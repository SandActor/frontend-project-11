import { createSchema } from './validation';

export default class App {
  constructor() {
    this.view = new View(this);
    this.feeds = [];
  }

  init() {
    this.view.init();
  }

  validateForm() {
    const schema = createSchema(this.feeds);
    
    schema.validate({ url: this.view.state.form.value }, { abortEarly: false })
      .then(() => {
        this.view.state.form.valid = true;
        this.view.state.form.error = '';
      })
      .catch((err) => {
        this.view.state.form.valid = false;
        this.view.state.form.error = err.errors.join('. ');
      });
  }

  handleSubmit(url) {
    const schema = createSchema(this.feeds);
    
    schema.validate({ url }, { abortEarly: false })
      .then(() => {
        this.feeds.push(url);
        this.view.state.feeds = [...this.feeds];
      })
  }
}