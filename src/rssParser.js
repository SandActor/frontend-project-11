export const parseRSS = (xmlString) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'text/xml');
  
  const channel = doc.querySelector('channel');
  const feed = {
    title: channel.querySelector('title').textContent,
    description: channel.querySelector('description').textContent,
    link: channel.querySelector('link').textContent,
    lastBuildDate: channel.querySelector('lastBuildDate')?.textContent,
    generator: channel.querySelector('generator')?.textContent
  };

  const items = Array.from(doc.querySelectorAll('item')).map((item) => ({
    title: item.querySelector('title').textContent,
    description: item.querySelector('description').textContent,
    link: item.querySelector('link').textContent,
    pubDate: item.querySelector('pubDate')?.textContent,
    creator: item.querySelector('dc\\:creator')?.textContent || 'Unknown author',
    guid: item.querySelector('guid')?.textContent
  }));

  return { feed, posts: items };
};

export const getRSS = (url) => {
  const proxyUrl = `https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}&disableCache=true`

  return fetch(proxyUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    })
    .then(data => {
      if (!data.contents) {
        throw new Error('No RSS content found')
      }
      return parseRSS(data.contents)
    })
}