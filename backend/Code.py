import sys
import json
import requests
import heapq

sys.stdout.reconfigure(encoding='utf-8')

def prim_mst(graph, nodes):
    if not nodes:
        return []

    mst_edges = []
    visited = set()
    min_heap = []

    start = nodes[0]
    visited.add(start)

    for to, dist in graph.get(start, []):
        if to in nodes:
            heapq.heappush(min_heap, (dist, start, to))

    while min_heap and len(visited) < len(nodes):
        dist, frm, to = heapq.heappop(min_heap)
        if to in visited:
            continue
        visited.add(to)
        mst_edges.append((frm, to, dist))

        for nxt, ndist in graph.get(to, []):
            if nxt not in visited and nxt in nodes:
                heapq.heappush(min_heap, (ndist, to, nxt))

    return mst_edges


def calculate_centroid(places):
    if not places:
        return None, None
    lat_sum = 0.0
    lon_sum = 0.0
    count = 0
    for p in places:
        lat = p.get("lat") or p.get("Lat")
        lon = p.get("lon") or p.get("Lon")
        if lat is not None and lon is not None:
            lat_sum += lat
            lon_sum += lon
            count += 1
    if count == 0:
        return None, None
    return lat_sum / count, lon_sum / count


def find_nearest_accommodation(accommodations, centroid_lat, centroid_lon):
    if centroid_lat is None or centroid_lon is None or not accommodations:
        return None

    def distance(lat1, lon1, lat2, lon2):
        return ((lat1 - lat2) ** 2 + (lon1 - lon2) ** 2) ** 0.5

    nearest = None
    min_dist = float('inf')
    for acc in accommodations:
        lat = acc.get("lat") or acc.get("Lat")
        lon = acc.get("lon") or acc.get("Lon")
        if lat is None or lon is None:
            continue
        dist = distance(centroid_lat, centroid_lon, lat, lon)
        if dist < min_dist:
            min_dist = dist
            nearest = acc
    return nearest


def plan_trip(start_id, landmarks, restaurants, graph, accommodations, days=1):
    p_list = [p['id'] for p in landmarks if p['id'] != start_id]
    r_list = [r['id'] for r in restaurants]

    all_places = landmarks + restaurants + accommodations
    place_lookup = {p['id']: p for p in all_places}

    p_nodes = [start_id] + p_list
    mst_edges = prim_mst(graph, p_nodes)

    mst_adj = {node: [] for node in p_nodes}
    for frm, to, dist in mst_edges:
        mst_adj[frm].append(to)
        mst_adj[to].append(frm)

    visited = set()
    remaining_r = set(r_list)

    trip_plan_days = []
    current_day_plan = []
    p_count = 0  # นับ P ในวันนั้น
    day_count = 0

    def insert_nearest_restaurant(current_p):
        nonlocal remaining_r
        if not remaining_r:
            return None
        nearest_r = None
        min_dist = float('inf')
        for r in remaining_r:
            dist = next((d for nxt, d in graph.get(current_p, []) if nxt == r), float('inf'))
            if dist < min_dist:
                min_dist = dist
                nearest_r = r
        if nearest_r:
            remaining_r.remove(nearest_r)
        return nearest_r

    def dfs(node):
        nonlocal p_count, current_day_plan, day_count

        if day_count >= days:
            return  # ครบจำนวนวันที่กำหนดแล้ว หยุดเดิน

        visited.add(node)
        current_day_plan.append(node)
        p_count += 1

        # ทุกครั้งที่นับ P ถึง 2 หรือ 4 ให้แทรก R ใกล้ที่สุด
        if p_count == 2 or p_count == 4:
            r = insert_nearest_restaurant(node)
            if r:
                current_day_plan.append(r)

        # ถ้าครบ 6 จุด (P P R P P R) ให้เก็บวันแล้วเริ่มวันใหม่
        if len(current_day_plan) == 6:
            trip_plan_days.append(current_day_plan)
            current_day_plan = []
            p_count = 0
            day_count += 1
            if day_count >= days:
                return

        for nxt in mst_adj[node]:
            if nxt not in visited and day_count < days:
                dfs(nxt)

    dfs(start_id)

    # ถ้ายังมีจุดในวันสุดท้ายที่ยังไม่เต็ม 6 จุด ให้เก็บเพิ่ม
    if current_day_plan and day_count < days:
        trip_plan_days.append(current_day_plan)
        day_count += 1

    # ถ้าวันยังไม่ครบตาม days ให้เติมวันว่าง
    while day_count < days:
        trip_plan_days.append([])
        day_count += 1

    # สร้าง detailed plan + คำนวณที่พักตาม centroid ของ P ในแต่ละวัน
        # สร้าง detailed plan แยกวัน
    detailed_plan_by_day = []
    all_places_for_accommodation = []

    for day_idx, day_plan in enumerate(trip_plan_days, start=1):
        day_detail = []
        for node in day_plan:
            p = place_lookup[node]
            lat = p.get("lat") or p.get("Lat")
            lon = p.get("lon") or p.get("Lon")
            day_detail.append({
                "id": node,
                "name": p.get("Name") or p.get("name"),
                "lat": lat,
                "lon": lon,
            })
            if lat is not None and lon is not None:
                all_places_for_accommodation.append({"lat": lat, "lon": lon})

        detailed_plan_by_day.append({"day": day_idx, "plan": day_detail})

    # คำนวณ centroid ของทุกจุดในทุกวันรวมกัน
    centroid_lat, centroid_lon = calculate_centroid(all_places_for_accommodation)

    # หา accommodation ที่ใกล้ centroid ที่คำนวณได้
    nearest_acc = None
    if centroid_lat is not None:
        nearest_acc = find_nearest_accommodation(accommodations, centroid_lat, centroid_lon)
    # แก้ให้ accommodation มี id เป็น string และลบฟิลด์ ID แบบ number
    if nearest_acc:
        nearest_acc["id"] = f"A{nearest_acc.get('ID')}"
        if "ID" in nearest_acc:
            del nearest_acc["ID"]


    # สร้างเส้นทางรวม
    detailed_routes = []
    total_distance = 0.0
    full_trip_plan = []
    if nearest_acc:
        acc_id = nearest_acc["id"]
        for day_plan in trip_plan_days:
            if not day_plan:
                continue
            full_trip_plan.append(acc_id)           # เริ่มต้นวันด้วย A
            full_trip_plan.extend(day_plan)         # ตามด้วย P P R ...
            full_trip_plan.append(acc_id)           # จบวันด้วย A

    for i in range(len(full_trip_plan) - 1):
        frm = full_trip_plan[i]
        to = full_trip_plan[i + 1]
        dist = next((d for n, d in graph.get(frm, []) if n == to), 0)
        total_distance += dist
        detailed_routes.append({
            "from": frm,
            "from_name": place_lookup[frm].get("Name") or place_lookup[frm].get("name"),
            "from_lat": place_lookup[frm].get("lat") or place_lookup[frm].get("Lat"),
            "from_lon": place_lookup[frm].get("lon") or place_lookup[frm].get("Lon"),
            "to": to,
            "to_name": place_lookup[to].get("Name") or place_lookup[to].get("name"),
            "to_lat": place_lookup[to].get("lat") or place_lookup[to].get("Lat"),
            "to_lon": place_lookup[to].get("lon") or place_lookup[to].get("Lon"),
            "distance_km": round(dist, 2),
        })

    return {
        "start": start_id,
        "start_name": place_lookup[start_id].get("Name") or place_lookup[start_id].get("name"),
        "trip_plan_by_day": detailed_plan_by_day,
        "paths": detailed_routes,
        "total_distance_km": round(total_distance, 2),
        "accommodation": nearest_acc,   # ที่พักรวมทุกวัน 1 ที่
        "message": "สร้างเส้นทางสำเร็จ",
    }


def load_data(url, prefix):
    try:
        resp = requests.get(url)
        resp.raise_for_status()
        data = resp.json()
        for item in data:
            item['id'] = f"{prefix}{item['ID']}"
        return data
    except Exception as e:
        print(f"Failed to load {url}: {e}", file=sys.stderr)
        return []


def build_graph(distance_data):
    from collections import defaultdict
    graph = defaultdict(list)
    for from_node, neighbors in distance_data.items():
        for neighbor in neighbors:
            to_id = neighbor['to']
            dist = neighbor['distance']
            graph[from_node].append((to_id, dist))
    return graph


def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "กรุณาระบุ start_id"}))
        return

    start_id = sys.argv[1]
    days = int(sys.argv[2]) if len(sys.argv) > 2 else 1
    print(f"[DEBUG] Start with: {start_id}, days: {days}", file=sys.stderr)

    landmarks = load_data("http://localhost:8080/landmarks", "P")
    print(f"[DEBUG] Loaded {len(landmarks)} landmarks", file=sys.stderr)

    restaurants = load_data("http://localhost:8080/restaurants", "R")
    print(f"[DEBUG] Loaded {len(restaurants)} restaurants", file=sys.stderr)

    accommodations = load_data("http://localhost:8080/accommodations", "A")
    print(f"[DEBUG] Loaded {len(accommodations)} accommodations", file=sys.stderr)

    try:
        distance_data = requests.get("http://localhost:8080/distances").json()
        print(f"[DEBUG] Loaded distance data", file=sys.stderr)
    except Exception as e:
        print(f"[ERROR] Load distances failed: {e}", file=sys.stderr)
        return

    graph = build_graph(distance_data)
    result = plan_trip(start_id, landmarks, restaurants, graph, accommodations, days)

    print(json.dumps(result, ensure_ascii=False))


if __name__ == "__main__":
    main()
