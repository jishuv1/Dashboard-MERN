import express from 'express';
import { getData, getDataEndYear } from '../controllers/visualization.js';

const router = express.Router();

router.get('/data', getData);
router.get('/dataendyear', getDataEndYear);

export default router;
