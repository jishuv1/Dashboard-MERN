import React, { useMemo } from 'react';
import FlexBetween from 'components/FlexBetween';
import Header from 'components/Header';
import GeoChart from 'components/GeoChart';
import {
  DownloadOutlined,
  NewspaperOutlined,
  TopicOutlined,
  BoltOutlined,
  SourceOutlined,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import PieChart from 'components/PieChart';
import { useGetDataEndyearQuery, useGetTopicQuery } from 'state/api';
import StatBox from 'components/StatBox';
import BarChart from 'components/BarChart';

const Dashboard = () => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery('(min-width: 1200px)');
  const { data: data1, isLoading: isLoading1 } = useGetDataEndyearQuery();
  const { data: data2, isLoading: isLoading2 } = useGetTopicQuery();

  const [formattedDataBar] = useMemo(() => {
    if (!data1) return [];

    const formattedDataBar = {};

    // Accumulate values and count occurrences for each year
    for (const {
      end_year,
      impact,
      intensity,
      relevance,
      likelihood,
    } of data1) {
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
  }, [data1]); // eslint-disable-line react-hooks/exhaustive-deps

  const [formattedDataPie] = useMemo(() => {
    if (!data2) return [[]];

    const topicCountMap = {};

    // Accumulate count for each topic
    for (const { topic } of data2) {
      if (topic === '') continue;

      if (!topicCountMap[topic]) {
        topicCountMap[topic] = 0;
      }

      topicCountMap[topic] += 1;
    }

    const pieChartData = Object.keys(topicCountMap).map((topic) => ({
      id: topic,
      label: topic.toString(),
      value: topicCountMap[topic],
    }));

    return [pieChartData];
  }, [data2]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box m='1.5rem 2.5rem'>
      <FlexBetween>
        <Header title='DASHBOARD' subtitle='Welcome to your dashboard' />

        <Box>
          <Button
            sx={{
              backgroundColor: theme.palette.secondary.light,
              color: theme.palette.background.alt,
              fontSize: '14px',
              fontWeight: 'bold',
              padding: '10px 20px',
            }}
          >
            <DownloadOutlined sx={{ mr: '10px' }} />
            Download Reports
          </Button>
        </Box>
      </FlexBetween>

      <Box
        mt='20px'
        display='grid'
        gridTemplateColumns='repeat(12, 1fr)'
        gridAutoRows='160px'
        gap='20px'
        sx={{
          '& > div': { gridColumn: isNonMediumScreens ? undefined : 'span 12' },
        }}
      >
        {/* ROW 1 */}
        <StatBox
          title='Articles'
          value={1000}
          description='Total Articles'
          icon={
            <NewspaperOutlined
              sx={{ color: theme.palette.secondary[300], fontSize: '26px' }}
            />
          }
        />
        <StatBox
          title='Topics'
          value={403}
          increase='40.3%'
          description='OIL'
          icon={
            <TopicOutlined
              sx={{ color: theme.palette.secondary[300], fontSize: '26px' }}
            />
          }
        />
        <Box
          gridColumn='span 8'
          gridRow='span 2'
          backgroundColor={theme.palette.background.alt}
          p='1rem'
          borderRadius='0.55rem'
        >
          <BarChart
            formattedData={formattedDataBar}
            data={data1}
            isLoading={isLoading1}
            keys={['impact', 'intensity', 'relevance', 'likelihood']}
            indexBy='year'
            legendBottom='Year'
            isDashboard={true}
          />
        </Box>
        <StatBox
          title='Sectors'
          value={525}
          increase='52.5%'
          description='Energy'
          icon={
            <BoltOutlined
              sx={{ color: theme.palette.secondary[300], fontSize: '26px' }}
            />
          }
        />
        <StatBox
          title='Source'
          value={43}
          increase='4.3%'
          description='OPEC'
          icon={
            <SourceOutlined
              sx={{ color: theme.palette.secondary[300], fontSize: '26px' }}
            />
          }
        />

        {/* ROW 2 */}
        <Box
          gridColumn='span 8'
          gridRow='span 3'
          backgroundColor={theme.palette.background.alt}
          p='1rem'
          borderRadius='0.55rem'
        >
          <Typography variant='h6' sx={{ color: theme.palette.secondary[100] }}>
            Articles By Country
          </Typography>
          <GeoChart isDashboard={true} />
        </Box>
        <Box
          gridColumn='span 4'
          gridRow='span 3'
          backgroundColor={theme.palette.background.alt}
          p='1.5rem'
          borderRadius='0.55rem'
        >
          <Typography variant='h6' sx={{ color: theme.palette.secondary[100] }}>
            Articles By Topic
          </Typography>
          <PieChart
            isDashboard={true}
            formattedData={formattedDataPie}
            data={data2}
            isLoading={isLoading2}
          />
          <Typography
            p='0 0.6rem'
            fontSize='0.8rem'
            sx={{ color: theme.palette.secondary[200] }}
          >
            Breakdown of articles by topic and nunber of articles on each topic.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
