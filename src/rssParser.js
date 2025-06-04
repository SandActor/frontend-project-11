export const getRSS = async (url) => {
  try {
    const proxyUrl = `https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}&disableCache=true`;
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      throw new Error('Ошибка сети при загрузке RSS');
    }

    const data = await response.json();
    if (!data.contents) {
      throw new Error('Не удалось получить содержимое RSS');
    }

    return parseRSS(data.contents);
  } catch (error) {
    console.error('Ошибка при загрузке RSS:', error);
    throw error;
  }
};

const parseRSS = (xmlString) => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlString, 'text/xml');
    
    const errorNode = doc.querySelector('parsererror');
    if (errorNode) {
      throw new Error('Неверный формат RSS');
    }

    const channel = doc.querySelector('channel');
    const feed = {
      title: channel.querySelector('title').textContent,
      description: channel.querySelector('description').textContent,
    };

    const items = Array.from(doc.querySelectorAll('item')).map((item) => ({
      title: item.querySelector('title').textContent,
      link: item.querySelector('link').textContent,
      description: item.querySelector('description').textContent,
    }));

    return { feed, posts: items };
  } catch (error) {
    console.error('Ошибка при парсинге RSS:', error);
    throw new Error('Ошибка при обработке RSS-канала');
  }
};