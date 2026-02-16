# Visual Diagram Builder with Authentication

A React + TypeScript application that allows users to create and manage visual diagrams using draggable/connectable elements with Firebase authentication and role-based access control.

## Live Demo

**Deployed Application:** [https://deisign-tool-jisu.vercel.app/](https://deisign-tool-jisu.vercel.app/)

### Demo Credentials

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Editor** | editor@test.com | editor123 | Full CRUD access - can create, edit, and delete diagrams |
| **Viewer** | viewer@test.com | viewer123 | Read-only access - can only view diagrams |

### Core Features
- **Authentication & Authorization** - Firebase Email/Password authentication with role-based access control
- **User Roles:**
  - **Editor** – Can create, edit, and delete diagrams
  - **Viewer** – Can only view diagrams (read-only)
- **Dashboard** – View all diagrams the user has access to
- **Diagram Editor** – Create diagrams with draggable nodes and connectable edges using React Flow
- **Profile Management** – View user information and logout

### Bonus Features
- **Theme Toggle** – Light/Dark mode support
- **Diagram Sharing** – Editors can invite other users by email with 'view' or 'edit' access
- **Unit Tests** – Tests for components and hooks

## Tech Stack

- **Frontend:** React 19, TypeScript
- **Routing:** React Router DOM v7
- **Diagram Library:** React Flow
- **Backend/Auth:** Firebase (Authentication + Firestore)
- **Build Tool:** Vite
- **Testing:** Jest, React Testing Library
- **Deployment:** Vercel

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AppLayout.tsx
│   ├── ErrorBoundary.tsx
│   ├── Header.tsx
│   ├── LoadingSpinner.tsx
│   ├── NodePanel.tsx
│   ├── ProtectedRoute.tsx
│   ├── RoleGuard.tsx
│   ├── ShapeNode.tsx
│   ├── ShareDialog.tsx
│   └── Toast.tsx
├── context/             # React Context providers
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
├── hooks/               # Custom React hooks
│   ├── useAuth.ts
│   ├── useDebounce.tsx
│   └── usePermissions.tsx
├── pages/               # Page components
│   ├── DashboardPage.tsx
│   ├── DiagramEditorPage.tsx
│   ├── LoginPage.tsx
│   └── ProfilePage.tsx
├── services/            # API and Firebase services
│   ├── auth.service.ts
│   ├── diagram.service.ts
│   └── firebase.ts
├── types/               # TypeScript type definitions
│   ├── diagram.types.ts
│   └── user.types.ts
├── constants/           # Application constants
│   └── index.ts
└── __tests__/           # Unit tests
    ├── LoadingSpinner.test.tsx
    └── usePermissions.test.tsx
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase project with Authentication and Firestore enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Esha1712/deisignTool.git
   cd deisignTool
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory with your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |

## Pages

| Page | Route | Description |
|------|-------|-------------|
| **Login** | `/login` | Email/password login via Firebase |
| **Dashboard** | `/` | List of all diagrams with create new option |
| **Diagram Editor** | `/diagram/:id` | Create/edit diagrams with React Flow |
| **Profile** | `/profile` | User info, role display, and logout |

## Role-Based Access Control

- **Editors** can:
  - Create new diagrams
  - Edit existing diagrams (add/modify/delete nodes and edges)
  - Share diagrams with other users
  - Delete diagrams

- **Viewers** can:
  - View diagrams (read-only)
  - Navigate the application
  - View their profile

## Testing

Run the test suite:

```bash
npm run test
```

Tests are located in `src/__tests__/` and cover:
- `LoadingSpinner` component
- `usePermissions` hook
