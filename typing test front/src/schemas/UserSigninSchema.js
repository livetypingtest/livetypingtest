// validation.js
import * as Yup from 'yup';

export const emailSchema = Yup.object().shape({
  signin: Yup.string().email('Invalid email format').required('Required'),
  password: Yup.string().required('Password is required'),
});

export const usernameSchema = Yup.object().shape({
  signin: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
});
