import { useGetSourceQuery } from 'state/api';
import { useMemo } from 'react';
import Header from 'components/Header';
import { Box, useTheme } from '@mui/material';
import 'react-datepicker/dist/react-datepicker.css';
import LineChart from 'components/LineChart';
import BarChart from 'components/BarChart';
import PieChart from 'components/PieChart';

const Source = () => {
  const { data, isLoading } = useGetSourceQuery();
  const theme = useTheme();

  const [formattedDataLine] = useMemo(() => {
    if (!data) return [];

    // Create a map to store the data arrays for each property
    const propertyDataMap = {
      Intensity: [],
      Relevance: [],
      Likelihood: [],
    };

    // Create a map to store the count of each source
    const sourceCountMap = {};

    // Iterate over data to collect data points and count topics
    for (const { source, intensity, relevance, likelihood } of data) {
      if (source === '') continue; // Skip empty topics

      propertyDataMap.Intensity.push({ x: source, y: intensity });
      propertyDataMap.Relevance.push({ x: source, y: relevance });
      propertyDataMap.Likelihood.push({ x: source, y: likelihood });

      // Increment the count for the source
      sourceCountMap[source] = (sourceCountMap[source] || 0) + 1;
    }

    // Calculate average value for each source
    const formattedDataLine = Object.entries(propertyDataMap).map(
      ([id, dataPoints]) => {
        const topicDataMap = new Map();

        // Group data points by source
        dataPoints.forEach((dataPoint) => {
          const { x: source, y } = dataPoint;
          if (!topicDataMap.has(source)) {
            topicDataMap.set(source, []);
          }
          topicDataMap.get(source).push(y);
        });

        // Calculate average value for each source
        const averagedDataPoints = Array.from(topicDataMap)
          .map(([source, values]) => {
            if (source === '') return null; // Skip empty topics
            const count = values.length;
            const sum = values.reduce((acc, val) => acc + val, 0);
            const average = count > 0 ? Math.round(sum / count) : 0; // Round the average value
            return { x: source, y: average };
          })
          .filter((dataPoint) => dataPoint !== null); // Remove null data points

        // Filter out topics with a count less than or equal to 10
        const filteredDataPoints = averagedDataPoints.filter((dataPoint) => {
          const topicCount = sourceCountMap[dataPoint.x] || 0;
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

  const [formattedDataBar, sourceCountMap] = useMemo(() => {
    if (!data) return [];

    const sourceCountMap = {};

    // Accumulate count for each source
    for (const { source } of data) {
      if (source === '') continue;

      if (!sourceCountMap[source]) {
        sourceCountMap[source] = 0;
      }

      sourceCountMap[source] += 1;
    }

    // Filter out topics with a count less than or equal to 10
    const filteredTopics = Object.keys(sourceCountMap).filter(
      (source) => sourceCountMap[source] > 10
    );

    const formattedDataBar = {};

    // Accumulate values and count occurrences for each source
    for (const { source, intensity, relevance, likelihood } of data) {
      if (source === '' || !filteredTopics.includes(source)) continue;

      if (!formattedDataBar[source]) {
        formattedDataBar[source] = {
          source,

          intensity: 0,
          relevance: 0,
          likelihood: 0,
          count: 0,
        };
      }

      // Accumulate the values for each property within a source
      formattedDataBar[source] = {
        ...formattedDataBar[source],
        intensity: formattedDataBar[source].intensity + (intensity || 0),
        relevance: formattedDataBar[source].relevance + (relevance || 0),
        likelihood: formattedDataBar[source].likelihood + (likelihood || 0),
        count: formattedDataBar[source].count + 1,
      };
    }

    // Calculate average values for each property within a source
    for (const topicData of Object.values(formattedDataBar)) {
      topicData.intensity = Math.round(topicData.intensity / topicData.count);
      topicData.relevance = Math.round(topicData.relevance / topicData.count);
      topicData.likelihood = Math.round(topicData.likelihood / topicData.count);
    }

    const formattedDataBarArr = Object.values(formattedDataBar);
    return [formattedDataBarArr, sourceCountMap];
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const [formattedDataPie] = useMemo(() => {
    if (!data) return [[]];

    const pieChartData = Object.keys(sourceCountMap).map((source) => ({
      id: source,
      label: source.toString(),
      value: sourceCountMap[source],
    }));

    return [pieChartData];
  }, [data, sourceCountMap]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box m='1.5rem 2.5rem'>
      <Header title='SOURCE' subtitle='Chart of SOURCE' />
      <LineChart
        chartTitle={'Line Chart'}
        formattedData={formattedDataLine}
        data={data}
        isLoading={isLoading}
        lengendBottom='Sources'
        bottomMargin={150}
        bottomLegendOffset={100}
      />
      <br />
      <br />
      <BarChart
        chartTitle={'BAR Chart'}
        formattedData={formattedDataBar}
        data={data}
        isLoading={isLoading}
        keys={['intensity', 'relevance', 'likelihood']}
        indexBy='source'
        legendBottom='Sources'
        bottomMargin={150}
        bottomLegendOffset={100}
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

export default Source;
