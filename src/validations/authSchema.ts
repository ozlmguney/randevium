import * as Yup from 'yup';

export const loginSchema = Yup.object().shape({
  email: Yup.string().email('Geçersiz e-posta').required('E-posta zorunlu'),
  password: Yup.string().min(6, 'Şifre en az 6 karakter olmalı').required('Şifre zorunlu'),
});

export const registerSchema = Yup.object().shape({
  name: Yup.string().required('İsim soyisim zorunlu'),
  email: Yup.string().email('Geçersiz e-posta').required('E-posta zorunlu'),
  password: Yup.string().min(6, 'Şifre en az 6 karakter olmalı').required('Şifre zorunlu'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Şifreler eşleşmiyor')
    .required('Şifre tekrarı zorunlu'),
});

export {};