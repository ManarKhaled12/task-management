import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setTasksData } from "../reducers/taskReducer";
const API_URL = import.meta.env.VITE_API_URL;

const taskApi = createApi({
  reducerPath: "taskApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/api/Task/`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().user.token;
      if (token) {
        headers.set("Authorization", "Bearer " + token);
      }
      return headers;
    },
  }),
  tagTypes: ["tasks", "assignedDevs"],
  endpoints: (builder) => ({
    //Dev API
    //READ
    getTasks: builder.query({
      query: ({ id, role, projectId }) => ({
        url: `GetTasks?userId=${id}&role=${role}&projectId=${projectId}`,
        method: "GET",
      }),
      onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
        try {
          const { data } = await queryFulfilled;
          const task = data.map((task) => ({
            id: task._id,
            title: task.title,
            description: task.description,
            projectId: task.projectId,
            status: task.status,
            editable: task.Editable,
          }));
          dispatch(setTasksData(task));
        } catch (e) {
          console.error(e);
        }
      },
      providesTags: ["tasks"],
    }),

    //Team Leader APIs
    //CREATE
    createTask: builder.mutation({
      query: (newTaskData) => ({
        url: "Create",
        method: "POST",
        body: newTaskData,
      }),
      invalidatesTags: ["tasks"],
    }),

    //UPDATE
    updateTask: builder.mutation({
      query: (updatedTask) => ({
        url: "UpdateTask",
        method: "PUT",
        body: updatedTask,
      }),
      invalidatesTags: ["tasks"],
    }),

    //DELETE
    deleteTask: builder.mutation({
      query: (id) => ({
        url: `DeleteTask?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["tasks"],
    }),

    //ASSIGN TASKS
    assignTasks: builder.mutation({
      query: (newAssignedTask) => ({
        url: "AssignTask",
        method: "POST",
        body: newAssignedTask,
      }),
      invalidatesTags: ["assignedDevs"],
    }),

    //DEV AND TEAM LEADER API
    //GET ASSIGNED DEVS
    getAssignedDevs: builder.query({
      query: (taskId) => ({
        url: `GetAssignedDevs?taskId=${taskId}`,
        method: "GET",
      }),

      providesTags: ["assignedDevs"],
    }),

    //GET UNASSIGNED DEVS
    getUnassignedDevs: builder.query({
      query: (taskId) => ({
        url: `GetUnassignedDevs?taskId=${taskId}`,
        method: "GET",
      }),

      providesTags: ["assignedDevs"],
    }),

    //ATTACHMENT API
    //GET ATTACHMENT
    getAttachments: builder.query({
      query: () => ({
        url: "GetAllAttachedTasks",
        method: "GET",
      }),
    }),

    //ASSIGN ATTACHMENT
    assignAttachment: builder.mutation({
      query: (data) => ({
        url: "AttachFile",
        method: "POST",
        body: data,
      }),
    }),
  }),
});
export const {
  useGetTasksQuery,
  useGetAssignedDevsQuery,
  useGetUnassignedDevsQuery,
  useGetAttachmentsQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useAssignTasksMutation,
  useAssignAttachmentMutation,
} = taskApi;
export default taskApi;
