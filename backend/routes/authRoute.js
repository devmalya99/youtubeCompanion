import express from 'express'
const router = express.Router();
import { googleAuth } from '../controller/authController.js'

// POST /api/auth/google
router.post("/google", googleAuth);

export default router
