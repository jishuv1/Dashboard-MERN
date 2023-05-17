import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_URL }),
  reducerPath: 'adminApi',
  tagTypes: ['DataVisualization'],
  endpoints: (build) => ({
    getDataVisualization: build.query({
      query: () => 'visualization/datavisualizations',
      providesTags: ['DataVisualization'],
    }),
  }),
});

export const { useGetDataVisualizationQuery } = api;
