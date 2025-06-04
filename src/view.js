import i18n from './i18n';

export default class View {
  constructor(app) {
    this.app = app;
    this.form = document.getElementById('rss-form');
    this.input = document.getElementById('rss-url');
    this.feedback = document.querySelector('.feedback');
    this.submitBtn = document.querySelector('button[type="submit"]');
    this.successAlert = document.getElementById('success-alert');
    this.feedsContainer = document.getElementById('feeds');
    
    this.updateTexts();
    this.state = onChange({
      form: {
        valid: null,
        error: null,
        value: ''
      }
    }, this.render.bind(this));
  }

  updateTexts() {
    document.querySelector('label[for="rss-url"]').textContent = i18n.t('form.urlLabel');
    this.submitBtn.textContent = i18n.t('form.submit');
    document.querySelector('h1').textContent = i18n.t('app.title');
    document.querySelector('p.text-center').textContent = i18n.t('app.subtitle');
    document.querySelector('h2').textContent = i18n.t('app.feedsTitle');
  }

  render(path) {
    if (path === 'form.error') {
      this.feedback.textContent = this.state.form.error 
        ? i18n.t(`form.errors.${this.state.form.error}`) 
        : '';
    }
    
    if (path === 'form.valid') {
      this.updateValidationState();
    }

    if (path === 'form.value') {
      this.input.value = this.state.form.value;
    }

    if (path === 'feeds') {
      this.renderFeeds();
      this.showSuccessAlert();
      this.resetForm();
    }
  }

  renderFeeds() {
    this.feedsContainer.innerHTML = this.app.state.feeds
      .map(feed => `
        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title"><strong>${feed.title}</strong></h5>
            <p class="card-text">${feed.description}</p>
          </div>
        </div>
      `).join('');
  }

  showSuccessAlert() {
    this.successAlert.textContent = i18n.t('form.success');
    this.successAlert.classList.remove('d-none');
    setTimeout(() => {
      this.successAlert.classList.add('d-none');
    }, 3000);
  }

  updateValidationState() {
    this.input.classList.remove('is-valid', 'is-invalid');
    
    if (this.state.form.valid === true) {
      this.input.classList.add('is-valid');
      this.feedback.classList.remove('d-block');
    } else if (this.state.form.valid === false) {
      this.input.classList.add('is-invalid');
      this.feedback.textContent = this.state.form.error;
      this.feedback.classList.add('d-block');
    }
  }

  resetForm() {
    this.form.classList.remove('was-validated')
    this.input.classList.remove('is-valid', 'is-invalid')
    this.input.value = ''
    this.feedback.classList.remove('d-block')
    this.input.focus()
  }

  init() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault()
      this.form.classList.add('was-validated')
      this.app.handleSubmit(this.state.form.value)
    })

    this.input.addEventListener('input', (e) => {
      this.state.form.value = e.target.value
      this.app.validateForm()
    })

    this.postsContainer.addEventListener('click', (e) => {
      const postElement = e.target.closest('a[data-id]')
      if (postElement) {
        const postId = postElement.dataset.id
        const post = this.app.state.posts.find(p => p.id === postId)
        if (post) {
          post.viewed = true
        }
      }
    })
  }
}
