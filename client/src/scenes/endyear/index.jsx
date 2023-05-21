import { useGetDataEndyearQuery } from 'state/api';
import { useState, useMemo } from 'react';
import Header from 'components/Header';
import { Box, useTheme } from '@mui/material';
import 'react-datepicker/dist/react-datepicker.css';
import LineChart from 'components/LineChart';
import BarChart from 'components/BarChart';

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

    Object.values(data).forEach(
      ({ end_year, impact, intensity, relevance, likelihood }) => {
        const dateFormatted = new Date(end_year, 0, 1);
        if (
          dateFormatted >= startDate &&
          dateFormatted <= endDate &&
          impact !== null && // Skip empty values
          intensity !== null && // Skip empty values
          relevance !== null &&
          likelihood !== null
        ) {
          const yearDate = new Date(end_year, 0, 1);
          impactLine.data = [
            ...impactLine.data,
            { x: yearDate.getFullYear(), y: impact },
          ];
          intensityLine.data = [
            ...intensityLine.data,
            { x: yearDate.getFullYear(), y: intensity },
          ];
          relevanceLine.data = [
            ...relevanceLine.data,
            { x: yearDate.getFullYear(), y: relevance },
          ];
          likelihoodLine.data = [
            ...likelihoodLine.data,
            { x: yearDate.getFullYear(), y: likelihood },
          ];
        }
      }
    );

    const formattedDataLine = [
      impactLine,
      intensityLine,
      relevanceLine,
      likelihoodLine,
    ];
    return [formattedDataLine];
  }, [data, startDate, endDate]); // eslint-disable-line react-hooks/exhaustive-deps

  // console.log(formattedDataLine);

  const [formattedDataBar] = useMemo(() => {
    if (!data) return [];

    const formattedDataBar = {};

    // Populate formattedDataBar object with default values for each year
    for (const item of data) {
      const year = item.end_year;
      if (!formattedDataBar[year]) {
        formattedDataBar[year] = {
          year,
          intensity: 0,
          impact: 0,
          relevance: 0,
          likelihood: 0,
        };
      }
    }

    // Assign actual data values to corresponding years
    for (const item of data) {
      const year = item.end_year;
      formattedDataBar[year] = {
        ...formattedDataBar[year],
        intensity: item.intensity,
        impact: item.impact,
        relevance: item.relevance,
        likelihood: item.likelihood,
      };
    }

    const formattedDataBarArr = Object.values(formattedDataBar);
    return [formattedDataBarArr];
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

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
      />
    </Box>
  );
};

export default Endyear;
