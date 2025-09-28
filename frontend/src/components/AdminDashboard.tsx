import React, { useEffect, useState } from "react";
import { attendanceAPI } from "../services/api";

interface DashboardStats {
  totalEmployees: number;
  totalAttendances: number;
  todayAttendances: number;
  recentAttendances: Array<{
    id: number;
    userName: string;
    createdAt: string;
    photoPath: string;
  }>;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await attendanceAPI.getDashboard();
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleViewPhoto = (photoPath: string) => {
    const photoUrl = photoPath.startsWith("http")
      ? photoPath
      : `http://localhost:3003/uploads/${photoPath.replace(/^uploads\//, "")}`;
    setSelectedPhoto(photoUrl);
  };

  const closeModal = () => setSelectedPhoto(null);

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border" role="status"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">Failed to load dashboard data</div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>
        <i className="bi bi-speedometer2"></i> Admin Dashboard
      </h2>

      {/* Stats Cards */}
      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card bg-primary text-white">
            <div className="card-body d-flex justify-content-between">
              <div>
                <h4>{stats.totalEmployees}</h4>
                <p>Total Employees</p>
              </div>
              <i className="bi bi-people display-4"></i>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card bg-success text-white">
            <div className="card-body d-flex justify-content-between">
              <div>
                <h4>{stats.todayAttendances}</h4>
                <p>Today's Attendance</p>
              </div>
              <i className="bi bi-calendar-check display-4"></i>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card bg-info text-white">
            <div className="card-body d-flex justify-content-between">
              <div>
                <h4>{stats.totalAttendances}</h4>
                <p>Total Records</p>
              </div>
              <i className="bi bi-graph-up display-4"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Attendance */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5>Recent Attendance</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Photo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentAttendances.map((attendance) => {
                      const createdAt = new Date(attendance.createdAt);
                      return (
                        <tr key={attendance.id}>
                          <td>{attendance.userName}</td>
                          <td>{createdAt.toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              })}</td>
                          <td>
                            {createdAt.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() =>
                                window.open(
                                  `http://localhost:3000/${attendance.photoPath}`,
                                  "_blank"
                                )
                              }
                            >
                              Show Photo
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Attendance Photo</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body text-center">
                <img
                  src={selectedPhoto}
                  alt="Attendance"
                  className="img-fluid"
                  style={{ maxHeight: "500px" }}
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
