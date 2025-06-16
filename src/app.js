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
    return schema.validate({ url }).then(() => true).catch(err => err)
  }

  const handleSubmit = (url) => {
    return new Promise((resolve, reject) => {
      state.loading = true

      getRSS(url)
        .then(({ feed, posts }) => {
          if (!feed || !feed.title || !feed.description) {
            throw new Error('Некорректные данные RSS')
          }

          return validateForm(url)
            .then(() => ({ feed, posts }))
        })
        .then(({ feed, posts }) => {
          const feedId = generateId()

          const newFeed = {
            id: feedId,
            url,
            title: feed.title,
            description: feed.description,
          }

          const newPosts = posts.map(post => ({
            ...post,
            id: generateId(),
            feedId,
            viewed: false,
          }))

          startPolling(5000)

          return {
            feeds: [...state.feeds, newFeed],
            posts: [...state.posts, ...newPosts],
          }
        })
        .then((updatedData) => {
          state.feeds = updatedData.feeds
          state.posts = updatedData.posts
          state.loading = false

          resolve(updatedData)
        })
        .catch((err) => {
          state.loading = false
          state.error = err.message
          reject(err)
        })
    })
  }

  const checkForNewPosts = () => {
    const feedPromises = state.feeds.map((feed) => {
      return getRSS(feed.url)
        .then(({ posts }) => {
          const existingLinks = new Set(
            state.posts
              .filter(p => p.feedId === feed.id)
              .map(p => p.link),
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
        .catch((error) => {
          console.error(`Ошибка при обновлении фида ${feed.url}:`, error)
        })
    })

    return Promise.all(feedPromises)
  }

  const startPolling = (intervalMs = 5000) => {
    if (pollingInterval) clearInterval(pollingInterval)
    pollingInterval = setInterval(checkForNewPosts, intervalMs)
  }

  const updateState = (newState) => {
    if (newState.feeds) {
      state.feeds = newState.feeds
    }
    if (newState.posts) {
      state.posts = newState.posts
    }
    if (newState.error) {
      state.error = newState.error
    }
  }

  return {
    state,
    validateForm,
    handleSubmit,
    startPolling,
    set onUpdatePosts(callback) {
      onUpdatePosts = callback
    },
    updateState,
    getState: () => ({ ...state }),
  }
}
