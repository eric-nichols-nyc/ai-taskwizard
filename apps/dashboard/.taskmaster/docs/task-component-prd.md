<context>
# Overview
This document outlines the requirements for a new "Tasks" component. This component will provide users with a seamless and integrated way to manage their tasks directly within the application. The primary goal is to enhance user productivity and organization by offering a feature-rich, easy-to-use task management system that is persisted to a database.

# Core Features
- **Task Creation:** Users can add new tasks through a dedicated input field.
- **Priority Assignment:** Tasks can be assigned a priority level ('Low', 'Medium', 'High') via a dropdown menu. The default priority for a new task is 'Medium'.
- **Status Management:** Users can update a task's status. The available statuses are 'todo', 'inprogress', and 'done'. Checking a task's checkbox will toggle its status between 'todo' and 'done'.
- **Task Editing:** Users can modify the text and priority of an existing task in an inline edit mode.
- **Task Deletion:** Users can permanently remove tasks.
- **User Scoping:** All tasks are associated with the currently authenticated user.
- **Data Persistence:** Task data is saved and managed in a Supabase PostgreSQL database.

# User Experience
- **User Personas:** The primary user is anyone using the application who needs to track a list of to-do items or manage a simple workflow.
- **Key User Flows:**
  1.  **Add a Task:** The user types the task description into an input, optionally selects a priority from the dropdown, and submits. The new task appears in their task list.
  2.  **View Tasks:** The user sees a list of their tasks. Each item displays a checkbox, the task text, its priority, an edit icon, and a delete icon.
  3.  **Complete a Task:** The user clicks the checkbox next to a task. The task is marked as 'done' and may be visually distinguished (e.g., strikethrough).
  4.  **Edit a Task:** The user clicks the 'edit' icon. The task item transforms into an edit state with a text input, a priority dropdown, a 'Save' button, and a 'Cancel' button.
  5.  **Delete a Task:** The user clicks the 'delete' icon, confirms the action, and the task is removed from the list.
- **UI/UX Considerations:**
    - The interface will be built using `shadcn/ui` components for a modern and accessible experience.
    - The `Tasks` component will be developed as a compound component, exporting its constituent parts (`Tasks.Input`, `Tasks.List`, `Tasks.Item`, etc.) for maximum flexibility and reusability.
    - Client-side state (like the edit mode of a `TaskItem`) will be managed by Zustand.
    - Server state (fetching, creating, updating, and deleting tasks) will be handled by TanStack Query to ensure a responsive UI, including optimistic updates for a smoother user experience.
</context>
<PRD>
# Technical Architecture
- **Tech Stack:**
    - **Framework:** React
    - **Build Tool:** Vite
    - **UI Library:** shadcn/ui
    - **Styling:** Tailwind CSS
    - **Server State Management:** TanStack Query
    - **Client State Management:** Zustand
    - **Schema & Validation:** Zod
    - **Backend:** Supabase (PostgreSQL, Auth, REST API)

- **Component Structure:** The `Tasks` component will be a compound component.
    - `Tasks`: The root component.
    - `Tasks.Input`: The input field for creating new tasks.
    - `Tasks.PriorityDropdown`: The dropdown for selecting priority.
    - `Tasks.List`: The container that renders the list of tasks.
    - `TaskItem`: The individual task component with two states:
        - **Normal State:** Displays checkbox, task text, priority, edit icon, delete icon.
        - **Edit State:** Displays a text input, priority dropdown, save button, cancel button.

- **Data Model:** A `tasks` table will be created in Supabase with the following schema:
  ```sql
  CREATE TABLE tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    text TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'inprogress', 'done')),
    priority TEXT NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High')),
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
  );
  ```

# Development Roadmap
- **Phase 1: MVP**
  1.  **Backend Setup:** Initialize the Supabase project and run the SQL script to create the `tasks` table.
  2.  **Project Setup:** Configure a Vite + React project with Tailwind CSS and install all required dependencies. Initialize `shadcn/ui`.
  3.  **API Layer:** Create hooks using TanStack Query for `getTasks`, `addTask`, `updateTask`, and `deleteTask`.
  4.  **Component Scaffolding:** Build the basic structure of the `Tasks` compound component and the `TaskItem` component.
  5.  **Core Functionality:** Implement the ability to add, view, delete, and update the status of tasks via the checkbox.

- **Phase 2: Enhancements**
  1.  **Full Edit Mode:** Implement the state switching on `TaskItem` to allow for inline editing of a task's text and priority.
  2.  **Advanced Status:** Enhance status updates to support 'inprogress' in addition to 'todo' and 'done'.
  3.  **Due Dates:** Integrate a date picker to set and display a `due_date` for tasks.
  4.  **UI Polish:** Add animations, loading states, and toast notifications for a better user experience.

# Logical Dependency Chain
1.  **Supabase Setup:** The `tasks` table must exist before any API calls can be made.
2.  **Authentication:** A basic user authentication flow must be in place to associate tasks with a `user_id`.
3.  **API Hooks:** The TanStack Query hooks are the foundation for all data interactions in the UI.
4.  **UI Components:** The UI components can be built once the data contracts (API hooks) are defined.
5.  **Integration:** Connect the UI components to the API hooks to create the final, functional component.

# Risks and Mitigations
- **Risk:** Managing the state of each `TaskItem` (e.g., its edit mode) within a list can become complex.
- **Mitigation:** Encapsulate the item-level state within the `TaskItem` component itself, potentially using a local Zustand store or React's built-in state management if simple enough.
- **Risk:** Ensuring optimistic updates are handled correctly without data loss or UI flickering.
- **Mitigation:** Follow TanStack Query best practices for optimistic updates, including context-based rollback on error.
</PRD> 