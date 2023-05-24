import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_URL }),
  reducerPath: 'adminApi',
  tagTypes: ['Endyear', 'Topic'],
  endpoints: (build) => ({
    getDataEndyear: build.query({
      query: () => 'visualization/dataendyear',
      providesTags: ['Endyear'],
    }),
    getTopic: build.query({
      query: () => 'visualization/topic',
      providesTags: ['Topic'],
    }),
  }),
});

export const { useGetDataEndyearQuery, useGetTopicQuery } = api;
