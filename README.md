Choco Task


The **Choco Task** is an innovative platform designed to enhance team efficiency and organization. Leveraging the MERN stack and modern frontend technologies, this solution provides a seamless experience for administrators and users, fostering collaboration and productivity.

## Features

- 👤 **User and Admin Management**: Create, manage, and control user and admin accounts, including enabling, disabling, and deleting accounts.
- **Task Management**: Assign tasks to users, update task details and status, and label tasks as to-do, in progress, or completed.
- **Priority and Sub-Tasks**: Set task priority levels (high, medium, normal, low) and manage sub-tasks for detailed task management.
- **Asset Management**: Upload and manage task-related assets, such as images.
- **Communication and Collaboration**: Add comments or chat on tasks to enhance team communication.
- **Secure Authentication and Role-Based Access**: Secure user login with role-based access control, ensuring appropriate permissions for all users.
- **Profile and Password Management**: Update user profiles and change passwords securely.
- **Interactive Dashboard**: Summarize user activities and filter tasks by status: to-do, in progress, or completed.
- **Task Access Control**: Users can view tasks but cannot access detailed information or interact with tasks unless they are assigned to that specific task; non-assigned users will see the task overview but not the detailed task page.
- **Dynamic Task Search**: Search for tasks by name in a case-insensitive manner, allowing users to quickly find tasks using a dynamic search bar.

## Installation

1. Navigate to the project directory:
    ```bash
    cd Choco-Task
    ```
2. Install the dependencies for the frontend and backend:
    ```bash
    cd client
    npm install
    cd ../server
    npm install
    ```

## Usage

1. Start the backend server:
    ```bash
    cd server
    npm start
    ```
2. Start the frontend development server:
    ```bash
    cd client
    npm start
    ```

## Technologies Used

- **Frontend**: React, Tailwind CSS, Redux
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: JWT
- **File Storage**: Firebase Storage

## Screenshots

### Admin Operations

#### Authentication
- **Login Screen for Admin and User**
  <br>

#### Dashboard Overview
- 📊 **Task Summary and Priority Chart**
  
- **User Task Overview and Recent Registrations**
  
<br>

#### Task Management Views
- **Board View of All Tasks**
  
- **List View of All Tasks**
  
<br>

#### Task Creation and Assignment
- **Create New Task Interface**
  <br>

#### Sub-Task Management
- **Adding Sub-Tasks to a Main Task**
  
<br>

#### Task Assignment Notifications
- **User Notifications for New Task Assignments**
  <br>

#### Task Status Overview
- **Completed, In Progress, and To-Do Tasks**
  
<br>

#### User Management
- **Adding a New User**
  
<br>

#### Default User Credentials
- **Default Password Information**
  <br>

#### User Account Management
- **Activating and Deactivating User Accounts**
  
<br>

#### User Information Management
- **Editing and Deleting User Information**
  
<br>

#### Trash Management
- 🗑️ **Viewing Trashed Tasks**
  
<br>

#### Task Restoration
- **Restoring Tasks from Trash**
  
<br>

#### Task Details
- **Viewing Detailed Task Information**
  
<br>

#### Task Communication
- **Team Chat and Activity Timeline**
  
<br>

### User Operations

#### Task Overview
- **User's Task List**
  
<br>

#### Password Management
- **Changing User Password**
  
<br>

#### Task Notifications
- **User Notifications for Assigned Tasks**
  
<br>

####  Task Activity Tracking
- **Viewing and Posting Task Activities**
  
<br>

#### Limited Access to Other Tasks
- **Viewing Non-Assigned Task Details**
  - Overview: Users can see basic information for all tasks
  - Restricted Access: Cannot view detailed timeline or activity for non-assigned tasks
  ![Non-Assigned Task Overview]
- **Attempting to Access Detailed Information**
  - Result: User is prevented from viewing timeline and activity of non-assigned tasks
  
<br>

#### 6️User Logout
- **Logout Process**
  
## Contact

## Project Link

