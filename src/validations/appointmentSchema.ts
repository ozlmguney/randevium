import * as Yup from 'yup';

export const appointmentSchema = Yup.object().shape({
  doctorId: Yup.number().required('Lütfen bir doktor seçiniz'),
  date: Yup.date().required('Lütfen bir tarih seçiniz').min(new Date(), 'Geçmiş tarihe randevu alınamaz'),
  time: Yup.string().required('Lütfen saat seçiniz'),
  description: Yup.string().min(10, 'Lütfen şikayetinizi kısa bir cümleyle açıklayın'),
});

export {};