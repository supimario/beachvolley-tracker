import React, { useState, useEffect } from "react";

const getInitialEvents = () => {
  const saved = localStorage.getItem("calendarEvents");
  return saved ? JSON.parse(saved) : [];
};

const EventCalendar = () => {
  const [events, setEvents] = useState(getInitialEvents);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Practice");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [notes, setNotes] = useState("");
  const [location, setLocation] = useState(""); // New state
  const [filter, setFilter] = useState("All");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(events));
  }, [events]);

  const resetForm = () => {
    setTitle("");
    setType("Practice");
    setStart("");
    setEnd("");
    setNotes("");
    setLocation(""); // Reset location
    setEditingId(null);
  };

  const handleStartChange = (e) => {
    const newStart = e.target.value;
    setStart(newStart);
    if (!end) setEnd(newStart); // Auto-fill end date
  };

  const addOrUpdateEvent = (e) => {
    e.preventDefault();
    if (!title || !start || !end) return alert("Please fill in all required fields");

    const newEvent = {
      id: editingId || Date.now(),
      title,
      type,
      start,
      end,
      notes,
      location, // Include location
    };

    const updatedEvents = editingId
      ? events.map((ev) => (ev.id === editingId ? newEvent : ev))
      : [...events, newEvent];

    setEvents(updatedEvents);
    resetForm();
  };

  const deleteEvent = (id) => {
    setEvents(events.filter((event) => event.id !== id));
  };

  const editEvent = (event) => {
    setTitle(event.title);
    setType(event.type);
    setStart(event.start);
    setEnd(event.end);
    setNotes(event.notes);
    setLocation(event.location || ""); // Load location
    setEditingId(event.id);
  };

  const filteredEvents = filter === "All" ? events : events.filter((e) => e.type === filter);

  return (
    <div>
      <form onSubmit={addOrUpdateEvent}>
        <label>
          Title:
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label>
          Type:
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="Practice">Practice</option>
            <option value="Match">Match</option>
            <option value="Tournament">Tournament</option>
          </select>
        </label>
        <label>
          Start:
          <input type="date" value={start} onChange={handleStartChange} />
        </label>
        <label>
          End:
          <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
        </label>
        <label>
          Location:
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
        </label>
        <label>
          Notes:
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
        </label>
        <button type="submit">{editingId ? "Update" : "Add"} Event</button>
      </form>

      <div>
        <label>Filter by type:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="All">All</option>
          <option value="Practice">Practice</option>
          <option value="Match">Match</option>
          <option value="Tournament">Tournament</option>
        </select>
      </div>

      <ul>
        {filteredEvents.map((event) => (
          <li key={event.id}>
            <strong>{event.title}</strong> ({event.type})<br />
            {event.start} to {event.end}<br />
            📍 {event.location || "No location"}<br />
            📝 {event.notes}<br />
            <button onClick={() => editEvent(event)}>Edit</button>
            <button onClick={() => deleteEvent(event.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventCalendar;
