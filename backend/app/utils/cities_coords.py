import math
import json
import os

# Depo merkezimiz (Varsayilan: Istanbul)
WAREHOUSE_COORDS = {"lat": 41.0136, "lon": 28.9550}

_cities_cache = {}

def _load_cities():
    global _cities_cache
    if not _cities_cache:
        file_path = os.path.join(os.path.dirname(__file__), "tr.json")
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                for item in data:
                    # 'city' alanını ve 'admin_name' alanını indexleyelim (esneklik için)
                    lat = float(item["lat"])
                    lon = float(item["lng"])
                    city_name = item["city"]
                    admin_name = item.get("admin_name", city_name)
                    
                    if city_name not in _cities_cache:
                        _cities_cache[city_name] = {"lat": lat, "lon": lon}
                    if admin_name not in _cities_cache:
                        _cities_cache[admin_name] = {"lat": lat, "lon": lon}
                        
        except Exception as e:
            print(f"tr.json yuklenirken hata: {e}")

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Iki koordinat arasindaki kus ucusu mesafeyi kilometre cinsinden hesaplar."""
    R = 6371.0 # Dunyanin yariçapi (km)

    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)

    a = (math.sin(dlat / 2) * math.sin(dlat / 2) +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) * math.sin(dlon / 2))
    
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    distance = R * c

    return distance

def get_distance_from_warehouse(city_name: str) -> float:
    """Verilen sehrin depoya olan kus ucusu mesafesini dondurur."""
    _load_cities()
    
    city = _cities_cache.get(city_name)
    if not city:
        # Eger bulunamazsa en azindan 0 donelim
        return 0.0
        
    return haversine_distance(
        WAREHOUSE_COORDS["lat"], WAREHOUSE_COORDS["lon"],
        city["lat"], city["lon"]
    )
