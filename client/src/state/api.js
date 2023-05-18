import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_URL }),
  reducerPath: 'adminApi',
  tagTypes: ['Endyear'],
  endpoints: (build) => ({
    getDataEndyear: build.query({
      query: () => 'visualization/dataendyear',
      providesTags: ['Endyear'],
    }),
  }),
});

export const { useGetDataEndyearQuery } = api;
