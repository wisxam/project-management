import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AccessedProjects, Project } from "../types/projectTypes";
import { Task } from "../types/taskTypes";
import { SearchResults } from "../types/searchResults";
import { User } from "../types/userTypes";
import { Team } from "../types/teamTypes";
import { getToken, setToken } from "../auth/authService";
import { InvitationRequestStatus } from "../types/initationRequestStatus";
import { InvitationRequestTypes } from "../types/invitationRequestTypes";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = getToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  reducerPath: "api",
  tagTypes: [
    "Projects",
    "Tasks",
    "searchTerm",
    "Users",
    "Teams",
    "InvitationRequests",
    "AccessedProjects",
  ],
  endpoints: (build) => ({
    loginUser: build.mutation<
      { access_token: string },
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          setToken(data.access_token);
        } catch (err) {
          console.error("Login failed:", err);
        }
      },
    }),

    getProjects: build.query<Project[], void>({
      query: () => "projects",
      providesTags: ["Projects"],
    }),

    createProject: build.mutation<Project, Partial<Project>>({
      query: (project) => ({
        url: "projects",
        method: "POST",
        body: project,
      }),
      invalidatesTags: ["Projects"],
    }),

    getTasks: build.query<Task[], { projectId: number }>({
      query: ({ projectId }) => `projects/${projectId}`,
      providesTags: (result) =>
        result
          ? result.map(({ id }) => ({ type: "Tasks" as const, id }))
          : [{ type: "Tasks" as const }],
    }),

    // getTasks: build.query<Task[], { projectId: number }>({
    //   query: ({ projectId }) => `tasks?projectId=${projectId}`,
    //   transformResponse: (response: TaskData[]) => {
    //     // Map the response to instances of Task class
    //     return response.map((data) => new Task(data));
    //   },
    //   providesTags: (result) =>
    //     result
    //       ? result.map(({ id }) => ({ type: "Tasks" as const, id }))
    //       : [{ type: "Tasks" as const }],
    // }),

    createTask: build.mutation<
      Task,
      { projectId: number; taskData: Partial<Task> }
    >({
      query: ({ projectId, taskData }) => ({
        url: `projects/${projectId}/task`,
        method: "POST",
        body: taskData,
      }),
      invalidatesTags: ["Tasks"],
    }),

    updateTaskStatus: build.mutation<
      Task,
      { taskId: number; projectId: number; status: string }
    >({
      query: ({ taskId, status, projectId }) => ({
        url: `projects/${projectId}/update/status/${taskId}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: "Tasks" as const, id: taskId },
      ],
    }),

    deleteTask: build.mutation<
      void,
      { taskIds: string | string[]; projectId: number }
    >({
      query: ({ taskIds, projectId }) => ({
        url: Array.isArray(taskIds)
          ? `projects/${projectId}/delete?ids=${taskIds.join(",")}`
          : `projects/${projectId}/delete?ids=${taskIds}`,
        method: "DELETE",
        body: Array.isArray(taskIds) ? { taskIds } : { taskIds: [taskIds] },
      }),
      invalidatesTags: (result, error, { taskIds }) => [
        ...(Array.isArray(taskIds)
          ? taskIds.map((id) => ({ type: "Tasks" as const, id }))
          : [{ type: "Tasks" as const, id: taskIds }]),
        { type: "searchTerm" as const, id: "SEARCH" },
      ],
    }),

    searchTerm: build.query<SearchResults, string>({
      query: (query) => `search?query=${query}`,
      providesTags: (result) =>
        result ? [{ type: "searchTerm" as const, id: "SEARCH" }] : [],
    }),

    getUsers: build.query<User[], void>({
      query: () => "users",
      providesTags: ["Users"],
    }),

    getTeams: build.query<Team[], void>({
      query: () => "teams",
      providesTags: ["Teams"],
    }),

    updateTask: build.mutation<
      Task,
      { taskId: string; patchedBody: object; projectId: number }
    >({
      query: ({ taskId, patchedBody, projectId }) => ({
        url: `projects/${projectId}/update/${taskId}`,
        method: "PATCH",
        body: patchedBody,
      }),
      async onQueryStarted(
        { taskId, patchedBody, projectId },
        { dispatch, queryFulfilled },
      ) {
        const patchResult = dispatch(
          api.util.updateQueryData("getTasks", { projectId }, (draft) => {
            const task = draft.find((task) => task.id === Number(taskId));
            if (task) {
              Object.assign(task, patchedBody);
            }
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (result, error, { taskId }) => [
        { type: "Tasks" as const, id: taskId },
        { type: "searchTerm" as const, id: "SEARCH" },
      ],
    }),

    updateProject: build.mutation<
      Project,
      { projectId: number; patchedBody: Partial<Project> }
    >({
      query: ({ projectId, patchedBody }) => ({
        url: `projects/update/${projectId}`,
        method: "PATCH",
        body: patchedBody,
      }),
      async onQueryStarted(
        { projectId, patchedBody },
        { dispatch, queryFulfilled },
      ) {
        const patchResult = dispatch(
          api.util.updateQueryData("getProjects", undefined, (draft) => {
            const project = draft.find((project) => project.id === projectId);
            if (project) {
              Object.assign(project, patchedBody);
            }
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    deleteProject: build.mutation<Project, number>({
      query: (projectId) => ({
        url: `projects/delete/${projectId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Projects"],
    }),

    getTasksByUser: build.query<Task[], number>({
      query: (userId) => `tasks/user/${userId}`,
      providesTags: (result, error, userId) =>
        result
          ? result.map(({ id }) => ({ type: "Tasks", id }))
          : [{ type: "Tasks", id: userId }],
    }),

    getInvitationRequestsByOwner: build.query<InvitationRequestTypes[], void>({
      query: () => "invitation-requests",
      providesTags: (result) =>
        result
          ? result.map(({ id }) => ({
              type: "InvitationRequests" as const,
              id,
            }))
          : [{ type: "InvitationRequests" as const }],
    }),

    updateUserProjectAccess: build.mutation<
      InvitationRequestStatus,
      { requestId: number; status: InvitationRequestStatus }
    >({
      query: ({ requestId, status }) => ({
        url: `invitation-requests/${requestId}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { requestId }) => [
        {
          type: "InvitationRequests" as const,
          id: requestId,
        },
      ],
    }),

    deleteUserProjectRequest: build.mutation<void, { requestId: number }>({
      query: ({ requestId }) => ({
        url: `invitation-requests/${requestId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { requestId }) => [
        { type: "InvitationRequests" as const, id: requestId },
      ],
    }),

    getUserAccessedProjects: build.query<AccessedProjects[], void>({
      query: () => ({
        url: "projects/get/accessed-projects",
      }),
      providesTags: ["AccessedProjects"],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskStatusMutation,
  useDeleteTaskMutation,
  useSearchTermQuery,
  useGetUsersQuery,
  useGetTeamsQuery,
  useUpdateTaskMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useGetTasksByUserQuery,
  useLoginUserMutation,
  useGetInvitationRequestsByOwnerQuery,
  useUpdateUserProjectAccessMutation,
  useDeleteUserProjectRequestMutation,
  useGetUserAccessedProjectsQuery,
} = api;
