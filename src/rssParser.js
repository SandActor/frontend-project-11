import axios from 'axios'

export const getRSS = (url) => {
  const allOriginsUrl = `https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}&disableCache=true`
  
  return axios.get(allOriginsUrl)
    .then((response) => {
      if (!response.data.contents) {
        throw new Error('networkError')
      }
      return parseRSS(response.data.contents)
    })
}

const parseRSS = (xmlString) => {
  return new Promise((resolve, reject) => {
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(xmlString, 'text/xml')
      
      const errorNode = doc.querySelector('parsererror')
      if (errorNode) {
        throw new Error('invalidRSS')
      }
      
      const channel = doc.querySelector('channel')
      const feed = {
        title: channel.querySelector('title').textContent,
        description: channel.querySelector('description').textContent,
      }
      
      const items = Array.from(doc.querySelectorAll('item')).map((item) => ({
        title: item.querySelector('title').textContent,
        link: item.querySelector('link').textContent,
        description: item.querySelector('description').textContent,
      }))
      
      resolve({ feed, posts: items })
    } catch (e) {
      reject(e)
    }
  })
}
