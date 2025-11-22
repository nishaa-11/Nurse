

import React, { useState } from 'react'
import shiftsStore from '../shared/shiftsStore'

export default function CreateShift() {
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')
  const [time, setTime] = useState('')
  const [pay, setPay] = useState('')
  const [message, setMessage] = useState('')

  function onCreate(e) {
    e.preventDefault()
    if (!title || !location || !time) {
      setMessage('Please fill title, location and time')
      return
    }
    const shift = { id: Date.now(), title, type: 'Micro', location, time, pay: pay || 'TBD', createdAt: new Date().toISOString() }
    shiftsStore.addShift(shift)
    setMessage('Shift created')
    setTitle('')
    setLocation('')
    setTime('')
    setPay('')
    setTimeout(() => setMessage(''), 2000)
  }

  return (
    <div className="card" style={{ padding: 18 }}>
      <h3 style={{ marginTop: 0 }}>Create Micro Shift</h3>
      <form onSubmit={onCreate}>
        <label>
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Vaccine Drive" />
        </label>
        <div style={{ height: 8 }} />
        <label>
          Location
          <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" />
        </label>
        <div style={{ height: 8 }} />
        <label>
          Time
          <input value={time} onChange={(e) => setTime(e.target.value)} placeholder="e.g. 10:00 - 12:00" />
        </label>
        <div style={{ height: 8 }} />
        <label>
          Pay (optional)
          <input value={pay} onChange={(e) => setPay(e.target.value)} placeholder="e.g. $25" />
        </label>
        <div style={{ height: 12 }} />
        <button type="submit" className="btn btn-primary">Create Shift</button>
        {message && <div style={{ marginTop: 8 }}>{message}</div>}
      </form>
    </div>
  )
}
