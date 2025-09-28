import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuthStore } from "./stores/authStore";
import Login from "./components/Login";
import AttendanceForm from "./components/AttendanceForm";
import AttendanceList from "./components/AttendanceList";
import EmployeeManagement from "./components/EmployeeManagement";
import AdminDashboard from "./components/AdminDashboard";
import AttendanceManagement from "./components/AttendanceManagement";
import AdminRoute from "./components/AdminRoute";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const App: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuthStore();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <div className="container">
            <span className="navbar-brand">WFH Attendance</span>
            <div className="navbar-nav ms-auto">
              <span className="navbar-text me-3">
                Welcome, {user?.name} ({user?.role})
              </span>
              <button className="btn btn-outline-light" onClick={logout}>
                Logout
              </button>
            </div>
          </div>
        </nav>

        <div className="container-fluid">
          <div className="row">
            <div className="col-md-2 bg-light vh-100">
              <div className="list-group list-group-flush mt-3">
                {user?.role === "admin" && (
                  <a
                    href="/dashboard"
                    className="list-group-item list-group-item-action"
                  >
                    <i className="bi bi-speedometer2 me-2"></i>Dashboard
                  </a>
                )}
                <a
                  href="/attendance"
                  className="list-group-item list-group-item-action"
                >
                  <i className="bi bi-camera me-2"></i>Record Attendance
                </a>
                {user?.role !== "admin" && (
                  <a
                    href="/history"
                    className="list-group-item list-group-item-action"
                  >
                    <i className="bi bi-list-ul me-2"></i>View History
                  </a>
                )}
                {user?.role === "admin" && (
                  <>
                    <a
                      href="/employees"
                      className="list-group-item list-group-item-action"
                    >
                      <i className="bi bi-people me-2"></i>Manage Employees
                    </a>
                    <a
                      href="/manage-attendance"
                      className="list-group-item list-group-item-action"
                    >
                      <i className="bi bi-eye me-2"></i>View Attendance
                    </a>
                  </>
                )}
              </div>
            </div>
            <div className="col-md-10">
              <Routes>
                <Route
                  path="/"
                  element={
                    <Navigate
                      to={user?.role === "admin" ? "/dashboard" : "/attendance"}
                    />
                  }
                />
                <Route path="/attendance" element={<AttendanceForm />} />
                <Route path="/history" element={<AttendanceList />} />
                <Route
                  path="/dashboard"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/employees"
                  element={
                    <AdminRoute>
                      <EmployeeManagement />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/manage-attendance"
                  element={
                    <AdminRoute>
                      <AttendanceManagement />
                    </AdminRoute>
                  }
                />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
