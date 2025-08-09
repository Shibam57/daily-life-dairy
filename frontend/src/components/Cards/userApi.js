import axios from 'axios';

export const getCurrentUser = async () => {
  try {
    const res = await axios.get('/api/v1/users/profile', {
      withCredentials: true,
    });
    return res.data.data;
  } catch (error) {
    console.error('Error fetching current user:', error.response?.data || error.message);
    throw error;
  }
};