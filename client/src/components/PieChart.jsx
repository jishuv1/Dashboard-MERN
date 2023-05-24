import React from 'react';
import { ResponsivePie } from '@nivo/pie';
import { Box, Typography, useTheme } from '@mui/material';

const BreakdownChart = ({ formattedData, data, isLoading, chartTitle }) => {
  const theme = useTheme();

  return (
    <Box sx={{ p: 2, border: `1px dashed ${theme.palette.secondary[100]}` }}>
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
          height={'400px'}
          width={undefined}
          minHeight={'325px'}
          minWidth={'325px'}
          position='relative'
        >
          <ResponsivePie
            data={formattedData}
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
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            sortByValue={true}
            innerRadius={0.45}
            activeOuterRadiusOffset={8}
            borderWidth={1}
            borderColor={{
              from: 'color',
              modifiers: [['darker', 0.2]],
            }}
            enableArcLinkLabels={true}
            arcLinkLabelsTextColor={theme.palette.secondary[200]}
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: 'color' }}
            arcLabelsSkipAngle={10}
            arcLinkLabelsSkipAngle={6}
            arcLabelsTextColor={{
              from: 'color',
              modifiers: [['darker', 2]],
            }}
            // legends={[
            //   {
            //     anchor: 'top-right',
            //     direction: 'column',
            //     justify: false,
            //     translateX: 20,
            //     translateY: 50,
            //     itemsSpacing: 0,
            //     itemWidth: 80,
            //     itemHeight: 20,
            //     itemDirection: 'left-to-right',
            //     itemOpacity: 1,
            //     symbolSize: 18,
            //     symbolShape: 'circle',
            //     effects: [
            //       {
            //         on: 'hover',
            //         style: {
            //           itemTextColor: theme.palette.primary[500],
            //         },
            //       },
            //     ],
            //   },
            // ]}
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
