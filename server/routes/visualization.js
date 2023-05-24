import express from 'express';
import {
  getData,
  getDataEndYear,
  getTopic,
  getSector,
  getPest,
  getSource,
  getCountry,
} from '../controllers/visualization.js';

const router = express.Router();

router.get('/data', getData);
router.get('/dataendyear', getDataEndYear);
router.get('/topic', getTopic);
router.get('/sector', getSector);
router.get('/pest', getPest);
router.get('/source', getSource);
router.get('/country', getCountry);

export default router;
