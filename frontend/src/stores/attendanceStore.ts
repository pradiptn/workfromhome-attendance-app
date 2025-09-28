import { create } from 'zustand';
import { attendanceAPI } from '../services/api';

interface Attendance {
  id: number;
  userId: number;
  createdAt: string;
  photoPath: string;
  notes?: string;
  userName: string;
  userEmail: string;
}

interface AttendanceState {
  attendances: Attendance[];
  loading: boolean;
  fetchAttendances: (userId?: number) => Promise<void>;
  createAttendance: (data: FormData) => Promise<void>;
}

export const useAttendanceStore = create<AttendanceState>((set, get) => ({
  attendances: [],
  loading: false,
  fetchAttendances: async (userId) => {
    console.log('fetchAttendances called with userId:', userId);
    set({ loading: true });
    try {
      console.log('Making API call to:', `/attendance${userId ? `?userId=${userId}` : ''}`);
      const response = await attendanceAPI.getAll(userId);
      console.log('API response:', response);
      console.log('Attendance data received:', response.data);
      console.log('Data length:', response.data?.length);
      set({ attendances: response.data || [], loading: false });
    } catch (error: any) {
      console.error('Error fetching attendances:', error);
      console.error('Error details:', error.response?.data);
      set({ attendances: [], loading: false });
      throw error;
    }
  },
  createAttendance: async (data) => {
    try {
      await attendanceAPI.create(data);
      await get().fetchAttendances();
    } catch (error: any) {
      throw error;
    }
  },
}));
