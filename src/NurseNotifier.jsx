// src/NurseNotifier.jsx
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";

const BACKEND = "http://localhost:5000"; // change if backend runs elsewhere

export default function NurseNotifier() {
  const [username, setUsername] = useState(localStorage.getItem("nn_user") || "");
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("nn_user"));
  const [position, setPosition] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [creating, setCreating] = useState({ title: "", lat: "", lon: "", radius: 1000 });
  const socketRef = useRef(null);
  const watchIdRef = useRef(null);

  // initialize socket once
  useEffect(() => {
    socketRef.current = io(BACKEND, { transports: ["websocket"] });

    socketRef.current.on("connect", () => {
      console.log("socket connected", socketRef.current.id);
      pushNotif("Connected to server");
      // if already logged in, register again
      const saved = localStorage.getItem("nn_user");
      if (saved) socketRef.current.emit("register", { id: saved });
    });

    socketRef.current.on("registered", (d) => {
      console.log("registered", d);
    });

    socketRef.current.on("emergency_alert", (payload) => {
      const text = `EMERGENCY: ${payload.emergency.title} — ${payload.distance} m away`;
      pushNotif(text);
      // optionally add to emergencies list (open)
      setEmergencies((p) => [{ ...payload.emergency, distance: payload.distance }, ...p]);
    });

    socketRef.current.on("emergency_assigned", (payload) => {
      pushNotif(`Assigned: ${payload.emergency.title}`);
      setEmergencies((p) => p.map(e => e.id === payload.emergency.id ? payload.emergency : e));
    });

    socketRef.current.on("emergency_updated", (payload) => {
      pushNotif(`Updated: ${payload.emergency.title}`);
      setEmergencies((p) => p.map(e => e.id === payload.emergency.id ? payload.emergency : e));
    });

    socketRef.current.on("disconnect", () => {
      console.log("socket disconnected");
      pushNotif("Disconnected from server");
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  // register + start location tracking on login
  useEffect(() => {
    if (!loggedIn) {
      // stop tracking
      if (watchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      return;
    }

    // register on server
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit("register", { id: username });
    }

    if (!("geolocation" in navigator)) {
      pushNotif("Geolocation not supported in this browser.");
      return;
    }

    const success = (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      setPosition({ lat, lon, ts: Date.now() });

      // send location via socket
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit("update_location", { id: username, lat, lon, available: true });
      } else {
        // fallback: REST update
        fetch(`${BACKEND}/nurse/${encodeURIComponent(username)}/location`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lat, lon, available: true }),
        }).catch(() => {});
      }
    };

    const fail = (err) => pushNotif("Geolocation error: " + err.message);

    const id = navigator.geolocation.watchPosition(success, fail, {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 10000,
    });

    watchIdRef.current = id;

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [loggedIn, username]);

  // helper to show notifications in UI
  function pushNotif(text) {
    setNotifications((p) => [{ id: Date.now(), text }, ...p].slice(0, 12));
  }

  // login handler
  function handleLogin(e) {
    e?.preventDefault?.();
    if (!username) return pushNotif("Enter username");
    localStorage.setItem("nn_user", username);
    setLoggedIn(true);
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit("register", { id: username });
    }
    pushNotif(`Logged in as ${username}`);
  }

  function handleLogout() {
    localStorage.removeItem("nn_user");
    setLoggedIn(false);
    setPosition(null);
    pushNotif("Logged out");
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit("disconnect_me", { id: username }); // optional
    }
  }

  // create emergency via backend REST
  async function doCreateEmergency() {
    const { title, lat, lon, radius } = creating;
    if (!title || !lat || !lon) return pushNotif("Fill title, lat, lon");
    try {
      const res = await fetch(`${BACKEND}/create_emergency`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, lat: Number(lat), lon: Number(lon), radius: Number(radius || 1000) }),
      });
      const j = await res.json();
      if (res.ok) {
        pushNotif("Emergency created");
        // add to local emergencies list
        setEmergencies((p) => [{ ...j.emergency }, ...p]);
      } else {
        pushNotif("Create emergency error: " + (j.error || res.status));
      }
    } catch (err) {
      pushNotif("Network error creating emergency");
    }
  }

  // accept emergency (REST)
  async function acceptEmergency(em) {
    if (!loggedIn) return pushNotif("Login first");
    try {
      const res = await fetch(`${BACKEND}/accept_emergency/${em.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nurse_id: username }),
      });
      const j = await res.json();
      if (res.ok) {
        pushNotif("You accepted: " + em.title);
        setEmergencies((p) => p.map(e => e.id === em.id ? j.emergency : e));
      } else pushNotif("Accept error: " + (j.error || res.status));
    } catch (err) {
      pushNotif("Network error accepting emergency");
    }
  }

  // load current emergencies on mount
  useEffect(() => {
    fetch(`${BACKEND}/emergencies`).then(r => r.json()).then(list => {
      setEmergencies(list.reverse ? list.reverse() : list);
    }).catch(() => {});
  }, []);

  return (
    <div className="ui-wrap">
      <aside className="ui-sidebar">
        <div className="brand">🏥 MicroShift</div>

        <div className="side-block">
          <div className="side-title">User</div>
          {!loggedIn ? (
            <form onSubmit={handleLogin}>
              <input className="input" value={username} onChange={e => setUsername(e.target.value)} placeholder="nurse id (e.g. nurse1)"/>
              <button className="btn">Login</button>
            </form>
          ) : (
            <div>
              <div className="user-name">{username}</div>
              <div className="muted">{position ? `${position.lat.toFixed(4)}, ${position.lon.toFixed(4)}` : "Locating..."}</div>
              <button className="btn-outline" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>

        <div className="side-block">
          <div className="side-title">Quick actions</div>
          <button className="btn-ghost" onClick={() => {
            // fill create with current pos
            if (position) setCreating(c => ({ ...c, lat: position.lat, lon: position.lon }));
            pushNotif("Filled current location in create form");
          }}>Fill current location</button>
          <button className="btn-ghost" onClick={() => {
            fetch(`${BACKEND}/nurses`).then(r=>r.json()).then(d=> {
              pushNotif("Nurses: " + d.length);
            }).catch(()=>pushNotif("Error fetching nurses"));
          }}>Get nurses</button>
        </div>

      </aside>

      <main className="ui-main">
        <header className="main-header">
          <h1>Nurse Nearby Notifier — Dashboard</h1>
          <div className="header-right">Backend: <span className="muted"> {BACKEND}</span></div>
        </header>

        <section className="grid-row">
          <div className="card">
            <h3>Create Emergency</h3>
            <input className="input" placeholder="Title" value={creating.title} onChange={e => setCreating(s => ({ ...s, title: e.target.value }))}/>
            <div style={{display: "flex", gap: 8}}>
              <input className="input" placeholder="Latitude" value={creating.lat} onChange={e => setCreating(s => ({ ...s, lat: e.target.value }))}/>
              <input className="input" placeholder="Longitude" value={creating.lon} onChange={e => setCreating(s => ({ ...s, lon: e.target.value }))}/>
            </div>
            <input className="input" placeholder="Radius (m)" value={creating.radius} onChange={e => setCreating(s => ({ ...s, radius: e.target.value }))}/>
            <div style={{display:"flex", gap:8}}>
              <button className="btn-primary" onClick={doCreateEmergency}>Create Emergency</button>
              <button className="btn-outline" onClick={() => {
                setCreating({ title:"", lat:"", lon:"", radius:1000});
              }}>Clear</button>
            </div>
          </div>

          <div className="card">
            <h3>Active Emergencies</h3>
            {emergencies.length === 0 && <div className="muted">No emergencies</div>}
            {emergencies.map(em => (
              <div className="list-item" key={em.id}>
                <div>
                  <div className="item-title">{em.title}</div>
                  <div className="muted">{em.lat}, {em.lon} {em.distance ? `• ${em.distance} m` : ""}</div>
                </div>
                <div style={{display:"flex", gap:8}}>
                  <button className="btn" onClick={() => acceptEmergency(em)}>Accept</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={{display:"grid", gridTemplateColumns:"1fr 320px", gap:16, marginTop:16}}>
          <div className="card">
            <h3>Notifications</h3>
            {notifications.length === 0 && <div className="muted">No notifications</div>}
            {notifications.map(n => (
              <div key={n.id} className="note">{n.text}</div>
            ))}
          </div>

          <div className="card">
            <h3>Console</h3>
            <div className="muted">Socket ID: {socketRef.current?.id || "not connected"}</div>
            <div className="muted" style={{marginTop:8}}>Connected nurses (from server):</div>
            <button className="btn-ghost" onClick={()=>{
              fetch(`${BACKEND}/nurses`).then(r=>r.json()).then(j=>pushNotif("Nurses: "+ j.length)).catch(()=>pushNotif("Error"));
            }}>Refresh nurses</button>
          </div>
        </section>
      </main>
    </div>
  );
}
