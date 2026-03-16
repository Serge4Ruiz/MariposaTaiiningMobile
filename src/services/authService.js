import axios from 'axios';

const BASE_URL = 'https://api.mariposatraining.com/api';

export const loginUser = async (username, password) => {
  const response = await axios.post(`${BASE_URL}/Community/Member/Login`, {
    UserName: username,
    Password: password,
  });
  return response.data;
};
