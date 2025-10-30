# Task Manager (MERN)

Full-featured project and task management platform built with the MERN stack. The system provides project spaces with configurable Kanban boards, a global dashboard, shared taxonomies, and RESTful APIs for managing all entities.

The repository contains both the backend (Express/MongoDB) and frontend (React/Vite) applications.

## Features

### Project workspace
- Create projects with descriptions, external resources, and shared categories.
- Auto-generated Kanban columns with customizable status, order, and naming.
- Drag & drop tasks between columns with persisted ordering.
- Rich task metadata: assignee, category, tags, priority, deadlines, and external links.

### Reference catalog
- Centralized category dictionary reusable across projects.
- Inline creation and deletion of categories from the UI.
- Changes reflected instantly across the workspace.

### Dashboard
- Global overview aggregating metrics from every project.
- Detailed task table with quick navigation back to originating projects.
- Highlight urgent work and weekly focus items.

### REST API
- CRUD endpoints for projects, tasks, categories, tags, users, and Kanban columns.
- Structured responses with populated relations for immediate UI consumption.
- Dedicated reorder endpoint to support drag & drop interactions.

## Project structure

```
.
├── client/           # React + Vite frontend
│   ├── src/
│   │   ├── api/      # Axios API client helpers
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── providers/
│   │   └── styles/
│   └── vite.config.js
└── server/           # Express + MongoDB backend
    ├── src/
    │   ├── config/
    │   ├── controllers/
    │   ├── middlewares/
    │   ├── models/
    │   ├── routes/
    │   └── services/
    └── package.json
```

## Getting started

### Prerequisites
- Node.js 18+
- MongoDB 6+ (local or hosted)

### Backend setup
```bash
cd server
cp .env.example .env # configure MongoDB connection string
npm install
npm run dev
```

The API is exposed at `http://localhost:5000` with routes under `/api`.

#### Backend tests

The server includes integration tests that run against an in-memory MongoDB instance and cover the category, project, and task
workflows (including drag-and-drop reordering). Execute them with:

```bash
cd server
npm test
```

> The suite uses `mongodb-memory-server` to spin up an ephemeral database, ensuring persistence logic is validated without
> requiring a local Mongo installation.

### Frontend setup
```bash
cd client
npm install
npm run dev
```

Vite will start the UI at `http://localhost:5173` and proxy `/api` requests to the backend.

## Available API routes

| Method | Route                            | Description                     |
| ------ | -------------------------------- | ------------------------------- |
| GET    | `/api/projects`                  | List all projects               |
| POST   | `/api/projects`                  | Create project                  |
| PUT    | `/api/projects/:id`              | Update project details          |
| PUT    | `/api/projects/:id/columns`      | Update column definitions       |
| DELETE | `/api/projects/:id`              | Delete project                  |
| GET    | `/api/tasks`                     | Query tasks with filters        |
| POST   | `/api/tasks`                     | Create task                     |
| PATCH  | `/api/tasks/:id/move`            | Move task between columns       |
| PUT    | `/api/tasks/:id`                 | Update task                     |
| DELETE | `/api/tasks/:id`                 | Delete task                     |
| GET    | `/api/categories`                | List categories                 |
| POST   | `/api/categories`                | Create category                 |
| PUT    | `/api/categories/:id`            | Update category                 |
| DELETE | `/api/categories/:id`            | Delete category                 |
| GET    | `/api/tags`                      | List tags                       |
| POST   | `/api/tags`                      | Create tag                      |
| GET    | `/api/users`                     | List users (manual provisioning)|
| POST   | `/api/users`                     | Create user                     |

## Design language

The interface follows a light, glassmorphism-inspired aesthetic using Inter typeface, pill-shaped controls, and layered cards. Components are organized to mirror the provided reference design with left-hand navigation, top command bar, and split board/detail layout.

## Future enhancements
- Authentication and user roles
- Comments and activity history
- Notifications for approaching deadlines
- File uploads and asset management

## License

MIT © 2024
