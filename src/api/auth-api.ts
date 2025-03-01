import axiosInstance from './axios-instance';

export const authApi = {
  login: (email: string, password: string) => {
    // return axiosInstance.post('/auth/login', { email, password });
        // Mocked check for testing purposes
    if (email === 'user@mail.com' && password === 'Password') {
      return new Promise<{ data: User }>((resolve) => {
        resolve({
          data: {
            id: 1,
            email: 'user@mail.com',
            name: 'User Name',
            // other user fields
          },
        });
      });
    } else {
      return Promise.reject('Invalid email or password');
    }
  },

  register: (email: string, password: string, name: string) => {
    return axiosInstance.post('/auth/register', { email, password, name });
  },

  logout: () => {
    localStorage.removeItem('token');
    return axiosInstance.post('/auth/logout');
  },

  getCurrentUser: () => {
    return axiosInstance.get('/auth/me');
  },

  googleLogin: (token: string) => {
    return axiosInstance.post('/auth/google', { token });
  },

  forgotPassword: (email: string) => {
    return axiosInstance.post('/auth/forgot-password', { email });
  },

  resetPassword: (token: string, password: string) => {
    return axiosInstance.post('/auth/reset-password', { token, password });
  },
};