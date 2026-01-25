import {
  Refine,
  Authenticated,
} from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import { BrowserRouter, Route, Routes, Outlet, Navigate } from "react-router";
import routerProvider, {
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from "@refinedev/react-router";
import { dataProvider } from "./providers/data";
import { authProvider } from "./providers/auth";
import { Layout } from "./components/refine-ui/layout/layout";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
import "./App.css";
import Dashboard from "./pages/dashboard";
import { BookOpen, GraduationCap, Home } from "lucide-react";
import SubjectsCreate from "./pages/subjects/create";
import SubjectsList from "./pages/subjects/list";
import ClassesList from "./pages/classes/list";
import ClassesCreate from "./pages/classes/create";
import ShowClasses from "./pages/classes/show";
import Login from "./pages/login/login";
import Signup from "./pages/signup.tsx/signup";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ThemeProvider>
          <DevtoolsProvider>
            <Refine
              dataProvider={dataProvider}
              authProvider={authProvider}
              notificationProvider={useNotificationProvider()}
              routerProvider={routerProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: "2ohZEK-slEtHW-uR6y4O",
              }}
              resources={[
                {
                  name: "dashboard",
                  list: "/dashboard",
                  meta: { label: "Home", icon: <Home /> },
                },
                {
                  name: "subjects",
                  list: "/subjects",
                  create: "/subjects/create",
                  meta: { label: "Subjects", icon: <BookOpen /> },
                },
                {
                  name: "classes",
                  list: "/classes",
                  create: "/classes/create",
                  show: "/classes/show/:id",
                  meta: { label: "Classes", icon: <GraduationCap /> },
                },
              ]}
            >
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Signup />} />
                
                {/* Redirect root to dashboard */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                
                {/* Protected routes */}
                <Route
                  element={
                    <Authenticated
                      key="authenticated-layout"
                      fallback={<Navigate to="/login" />}
                    >
                      <Layout>
                        <Outlet />
                      </Layout>
                    </Authenticated>
                  }
                >
                  <Route path="/dashboard" element={<Dashboard />} />

                  <Route path="subjects">
                    <Route index element={<SubjectsList />} />
                    <Route path="create" element={<SubjectsCreate />} />
                  </Route>
                  <Route path="classes">
                    <Route index element={<ClassesList />} />
                    <Route path="create" element={<ClassesCreate />} />
                    <Route path="show/:id" element={<ShowClasses />} />
                  </Route>
                </Route>
              </Routes>
              <Toaster />
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </ThemeProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
