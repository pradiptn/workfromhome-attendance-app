import React, { useEffect, useState } from 'react';
import { useAttendanceStore } from '../stores/attendanceStore';
import Swal from 'sweetalert2';

const AttendanceManagement: React.FC = () => {
  const { attendances, loading, fetchAttendances } = useAttendanceStore();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    console.log('AttendanceManagement useEffect triggered');
    fetchAttendances();
  }, [fetchAttendances]);

  const filteredAttendances = attendances.filter(attendance => {
    const matchesSearch = (attendance.userName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (attendance.userEmail || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'today') {
      return matchesSearch && attendance.createdAt && new Date(attendance.createdAt).toDateString() === new Date().toDateString();
    }
    if (filter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return matchesSearch && attendance.createdAt && new Date(attendance.createdAt) >= weekAgo;
    }
    return matchesSearch;
  });

  console.log('AttendanceManagement render - attendances:', attendances);
  console.log('AttendanceManagement render - filteredAttendances:', filteredAttendances);

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h4><i className="bi bi-eye"></i> View Attendance Records</h4>
            </div>
            <div className="col-md-6">
              <div className="row">
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search employee..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <select
                    className="form-control"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="all">All Records</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="text-center">
              <div className="spinner-border" role="status"></div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Employee</th>
                    <th>Email</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Photo</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttendances.map((attendance) => (
                    <tr key={attendance.id}>
                      <td>{attendance.id}</td>
                      <td>{attendance.userName || 'Unknown'}</td>
                      <td>{attendance.userEmail || 'N/A'}</td>
                      <td>{attendance.createdAt ? new Date(attendance.createdAt).toLocaleDateString() : 'N/A'}</td>
                      <td>{new Date(attendance.createdAt).toLocaleTimeString() || 'N/A'}</td>
                      <td style={{ position: 'relative', zIndex: 1 }}>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          style={{ position: 'relative', zIndex: 2, pointerEvents: 'auto' }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('Photo button clicked:', attendance.photoPath);
                            const photoUrl = attendance.photoPath.startsWith('http') 
                              ? attendance.photoPath 
                              : `http://localhost:3003/uploads/${attendance.photoPath.replace(/^uploads\//, '')}`;
                            console.log('Photo URL:', photoUrl);
                            Swal.fire({
                              imageUrl: photoUrl,
                              imageWidth: 400,
                              imageHeight: 300,
                              imageAlt: 'Attendance Photo',
                              showConfirmButton: false,
                              showCloseButton: true
                            });
                          }}
                        >
                          <i className="bi bi-eye"></i> View Photo
                        </button>
                      </td>
                      <td>{attendance.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredAttendances.length === 0 && (
                <div className="text-center text-muted py-4">
                  <i className="bi bi-inbox display-1"></i>
                  <p>No attendance records found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceManagement;
