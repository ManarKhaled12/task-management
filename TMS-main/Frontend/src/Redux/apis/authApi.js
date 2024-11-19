import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setAuthToken } from "../reducers/UserReducer";
const API_URL = import.meta.env.VITE_API_URL;

const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${API_URL}/api/Auth/` }),
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (userData) => ({
        url: "Register",
        method: "POST",
        body: userData,
      }),
    }),
    login: builder.mutation({
      query: (userData) => ({
        url: "Login",
        method: "POST",
        body: userData,
      }),
      onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAuthToken(data.token));
        } catch (err) {
          console.error("Error ", err);
        }
      },
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;

export default authApi;
