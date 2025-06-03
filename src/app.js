import { createSchema } from './validation';
import i18n from './i18n';

export default class App {
  constructor() {
    this.feeds = [];
    i18n.on('languageChanged', () => this.view.updateTexts());
  }

  handleSubmit(url) {
    console.log("что-то1")
    const schema = createSchema(this.feeds);
    
    schema.validate({ url })
      .then(() => {
        this.feeds.push(url);
        this.view.state.form.error = null;
        alert(i18n.t('form.success'));
      })
      .catch((err) => {
        this.view.showError(err);
      });
  }
}