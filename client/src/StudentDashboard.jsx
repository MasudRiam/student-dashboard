import React, { useState, useEffect, forwardRef } from 'react';
import axios from 'axios';
import {
  Container,
  TextField,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  Slide
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { motion } from 'framer-motion';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function StudentDashboard() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: '', age: '', course: '' });
  const [editId, setEditId] = useState(null);
  const [open, setOpen] = useState(false);

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
    if (editId) {
      await axios.put(`http://localhost:5000/students/${editId}`, form);
    } else {
      await axios.post('http://localhost:5000/students', form);
    }
    setForm({ name: '', age: '', course: '' });
    setEditId(null);
    setOpen(false);
    fetchStudents();
  };

  const handleEdit = (student) => {
    setForm({ name: student.name, age: student.age, course: student.course });
    setEditId(student._id);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/students/${id}`);
    fetchStudents();
  };

  const handleDialogClose = () => {
    setOpen(false);
    setEditId(null);
    setForm({ name: '', age: '', course: '' });
  };

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Student Dashboard
      </Typography>

      {/* Dashboard Widgets */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          {
            label: 'Total Students',
            value: students.length
          },
          {
            label: 'Average Age',
            value:
              students.length > 0
                ? (students.reduce((sum, s) => sum + parseInt(s.age), 0) / students.length).toFixed(1)
                : 0
          },
          {
            label: 'Unique Courses',
            value: [...new Set(students.map((s) => s.course))].length
          }
        ].map((widget, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Card>
                <CardContent>
                  <Typography variant="h6">{widget.label}</Typography>
                  <Typography variant="h4">{widget.value}</Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Button variant="contained" onClick={() => setOpen(true)} sx={{ mb: 2 }}>
        Add Student
      </Button>

      <Dialog open={open} onClose={handleDialogClose} fullWidth TransitionComponent={Transition}>
        <DialogTitle>{editId ? 'Edit Student' : 'Add Student'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <TextField
            label="Age"
            name="age"
            type="number"
            value={form.age}
            onChange={handleChange}
            required
          />
          <TextField
            label="Course"
            name="course"
            value={form.course}
            onChange={handleChange}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button type="submit" variant="contained" onClick={handleSubmit}>
            {editId ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Age</b></TableCell>
              <TableCell><b>Course</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody component={motion.tbody}>
            {students.map((stu, index) => (
              <motion.tr
                key={stu._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <TableCell>{stu.name}</TableCell>
                <TableCell>{stu.age}</TableCell>
                <TableCell>{stu.course}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(stu)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(stu._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default StudentDashboard;
