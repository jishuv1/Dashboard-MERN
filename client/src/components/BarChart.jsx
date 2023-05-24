import { Box, Typography, useTheme } from '@mui/material';
import { ResponsiveBar } from '@nivo/bar';

const BarChart = ({
  formattedData,
  data,
  isLoading,
  chartTitle,
  keys,
  indexBy,
  legendBottom,
}) => {
  // const keys = ['impact', 'intensity', 'relevance', 'likelihood'];
  const theme = useTheme();
  return (
    <Box
      height='75vh'
      sx={{ p: 2, border: `1px dashed ${theme.palette.secondary[100]}` }}
    >
      <Box>
        <Typography
          variant='h5'
          color={theme.palette.secondary[100]}
          fontWeight='bold'
          sx={{ mb: '5px' }}
        >
          {chartTitle}
        </Typography>
      </Box>
      {data || !isLoading ? (
        <ResponsiveBar
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
          keys={keys}
          indexBy={`${indexBy}`}
          margin={{ top: 50, right: 50, bottom: 70, left: 60 }}
          padding={0.3}
          colors={{ scheme: 'category10' }}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: `${legendBottom}`,
            legendPosition: 'middle',
            legendOffset: 32,
          }}
          axisLeft={{
            orient: 'left',
            tickOuterSize: 0,
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Values',
            legendOffset: -50,
            legendPosition: 'middle',
          }}
          enableGridY={false}
          labelSkipWidth={12}
          labelSkipHeight={12}
          legends={[
            {
              dataFrom: 'keys',
              anchor: 'top-right',
              direction: 'column',
              justify: false,
              translateX: 50,
              translateY: 0,
              itemsSpacing: 0,
              itemWidth: 80,
              itemHeight: 20,
              itemDirection: 'left-to-right',
              itemOpacity: 0.85,
              symbolSize: 12,
              symbolShape: 'circle',
              symbolBorderColor: 'rgba(0, 0, 0, .5)',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemBackground: 'rgba(0, 0, 0, .03)',
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
          animate={true}
          motionStiffness={90}
          motionDamping={15}
        />
      ) : (
        <>Loading...</>
      )}
    </Box>
  );
};
export default BarChart;
