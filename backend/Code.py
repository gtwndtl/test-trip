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
        # หา dist จาก current_id ไป c
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

def plan_trip(start_id, days, landmarks, accommodations, restaurants, points_per_day=4):
    p_list = [p['id'] for p in landmarks if p['id'] != start_id]
    r_list = [r['id'] for r in restaurants]
    a_list = [a['id'] for a in accommodations]

    all_places = landmarks + accommodations + restaurants
    place_lookup = {p['id']: p for p in all_places}

    graph = build_graph(all_places)

    remaining = set(p_list)

    trip_days = []
    all_trip_points = [start_id]  # เก็บสถานที่เที่ยว + ร้านอาหาร ทุกวันรวมกัน

    for day in range(days):
        day_plan = []
        if day == 0:
            current = start_id
            day_plan.append(current)
        else:
            if trip_days:
                current = trip_days[-1]['plan'][-1]
                day_plan.append(current)
            else:
                current = start_id
                day_plan.append(current)

        while len(day_plan) < points_per_day:
            nearest = find_nearest(current, remaining, graph)
            if nearest is None:
                break
            day_plan.append(nearest)
            remaining.remove(nearest)
            current = nearest

        # แทรกร้านอาหารตามตำแหน่ง
        r_points = []
        if len(day_plan) >= 2 and r_list:
            last_p = day_plan[1]
            nearest_r = find_nearest(last_p, r_list, graph)
            if nearest_r:
                r_points.append((2, nearest_r))
        if len(day_plan) >= 4 and r_list:
            last_p = day_plan[3]
            nearest_r = find_nearest(last_p, r_list, graph)
            if nearest_r:
                r_points.append((4 + len(r_points), nearest_r))

        for idx, r_id in r_points:
            day_plan.insert(idx, r_id)

        trip_days.append({
            "day": day + 1,
            "plan": day_plan,
        })

        # รวมสถานที่เที่ยวและร้านอาหารทั้งหมดในทริป
        for p in day_plan:
            if p not in all_trip_points:
                all_trip_points.append(p)

        if not remaining:
            break

    # เลือกที่พักเพียงจุดเดียวสำหรับทั้งทริป (ศูนย์กลางของ all_trip_points)
    if a_list and all_trip_points:
        center_a = min(a_list, key=lambda a: average_distance(a, all_trip_points, graph))
        accommodation_info = place_lookup[center_a]
    else:
        center_a = None
        accommodation_info = None

    # กำหนดที่พักเดียวกันในทุกวัน
    for day_info in trip_days:
        day_info["accommodation"] = center_a
        day_info["accommodation_name"] = accommodation_info["Name"] if accommodation_info else None
        day_info["accommodation_location"] = {
            "lat": accommodation_info["Lat"],
            "lon": accommodation_info["Lon"]
        } if accommodation_info else None

    detailed_routes = []
    total_distance = 0.0

    for day_info in trip_days:
        day_plan = day_info["plan"][:]
        if day_info["accommodation"]:
            day_plan.append(day_info["accommodation"])

        for i in range(len(day_plan) - 1):
            frm = day_plan[i]
            to = day_plan[i+1]
            dist = next((d for n,d in graph[frm] if n == to), 0)
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
        "days": days,
        "trip_plan": trip_days,
        "paths": detailed_routes,
        "total_distance_km": round(total_distance, 2),
        "message": "สร้างเส้นทางสำเร็จ"
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
