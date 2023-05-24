import { useGetTopicQuery } from 'state/api';
import { useMemo } from 'react';
import Header from 'components/Header';
import { Box, useTheme } from '@mui/material';
import 'react-datepicker/dist/react-datepicker.css';
import LineChart from 'components/LineChart';
import BarChart from 'components/BarChart';
import PieChart from 'components/PieChart';

const Topics = () => {
  const { data, isLoading } = useGetTopicQuery();
  const theme = useTheme();

  const [formattedDataLine] = useMemo(() => {
    if (!data) return [];

    // Create a map to store the data arrays for each property
    const propertyDataMap = {
      Impact: [],
      Intensity: [],
      Relevance: [],
      Likelihood: [],
    };

    // Create a map to store the count of each topic
    const topicCountMap = {};

    // Iterate over data to collect data points and count topics
    for (const { topic, impact, intensity, relevance, likelihood } of data) {
      if (topic === '') continue; // Skip empty topics

      propertyDataMap.Impact.push({ x: topic, y: impact });
      propertyDataMap.Intensity.push({ x: topic, y: intensity });
      propertyDataMap.Relevance.push({ x: topic, y: relevance });
      propertyDataMap.Likelihood.push({ x: topic, y: likelihood });

      // Increment the count for the topic
      topicCountMap[topic] = (topicCountMap[topic] || 0) + 1;
    }

    // Calculate average value for each topic
    const formattedDataLine = Object.entries(propertyDataMap).map(
      ([id, dataPoints]) => {
        const topicDataMap = new Map();

        // Group data points by topic
        dataPoints.forEach((dataPoint) => {
          const { x: topic, y } = dataPoint;
          if (!topicDataMap.has(topic)) {
            topicDataMap.set(topic, []);
          }
          topicDataMap.get(topic).push(y);
        });

        // Calculate average value for each topic
        const averagedDataPoints = Array.from(topicDataMap)
          .map(([topic, values]) => {
            if (topic === '') return null; // Skip empty topics
            const count = values.length;
            const sum = values.reduce((acc, val) => acc + val, 0);
            const average = count > 0 ? Math.round(sum / count) : 0; // Round the average value
            return { x: topic, y: average };
          })
          .filter((dataPoint) => dataPoint !== null); // Remove null data points

        // Filter out topics with a count less than or equal to 10
        const filteredDataPoints = averagedDataPoints.filter((dataPoint) => {
          const topicCount = topicCountMap[dataPoint.x] || 0;
          return topicCount > 10;
        });

        return {
          id,
          color: theme.palette.secondary.main,
          data: filteredDataPoints,
        };
      }
    );

    return [formattedDataLine];
  }, [data, theme]); // eslint-disable-line react-hooks/exhaustive-deps

  const [formattedDataBar, topicCountMap] = useMemo(() => {
    if (!data) return [];

    const topicCountMap = {};

    // Accumulate count for each topic
    for (const { topic } of data) {
      if (topic === '') continue;

      if (!topicCountMap[topic]) {
        topicCountMap[topic] = 0;
      }

      topicCountMap[topic] += 1;
    }

    // Filter out topics with a count less than or equal to 10
    const filteredTopics = Object.keys(topicCountMap).filter(
      (topic) => topicCountMap[topic] > 10
    );

    const formattedDataBar = {};

    // Accumulate values and count occurrences for each topic
    for (const { topic, impact, intensity, relevance, likelihood } of data) {
      if (topic === '' || !filteredTopics.includes(topic)) continue;

      if (!formattedDataBar[topic]) {
        formattedDataBar[topic] = {
          topic,
          impact: 0,
          intensity: 0,
          relevance: 0,
          likelihood: 0,
          count: 0,
        };
      }

      // Accumulate the values for each property within a topic
      formattedDataBar[topic] = {
        ...formattedDataBar[topic],
        impact: formattedDataBar[topic].impact + (impact || 0),
        intensity: formattedDataBar[topic].intensity + (intensity || 0),
        relevance: formattedDataBar[topic].relevance + (relevance || 0),
        likelihood: formattedDataBar[topic].likelihood + (likelihood || 0),
        count: formattedDataBar[topic].count + 1,
      };
    }

    // Calculate average values for each property within a topic
    for (const topicData of Object.values(formattedDataBar)) {
      topicData.impact = Math.round(topicData.impact / topicData.count);
      topicData.intensity = Math.round(topicData.intensity / topicData.count);
      topicData.relevance = Math.round(topicData.relevance / topicData.count);
      topicData.likelihood = Math.round(topicData.likelihood / topicData.count);
    }

    const formattedDataBarArr = Object.values(formattedDataBar);
    return [formattedDataBarArr, topicCountMap];
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const [formattedDataPie] = useMemo(() => {
    if (!data) return [[]];

    const pieChartData = Object.keys(topicCountMap).map((topic) => ({
      id: topic,
      label: topic.toString(),
      value: topicCountMap[topic],
    }));

    return [pieChartData];
  }, [data, topicCountMap]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box m='1.5rem 2.5rem'>
      <Header title='TOPIC' subtitle='Chart of TOPIC' />
      <LineChart
        chartTitle={'Line Chart'}
        formattedData={formattedDataLine}
        data={data}
        isLoading={isLoading}
        lengendBottom='Topics'
        bottomLegendOffset={50}
      />
      <br />
      <br />
      <BarChart
        chartTitle={'BAR Chart'}
        formattedData={formattedDataBar}
        data={data}
        isLoading={isLoading}
        keys={['impact', 'intensity', 'relevance', 'likelihood']}
        indexBy='topic'
        legendBottom='Topics'
        bottomLegendOffset={50}
      />
      <br />
      <br />
      <PieChart
        chartTitle={'PIE Chart'}
        formattedData={formattedDataPie}
        data={data}
        isLoading={isLoading}
      />
    </Box>
  );
};

export default Topics;
