Overview
This project management platform is built using Next.js for the frontend and NestJS for the server-side backend. It offers a comprehensive set of features to manage projects efficiently, including drag-and-drop task management, role-based access control, and detailed analytics.
Key Features
Task Management
Drag and Drop: Users can easily manage tasks by dragging and dropping them across different stages.
Task Assignment: Project owners can create and assign tasks to project leaders and team members.
Role-Based Access: Different roles (project owner, project leader, team member) have distinct permissions and access levels.
Access Control
Request to Join: Users need to send a request to the project owner to join a project.
Approval/Decline: Project owners have full control to either accept or decline join requests.
Analytics
Analysis Page: A dedicated page providing detailed analytics on tasks, including numbers and visual charts.
Dialogs: Interactive dialogs for various actions and notifications.
Technology Stack
Frontend: Next.js
TypeScript for type safety,
MUI for styled components,
RTK and RTK query for state management and api calls,
React-dnd,
React-toastify
Backend: NestJS
Node.js for server-side runtime
TypeScript for type safety
PostgreSQL for database management
Getting Started
Prerequisites
Node.js (latest version)
npm or yarn
PostgreSQL or MongoDB (depending on the database choice)
Installation
Clone the Repository
bash
git clone https://github.com/wisxam/project-management/

Navigate to the Project Directory
bash
cd project-management-platform

Install Dependencies
bash
npm install
# or
yarn install

Start the Backend Server
bash
cd backend
npm run start:dev
# or
yarn start:dev

Start the Frontend Server
bash
cd frontend
npm run dev
# or
yarn dev

Configuration
Environment Variables
Create a .env file in both the backend and frontend directories.
Configure the necessary environment variables such as database credentials, server ports, etc.
Database Setup
Ensure your database is set up and running.
Update the backend configuration to connect to your database.
Usage
User Roles
Project Owner: Can create projects, assign tasks, manage access requests, and view analytics.
Project Leader: Can manage tasks assigned to them and view project analytics.
Team Member: Can view and update tasks assigned to them.
Joining a Project
Send a join request to the project owner.
The project owner will receive the request and can either accept or decline it.
Task Management
Project owners can create tasks and assign them to project leaders or team members.
Users can drag and drop tasks across different stages (e.g., To-Do, In Progress, Done).
Analytics
Navigate to the analysis page to view detailed statistics and charts related to tasks.
Use interactive dialogs to get more information or perform actions.
Contributing
Contributions are welcome! Here’s how you can contribute:
Fork the Repository
Create a fork of the repository on GitHub.
Create a Branch
Create a new branch for your feature or bug fix.
Commit Changes
Commit your changes with meaningful commit messages.
Open a Pull Request
Open a pull request to the main repository.
