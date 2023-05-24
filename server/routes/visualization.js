import express from 'express';
import {
  getData,
  getDataEndYear,
  getTopic,
} from '../controllers/visualization.js';

const router = express.Router();

router.get('/data', getData);
router.get('/dataendyear', getDataEndYear);
router.get('/topic', getTopic);

export default router;
