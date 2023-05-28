import React from 'react';
import { ResponsivePie } from '@nivo/pie';
import { Box, Typography, useTheme } from '@mui/material';

const BreakdownChart = ({
  formattedData,
  data,
  isLoading,
  chartTitle,
  isDashboard = false,
}) => {
  const theme = useTheme();

  return (
    <Box
      backgroundColor={theme.palette.background.alt}
      p='1rem'
      borderRadius='0.55rem'
      sx={
        isDashboard
          ? {
              height: '20rem',
            }
          : {
              height: '60vh',
            }
      }
    >
      <Typography
        variant='h5'
        color={theme.palette.secondary[100]}
        fontWeight='bold'
        sx={{ mb: '5px' }}
      >
        {chartTitle}
      </Typography>

      {data || !isLoading ? (
        <Box
          height={isDashboard ? '400px' : '100%'}
          width={undefined}
          minHeight={isDashboard ? '325px' : undefined}
          minWidth={isDashboard ? '325px' : undefined}
          position='relative'
        >
          <ResponsivePie
            data={formattedData}
            enableArea={isDashboard}
            theme={{
              axis: {
                domain: {
                  line: {
                    stroke: theme.palette.secondary[200],
                  },
                },
                legend: {
                  text: {
                    fill: theme.palette.secondary[200],
                  },
                },
                ticks: {
                  line: {
                    stroke: theme.palette.secondary[200],
                    strokeWidth: 1,
                  },
                  text: {
                    fill: theme.palette.secondary[200],
                  },
                },
              },
              legends: {
                text: {
                  fill: theme.palette.secondary[200],
                },
              },
              tooltip: {
                container: {
                  color: theme.palette.secondary[200],
                  backgroundColor: theme.palette.primary.main,
                },
              },
            }}
            colors={{ scheme: 'category10' }}
            margin={
              isDashboard
                ? { top: 10, right: 50, bottom: 100, left: 10 }
                : { top: 40, right: 80, bottom: 80, left: 80 }
            }
            sortByValue={true}
            innerRadius={0.45}
            activeOuterRadiusOffset={8}
            borderWidth={1}
            borderColor={{
              from: 'color',
              modifiers: [['darker', 0.2]],
            }}
            enableArcLinkLabels={isDashboard ? false : true}
            arcLinkLabelsTextColor={theme.palette.secondary[200]}
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: 'color' }}
            arcLabelsSkipAngle={10}
            arcLinkLabelsSkipAngle={6}
            arcLabelsTextColor={{
              from: 'color',
              modifiers: [['darker', 2]],
            }}
            legends={[]}
          />
          <Box
            position='absolute'
            top='50%'
            left='50%'
            color={theme.palette.secondary[400]}
            textAlign='center'
            pointerEvents='none'
            sx={{
              transform: 'translate(-50%, -100%)',
            }}
          ></Box>
        </Box>
      ) : (
        <>Loading...</>
      )}
    </Box>
  );
};

export default BreakdownChart;
