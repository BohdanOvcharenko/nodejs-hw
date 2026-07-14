import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

// Отримати список усіх нотаток
export const getAllNotes = async (req, res) => {

  const { page = 1, perPage = 10, search, tag } = req.query;

  const skip = (page - 1) * perPage;

  const notesQuery = Note.find();

  if (search) {
  notesQuery.where({
  $or: [
    { title: { $regex: search, $options: 'i' } },
    { content: { $regex: search, $options: 'i' } },
  ],
  });
  }

  if (tag) {
    notesQuery.where({ tag: tag });
  }

 const [totalNotes, notes] = await Promise.all([
    notesQuery.clone().countDocuments(),
    notesQuery.skip(skip).limit(perPage),
 ]);

  const totalPages = Math.ceil(totalNotes / perPage);

  res.status(200).json({
    page,
    perPage,
    totalNotes,
    totalPages,
    notes,
  });
};

// Отримати одну нотатку за id
export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findById(noteId);

  if (!note) {
	throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};

export const createNote = async (req, res) => {
  const { title, content, tag } = req.body;
  const newNote = new Note({ title, content, tag });
  await newNote.save();
  res.status(201).json(newNote);
};

export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const deletedNote = await Note.findByIdAndDelete(noteId);

  if (!deletedNote) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(deletedNote);
};

export const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const { title, content } = req.body;

  const updatedNote = await Note.findByIdAndUpdate(
    noteId,
    { title, content },
    { returnDocument: 'after' }
  );

  if (!updatedNote) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(updatedNote);
};
