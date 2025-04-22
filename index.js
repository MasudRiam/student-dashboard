const express = require('express');
 const mongoose = require('mongoose');
 const cors = require('cors');

 const app = express();
 app.use(express.json());
 app.use(cors());

 // --- Database Connection ---
 mongoose.connect('mongodb://localhost:27017/studentParentDB'); // Single database

 // --- OR --- (For separate databases - Not Recommended, but included for reference)
 // const studentDB = mongoose.createConnection('mongodb://localhost:27017/studentDashboard');
 // const parentDB = mongoose.createConnection('mongodb://localhost:27017/parentDB');

 // --- Student Schema ---
 const StudentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  course: String
 }, { collection: 'students' }); // Added collection name for clarity

 const Student = mongoose.model('Student', StudentSchema);
 // const Student = studentDB.model('Student', StudentSchema);  // For separate DBs

 // --- Parent Schema ---
 const ParentSchema = new mongoose.Schema({
  studentId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Student',
  required: true,
  unique: true
  },
  movie: String,
  parentCurrentAge: Number,
  parentCourse: String
 }, { collection: 'parents' });  // Added collection name for clarity

 const Parent = mongoose.model('Parent', ParentSchema);
 // const Parent = parentDB.model('Parent', ParentSchema);  // For separate DBs

 // --- Student Routes ---
 app.get('/students', async (req, res) => {
  try {
  const students = await Student.find();
  res.json(students);
  } catch (error) {
  res.status(500).json({ error: error.message });
  }
 });

 app.post('/students', async (req, res) => {
  try {
  const student = new Student(req.body);
  await student.save();
  res.status(201).json(student);
  } catch (error) {
  res.status(500).json({ error: error.message });
  }
 });

 app.put('/students/:id', async (req, res) => {
  try {
  const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); // Added runValidators
  if (student) {
  res.json(student);
  } else {
  res.status(404).json({ message: 'Student not found' });
  }
  } catch (error) {
  res.status(500).json({ error: error.message });
  }
 });

 app.delete('/students/:id', async (req, res) => {
  try {
  const student = await Student.findByIdAndDelete(req.params.id);
  if (student) {
  res.json({ message: 'Student deleted' });
  } else {
  res.status(404).json({ message: 'Student not found' });
  }
  } catch (error) {
  res.status(500).json({ error: error.message });
  }
 });

 // --- Parent Routes ---
 app.get('/parents/:studentId', async (req, res) => {
  try {
    const parent = await Parent.findOne({ studentId: req.params.studentId }).populate('studentId');
    if (parent) {
      res.json(parent);
    } else {
      res.status(404).json({ message: 'Parent not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

 app.post('/parents', async (req, res) => {
  try {
  const parent = new Parent(req.body);
  await parent.save();
  res.status(201).json(parent);
  } catch (error) {
  res.status(500).json({ error: error.message });
  }
 });

 app.put('/parents/:studentId', async (req, res) => {
    try {
    const parent = await Parent.findOneAndUpdate(
    { studentId: req.params.studentId },
    req.body,
    { new: true, runValidators: true }
    );
    if (parent) {
    res.json(parent);
    } else {
    res.status(404).json({ message: 'Parent not found' });
    }
    } catch (error) {
    res.status(500).json({ error: error.message });
  }
 });

 app.delete('/parents/:studentId', async (req, res) => {
  try {
  const parent = await Parent.findOneAndDelete({ studentId: req.params.studentId });
  if (parent) {
  res.json({ message: 'Parent deleted' });
  } else {
  res.status(404).json({ message: 'Parent not found' });
  }
  } catch (error) {
  res.status(500).json({ error: error.message });
  }
 });

 app.listen(5000, () => console.log('Server running on port 5000'));