import express from 'express';
import { getData } from '../controllers/visualization.js';

const router = express.Router();

router.get('/datavisualizations', getData);

export default router;
