import { useGetPestQuery } from 'state/api';
import { useMemo } from 'react';
import Header from 'components/Header';
import { Box, useTheme } from '@mui/material';
import 'react-datepicker/dist/react-datepicker.css';
import LineChart from 'components/LineChart';
import BarChart from 'components/BarChart';
import PieChart from 'components/PieChart';

const Pest = () => {
  const { data, isLoading } = useGetPestQuery();
  const theme = useTheme();

  const [formattedDataLine] = useMemo(() => {
    if (!data) return [];

    // Create a map to store the data arrays for each property
    const propertyDataMap = {
      Intensity: [],
      Relevance: [],
      Likelihood: [],
    };

    // Create a map to store the count of each pestle
    const pestCountMap = {};

    // Iterate over data to collect data points and count topics
    for (const { pestle, intensity, relevance, likelihood } of data) {
      if (pestle === '') continue; // Skip empty topics

      propertyDataMap.Intensity.push({ x: pestle, y: intensity });
      propertyDataMap.Relevance.push({ x: pestle, y: relevance });
      propertyDataMap.Likelihood.push({ x: pestle, y: likelihood });

      // Increment the count for the pestle
      pestCountMap[pestle] = (pestCountMap[pestle] || 0) + 1;
    }

    // Calculate average value for each pestle
    const formattedDataLine = Object.entries(propertyDataMap).map(
      ([id, dataPoints]) => {
        const topicDataMap = new Map();

        // Group data points by pestle
        dataPoints.forEach((dataPoint) => {
          const { x: pestle, y } = dataPoint;
          if (!topicDataMap.has(pestle)) {
            topicDataMap.set(pestle, []);
          }
          topicDataMap.get(pestle).push(y);
        });

        // Calculate average value for each pestle
        const averagedDataPoints = Array.from(topicDataMap)
          .map(([pestle, values]) => {
            if (pestle === '') return null; // Skip empty topics
            const count = values.length;
            const sum = values.reduce((acc, val) => acc + val, 0);
            const average = count > 0 ? Math.round(sum / count) : 0; // Round the average value
            return { x: pestle, y: average };
          })
          .filter((dataPoint) => dataPoint !== null); // Remove null data points

        // Filter out topics with a count less than or equal to 10
        const filteredDataPoints = averagedDataPoints.filter((dataPoint) => {
          const topicCount = pestCountMap[dataPoint.x] || 0;
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

  const [formattedDataBar, pestCountMap] = useMemo(() => {
    if (!data) return [];

    const pestCountMap = {};

    // Accumulate count for each pestle
    for (const { pestle } of data) {
      if (pestle === '') continue;

      if (!pestCountMap[pestle]) {
        pestCountMap[pestle] = 0;
      }

      pestCountMap[pestle] += 1;
    }

    // Filter out topics with a count less than or equal to 10
    const filteredTopics = Object.keys(pestCountMap).filter(
      (pestle) => pestCountMap[pestle] > 10
    );

    const formattedDataBar = {};

    // Accumulate values and count occurrences for each pestle
    for (const { pestle, intensity, relevance, likelihood } of data) {
      if (pestle === '' || !filteredTopics.includes(pestle)) continue;

      if (!formattedDataBar[pestle]) {
        formattedDataBar[pestle] = {
          pestle,
          intensity: 0,
          relevance: 0,
          likelihood: 0,
          count: 0,
        };
      }

      // Accumulate the values for each property within a pestle
      formattedDataBar[pestle] = {
        ...formattedDataBar[pestle],
        intensity: formattedDataBar[pestle].intensity + (intensity || 0),
        relevance: formattedDataBar[pestle].relevance + (relevance || 0),
        likelihood: formattedDataBar[pestle].likelihood + (likelihood || 0),
        count: formattedDataBar[pestle].count + 1,
      };
    }

    // Calculate average values for each property within a pestle
    for (const topicData of Object.values(formattedDataBar)) {
      topicData.intensity = Math.round(topicData.intensity / topicData.count);
      topicData.relevance = Math.round(topicData.relevance / topicData.count);
      topicData.likelihood = Math.round(topicData.likelihood / topicData.count);
    }

    const formattedDataBarArr = Object.values(formattedDataBar);
    return [formattedDataBarArr, pestCountMap];
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const [formattedDataPie] = useMemo(() => {
    if (!data) return [[]];

    const pieChartData = Object.keys(pestCountMap).map((pestle) => ({
      id: pestle,
      label: pestle.toString(),
      value: pestCountMap[pestle],
    }));

    return [pieChartData];
  }, [data, pestCountMap]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box m='1.5rem 2.5rem'>
      <Header title='PEST' subtitle='Chart of PEST' />
      <LineChart
        chartTitle={'Line Chart'}
        formattedData={formattedDataLine}
        data={data}
        isLoading={isLoading}
        lengendBottom='Pestle'
        bottomMargin={105}
        bottomLegendOffset={74}
      />
      <br />
      <br />
      <BarChart
        chartTitle={'BAR Chart'}
        formattedData={formattedDataBar}
        data={data}
        isLoading={isLoading}
        keys={['intensity', 'relevance', 'likelihood']}
        indexBy='pestle'
        legendBottom='Pestle'
        bottomMargin={105}
        bottomLegendOffset={74}
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

export default Pest;
