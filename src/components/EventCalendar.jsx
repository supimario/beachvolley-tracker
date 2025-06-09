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
  const [filter, setFilter] = useState("All");
  const [editingId, setEditingId] = useState(null); // ← NEW

  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(events));
  }, [events]);

  const resetForm = () => {
    setTitle("");
    setType("Practice");
    setStart("");
    setEnd("");
    setNotes("");
    setEditingId(null);
  };

  const addOrUpdateEvent = (e) => {
    e.preventDefault();
    if (!title || !start || !end) return alert("Please fill in all required fields");

    const updatedEvent = {
      id: editingId ?? Date.now(),
      title,
      type,
      start,
      end,
      notes,
    };

    if (editingId) {
      setEvents(events.map((ev) => (ev.id === editingId ? updatedEvent : ev)));
    } else {
      setEvents([...events, updatedEvent]);
    }

    resetForm();
  };

  const handleEdit = (event) => {
    setTitle(event.title);
    setType(event.type);
    setStart(event.start);
    setEnd(event.end);
    setNotes(event.notes);
    setEditingId(event.id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this event?")) {
      setEvents(events.filter((e) => e.id !== id));
      if (editingId === id) resetForm();
    }
  };

  const filteredEvents = filter === "All" ? events : events.filter((e) => e.type === filter);

  return (
    <div className="mt-6 border rounded-lg p-4 shadow">
      <h2 className="text-xl font-bold mb-2">📅 Calendar</h2>

      <form onSubmit={addOrUpdateEvent} className="space-y-2">
        <input
          type="text"
          placeholder="Event title"
          className="w-full p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <div className="flex flex-wrap gap-2">
          <select
            className="flex-1 min-w-[130px] p-2 border rounded"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="Practice">Practice</option>
            <option value="Tournament">Tournament</option>
          </select>
          <input
            type="date"
            className="flex-1 min-w-[130px] p-2 border rounded"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            required
          />
          <input
            type="date"
            className="flex-1 min-w-[130px] p-2 border rounded"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            required
          />
        </div>
        <textarea
          placeholder="Notes (optional)"
          className="w-full p-2 border rounded"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        ></textarea>
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {editingId ? "Update Event" : "Add Event"}
          </button>
          {editingId && (
            <button
              type="button"
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="mt-4">
        <label className="mr-2 font-semibold">Filter:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-1 rounded"
        >
          <option value="All">All</option>
          <option value="Practice">Practice</option>
          <option value="Tournament">Tournament</option>
        </select>
      </div>

      <ul className="mt-4 space-y-2">
        {filteredEvents.length === 0 && <p className="text-gray-500">No events</p>}
        {filteredEvents.map((e) => (
          <li key={e.id} className="border rounded p-2 bg-gray-50 flex justify-between items-start">
            <div>
              <div className="font-semibold">{e.title}</div>
              <div className="text-sm text-gray-700">
                {e.type} — {e.start} to {e.end}
              </div>
              {e.notes && <div className="text-sm mt-1 italic">{e.notes}</div>}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(e)}
                className="text-blue-600 hover:underline text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(e.id)}
                className="text-red-600 hover:underline text-sm"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventCalendar;
