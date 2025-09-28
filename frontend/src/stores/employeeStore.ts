import { create } from 'zustand';
import { employeeAPI } from '../services/api';

interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface EmployeeState {
  employees: Employee[];
  loading: boolean;
  fetchEmployees: () => Promise<void>;
  createEmployee: (data: any) => Promise<void>;
  updateEmployee: (id: number, data: any) => Promise<void>;
  deleteEmployee: (id: number) => Promise<void>;
}

export const useEmployeeStore = create<EmployeeState>((set, get) => ({
  employees: [],
  loading: false,
  fetchEmployees: async () => {
    set({ loading: true });
    try {
      const response = await employeeAPI.getAll();
      set({ employees: response.data, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
  createEmployee: async (data) => {
    try {
      await employeeAPI.create(data);
      await get().fetchEmployees();
    } catch (error) {
      throw error;
    }
  },
  updateEmployee: async (id, data) => {
    try {
      await employeeAPI.update(id, data);
      await get().fetchEmployees();
    } catch (error) {
      throw error;
    }
  },
  deleteEmployee: async (id) => {
    try {
      await employeeAPI.delete(id);
      await get().fetchEmployees();
    } catch (error) {
      throw error;
    }
  },
}));
