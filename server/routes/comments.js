import express from 'express';
import {
  getComments,
  createComment,
  deleteComment,
} from '../controllers/commentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/:postId', getComments);
router.post('/:postId', protect, createComment);
router.delete('/:id', protect, deleteComment);

export default router;