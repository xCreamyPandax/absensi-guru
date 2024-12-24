import api from './api';

// Authentication
export const login = async (credentials) => {
  try {
    const response = await api.post('/login', credentials);
    const { token, role, id, name } = response.data;

    if (token) {
      // Save token and role to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('userId', id);
      localStorage.setItem('name', name);
      console.log(name);

      // Set default Authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    return response.data;
  } catch (error) {
    console.error('Login failed:', error.response?.data?.message || error.message);
    throw error;
  }
};

export const logout = async () => {
  try {
    await api.post('/logout');

    // Clear localStorage and Authorization header
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    delete api.defaults.headers.common['Authorization'];
  } catch (error) {
    console.error('Logout failed:', error.response?.data?.message || error.message);
    throw error;
  }
};

// Teachers
export const getAllTeachers = async () => {
  try {
    const response = await api.get('/teachers');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch teachers:', error.response?.data?.message || error.message);
    throw error;
  }
};

export const createTeacher = async (teacherData) => {
  try {
    const response = await api.post('/teachers', teacherData);
    return response.data;
  } catch (error) {
    console.error('Failed to create teacher:', error.response?.data?.message || error.message);
    throw error;
  }
};

export const importTeacher = async (formData) => {
  try {
    const response = await api.post('/import-users', formData);
    return response.data;
  } catch (error) {
    console.error('Failed to create teacher:', error.response?.data?.message || error.message);
    throw error;
  }
};

export const downloadTemplate = async () => {
  try {
    const response = await api.get('/download-template', {
      responseType: 'blob', // Penting untuk mendownload file
    });

    // Membuat URL untuk file yang diunduh
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'user_template.xlsx'); // Nama file unduhan
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  } catch (error) {
    console.error('Failed to download template:', error.response?.data?.message || error.message);
    throw error;
  }
};

export const updateTeacher = async (id, teacherData) => {
  try {
    const response = await api.put(`/teachers/${id}`, teacherData);
    return response.data;
  } catch (error) {
    console.error('Failed to update teacher:', error.response?.data?.message || error.message);
    throw error;
  }
};

export const deleteTeacher = async (id) => {
  try {
    const response = await api.delete(`/teachers/${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete teacher:', error.response?.data?.message || error.message);
    throw error;
  }
};

// Leaves
export const getAllLeaves = async () => {
  try {
    const response = await api.get('/leaves');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch leaves:', error.response?.data?.message || error.message);
    throw error;
  }
};

export const getLeavesByUserId = async (userId) => {
  try {
    const response = await api.get(`/leaves/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch leaves by user ID:', error.response?.data?.message || error.message);
    throw error;
  }
};

export const createLeave = async (leaveData) => {
  try {
    const response = await api.post('/leaves', leaveData);
    return response.data;
  } catch (error) {
    console.error('Failed to create leave:', error.response?.data?.message || error.message);
    throw error;
  }
};

export const updateLeaveStatus = async (id, statusData) => {
  try {
    const response = await api.patch(`/leaves/${id}`, statusData);
    return response.data;
  } catch (error) {
    console.error('Failed to update leave status:', error.response?.data?.message || error.message);
    throw error;
  }
};

// Reports
export const getReports = async () => {
  try {
    const response = await api.get('/reports');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch reports:', error.response?.data?.message || error.message);
    throw error;
  }
};

export const getReportsAll = async () => {
  try {
    const response = await api.get('/reports/all');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch reports:', error.response?.data?.message || error.message);
    throw error;
  }
};

// Attendance
export const checkIn = async (attendanceData) => {
  try {
    const response = await api.post('/checkin', attendanceData);
    return response.data;
  } catch (error) {
    console.error('Failed to check in:', error.response?.data?.message || error.message);
    throw error;
  }
};

export const checkOut = async (attendanceData) => {
  try {
    const response = await api.post('/checkout', attendanceData);
    return response.data;
  } catch (error) {
    console.error('Failed to check out:', error.response?.data?.message || error.message);
    throw error;
  }
};

export const getAttendanceByUserId = async (userId) => {
  try {
    const response = await api.get(`/attendances/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch attendance by user ID:', error.response?.data?.message || error.message);
    throw error;
  }
};

// User Profile
export const getUserById = async (id) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user profile:', error.response?.data?.message || error.message);
    throw error;
  }
};
