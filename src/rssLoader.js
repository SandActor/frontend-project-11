import axios from 'axios'

export const loadRSS = (url) => {
  const allOriginsUrl = `https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}&disableCache=true`
  
  return axios.get(allOriginsUrl)
    .then((response) => {
      if (response.data.contents) {
        return response.data.contents
      }
      throw new Error('Network response was not ok')
    })
}
