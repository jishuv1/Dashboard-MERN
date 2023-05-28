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
  bottomMargin = 70,
  bottomLegendOffset = 40,
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
              height: '75vh',
            }
      }
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
          enableArea={isDashboard}
          enableLabel={!isDashboard}
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
          margin={{ top: 20, right: 50, bottom: bottomMargin, left: 60 }}
          padding={0.4}
          colors={{ scheme: 'category10' }}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            legend: isDashboard ? '' : `${legendBottom}`,
            legendPosition: 'middle',
            legendOffset: bottomLegendOffset,
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
