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

  console.log(data);

  const [formattedDataLine] = useMemo(() => {
    if (!data) return [[{}], [{}], [{}], [{}]];

    const topicDataMap = new Map();

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

    return [formattedDataLine];
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const [formattedDataBar] = useMemo(() => {
    if (!data) return [];

    const formattedDataBar = {};

    // Accumulate values and count occurrences for each topic
    for (const { topic, impact, intensity, relevance, likelihood } of data) {
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
        impact: formattedDataBar[topic].impact + impact,
        intensity: formattedDataBar[topic].intensity + intensity,
        relevance: formattedDataBar[topic].relevance + relevance,
        likelihood: formattedDataBar[topic].likelihood + likelihood,
        count: formattedDataBar[topic].count + 1,
      };
    }

    // Calculate average values for each property within a topic
    for (const topicData of Object.values(formattedDataBar)) {
      topicData.impact = Math.round(topicData.impact);
      topicData.intensity = Math.round(topicData.intensity);
      topicData.relevance = Math.round(topicData.relevance);
      topicData.likelihood = Math.round(topicData.likelihood);
    }

    const formattedDataBarArr = Object.values(formattedDataBar);
    return [formattedDataBarArr];
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const [formattedDataPie] = useMemo(() => {
    if (!data) return [[]];

    const pieChartData = Object.values(formattedDataBar).map((topicData) => ({
      id: topicData.topic,
      label: topicData.topic.toString(),
      value: topicData.count,
    }));

    return [pieChartData];
  }, [formattedDataBar]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box m='1.5rem 2.5rem'>
      <Header title='END YEAR' subtitle='Chart of END YEAR' />
      <LineChart
        chartTitle={'Line Chart'}
        formattedData={formattedDataLine}
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

export default Topics;
