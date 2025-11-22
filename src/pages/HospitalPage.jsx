import React, { useState } from "react";
import "./hospital.css";

const BACKEND = "http://localhost:5000";

export default function HospitalPage() {
  const [data, setData] = useState({
    title: "",
    lat: "",
    lon: "",
    radius: 1000
  });

  async function createEmergency() {
    const res = await fetch(`${BACKEND}/create_emergency`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        title: data.title,
        lat: Number(data.lat),
        lon: Number(data.lon),
        radius: Number(data.radius),
      })
    });

    const j = await res.json();
    alert(res.ok ? "Emergency Sent!" : j.error);
  }

  return (
    <div className="hospital-page-container">
      <div className="hospital-card">
        
        <h1 className="hospital-title">🏥 Hospital Emergency Panel</h1>
        <p className="subtitle">Send notifications to nurses within radius.</p>

        <input 
          className="input"
          placeholder="Emergency Title"
          value={data.title}
          onChange={e => setData({...data, title: e.target.value})}
        />

        <input 
          className="input"
          placeholder="Latitude"
          value={data.lat}
          onChange={e => setData({...data, lat: e.target.value})}
        />

        <input 
          className="input"
          placeholder="Longitude"
          value={data.lon}
          onChange={e => setData({...data, lon: e.target.value})}
        />

        <input 
          className="input"
          placeholder="Radius (meters)"
          value={data.radius}
          onChange={e => setData({...data, radius: e.target.value})}
        />

        <button className="btn-primary" onClick={createEmergency}>
          🚨 Send Emergency Alert
        </button>
      </div>
    </div>
  );
}
