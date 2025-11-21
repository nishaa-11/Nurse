from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import math
import time


# -------------------------
# Helpers
# -------------------------
def haversine_meters(lat1, lon1, lat2, lon2):
    R = 6371000
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)

    a = (math.sin(dphi / 2) ** 2 +
         math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2)

    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


# -------------------------
# App Setup
# -------------------------
app = Flask(__name__)
CORS(app)

# THIS WORKS ON PYTHON 3.12 & 3.13
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="threading")

nurses = {}  # nurse_id → {lat, lon, available, sid}
emergencies = {}  # emergency_id → {data}


# -------------------------
# Socket Events
# -------------------------
@socketio.on("connect")
def on_connect():
    print("Client connected:", request.sid)
    emit("connected", {"sid": request.sid})


@socketio.on("register")
def on_register(data):
    """
    data = { "id": "nurse1" }
    """
    nurse_id = data.get("id")
    if not nurse_id:
        return

    nurses[nurse_id] = {
        "id": nurse_id,
        "lat": None,
        "lon": None,
        "available": True,
        "sid": request.sid
    }

    print(f"Nurse registered: {nurse_id}")
    emit("registered", {"id": nurse_id})


@socketio.on("update_location")
def on_update_location(data):
    """
    data = { "id": "nurse1", "lat": 12.34, "lon": 56.78 }
    """
    nid = data.get("id")
    if nid in nurses:
        nurses[nid]["lat"] = data.get("lat")
        nurses[nid]["lon"] = data.get("lon")
        nurses[nid]["available"] = data.get("available", True)

    print("Updated location for", nid)


@socketio.on("disconnect")
def on_disconnect():
    sid = request.sid
    for nid, n in list(nurses.items()):
        if n["sid"] == sid:
            print(f"Nurse {nid} disconnected")
            nurses.pop(nid)
            break


# -------------------------
# REST API
# -------------------------
@app.route("/")
def home():
    return "Backend is running"

@app.route("/create_emergency", methods=["POST"])
def create_emergency():
    body = request.json
    title = body.get("title")
    lat = body.get("lat")
    lon = body.get("lon")
    radius = body.get("radius", 1000)

    if not title or lat is None or lon is None:
        return jsonify({"error": "title, lat, lon required"}), 400

    em_id = str(int(time.time() * 1000))
    emergencies[em_id] = {
        "id": em_id,
        "title": title,
        "lat": lat,
        "lon": lon,
        "radius": radius,
        "status": "open"
    }

    # notify nearby nurses
    for nurse_id, nurse in nurses.items():
        if nurse["lat"] is None:
            continue

        dist = haversine_meters(lat, lon, nurse["lat"], nurse["lon"])
        if dist <= radius:
            sid = nurse["sid"]
            socketio.emit("emergency_alert", {
                "emergency": emergencies[em_id],
                "distance": int(dist)
            }, room=sid)

    return jsonify({"ok": True, "emergency": emergencies[em_id]})


@app.route("/accept_emergency/<eid>", methods=["POST"])
def accept_emergency(eid):
    body = request.json
    nurse_id = body.get("nurse_id")

    if eid not in emergencies:
        return jsonify({"error": "Not found"}), 404

    em = emergencies[eid]
    em["status"] = "assigned"
    em["assigned_to"] = nurse_id

    # notify the nurse who accepted
    if nurse_id in nurses:
        socketio.emit("emergency_assigned", {"emergency": em}, room=nurses[nurse_id]["sid"])

    return jsonify({"ok": True, "emergency": em})


@app.route("/nurses", methods=["GET"])
def all_nurses():
    return jsonify(list(nurses.values()))


@app.route("/emergencies", methods=["GET"])
def all_emergencies():
    return jsonify(list(emergencies.values()))


# -------------------------
# RUN
# -------------------------
if __name__ == "__main__":
    print("Backend running on http://localhost:5000")
    socketio.run(app, host="0.0.0.0", port=5000)
