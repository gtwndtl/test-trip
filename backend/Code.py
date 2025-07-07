import pandas as pd
import math
import heapq
import sys
import time
import json
from collections import defaultdict, deque
import requests

if sys.version_info >= (3, 7):
    sys.stdout.reconfigure(encoding='utf-8')

def haversine(lat1, lon1, lat2, lon2):
    R = 6371
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(dlambda/2)**2
    return 2 * R * math.atan2(math.sqrt(a), math.sqrt(1 - a))

start_time = time.time()

try:
    # รับ start node จาก argument
    if len(sys.argv) < 2:
        print(json.dumps({"error": "กรุณาระบุรหัสเริ่มต้น (start_node)"}))
        sys.exit(1)
    start_node = sys.argv[1].strip()

    # โหลดข้อมูลจาก API
    def load_data_from_api(url):
        resp = requests.get(url)
        resp.raise_for_status()
        return resp.json()

    places_data = load_data_from_api('http://localhost:8080/accommodations')
    landmarks_data = load_data_from_api('http://localhost:8080/landmarks')
    restaurants_data = load_data_from_api('http://localhost:8080/restaurants')

    def convert_to_df(data_list, prefix):
        df = pd.DataFrame(data_list)
        df = df.copy()
        df['id'] = [f"{prefix}{i}" for i in range(len(df))]
        return df

    places_df = convert_to_df(places_data, 'P')
    attractions_df = convert_to_df(landmarks_data, 'A')
    restaurants_df = convert_to_df(restaurants_data, 'R')

    all_places = pd.concat([places_df, attractions_df, restaurants_df], ignore_index=True)

    location_dict = {row['id']: (row['Lat'], row['Lon']) for _, row in all_places.iterrows()}
    name_dict = {row['id']: row['Name'] for _, row in all_places.iterrows()}

    if start_node not in location_dict:
        print(json.dumps({"error": f"ไม่พบ node '{start_node}' ในข้อมูล!"}))
        sys.exit(1)

    # สร้างกราฟ (undirected)
    graph = {node: [] for node in location_dict}
    max_distance = 30
    for id1, (lat1, lon1) in location_dict.items():
        for id2, (lat2, lon2) in location_dict.items():
            if id1 < id2:
                distance = haversine(lat1, lon1, lat2, lon2)
                if distance <= max_distance:
                    graph[id1].append((id2, distance))
                    graph[id2].append((id1, distance))

    # Dijkstra หาเส้นทางที่สั้นสุดจาก start
    def dijkstra(graph, start):
        distances = {node: float('inf') for node in graph}
        distances[start] = 0
        queue = [(0, start)]
        while queue:
            current_distance, current_node = heapq.heappop(queue)
            if current_distance > distances[current_node]:
                continue
            for neighbor, weight in graph[current_node]:
                distance = current_distance + weight
                if distance < distances[neighbor]:
                    distances[neighbor] = distance
                    heapq.heappush(queue, (distance, neighbor))
        return distances

    distances = dijkstra(graph, start_node)

    # หาจุด attraction และ restaurant ที่ใกล้ที่สุด
    closest_attraction = min(
        [(id_, dist) for id_, dist in distances.items() if id_ in set(attractions_df['id'])],
        key=lambda x: x[1]
    )
    closest_restaurant = min(
        [(id_, dist) for id_, dist in distances.items() if id_ in set(restaurants_df['id'])],
        key=lambda x: x[1]
    )

    # สร้าง MST (Prim's Algorithm)
    def prim_mst(graph, start):
        visited = set([start])
        edges = [(weight, start, neighbor) for neighbor, weight in graph[start]]
        heapq.heapify(edges)
        mst = []
        while edges:
            weight, frm, to = heapq.heappop(edges)
            if to not in visited:
                visited.add(to)
                mst.append((frm, to, weight))
                for neighbor, w in graph[to]:
                    if neighbor not in visited:
                        heapq.heappush(edges, (w, to, neighbor))
        return mst

    mst = prim_mst(graph, start_node)

    # สร้าง adjacency list ของ MST
    mst_adj = defaultdict(list)
    for u, v, w in mst:
        mst_adj[u].append((v, w))
        mst_adj[v].append((u, w))

    # BFS หา path เป็น edges จาก start ถึง goal
    def bfs_path(graph, start, goal):
        queue = deque([(start, [start])])
        visited = set()
        while queue:
            current, path = queue.popleft()
            if current == goal:
                edges = []
                for i in range(len(path) - 1):
                    frm = path[i]
                    to = path[i + 1]
                    w = next(w for n, w in graph[frm] if n == to)
                    edges.append((frm, to, w))
                return edges
            if current in visited:
                continue
            visited.add(current)
            for neighbor, weight in graph[current]:
                if neighbor not in visited:
                    queue.append((neighbor, path + [neighbor]))
        return []

    path_to_attraction = bfs_path(mst_adj, start_node, closest_attraction[0])
    path_to_restaurant = bfs_path(mst_adj, closest_attraction[0], closest_restaurant[0])

    # รวมเส้นทาง
    if path_to_attraction and path_to_restaurant:
        if path_to_attraction[-1][1] == path_to_restaurant[0][0]:
            combined_path = path_to_attraction + path_to_restaurant
        else:
            combined_path = path_to_attraction + path_to_restaurant
    else:
        combined_path = path_to_attraction + path_to_restaurant

    # ฟังก์ชันกรอง edge ซ้ำย้อนกลับ (A->B กับ B->A)
    def remove_reverse_duplicates(edges):
        seen = set()
        filtered = []
        for frm, to, dist in edges:
            if (to, frm) not in seen:
                filtered.append((frm, to, dist))
                seen.add((frm, to))
        return filtered

    filtered_path = remove_reverse_duplicates(combined_path)

    # กรอง edge ที่ระยะเกิน 2 กม.
    filtered_path = [e for e in filtered_path if e[2] <= 2.0]

    total_dist = sum(edge[2] for edge in filtered_path)

    result = {
        "route_description": f"เส้นทางจาก {start_node} → {closest_attraction[0]} → {closest_restaurant[0]} ที่ระยะไม่เกิน 2 km",
        "paths": [
            {
                "from": frm,
                "from_name": name_dict.get(frm, ""),
                "to": to,
                "to_name": name_dict.get(to, ""),
                "distance_km": dist
            }
            for frm, to, dist in filtered_path
        ],
        "total_distance_km": total_dist,
        "elapsed_seconds": round(time.time() - start_time, 2),
        "message": "สำเร็จ"
    }

    print(json.dumps(result, ensure_ascii=False))

except Exception as e:
    print(json.dumps({
        "error": str(e)
    }))
    sys.exit(1)
