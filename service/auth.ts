import axios from 'axios';

const url = process.env.API_URL;

export async function signIn(user: { email: string; password: string }) {
  const res = await axios.post(`${url}/api/auth/local`, {
    identifier: user.email,
    password: user.password,
  });
  return res.data;
}