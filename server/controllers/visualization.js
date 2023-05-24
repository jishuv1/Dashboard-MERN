import DataVisualization from '../models/DataVisualization.js';
import { countryToAlpha3 } from 'country-to-iso';

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

export const getTopic = async (req, res) => {
  try {
    const projection = {
      topic: 1,
      intensity: 1,
      impact: 1,
      relevance: 1,
      likelihood: 1,
    };
    const data = await DataVisualization.find(
      {
        topic: { $ne: null },
      },
      projection
    );
    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getSector = async (req, res) => {
  try {
    const projection = {
      sector: 1,
      intensity: 1,
      relevance: 1,
      likelihood: 1,
    };
    const data = await DataVisualization.find(
      {
        sector: { $ne: null },
      },
      projection
    );
    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getPest = async (req, res) => {
  try {
    const projection = {
      pestle: 1,
      intensity: 1,
      relevance: 1,
      likelihood: 1,
    };
    const data = await DataVisualization.find(
      {
        pestle: { $ne: null },
      },
      projection
    );
    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getSource = async (req, res) => {
  try {
    const projection = {
      source: 1,
      intensity: 1,
      relevance: 1,
      likelihood: 1,
    };
    const data = await DataVisualization.find(
      {
        source: { $ne: null },
      },
      projection
    );
    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getCountry = async (req, res) => {
  try {
    const projection = {
      country: 1,
      intensity: 1,
      relevance: 1,
      likelihood: 1,
    };
    const data = await DataVisualization.find(
      {
        country: { $ne: '' },
      },
      projection
    );

    const mappedLocation = data.reduce((acc, { country }) => {
      const countryISO3 = countryToAlpha3(country);

      if (!acc[countryISO3]) {
        acc[countryISO3] = 0;
      }
      acc[countryISO3]++;
      return acc;
    }, {});

    const formattedLocations = Object.entries(mappedLocation).map(
      ([country, count]) => {
        return { id: country, value: count };
      }
    );

    res.status(200).json(formattedLocations);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
