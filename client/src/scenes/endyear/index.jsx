import { useGetDataEndyearQuery } from 'state/api';
import { useState, useMemo } from 'react';
import Header from 'components/Header';
import { Box, useTheme } from '@mui/material';
import 'react-datepicker/dist/react-datepicker.css';
import LineChart from 'components/LineChart';
import BarChart from 'components/BarChart';
import PieChart from 'components/PieChart';

const Endyear = () => {
  const [startDate, setStartDate] = useState(new Date(2016, 0, 1));
  const [endDate, setEndDate] = useState(new Date(2200, 0, 1));
  const { data, isLoading } = useGetDataEndyearQuery();
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

    // Create a set to keep track of unique years
    const uniqueYears = new Set();

    // Iterate over data to collect unique years and populate the data arrays
    for (const { end_year, impact, intensity, relevance, likelihood } of data) {
      const yearDate = new Date(end_year, 0, 1);
      if (yearDate >= startDate && yearDate <= endDate) {
        const year = yearDate.getFullYear();
        uniqueYears.add(year);

        propertyDataMap.Impact.push({ x: year, y: impact });
        propertyDataMap.Intensity.push({ x: year, y: intensity });
        propertyDataMap.Relevance.push({ x: year, y: relevance });
        propertyDataMap.Likelihood.push({ x: year, y: likelihood });
      }
    }

    // Create the formatted data array with average values for each property
    const formattedDataLine = Object.entries(propertyDataMap).map(
      ([id, dataPoints]) => {
        const yearDataMap = new Map();

        // Group data points by year
        dataPoints.forEach((dataPoint) => {
          const { x: year, y } = dataPoint;
          if (!yearDataMap.has(year)) {
            yearDataMap.set(year, []);
          }
          yearDataMap.get(year).push(y);
        });

        // Calculate average value for each year
        const averagedDataPoints = Array.from(yearDataMap).map(
          ([year, values]) => {
            const count = values.length;
            const sum = values.reduce((acc, val) => acc + val, 0);
            const average = count > 0 ? sum / count : 0;
            return { x: year, y: average };
          }
        );

        return {
          id,
          color: theme.palette.secondary.main,
          data: averagedDataPoints,
        };
      }
    );

    return [formattedDataLine];
  }, [data, startDate, endDate, theme]); // eslint-disable-line react-hooks/exhaustive-deps

  const [formattedDataBar] = useMemo(() => {
    if (!data) return [];

    const formattedDataBar = {};

    // Accumulate values and count occurrences for each year
    for (const { end_year, impact, intensity, relevance, likelihood } of data) {
      const year = end_year;
      if (!formattedDataBar[year]) {
        formattedDataBar[year] = {
          year,
          impact: 0,
          intensity: 0,
          relevance: 0,
          likelihood: 0,
          count: 0,
        };
      }

      // Accumulate the values for each property within a year
      formattedDataBar[year] = {
        ...formattedDataBar[year],
        impact: formattedDataBar[year].impact + impact,
        intensity: formattedDataBar[year].intensity + intensity,
        relevance: formattedDataBar[year].relevance + relevance,
        likelihood: formattedDataBar[year].likelihood + likelihood,
        count: formattedDataBar[year].count + 1,
      };
    }

    // Calculate average values for each property within a year
    for (const yearData of Object.values(formattedDataBar)) {
      yearData.impact = Math.round(yearData.impact / yearData.count);
      yearData.intensity = Math.round(yearData.intensity / yearData.count);
      yearData.relevance = Math.round(yearData.relevance / yearData.count);
      yearData.likelihood = Math.round(yearData.likelihood / yearData.count);
    }

    const formattedDataBarArr = Object.values(formattedDataBar);
    return [formattedDataBarArr];
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const [formattedDataPie] = useMemo(() => {
    if (!data) return [[]];

    const pieChartData = Object.values(formattedDataBar).map((yearData) => ({
      id: yearData.year,
      label: yearData.year.toString(),
      value: yearData.count,
    }));

    return [pieChartData];
  }, [formattedDataBar]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box m='1.5rem 2.5rem'>
      <Header title='END YEAR' subtitle='Chart of END YEAR' />
      <LineChart
        chartTitle={'Line Chart'}
        startDate={startDate}
        endDate={endDate}
        setEndDate={setEndDate}
        formattedData={formattedDataLine}
        setStartDate={setStartDate}
        data={data}
        isLoading={isLoading}
        lengendBottom='Year'
      />
      <br />
      <br />
      <BarChart
        chartTitle={'BAR Chart'}
        formattedData={formattedDataBar}
        data={data}
        isLoading={isLoading}
        keys={['impact', 'intensity', 'relevance', 'likelihood']}
        indexBy='year'
        legendBottom='Year'
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

export default Endyear;
