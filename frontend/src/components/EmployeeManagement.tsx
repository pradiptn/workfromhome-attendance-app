import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useEmployeeStore } from '../stores/employeeStore';
import { employeeSchema, EmployeeForm } from '../schemas/validationSchemas';
import { createSemicolonClassElement } from 'typescript';

const EmployeeManagement: React.FC = () => {
  const [formData, setFormData] = useState<Partial<EmployeeForm>>({
    name: '',
    email: '',
    password: '',
    role: 'employee',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const { employees, loading, fetchEmployees, createEmployee, updateEmployee, deleteEmployee } = useEmployeeStore();

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const validData = employeeSchema.parse(formData);

      if (editingId) {
        await updateEmployee(editingId, validData);
        Swal.fire('Success', 'Employee updated successfully!', 'success');
      } else {
        await createEmployee(validData);
        Swal.fire('Success', 'Employee created successfully!', 'success');
      }

      setFormData({ name: '', email: '', password: '', role: 'employee' });
      setEditingId(null);
    } catch (error: any) {
      if (error.errors) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        Swal.fire('Error', error.response?.data?.message || 'Operation failed', 'error');
      }
    }
  };

  const handleEdit = (employee: any) => {
    setFormData({
      name: employee.name,
      email: employee.email,
      role: employee.role,
    });
    console.log(employee.id)
    setEditingId(employee.id);
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await deleteEmployee(id);
        Swal.fire('Deleted!', 'Employee has been deleted.', 'success');
      } catch (error) {
        Swal.fire('Error', 'Failed to delete employee', 'error');
      }
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5>{editingId ? 'Edit Employee' : 'Add Employee'}</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    type="text"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>
                <div className="mb-3">
                  <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>
                <div className="mb-3">
                  <select
                    className={`form-control ${errors.role ? 'is-invalid' : ''}`}
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value as 'employee' | 'admin'})}
                  >
                    <option value="employee">Employee</option>
                    <option value="admin">Admin</option>
                  </select>
                  {errors.role && <div className="invalid-feedback">{errors.role}</div>}
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  {editingId ? 'Update' : 'Create'} Employee
                </button>
                {editingId && (
                  <button
                    type="button"
                    className="btn btn-secondary w-100 mt-2"
                    onClick={() => {
                      setEditingId(null);
                      setFormData({ name: '', email: '', password: '', role: 'employee' });
                    }}
                  >
                    Cancel
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5>Employee List</h5>
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
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map((employee) => (
                        <tr key={employee.id}>
                          <td>{employee.name}</td>
                          <td>{employee.email}</td>
                          <td>
                            <span className={`badge ${employee.role === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                              {employee.role}
                            </span>
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-primary me-2"
                              onClick={() => handleEdit(employee)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(employee.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeManagement;
