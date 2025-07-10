import sys
import json
import requests
import math
from collections import defaultdict
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1))*math.cos(math.radians(lat2))*math.sin(dlon/2)**2
    return 2 * R * math.asin(math.sqrt(a))

def load_data(url, prefix):
    data = requests.get(url).json()
    for item in data:
        item['id'] = f"{prefix}{item['ID']}"
    return data

def build_graph(places):
    graph = defaultdict(list)
    for i in range(len(places)):
        for j in range(i+1, len(places)):
            a = places[i]
            b = places[j]
            dist = haversine(float(a['Lat']), float(a['Lon']), float(b['Lat']), float(b['Lon']))
            graph[a['id']].append((b['id'], dist))
            graph[b['id']].append((a['id'], dist))
    return graph

def find_nearest(current_id, candidates, graph):
    nearest = None
    min_dist = float('inf')
    for c in candidates:
        dist = next((d for n,d in graph[current_id] if n == c), float('inf'))
        if dist < min_dist:
            min_dist = dist
            nearest = c
    return nearest

def average_distance(center_id, nodes, graph):
    total = 0
    count = 0
    for node in nodes:
        dist = next((d for n,d in graph[center_id] if n == node), None)
        if dist is not None:
            total += dist
            count += 1
    return total / count if count > 0 else float('inf')

def get_nearest_points(current_id, candidates, n, graph):
    selected = []
    cands = candidates.copy()
    for _ in range(n):
        nearest = find_nearest(current_id, cands, graph)
        if nearest is None:
            break
        selected.append(nearest)
        cands.remove(nearest)
        current_id = nearest
    return selected

def plan_trip(start_id, days, landmarks, accommodations, restaurants):
    p_list = [p['id'] for p in landmarks if p['id'] != start_id]
    r_list = [r['id'] for r in restaurants]
    a_list = [a['id'] for a in accommodations]

    all_places = landmarks + accommodations + restaurants
    place_lookup = {p['id']: p for p in all_places}

    graph = build_graph(all_places)

    remaining_p = set(p_list)
    remaining_r = set(r_list)

    trip_days = []
    all_selected_p = set([start_id])  # เก็บ P ที่เลือกทั้งหมด

    current_start = start_id

    for day in range(days):
        day_plan = []
        if current_start is None:
            break

        day_plan.append(current_start)  # เริ่มวันด้วย current_start

        # P 1 จุด
        next_p1 = get_nearest_points(day_plan[-1], remaining_p, 1, graph)
        if next_p1:
            day_plan.extend(next_p1)
            for p in next_p1:
                remaining_p.discard(p)
                all_selected_p.add(p)

        # R 1 จุด
        if remaining_r:
            r1 = find_nearest(day_plan[-1], remaining_r, graph)
            if r1:
                day_plan.append(r1)
                remaining_r.discard(r1)

        # P 2 จุด
        next_p2 = get_nearest_points(day_plan[-1], remaining_p, 2, graph)
        if next_p2:
            day_plan.extend(next_p2)
            for p in next_p2:
                remaining_p.discard(p)
                all_selected_p.add(p)

        # R 1 จุด
        if remaining_r:
            r2 = find_nearest(day_plan[-1], remaining_r, graph)
            if r2:
                day_plan.append(r2)
                remaining_r.discard(r2)

        trip_days.append({"day": day + 1, "plan": day_plan})

        # คำนวณที่พักจาก P ทั้งหมดที่เลือกในทริป
        if a_list and all_selected_p:
            accommodation_id = min(a_list, key=lambda a: average_distance(a, all_selected_p, graph))
            accommodation_info = place_lookup[accommodation_id]
        else:
            accommodation_id = None
            accommodation_info = None

        # ไม่เปลี่ยน current_start เป็น accommodation_id เพื่อไม่ให้ที่พักโผล่ใน plan ของวันถัดไป
        # current_start = accommodation_id  # ลบบรรทัดนี้

        # ถ้า P กับ R หมดก่อนก็หยุด
        if not remaining_p and not remaining_r:
            break

    # อัพเดต accommodation ในทุกวัน (ที่พักเดียวตลอดทริป)
    for day_info in trip_days:
        day_info["accommodation"] = accommodation_id
        day_info["accommodation_name"] = accommodation_info["Name"] if accommodation_info else None
        day_info["accommodation_location"] = {
            "lat": accommodation_info["Lat"],
            "lon": accommodation_info["Lon"],
        } if accommodation_info else None

    # สร้าง detailed_routes โดยไม่รวมที่พักในเส้นทางเดิน
    detailed_routes = []
    total_distance = 0.0
    for day_info in trip_days:
        plan = day_info["plan"]
        for i in range(len(plan) - 1):
            frm = plan[i]
            to = plan[i + 1]

            # ข้ามเส้นทางที่เริ่มหรือสิ้นสุดที่พัก (accommodation_id)
            if frm == accommodation_id or to == accommodation_id:
                continue

            dist = next((d for n, d in graph[frm] if n == to), 0)
            total_distance += dist
            detailed_routes.append({
                "from": frm,
                "from_name": place_lookup[frm]["Name"],
                "to": to,
                "to_name": place_lookup[to]["Name"],
                "distance_km": round(dist, 2),
                "day": day_info["day"]
            })

    return {
        "start": start_id,
        "start_name": place_lookup[start_id]["Name"],
        "days": len(trip_days),
        "trip_plan": trip_days,
        "paths": detailed_routes,
        "total_distance_km": round(total_distance, 2),
        "message": "สร้างเส้นทางสำเร็จ",
        "accommodation": {
            "id": accommodation_id,
            "name": accommodation_info["Name"] if accommodation_info else None,
            "location": {
                "lat": accommodation_info["Lat"] if accommodation_info else None,
                "lon": accommodation_info["Lon"] if accommodation_info else None,
            }
        }
    }



def main():
    if len(sys.argv) < 3:
        print(json.dumps({"error": "กรุณาระบุ start_id และ days"}))
        sys.exit(1)

    start_id = sys.argv[1]
    days = int(sys.argv[2])

    landmarks = load_data("http://localhost:8080/landmarks", "P")
    accommodations = load_data("http://localhost:8080/accommodations", "A")
    restaurants = load_data("http://localhost:8080/restaurants", "R")

    result = plan_trip(start_id, days, landmarks, accommodations, restaurants)
    print(json.dumps(result, ensure_ascii=False))

if __name__ == "__main__":
    main()
