/**
 * Серверный скрипт для получения постов из Telegram-канала
 * 
 * Этот скрипт использует Telegram Scraper для получения публичных постов из канала
 * без использования официального Telegram API
 */

const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Получить последние посты из публичного Telegram-канала
 * @param {string} channelName - имя канала (например, 'npdetailing')
 * @param {number} limit - количество постов для получения
 * @returns {Promise<Array>} массив объектов постов
 */
async function getChannelPosts(channelName, limit = 10) {
  try {
    // URL публичного доступа к каналу
    const url = `https://t.me/s/${channelName}`;
    
    // Получаем HTML-страницу с постами
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const html = response.data;
    const $ = cheerio.load(html);
    
    const posts = [];
    
    // Находим элементы постов
    $('.tgme_widget_message_wrap').each((index, element) => {
      if (posts.length >= limit) return false; // Ограничиваем количество
      
      const $element = $(element);
      const postId = $element.attr('data-post');
      
      // Извлекаем дату
      const dateElement = $element.find('.tgme_widget_message_meta .time');
      const date = dateElement.text().trim();
      
      // Извлекаем текст
      const textElement = $element.find('.tgme_widget_message_text');
      const text = textElement.length > 0 ? textElement.text().trim() : '';
      
      // Извлекаем изображение
      let photo = null;
      const photoElement = $element.find('.tgme_widget_message_photo_wrap');
      if (photoElement.length > 0) {
        // Получаем URL из фона элемента
        const style = photoElement.attr('style');
        if (style) {
          const match = style.match(/background-image:url\('([^']+)'\)/);
          if (match && match[1]) {
            photo = match[1];
          }
        }
      }
      
      // Извлекаем видео
      let video = null;
      const videoElement = $element.find('.tgme_widget_message_video_player video');
      if (videoElement.length > 0) {
        video = videoElement.attr('src');
      }
      
      // Извлекаем количество просмотров
      let views = null;
      const viewsElement = $element.find('.tgme_widget_message_views');
      if (viewsElement.length > 0) {
        const viewsText = viewsElement.text().trim();
        const viewsMatch = viewsText.match(/(\d+(?:\.\d+)?)([KMB]?)/);
        if (viewsMatch) {
          views = parseNumberWithSuffix(viewsMatch[1], viewsMatch[2]);
        }
      }
      
      // Извлекаем количество репостов
      let forwards = null;
      const forwardsElement = $element.find('.tgme_widget_message_fwd_info');
      if (forwardsElement.length > 0) {
        const forwardsText = forwardsElement.text().trim();
        const forwardsMatch = forwardsText.match(/(\d+(?:\.\d+)?)([KMB]?)/);
        if (forwardsMatch) {
          forwards = parseNumberWithSuffix(forwardsMatch[1], forwardsMatch[2]);
        }
      }
      
      if (postId) {
        posts.push({
          id: parseInt(postId.split('/')[1]),
          date: formatDate(date),
          text: text,
          photo: photo,
          video: video,
          views: views,
          forwards: forwards
        });
      }
    });
    
    return posts;
  } catch (error) {
    console.error('Ошибка при получении постов из Telegram-канала:', error.message);
    throw error;
  }
}

/**
 * Преобразовать число с суффиксом (K, M, B) в обычное число
 */
function parseNumberWithSuffix(value, suffix) {
  const num = parseFloat(value);
  switch (suffix) {
    case 'K':
      return Math.round(num * 1000);
    case 'M':
      return Math.round(num * 1000000);
    case 'B':
      return Math.round(num * 1000000000);
    default:
      return num;
  }
}

/**
 * Преобразовать дату из формата Telegram в ISO
 */
function formatDate(telegramDate) {
  // Telegram дает дату в формате "15 February 2024", "Yesterday at 15:30" или "Today at 10:15"
  // Преобразуем в ISO формат
  
  if (telegramDate.includes('Today')) {
    const time = telegramDate.replace('Today at ', '');
    const today = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    today.setHours(hours, minutes, 0, 0);
    return today.toISOString();
  }
  
  if (telegramDate.includes('Yesterday')) {
    const time = telegramDate.replace('Yesterday at ', '');
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const [hours, minutes] = time.split(':').map(Number);
    yesterday.setHours(hours, minutes, 0, 0);
    return yesterday.toISOString();
  }
  
  // Для формата "15 February 2024" или "15 February 2024 at 15:30"
  try {
    return new Date(telegramDate).toISOString();
  } catch (e) {
    console.warn('Не удалось распознать дату:', telegramDate);
    return new Date().toISOString();
  }
}

module.exports = {
  getChannelPosts
};