import React, { useEffect, useState } from "react";
import { useAttendanceStore } from "../stores/attendanceStore";
import { useAuthStore } from "../stores/authStore";

const AttendanceList: React.FC = () => {
  const { attendances, loading, fetchAttendances } = useAttendanceStore();
  const { user } = useAuthStore();
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  useEffect(() => {
    const userId = user?.role === "admin" ? undefined : user?.id;
    fetchAttendances(userId); // admin gets all if undefined
  }, [fetchAttendances, user]);

  const handleViewPhoto = (photoPath?: string | null) => {
    if (!photoPath) {
      console.warn("No photo path provided");
      return;
    }

    const photoUrl = photoPath.startsWith("http")
      ? photoPath
      : `http://localhost:3003/uploads/${photoPath.replace(/^uploads\//, "")}`;

    console.log("Final photo URL:", photoUrl);
    setSelectedPhoto(photoUrl);
  };

  const closeModal = () => {
    setSelectedPhoto(null);
  };

  if (loading) {
    console.log("AttendanceList: Loading state");
    return (
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  console.log("AttendanceList render - attendances:", attendances);
  console.log(
    "AttendanceList render - attendances length:",
    attendances.length
  );

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <h4>
            <i className="bi bi-list-ul"></i> Attendance Records
          </h4>
        </div>
        <div className="card-body">
          {attendances.length === 0 ? (
            <div className="text-center text-muted">
              <i className="bi bi-inbox display-1"></i>
              <p>No attendance records found</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    {user?.role === "admin" && <th>Employee</th>}
                    <th>Photo</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {attendances.map((attendance) => {
                    const createdAt = attendance.createdAt
                      ? new Date(attendance.createdAt)
                      : null;

                    return (
                      <tr key={attendance.id}>
                        <td>
                          {createdAt
                            ? createdAt.toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              })
                            : "N/A"}
                        </td>
                        <td>
                          {createdAt
                            ? createdAt.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "N/A"}
                        </td>
                        {user?.role === "admin" && (
                          <td>{attendance.userName || "Unknown"}</td>
                        )}
                        <td style={{ position: "relative", zIndex: 1 }}>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            style={{
                              position: "relative",
                              zIndex: 2,
                              pointerEvents: "auto",
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log(
                                "Button clicked, photo:",
                                attendance.photoPath
                              );
                              handleViewPhoto(attendance.photoPath);
                            }}
                          >
                            <i className="bi bi-eye"></i> View Photo
                          </button>
                        </td>
                        <td>{attendance.notes || "-"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
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
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=";
                  }}
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

export default AttendanceList;
