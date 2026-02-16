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
    console.log(`Fetching URL: ${url}`);

    // Получаем HTML-страницу с постами
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    const html = response.data;
    console.log(`Received HTML length: ${html.length}`);
    
    const $ = cheerio.load(html);

    const posts = [];
    
    // Находим элементы постов - используем data-post атрибут для надёжности
    const elements = $('[data-post]').toArray();
    console.log(`Found ${elements.length} elements with data-post attribute`);

    $('[data-post]').each((index, element) => {
      if (posts.length >= limit) return false; // Ограничиваем количество

      const $element = $(element);
      const postId = $element.attr('data-post');
      
      console.log(`Processing element ${index}: data-post="${postId}"`);

      // Пропускаем элементы без полного data-post (например, реакции)
      if (!postId || !postId.includes('/')) {
        console.log(`Skipping element - invalid postId`);
        return true;
      }
      
      // Извлекаем дату из datetime атрибута или из текста
      let date = null;
      const datetimeElement = $element.find('.tgme_widget_message_date time');
      if (datetimeElement.length > 0 && datetimeElement.attr('datetime')) {
        date = datetimeElement.attr('datetime');
      } else {
        const dateElement = $element.find('.tgme_widget_message_meta .time');
        date = formatDate(dateElement.text().trim());
      }
      
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

    console.log(`Parsed ${posts.length} posts`);
    if (posts.length > 0) {
      console.log('First post:', JSON.stringify(posts[0], null, 2));
    }
    
    return posts;
  } catch (error) {
    console.error('Ошибка при получении постов из Telegram-канала:', error.message);
    console.error(error.stack);
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
  if (!telegramDate || telegramDate.length < 3) {
    return new Date().toISOString();
  }
  
  // Telegram дает дату в формате "16 февр.", "16 февраля 2026", "11:34", "Yesterday at 15:30" или "Today at 10:15"
  
  if (telegramDate.includes('Today') || telegramDate.includes('Сегодня')) {
    const time = telegramDate.replace(/.*at /, '').replace(/в /, '');
    const today = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    today.setHours(hours || 0, minutes || 0, 0, 0);
    return today.toISOString();
  }
  
  if (telegramDate.includes('Yesterday') || telegramDate.includes('Вчера')) {
    const time = telegramDate.replace(/.*at /, '').replace(/в /, '');
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const [hours, minutes] = time.split(':').map(Number);
    yesterday.setHours(hours || 0, minutes || 0, 0, 0);
    return yesterday.toISOString();
  }
  
  // Если только время (например, "11:34") - это сегодня
  if (/^\d{1,2}:\d{2}$/.test(telegramDate)) {
    const today = new Date();
    const [hours, minutes] = telegramDate.split(':').map(Number);
    today.setHours(hours || 0, minutes || 0, 0, 0);
    return today.toISOString();
  }
  
  // Для формата "16 февр.", "16 февраля 2026"
  try {
    const currentYear = new Date().getFullYear();
    // Добавляем текущий год, если его нет
    const dateWithYear = telegramDate.includes('20') ? telegramDate : `${telegramDate} ${currentYear}`;
    const parsedDate = new Date(dateWithYear);
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate.toISOString();
    }
  } catch (e) {
    console.warn('Не удалось распознать дату:', telegramDate);
  }
  
  return new Date().toISOString();
}

module.exports = {
  getChannelPosts
};