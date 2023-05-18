import DataVisualization from '../models/DataVisualization.js';

export const getData = async (req, res) => {
  try {
    const data = await DataVisualization.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getDataEndYear = async (req, res) => {
  try {
    const projection = {
      end_year: 1,
      intensity: 1,
      impact: 1,
      relevance: 1,
      likelihood: 1,
      topic: 1,
      country: 1,
      region: 1,
    };
    const data = await DataVisualization.find(
      {
        end_year: { $ne: null },
      },
      projection
    ).sort({
      end_year: 1,
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
