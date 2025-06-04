import { createSchema } from './validation';
import i18n from './i18n';
import { getRSS } from './rssParser';

export default class App {
  constructor() {
    this.state = onChange({
      feeds: [],
      posts: [],
      form: {
        valid: null,
        error: null,
        value: ''
      },
      loading: false,
      ui: {
        viewedPosts: new Set()
      }
    }, () => this.view.render());
    i18n.on('languageChanged', () => this.view.updateTexts());
  }

  handleSubmit(url) {
    const schema = createSchema(this.state.feeds);
    
    this.state.loading = true;
    
    schema.validate({ url })
      .then(() => getRSS(url))
      .then(({ feed, posts }) => {
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
        
        this.state.posts.push(...newPosts);
        this.state.form.error = null;
        this.state.form.value = '';
      })
      .catch((err) => {
        this.state.form.error = err.message;
      })
      .finally(() => {
        this.state.loading = false;
      });
  }
}