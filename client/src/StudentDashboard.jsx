import React, { useState, useEffect } from 'react';
import axios from 'axios';

function StudentDashboard() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: '', age: '', course: '' });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const res = await axios.get('http://localhost:5000/students');
    setStudents(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/students', form);
    setForm({ name: '', age: '', course: '' });
    fetchStudents();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/students/${id}`);
    fetchStudents();
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Student Dashboard</h1>

      <form className="row g-3 mb-4" onSubmit={handleSubmit}>
        <div className="col-md-4">
          <input
            className="form-control"
            placeholder="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-3">
          <input
            type="number"
            className="form-control"
            placeholder="Age"
            name="age"
            value={form.age}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-3">
          <input
            className="form-control"
            placeholder="Course"
            name="course"
            value={form.course}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-2 d-grid">
          <button type="submit" className="btn btn-primary">Add Student</button>
        </div>
      </form>

      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Course</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((stu) => (
            <tr key={stu._id}>
              <td>{stu.name}</td>
              <td>{stu.age}</td>
              <td>{stu.course}</td>
              <td>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(stu._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentDashboard;
