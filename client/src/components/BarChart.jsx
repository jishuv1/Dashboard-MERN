import { Box, Typography, useTheme } from '@mui/material';
import { ResponsiveBar } from '@nivo/bar';

const BarChart = ({ formattedData, data, isLoading, chartTitle }) => {
  const keys = ['Intensity', 'Impact', 'relevance', 'likelihood'];
  const theme = useTheme();
  console.log(formattedData);
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
          keys={keys}
          indexBy='yearDate'
          padding={0.3}
          innerPadding={1}
          groupMode='grouped'
          colors={{ scheme: 'category10' }}
          margin={{ top: 50, right: 50, bottom: 70, left: 60 }}
          valueScale={{ type: 'linear' }}
          indexScale={{ type: 'band', round: true }}
          borderColor={{
            from: 'color',
            modifiers: [['darker', 1.6]],
          }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Year',
            legendPosition: 'middle',
            legendOffset: 32,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Values',
            legendPosition: 'middle',
            legendOffset: -40,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{
            from: 'color',
            modifiers: [['darker', 1.6]],
          }}
          legends={[
            {
              dataFrom: 'keys',
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 120,
              translateY: 0,
              itemsSpacing: 2,
              itemWidth: 100,
              itemHeight: 20,
              itemDirection: 'left-to-right',
              itemOpacity: 0.85,
              symbolSize: 20,
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
          role='application'
          ariaLabel='Nivo bar chart demo'
          barAriaLabel={(e) =>
            e.id + ': ' + e.formattedValue + ' in country: ' + e.indexValue
          }
        />
      ) : (
        <>Loading...</>
      )}
    </Box>
  );
};
export default BarChart;
