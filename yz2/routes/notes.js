import express from 'express';
import { getDatabase } from '../db.js';

const router = express.Router();

// Get all notes for user
router.get('/', async (req, res) => {
  try {
    const db = getDatabase();
    const notes = await db.all(
      'SELECT id, title, content, created_at, updated_at FROM notes WHERE user_id = ? ORDER BY updated_at DESC',
      [req.userId]
    );
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single note
router.get('/:id', async (req, res) => {
  try {
    const db = getDatabase();
    const note = await db.get(
      'SELECT id, title, content, created_at, updated_at FROM notes WHERE id = ? AND user_id = ?',
      [req.params.id, req.userId]
    );
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create note
router.post('/', async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const db = getDatabase();
    const result = await db.run(
      'INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)',
      [req.userId, title, content || '']
    );

    res.status(201).json({
      id: result.lastID,
      title,
      content: content || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update note
router.put('/:id', async (req, res) => {
  try {
    const { title, content } = req.body;
    const db = getDatabase();

    const note = await db.get(
      'SELECT id FROM notes WHERE id = ? AND user_id = ?',
      [req.params.id, req.userId]
    );

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    await db.run(
      'UPDATE notes SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [title || 'Untitled', content || '', req.params.id]
    );

    const updated = await db.get(
      'SELECT id, title, content, created_at, updated_at FROM notes WHERE id = ?',
      [req.params.id]
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete note
router.delete('/:id', async (req, res) => {
  try {
    const db = getDatabase();

    const note = await db.get(
      'SELECT id FROM notes WHERE id = ? AND user_id = ?',
      [req.params.id, req.userId]
    );

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    await db.run('DELETE FROM notes WHERE id = ?', [req.params.id]);
    res.json({ message: 'Note deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
