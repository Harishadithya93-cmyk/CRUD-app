const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const MONGO_URL = process.env.MONGO_URL || 'mongodb://mongo:27017/notesdb';
mongoose.connect(MONGO_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Mongo error:', err));

const Note = mongoose.model('Note', new mongoose.Schema({
  title: String,
  content: String
}));

// Create
app.post('/notes', async (req, res) => {
  res.status(201).json(await Note.create(req.body));
});

// Read all
app.get('/notes', async (req, res) => {
  res.json(await Note.find());
});

// Read one
app.get('/notes/:id', async (req, res) => {
  const note = await Note.findById(req.params.id);
  note ? res.json(note) : res.status(404).json({ error: 'Not found' });
});

// Update
app.put('/notes/:id', async (req, res) => {
  const note = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
  note ? res.json(note) : res.status(404).json({ error: 'Not found' });
});

// Delete
app.delete('/notes/:id', async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

app.listen(3000, () => console.log('API running on port 3000'));