export const parseRSS = (xmlString) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(xmlString, 'text/xml')

  const channel = doc.querySelector('channel')
  const feed = {
    title: channel.querySelector('title').textContent,
    description: channel.querySelector('description').textContent,
    link: channel.querySelector('link').textContent,
    lastBuildDate: channel.querySelector('lastBuildDate')?.textContent,
    generator: channel.querySelector('generator')?.textContent,
  }

  const items = Array.from(doc.querySelectorAll('item')).map(item => ({
    title: item.querySelector('title').textContent,
    description: item.querySelector('description').textContent,
    link: item.querySelector('link').textContent,
    pubDate: item.querySelector('pubDate')?.textContent,
    creator: item.querySelector('dc\\:creator')?.textContent || 'Unknown author',
    guid: item.querySelector('guid')?.textContent,
  }))

  return { feed, posts: items }
}

export const getRSS = (url) => {
  const proxyUrl = `https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}&disableCache=true12312`

  return fetch(proxyUrl)
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      return parseRSS(data.contents)
    })
    .catch((error) => {
      console.log(error.message)
      throw new Error(error.message.includes('valid') ? error.message : 'Ресурс не содержит валидный RSS')
    })
}
