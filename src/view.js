export default class View {
  constructor(app) {
    this.app = app;
    this.form = document.getElementById('rss-form');
    this.input = document.getElementById('rss-url');
    this.feedback = document.querySelector('.feedback');
    this.submitBtn = document.querySelector('button[type="submit"]');
    this.successAlert = document.getElementById('success-alert');
    this.feedsContainer = document.getElementById('feeds');
    this.postsContainer = document.getElementById('posts');
    this.renderFeeds();
    this.renderPosts();

    this.init();

    this.app.onUpdatePosts = () => {
      this.renderPosts()
    }

    this.app.startPolling(5000)
  }

  init() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const url = this.input.value.trim();
      
      try {
        this.app.validateForm(url)
        this.app.handleSubmit(url);
        this.showSuccess();
        this.renderFeeds();
        this.renderPosts();
        this.resetForm();
      } catch (error) {
        this.showError(error.message);
      }
    });

    this.input.addEventListener('input', (e) => {
      const url = e.target.value.trim();
      if (url) {
        try {
          this.app.validateForm(url);
          this.clearErrors();
        } catch (error) {
          this.showError(error.message);
        }
      } else {
        this.clearErrors();
      }
    });
  }

  showSuccess() {
    this.successAlert.textContent = 'RSS успешно загружен';
    this.successAlert.classList.remove('d-none');
    setTimeout(() => this.successAlert.classList.add('d-none'), 3000);
  }

  showError(message) {
    this.feedback.textContent = message;
    this.feedback.classList.add('d-block');
    this.input.classList.add('is-invalid');
  }

  clearErrors() {
    this.feedback.textContent = '';
    this.feedback.classList.remove('d-block');
    this.input.classList.remove('is-invalid');
  }

  resetForm() {
    this.form.reset();
    this.clearErrors();
    this.input.focus();
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

  renderPosts() {
    this.postsContainer.innerHTML = this.app.state.posts
      .map(post => {
        const feed = this.app.state.feeds.find(f => f.id === post.feedId);
        return `
          <div class="mb-3">
            <a href="${post.link}" 
              class="${post.viewed ? 'text-secondary' : 'fw-bold'}" 
              target="_blank"
              data-id="${post.id}">
              ${post.title}
            </a>
            <small class="text-muted d-block">${feed?.title || 'Unknown feed'}</small>
          </div>
        `;
      }).join('');
  }
}
