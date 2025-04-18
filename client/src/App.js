import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: '', age: '', course: '' });

  const fetchStudents = async () => {
    const res = await axios.get('http://localhost:5000/students');
    setStudents(res.data);
  };

  const addStudent = async () => {
    await axios.post('http://localhost:5000/students', form);
    setForm({ name: '', age: '', course: '' });
    fetchStudents();
  };

  const deleteStudent = async (id) => {
    await axios.delete(`http://localhost:5000/students/${id}`);
    fetchStudents();
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Student Dashboard</h2>
      <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Age" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} />
      <input placeholder="Course" value={form.course} onChange={e => setForm({ ...form, course: e.target.value })} />
      <button onClick={addStudent}>Add Student</button>

      <ul>
        {students.map(s => (
          <li key={s._id}>
            {s.name} - {s.age} - {s.course}
            <button onClick={() => deleteStudent(s._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
