import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_URL }),
  reducerPath: 'adminApi',
  tagTypes: ['Endyear', 'Topic', 'Sector', 'Pest', 'Source', 'Country'],
  endpoints: (build) => ({
    getDataEndyear: build.query({
      query: () => 'visualization/dataendyear',
      providesTags: ['Endyear'],
    }),
    getTopic: build.query({
      query: () => 'visualization/topic',
      providesTags: ['Topic'],
    }),
    getSector: build.query({
      query: () => 'visualization/sector',
      providesTags: ['Sector'],
    }),
    getPest: build.query({
      query: () => 'visualization/pest',
      providesTags: ['Pest'],
    }),
    getSource: build.query({
      query: () => 'visualization/source',
      providesTags: ['Source'],
    }),
    getCountry: build.query({
      query: () => 'visualization/country',
      providesTags: ['Country'],
    }),
  }),
});

export const {
  useGetDataEndyearQuery,
  useGetTopicQuery,
  useGetSectorQuery,
  useGetPestQuery,
  useGetSourceQuery,
  useGetCountryQuery,
} = api;
