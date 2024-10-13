import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Project } from "../types/projectTypes";
import { Task } from "../types/taskTypes";
import { SearchResults } from "../types/searchResults";
import { User } from "../types/userTypes";
import { Team } from "../types/teamTypes";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }), // Grabs the public base URL
  reducerPath: "api",
  tagTypes: ["Projects", "Tasks", "searchTerm", "Users", "Teams"],
  endpoints: (build) => ({
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
      query: ({ projectId }) => `tasks?projectId=${projectId}`,
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

    createTask: build.mutation<Task, Partial<Task>>({
      query: (task) => ({
        url: "tasks",
        method: "POST",
        body: task,
      }),
      invalidatesTags: ["Tasks"],
    }),

    updateTaskStatus: build.mutation<Task, { taskId: number; status: string }>({
      query: ({ taskId, status }) => ({
        url: `tasks/${taskId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: "Tasks" as const, id: taskId },
      ],
    }),

    deleteTask: build.mutation<void, number | number[]>({
      query: (taskIds) => ({
        url: Array.isArray(taskIds) ? `tasks/bulk-delete` : `tasks/${taskIds}`,
        method: "DELETE",
        body: Array.isArray(taskIds) ? { taskIds } : undefined,
      }),
      invalidatesTags: (result, error, taskIds) => [
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
      query: ({ taskId, patchedBody }) => ({
        url: `tasks/${taskId}`,
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
    }),

    updateProject: build.mutation<
      Project,
      { projectId: number; patchedBody: Partial<Project> }
    >({
      query: ({ projectId, patchedBody }) => ({
        url: `projects/${projectId}`,
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
        url: `projects/${projectId}`,
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
} = api;
