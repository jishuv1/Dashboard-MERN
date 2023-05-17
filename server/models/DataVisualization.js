import mongoose from 'mongoose';

// Define the Data schema
const dataVisualizationSchema = new mongoose.Schema({
  end_year: {
    type: Number,
    default: null,
  },
  intensity: {
    type: Number,
    default: null,
  },
  sector: {
    type: String,
    default: null,
  },
  topic: {
    type: String,
    default: null,
  },
  insight: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    default: null,
  },
  start_year: {
    type: Number,
    default: null,
  },
  impact: {
    type: Number,
    default: null,
  },
  added: {
    type: Date,
    required: true,
  },
  published: {
    type: Date,
    default: null,
  },
  country: {
    type: String,
    default: null,
  },
  relevance: {
    type: Number,
    default: null,
  },
  pestle: {
    type: String,
    default: null,
  },
  source: {
    type: String,
    default: null,
  },
  title: {
    type: String,
    required: true,
  },
  likelihood: {
    type: Number,
    default: null,
  },
});

// Create the model
const DataVisualization = mongoose.model(
  'DataVisualization',
  dataVisualizationSchema
);

export default DataVisualization;
