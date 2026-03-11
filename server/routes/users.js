import express from 'express';
import { getUserProfile, getUserPosts } from '../controllers/userController.js';

const router = express.Router();

router.get('/:username', getUserProfile);
router.get('/:username/posts', getUserPosts);

export default router;