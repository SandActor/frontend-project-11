export default class App {
  constructor(view) {
    this.view = view;
    this.state = {
      feeds: [],
      posts: [],
      error: null,
      loading: false,
    };
  }

  async handleSubmit(url) {
    try {
      
      this.state.loading = true;
      
      const schema = createSchema(this.state.feeds);
      await schema.validate({ url });

      if (this.state.feeds.some(feed => feed.url === url)) {
        throw new Error('Этот RSS-канал уже добавлен');
      }

      const { feed, posts } = await getRSS(url);

      const feedId = this.generateId();
      this.state.feeds.push({
        id: feedId,
        url,
        title: feed.title,
        description: feed.description
      });

      const newPosts = posts.map(post => ({
        ...post,
        id: this.generateId(),
        feedId,
        viewed: false
      }));

      this.state.posts = [...this.state.posts, ...newPosts];
      
      return true;
    } catch (error) {
      console.error('Ошибка при добавлении RSS:', error);
      throw error;
    } finally {
      this.state.loading = false;
    }
  }

  generateId() {
    return Math.random().toString(36).substring(2, 9);
  }
}