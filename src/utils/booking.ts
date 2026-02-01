/**
 * Утилиты для работы с заявками
 */

import { getServiceById, getServiceOptionById, mainServices } from '../data/services';
import { getTelegramUser } from './telegram';

export interface BookingFormData {
  name: string;
  phone: string;
  carBrand: string;
  carModel: string;
  services: string[]; // Изменено на массив
  additionalOptions: string[];
  date: string;
  time?: string;
  comment: string;
  referrer?: string; // Код пользователя, который пригласил
  quantities?: { [serviceId: string]: number };
}

/**
 * Отправка заявки администратору в Telegram
 */
export const sendBookingToTelegram = async (formData: BookingFormData): Promise<boolean> => {
  // ЗАМЕНИТЕ НА ВАШ ТОКЕН
  const BOT_TOKEN = '8547724331:AAH0VcR3_yDvzgxHdRlC0FSPId71P5XKK6M';
  // ЗАМЕНИТЕ НА ВАШ ЧАТ ID
  const CHAT_ID = '478799066';
  
  // Получаем названия всех выбранных услуг
  const serviceNames = formData.services.map(serviceId => {
    const service = getServiceById(serviceId);
    let serviceName = service ? `${service.icon || ''} ${service.name}`.trim() : serviceId;
    if (service && formData.quantities && formData.quantities[service.id]) {
      serviceName += ` (x${formData.quantities[service.id]})`;
    }
    return serviceName;
  });

  // Ищем основную услугу для получения доп. опций
  const mainServiceId = formData.services.find(id => 
    mainServices.flatMap(cat => cat.services).some(s => s.id === id)
  );

  // Получаем названия дополнительных опций
  const additionalOptionsNames = mainServiceId ? formData.additionalOptions.map(optionId => {
    const option = getServiceOptionById(mainServiceId, optionId);
    return option ? `${option.icon || ''} ${option.name}`.trim() : optionId;
  }) : [];
  
  const telegramUser = getTelegramUser();
  const userLink = telegramUser?.username 
    ? `@${telegramUser.username}` 
    : `tg://user?id=${telegramUser?.id}`;

  const message = [
    '🎯 *Новая заявка на запись*',
    '',
    `👤 *Имя:* ${formData.name}`,
    `📞 *Телефон:* ${formData.phone}`,
    `🚗 *Автомобиль:* ${formData.carBrand} ${formData.carModel}`,
    `🔧 *Услуги:* ${serviceNames.join(', ')}`,
    additionalOptionsNames.length > 0 ? `➕ *Дополнительно:* ${additionalOptionsNames.join(', ')}` : null,
    `📅 *Дата:* ${formData.date}`,
    formData.comment ? `💬 *Комментарий:* ${formData.comment}` : null,
    formData.referrer ? `🎁 *Приглашен пользователем:* ${formData.referrer}` : null,
    `🔗 *Клиент:* ${userLink}`
  ].filter(Boolean).join('\n');

  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    const data = await response.json();
    if (data.ok) {
      return true;
    } else {
      console.error('Ошибка отправки в Telegram:', data);
      return false;
    }
  } catch (error) {
    console.error('Ошибка отправки заявки:', error);
    return false;
  }
};

/**
 * Валидация формы записи
 */
export const validateBookingForm = (formData: BookingFormData): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!formData.name.trim()) errors.name = 'Введите ваше имя';
  if (!formData.phone.trim()) {
    errors.phone = 'Введите номер телефона';
  } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
    errors.phone = 'Некорректный номер телефона';
  }
  if (!formData.carBrand.trim()) errors.carBrand = 'Введите марку автомобиля';
  if (!formData.carModel.trim()) errors.carModel = 'Введите модель автомобиля';
  if (formData.services.length === 0) errors.services = 'Выберите хотя бы одну услугу';
  if (!formData.date) errors.date = 'Выберите дату';

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
