import { createSchema } from './validation.js'
import { getRSS } from './rssParser.js'

export default class App {
  constructor() {
    this.state = {
      feeds: [],
      posts: [],
      error: null,
      loading: false,
    }
    this.pollingInterval = null
  }

  isDuplicateFeedUrl(url) {
    return this.state.feeds.some(feed => feed.url === url)
  }

  validateForm(url) {
    const existingUrls = this.state.feeds.map(feed => feed.url);
    const schema = createSchema(existingUrls);
    return schema.validate({ url })
      .then(() => {
        return true;
      })
      .catch((err) => {
        throw err;
      });
  }

  handleSubmit(url) {
    this.state.loading = true;
    getRSS(url)
      .then(({ feed, posts }) => {
        if (!feed || !feed.title || !feed.description) {
          throw new Error('Некорректные данные RSS');
        }
        return this.validateForm(url).then(() => ({ feed, posts }));
      })
      .then(({ feed, posts }) => {
        const feedId = this.generateId();
        this.state.feeds.push({
          id: feedId,
          url,
          title: feed.title,
          description: feed.description,
        });
        
        const newPosts = posts.map(post => ({
          ...post,
          id: this.generateId(),
          feedId,
          viewed: false,
        }));
        this.state.posts = [...this.state.posts, ...newPosts];
      })
      .catch((err) => {
        console.error('Ошибка при добавлении RSS:', err);
      })
      .finally(() => {
        this.state.loading = false;
      });
  }

  generateId() {
    return Math.random().toString(36).substring(2, 9)
  }

  startPolling(intervalMs = 5000) {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval)
    }
    this.pollingInterval = setInterval(() => {
      this.checkForNewPosts();
    }, intervalMs)
  }

  checkForNewPosts() {
    const feedPromises = this.state.feeds.map(feed => {
      return getRSS(feed.url)
        .then(({ posts }) => {
          const existingLinks = new Set(
            this.state.posts
              .filter(p => p.feedId === feed.id)
              .map(p => p.link)
          );
          const newPosts = posts
            .filter(post => !existingLinks.has(post.link))
            .map(post => ({
              ...post,
              id: this.generateId(),
              feedId: feed.id,
              viewed: false,
            }));
          if (newPosts.length > 0) {
            this.state.posts = [...newPosts, ...this.state.posts];
            if (this.onUpdatePosts) {
              this.onUpdatePosts();
            }
          }
        })
        .catch(error => {
          console.error(`Ошибка при обновлении фида ${feed.url}:`, error);
        });
    });

    return Promise.all(feedPromises);
  }
}