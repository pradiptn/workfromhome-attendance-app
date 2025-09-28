import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useAttendanceStore } from '../stores/attendanceStore';
import { attendanceSchema, AttendanceForm as AttendanceFormType } from '../schemas/validationSchemas';

const AttendanceForm: React.FC = () => {
  const [formData, setFormData] = useState<Partial<AttendanceFormType>>({
    notes: '',
    photo: undefined,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  
  const createAttendance = useAttendanceStore((state) => state.createAttendance);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const validData = attendanceSchema.parse(formData);
      
      const formDataToSend = new FormData();
      formDataToSend.append('photo', validData.photo);
      if (validData.notes) formDataToSend.append('notes', validData.notes);

      await createAttendance(formDataToSend);
      Swal.fire('Success', 'Attendance recorded successfully!', 'success');
      setFormData({ notes: '', photo: undefined });
    } catch (error: any) {
      if (error.errors) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        Swal.fire('Error', error.response?.data?.message || 'Failed to record attendance', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h4><i className="bi bi-camera"></i> Record Attendance</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Upload Photo *</label>
                  <input
                    type="file"
                    className={`form-control ${errors.photo ? 'is-invalid' : ''}`}
                    accept="image/*"
                    onChange={(e) => setFormData({...formData, photo: e.target.files?.[0]})}
                  />
                  {errors.photo && <div className="invalid-feedback">{errors.photo}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Notes (Optional)</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Add any notes about your work today..."
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Recording...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle me-2"></i>
                      Record Attendance
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceForm;
