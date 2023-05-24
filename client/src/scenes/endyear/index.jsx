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

    const impactLine = {
      id: 'Impact',
      color: theme.palette.secondary.main,
      data: [],
    };
    const intensityLine = {
      id: 'Intensity',
      color: theme.palette.secondary[600],
      data: [],
    };
    const relevanceLine = {
      id: 'Relevance',
      color: theme.palette.secondary[600],
      data: [],
    };
    const likelihoodLine = {
      id: 'Likelihood',
      color: theme.palette.secondary[600],
      data: [],
    };

    // Create a set to keep track of unique years
    const uniqueYears = new Set();

    // Iterate over data to collect unique years and populate the data arrays
    for (const { end_year, impact, intensity, relevance, likelihood } of data) {
      const yearDate = new Date(end_year, 0, 1);
      if (yearDate >= startDate && yearDate <= endDate) {
        const year = yearDate.getFullYear();
        uniqueYears.add(year);

        impactLine.data.push({ x: year, y: impact });
        intensityLine.data.push({ x: year, y: intensity });
        relevanceLine.data.push({ x: year, y: relevance });
        likelihoodLine.data.push({ x: year, y: likelihood });
      }
    }

    // Sort the years in ascending order
    const sortedYears = Array.from(uniqueYears).sort((a, b) => a - b);

    // Fill in missing years with default data
    const formattedDataLine = [
      impactLine,
      intensityLine,
      relevanceLine,
      likelihoodLine,
    ].map((line) => ({
      ...line,
      data: sortedYears.map((year) => {
        const existingData = line.data.find((d) => d.x === year);
        const defaultValue = { x: year, y: 0 };

        if (existingData) {
          return { ...existingData }; // Clone the existing data
        } else {
          return defaultValue;
        }
      }),
    }));

    // Calculate average values for each property within a year
    for (const yearData of formattedDataLine) {
      const count = yearData.data.length; // Get the count of data points for the year

      // Calculate sum of values for each property within a year
      let sumImpact = 0;
      let sumIntensity = 0;
      let sumRelevance = 0;
      let sumLikelihood = 0;
      // Iterate over data to collect unique years and populate the data arrays
      for (const {
        end_year,
        impact,
        intensity,
        relevance,
        likelihood,
      } of data) {
        const yearDate = new Date(end_year, 0, 1);
        if (yearDate >= startDate && yearDate <= endDate) {
          const year = yearDate.getFullYear();
          uniqueYears.add(year);

          impactLine.data.push({ x: year, y: impact });
          intensityLine.data.push({ x: year, y: intensity });
          relevanceLine.data.push({ x: year, y: relevance });
          likelihoodLine.data.push({ x: year, y: likelihood });
        }
      }

      yearData.data.forEach((dataPoint) => {
        sumImpact += dataPoint.y;
        sumIntensity += dataPoint.y;
        sumRelevance += dataPoint.y;
        sumLikelihood += dataPoint.y;
      });

      // Calculate average values for each property within a year
      const averageImpact = count > 0 ? sumImpact / count : 0;
      const averageIntensity = count > 0 ? sumIntensity / count : 0;
      const averageRelevance = count > 0 ? sumRelevance / count : 0;
      const averageLikelihood = count > 0 ? sumLikelihood / count : 0;

      yearData.data.forEach((dataPoint) => {
        dataPoint.y = Math.round(dataPoint.y); // Keep the original value
        dataPoint.averageImpact = Math.round(averageImpact); // Assign average Impact value
        dataPoint.averageIntensity = Math.round(averageIntensity); // Assign average Intensity value
        dataPoint.averageRelevance = Math.round(averageRelevance); // Assign average Relevance value
        dataPoint.averageLikelihood = Math.round(averageLikelihood); // Assign average Likelihood value
      });
    }
    return [formattedDataLine]; // Return sortedYears as well
  }, [data, startDate, endDate]); // eslint-disable-line react-hooks/exhaustive-deps

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
      />
      <br />
      <br />
      <BarChart
        chartTitle={'BAR Chart'}
        formattedData={formattedDataBar}
        data={data}
        isLoading={isLoading}
        keys={['impact', 'intensity', 'relevance', 'likelihood']}
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
