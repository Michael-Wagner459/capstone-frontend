import axios from 'axios';

//setting this up allows the user to not worry about the base url when using the axios method as it includes it in here
const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

export default instance;
