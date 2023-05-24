import { useGetSectorQuery } from 'state/api';
import { useMemo } from 'react';
import Header from 'components/Header';
import { Box, useTheme } from '@mui/material';
import 'react-datepicker/dist/react-datepicker.css';
import LineChart from 'components/LineChart';
import BarChart from 'components/BarChart';
import PieChart from 'components/PieChart';

const Sector = () => {
  const { data, isLoading } = useGetSectorQuery();
  const theme = useTheme();

  const [formattedDataLine] = useMemo(() => {
    if (!data) return [];

    // Create a map to store the data arrays for each property
    const propertyDataMap = {
      Intensity: [],
      Relevance: [],
      Likelihood: [],
    };

    // Create a map to store the count of each sector
    const sectorCountMap = {};

    // Iterate over data to collect data points and count topics
    for (const { sector, intensity, relevance, likelihood } of data) {
      if (sector === '') continue; // Skip empty topics

      propertyDataMap.Intensity.push({ x: sector, y: intensity });
      propertyDataMap.Relevance.push({ x: sector, y: relevance });
      propertyDataMap.Likelihood.push({ x: sector, y: likelihood });

      // Increment the count for the sector
      sectorCountMap[sector] = (sectorCountMap[sector] || 0) + 1;
    }

    // Calculate average value for each sector
    const formattedDataLine = Object.entries(propertyDataMap).map(
      ([id, dataPoints]) => {
        const topicDataMap = new Map();

        // Group data points by sector
        dataPoints.forEach((dataPoint) => {
          const { x: sector, y } = dataPoint;
          if (!topicDataMap.has(sector)) {
            topicDataMap.set(sector, []);
          }
          topicDataMap.get(sector).push(y);
        });

        // Calculate average value for each sector
        const averagedDataPoints = Array.from(topicDataMap)
          .map(([sector, values]) => {
            if (sector === '') return null; // Skip empty topics
            const count = values.length;
            const sum = values.reduce((acc, val) => acc + val, 0);
            const average = count > 0 ? Math.round(sum / count) : 0; // Round the average value
            return { x: sector, y: average };
          })
          .filter((dataPoint) => dataPoint !== null); // Remove null data points

        // Filter out topics with a count less than or equal to 10
        const filteredDataPoints = averagedDataPoints.filter((dataPoint) => {
          const topicCount = sectorCountMap[dataPoint.x] || 0;
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

  const [formattedDataBar, sectorCountMap] = useMemo(() => {
    if (!data) return [];

    const sectorCountMap = {};

    // Accumulate count for each sector
    for (const { sector } of data) {
      if (sector === '') continue;

      if (!sectorCountMap[sector]) {
        sectorCountMap[sector] = 0;
      }

      sectorCountMap[sector] += 1;
    }

    // Filter out topics with a count less than or equal to 10
    const filteredTopics = Object.keys(sectorCountMap).filter(
      (sector) => sectorCountMap[sector] > 10
    );

    const formattedDataBar = {};

    // Accumulate values and count occurrences for each sector
    for (const { sector, intensity, relevance, likelihood } of data) {
      if (sector === '' || !filteredTopics.includes(sector)) continue;

      if (!formattedDataBar[sector]) {
        formattedDataBar[sector] = {
          sector,

          intensity: 0,
          relevance: 0,
          likelihood: 0,
          count: 0,
        };
      }

      // Accumulate the values for each property within a sector
      formattedDataBar[sector] = {
        ...formattedDataBar[sector],
        intensity: formattedDataBar[sector].intensity + (intensity || 0),
        relevance: formattedDataBar[sector].relevance + (relevance || 0),
        likelihood: formattedDataBar[sector].likelihood + (likelihood || 0),
        count: formattedDataBar[sector].count + 1,
      };
    }

    // Calculate average values for each property within a sector
    for (const topicData of Object.values(formattedDataBar)) {
      topicData.intensity = Math.round(topicData.intensity / topicData.count);
      topicData.relevance = Math.round(topicData.relevance / topicData.count);
      topicData.likelihood = Math.round(topicData.likelihood / topicData.count);
    }

    const formattedDataBarArr = Object.values(formattedDataBar);
    return [formattedDataBarArr, sectorCountMap];
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const [formattedDataPie] = useMemo(() => {
    if (!data) return [[]];

    const pieChartData = Object.keys(sectorCountMap).map((sector) => ({
      id: sector,
      label: sector.toString(),
      value: sectorCountMap[sector],
    }));

    return [pieChartData];
  }, [data, sectorCountMap]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box m='1.5rem 2.5rem'>
      <Header title='SECTOR' subtitle='Chart of SECTOR' />
      <LineChart
        chartTitle={'Line Chart'}
        formattedData={formattedDataLine}
        data={data}
        isLoading={isLoading}
        lengendBottom='Sectors'
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
        indexBy='sector'
        legendBottom='Sectors'
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

export default Sector;
