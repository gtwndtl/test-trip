import requests
import pandas as pd
import math
import heapq
import sys
import io
import time
from collections import defaultdict, deque

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# ฟังก์ชันคำนวณระยะทางระหว่างพิกัด (ละติจูด, ลองจิจูด) ด้วยสูตร haversine
def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # รัศมีโลกหน่วยกิโลเมตร
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(dlambda/2)**2
    return 2 * R * math.atan2(math.sqrt(a), math.sqrt(1 - a))

start_time = time.time()

# ฟังก์ชันดึงข้อมูล JSON จาก API และแปลงเป็น DataFrame
def fetch_data_from_api(url):
    resp = requests.get(url)
    resp.raise_for_status()
    data = resp.json()
    return pd.DataFrame(data)

# เติม id ถ้า API ไม่มี id
def assign_ids(df, prefix):
    df = df.copy()
    if 'id' not in df.columns:
        df['id'] = [f"{prefix}{i+1}" for i in range(len(df))]
    else:
        df['id'] = prefix + df['id'].astype(str)
    return df

# ดึงข้อมูลจาก API
places_df = fetch_data_from_api("http://localhost:8080/accommodations")
attractions_df = fetch_data_from_api("http://localhost:8080/landmarks")
restaurants_df = fetch_data_from_api("http://localhost:8080/restaurants")

# เติม id prefix แยกแต่ละกลุ่ม
places_df = assign_ids(places_df, 'P')
attractions_df = assign_ids(attractions_df, 'A')
restaurants_df = assign_ids(restaurants_df, 'R')

# รวมข้อมูลทั้งหมด
all_places = pd.concat([places_df, attractions_df, restaurants_df], ignore_index=True)

# สร้าง dict สำหรับเก็บพิกัดและชื่อ
location_dict = {}
name_dict = {}

for _, row in all_places.iterrows():
    lat = row.get('Lat') or row.get('Latitude')
    lon = row.get('Lon') or row.get('Longitude')
    name = row.get('Name') or "Unknown"
    id_ = row['id']
    if lat is not None and lon is not None:
        location_dict[id_] = (float(lat), float(lon))
        name_dict[id_] = name

# สร้างกราฟแบบ adjacency list (เก็บเป็น dict)
graph = {node: [] for node in location_dict}
max_distance = 30  # เชื่อมเฉพาะที่ห่างกันไม่เกิน 30 กม.

for id1, (lat1, lon1) in location_dict.items():
    for id2, (lat2, lon2) in location_dict.items():
        if id1 < id2:
            distance = haversine(lat1, lon1, lat2, lon2)
            if distance <= max_distance:
                graph[id1].append((id2, distance))
                graph[id2].append((id1, distance))

# ฟังก์ชัน dijkstra หาเส้นทางสั้นสุด
def dijkstra(graph, start):
    distances = {node: float('inf') for node in graph}
    previous = {node: None for node in graph}
    distances[start] = 0
    heap = [(0, start)]

    while heap:
        current_dist, current_node = heapq.heappop(heap)
        if current_dist > distances[current_node]:
            continue
        for neighbor, weight in graph[current_node]:
            distance = current_dist + weight
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                previous[neighbor] = current_node
                heapq.heappush(heap, (distance, neighbor))
    return distances, previous

# ฟังก์ชันสร้าง MST โดย Prim's algorithm
def prim_mst(graph):
    start = next(iter(graph))
    mst = defaultdict(list)
    visited = set([start])
    edges = [(weight, start, neighbor) for neighbor, weight in graph[start]]
    heapq.heapify(edges)

    while edges:
        weight, node1, node2 = heapq.heappop(edges)
        if node2 not in visited:
            visited.add(node2)
            mst[node1].append((node2, weight))
            mst[node2].append((node1, weight))
            for neighbor, w in graph[node2]:
                if neighbor not in visited:
                    heapq.heappush(edges, (w, node2, neighbor))
    return mst

# ฟังก์ชันหาเส้นทางจาก MST ด้วย BFS
def bfs_path(mst, start):
    visited = set()
    path = []
    queue = deque([start])
    visited.add(start)

    while queue:
        node = queue.popleft()
        path.append(node)
        for neighbor, _ in mst[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    return path

# รับ input จุดเริ่มต้น (เช่น รหัสที่พักที่ต้องการ)
start_node = input("กรุณาใส่รหัสที่พักเริ่มต้น (เช่น P1): ").strip()

if start_node not in graph:
    print(f"❌ ไม่พบ node '{start_node}' ในข้อมูล!")
    sys.exit(1)

# คำนวณ dijkstra
distances, previous = dijkstra(graph, start_node)

# สร้าง MST
mst = prim_mst(graph)

# หาเส้นทางเดินจาก MST
path = bfs_path(mst, start_node)

# แสดงผลเส้นทางและระยะทางรวม
print("เส้นทางเดิน (ตาม MST):")
total_distance = 0
for i in range(len(path)-1):
    print(f"{path[i]} ({name_dict.get(path[i], '')}) -> ", end='')
    # หา distance จาก graph (สองทาง)
    dist = next((w for n, w in graph[path[i]] if n == path[i+1]), None)
    if dist is None:
        dist = next((w for n, w in graph[path[i+1]] if n == path[i]), None)
    total_distance += dist if dist else 0
print(f"{path[-1]} ({name_dict.get(path[-1], '')})")
print(f"ระยะทางรวม: {total_distance:.2f} กม.")

print(f"เวลาใช้ไป: {time.time() - start_time:.2f} วินาที")
