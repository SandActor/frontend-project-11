import { createSchema } from './validation.js'
import { getRSS } from './rssParser.js'

export const createApp = () => {
  const state = {
    feeds: [],
    posts: [],
    error: null,
    loading: false,
  }

  let pollingInterval = null
  let onUpdatePosts = null

  const generateId = () => Math.random().toString(36).substring(2, 9)

  const validateForm = (url) => {
    const existingUrls = state.feeds.map(feed => feed.url)
    const schema = createSchema(existingUrls)
    return schema.validate({ url })
      .then(() => true)
      .catch(err => { throw err })
  }

  const handleSubmit = (url) => {
    state.loading = true
    getRSS(url)
      .then(({ feed, posts }) => {
        if (!feed || !feed.title || !feed.description) {
          throw new Error('Некорректные данные RSS')
        }
        return validateForm(url).then(() => ({ feed, posts }))
      })
      .then(({ feed, posts }) => {
        const feedId = generateId()
        state.feeds.push({
          id: feedId,
          url,
          title: feed.title,
          description: feed.description,
        })
        
        const newPosts = posts.map(post => ({
          ...post,
          id: generateId(),
          feedId,
          viewed: false,
        }))
        state.posts = [...state.posts, ...newPosts]
      })
      .catch((err) => {
        console.error('Ошибка при добавлении RSS:', err)
        throw err
      })
      .finally(() => {
        state.loading = false
      })
  }

  const checkForNewPosts = () => {
    const feedPromises = state.feeds.map(feed => {
      return getRSS(feed.url)
        .then(({ posts }) => {
          const existingLinks = new Set(
            state.posts
              .filter(p => p.feedId === feed.id)
              .map(p => p.link)
          )
          const newPosts = posts
            .filter(post => !existingLinks.has(post.link))
            .map(post => ({
              ...post,
              id: generateId(),
              feedId: feed.id,
              viewed: false,
            }))
          if (newPosts.length > 0) {
            state.posts = [...newPosts, ...state.posts]
            if (onUpdatePosts) onUpdatePosts()
          }
        })
        .catch(error => {
          console.error(`Ошибка при обновлении фида ${feed.url}:`, error)
        })
    })

    return Promise.all(feedPromises)
  }

  const startPolling = (intervalMs = 5000) => {
    if (pollingInterval) clearInterval(pollingInterval)
    pollingInterval = setInterval(checkForNewPosts, intervalMs)
  }

  return {
    state,
    validateForm,
    handleSubmit,
    startPolling,
    set onUpdatePosts(callback) {
      onUpdatePosts = callback
    },
  }
}