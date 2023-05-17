import DataVisualization from '../models/DataVisualization.js';

export const getData = async (req, res) => {
  try {
    const data = await DataVisualization.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
