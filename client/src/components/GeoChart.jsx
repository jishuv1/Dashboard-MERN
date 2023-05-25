import React from 'react';
import { Box, useTheme } from '@mui/material';
import { useGetCountryQuery } from 'state/api';
import Header from 'components/Header';
import { ResponsiveChoropleth } from '@nivo/geo';
import { geoData } from 'state/geoData';

const GeoChart = ({
  isDashboard = false,
  title = 'GEOGRAPHY',
  subtitle = 'Geography Map of Country',
}) => {
  const theme = useTheme();
  const { data } = useGetCountryQuery();

  return (
    <Box m='1.5rem 2.5rem'>
      {!isDashboard && <Header title={title} subtitle={subtitle} />}
      <Box
        mt={isDashboard ? '0.1rem' : '40px'}
        height={isDashboard ? '28rem' : '75vh'}
        border={`1px solid ${theme.palette.secondary[200]}`}
        borderRadius='4px'
      >
        {data ? (
          <ResponsiveChoropleth
            data={data}
            theme={{
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
            features={geoData.features}
            colors='PRGn'
            margin={
              isDashboard
                ? { top: 0, right: 0, bottom: 0, left: 0 }
                : { top: 0, right: 0, bottom: 0, left: -50 }
            }
            domain={[0, 112]}
            unknownColor='#666666'
            label='properties.name'
            valueFormat='.2s'
            projectionScale={isDashboard ? 105 : 150}
            projectionTranslation={[0.45, 0.6]}
            projectionRotation={[0, 0, 0]}
            borderWidth={1.3}
            borderColor='#ffffff'
            legends={
              isDashboard
                ? undefined
                : [
                    {
                      anchor: 'bottom-right',
                      direction: 'column',
                      justify: true,
                      translateX: 0,
                      translateY: -125,
                      itemsSpacing: 0,
                      itemWidth: 94,
                      itemHeight: 18,
                      itemDirection: 'left-to-right',
                      itemTextColor: theme.palette.secondary[200],
                      itemOpacity: 0.85,
                      symbolSize: 18,
                      effects: [
                        {
                          on: 'hover',
                          style: {
                            itemTextColor: theme.palette.background.alt,
                            itemOpacity: 1,
                          },
                        },
                      ],
                    },
                  ]
            }
          />
        ) : (
          <>Loading...</>
        )}
      </Box>
    </Box>
  );
};

export default GeoChart;
