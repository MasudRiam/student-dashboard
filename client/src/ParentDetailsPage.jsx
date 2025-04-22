import React, { useState, useEffect } from 'react';
 import axios from 'axios';
 import {
  Container,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
 } from '@mui/material';
 import { useParams, useNavigate } from 'react-router-dom';

 function ParentDetailsPage() {
  const [parentDetails, setParentDetails] = useState({
  studentId: '',
  movie: '',
  parentCurrentAge: '',
  parentCourse: ''
  });
  const [students, setStudents] = useState([]);  //  For dropdown
  const { studentId } = useParams();  //  Get studentId from URL (if editing)
  const navigate = useNavigate();

  useEffect(() => {
  fetchStudents();
  if (studentId) {
  fetchParentDetails(studentId);
  }
  }, [studentId]);

  const fetchStudents = async () => {
  try {
  const response = await axios.get('http://localhost:5000/students');
  setStudents(response.data);
  } catch (error) {
  console.error('Error fetching students:', error);
  }
  };

  const fetchParentDetails = async (id) => {
  try {
  const response = await axios.get(`http://localhost:5000/parents/${id}`);
  setParentDetails(response.data);
  } catch (error) {
  console.error('Error fetching parent details:', error);
  }
  };

  const handleChange = (e) => {
  setParentDetails({ ...parentDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
  if (studentId) {
  await axios.put(`http://localhost:5000/parents/${studentId}`, parentDetails);
  } else {
  await axios.post('http://localhost:5000/parents', parentDetails);
  }
  navigate('/');  //  Go back to dashboard
  } catch (error) {
  console.error('Error saving parent details:', error);
  }
  };

  return (
  <Container>
  <Typography variant="h4" align="center" gutterBottom>
  {studentId ? 'Edit Parent Details' : 'Add Parent Details'}
  </Typography>
  <form onSubmit={handleSubmit}>
  <FormControl fullWidth margin="normal" required>
  <InputLabel id="student-select-label">Select Student</InputLabel>
  <Select
  labelId="student-select-label"
  id="studentId"
  name="studentId"
  value={parentDetails.studentId || ''}
  label="Select Student"
  onChange={handleChange}
  >
  {students.map((student) => (
  <MenuItem key={student._id} value={student._id}>
  {student.name}
  </MenuItem>
  ))}
  </Select>
  </FormControl>
  <TextField
  label="Movie"
  name="movie"
  value={parentDetails.movie}
  onChange={handleChange}
  fullWidth
  margin="normal"
  required
  />
  <TextField
  label="Parent Current Age"
  name="parentCurrentAge"
  value={parentDetails.parentCurrentAge}
  onChange={handleChange}
  fullWidth
  margin="normal"
  required
  />
  <TextField
  label="Parent Course"
  name="parentCourse"
  value={parentDetails.parentCourse}
  onChange={handleChange}
  fullWidth
  margin="normal"
  required
  />
  <Button type="submit" variant="contained" color="primary">
  {studentId ? 'Update Parent' : 'Add Parent'}
  </Button>
  </form>
  </Container>
  );
 }

 export default ParentDetailsPage;