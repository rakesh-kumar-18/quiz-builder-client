import axios from 'axios';
const staticUrl = 'https://quiz-builder-server.onrender.com';

export const registerUser = async ({ name, password, email }) => {
  try {
    const res = await axios.post(`${staticUrl}/api/v1/user/register`, {
      name,
      password,
      email,
    });
    return res.data.status;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const loginUser = async ({ password, email }) => {
  try {
    const response = await axios.post(`${staticUrl}/api/v1/user/login`, {
      email,
      password,
    });
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('userId', response.data.userId);
    return response.data.status;
  } catch (error) {
    console.log(error.response.data.status);
    return error.response.data.status;
  }
};
