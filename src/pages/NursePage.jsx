import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "./nurse.css";

const BACKEND = "http://localhost:5000";

export default function NursePage() {
  const username = "nurse1";
  const [notifications, setNotifications] = useState([]);
  const socketRef = useRef(null);

  function pushNotif(msg) {
    setNotifications(prev => [{ id: Date.now(), msg }, ...prev]);
  }

  // socket handler
  useEffect(() => {
    socketRef.current = io(BACKEND, { transports: ["websocket"] });

    socketRef.current.on("connect", () => {
      socketRef.current.emit("register", { id: username });
      pushNotif("Connected to server.");
    });

    socketRef.current.on("emergency_alert", (data) => {
      pushNotif(`🚨 ${data.emergency.title} — ${data.distance} meters away`);
    });

    return () => socketRef.current.disconnect();
  }, []);

  // geolocation
  useEffect(() => {
    navigator.geolocation.watchPosition(pos => {
      socketRef.current.emit("update_location", {
        id: username,
        lat: pos.coords.latitude,
        lon: pos.coords.longitude
      });
    });
  }, []);

  return (
    <div className="nurse-page-container">

      <header className="nurse-header">
        <h1>👩‍⚕️ Nurse Notification Center</h1>
        <p className="header-msg">Stay alert for emergency notifications</p>
      </header>

      <div className="notif-box">
        {notifications.length === 0 && (
          <p className="empty">No notifications yet…</p>
        )}

        {notifications.map(n => (
          <div key={n.id} className="notif-item">{n.msg}</div>
        ))}
      </div>
    </div>
  );
}
