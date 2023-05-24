import { Box, Typography, useTheme } from '@mui/material';
import { ResponsiveLine } from '@nivo/line';
import DatePicker from 'react-datepicker';

const LineChart = ({
  startDate,
  endDate,
  setEndDate,
  formattedData,
  setStartDate,
  data,
  isLoading,
  chartTitle,
  lengendBottom,
}) => {
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
      {startDate && (
        <Box display='flex' justifyContent='flex-end'>
          <Box>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              showYearPicker
              dateFormat='yyyy'
              yearItemNumber={20}
              selectsStart
              startDate={startDate}
              endDate={endDate}
            />
          </Box>
          <Box>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              showYearPicker
              dateFormat='yyyy'
              yearItemNumber={20}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
            />
          </Box>
        </Box>
      )}

      {data || !isLoading ? (
        <ResponsiveLine
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
          margin={{ top: 50, right: 50, bottom: 70, left: 60 }}
          xScale={{ type: 'point' }}
          yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: false,
            reverse: false,
          }}
          curve='catmullRom'
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: `${lengendBottom}`,
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
          enableGridX={false}
          enableGridY={false}
          pointSize={10}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabelYOffset={-12}
          labelSkipHeight={12}
          useMesh={true}
          legends={[
            {
              anchor: 'top-right',
              direction: 'column',
              justify: false,
              translateX: 50,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: 'left-to-right',
              itemWidth: 80,
              itemHeight: 20,
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
        />
      ) : (
        <>Loading...</>
      )}
    </Box>
  );
};
export default LineChart;
