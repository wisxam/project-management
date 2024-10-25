export interface Project {
  id: number;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export interface AccessedProjects {
  projectId: number;
  projectName: string;
}
