import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import "./EventCalendar.css"; // Optional for custom styles

const LOCAL_STORAGE_KEY = "beachvolley-events";

export default function EventCalendar() {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    notes: "",
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10),
  });

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) setEvents(JSON.parse(stored));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  const handleAddEvent = () => {
    const newEvent = {
      ...formData,
      id: Date.now(),
    };
    setEvents([...events, newEvent]);
    setFormData({
      title: "",
      notes: "",
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date().toISOString().slice(0, 10),
    });
    setShowForm(false);
  };

  const eventsOnDate = (date) => {
    const dateStr = date.toISOString().slice(0, 10);
    return events.filter((e) => e.startDate <= dateStr && e.endDate >= dateStr);
  };

  const tileContent = ({ date }) => {
    const dayEvents = eventsOnDate(date);
    return (
      <div className="text-xs">
        {dayEvents.map((e) => (
          <div key={e.id} className="bg-blue-200 text-blue-900 p-1 rounded mb-1">
            {e.title}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 bg-white rounded shadow mt-6">
      <h2 className="text-xl font-bold mb-4">Calendar</h2>
      <Calendar
        onChange={setDate}
        value={date}
        tileContent={tileContent}
      />

      <button
        onClick={() => setShowForm(true)}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Add Event
      </button>

      {showForm && (
        <div className="mt-4 bg-gray-100 p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Add Event</h3>
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full mb-2 border p-2 rounded"
            required
          />
          <textarea
            placeholder="Notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full mb-2 border p-2 rounded"
          />
          <label className="block mb-1 font-semibold">Start Date:</label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className="mb-2 border p-2 rounded w-full"
          />
          <label className="block mb-1 font-semibold">End Date:</label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            className="mb-2 border p-2 rounded w-full"
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddEvent}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
