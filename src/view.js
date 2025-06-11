import { Modal } from 'bootstrap'

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

    this.modal = new Modal(document.getElementById('previewModal'));
    this.modalTitle = document.querySelector('#previewModalLabel');
    this.modalDescription = document.querySelector('#modalDescription');

    this.renderFeeds();
    this.renderPosts();

    this.init();

    this.app.onUpdatePosts = () => {
      this.renderPosts();
    }

    this.app.startPolling(5000);
  }

  init() {
    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const url = this.input.value.trim();
      
      try {
        this.submitBtn.disabled = true;
        this.submitBtn.textContent = 'Загрузка...';
        
        await this.app.validateForm(url);
        await this.app.handleSubmit(url);
        
        this.renderFeeds();
        this.renderPosts();
        this.showSuccess();
        this.resetForm();
      } catch (error) {
        this.showError(error.message);
      } finally {
        this.submitBtn.disabled = false;
        this.submitBtn.textContent = 'Добавить';
      }
    });
  }

  showSuccess() {
    this.successAlert.textContent = 'RSS успешно загружен';
    this.successAlert.classList.remove('d-none');
    if (process.env.NODE_ENV !== 'test') {
      setTimeout(() => this.successAlert.classList.add('d-none'), 5000);
    }
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
        const linkClass = post.viewed ? 'text-secondary' : 'fw-bold';

        return `
          <div class="mb-3 d-flex justify-content-between align-items-start bg-white p-3 rounded shadow-sm">
            <a href="${post.link}" target="_blank" class="${linkClass}" data-id="${post.id}">
              ${post.title}
            </a>
            <button class="btn btn-sm btn-outline-primary ms-2 preview-btn" data-id="${post.id}">Предпросмотр</button>
          </div>
        `;
      }).join('');
      
    this.postsContainer.querySelectorAll('.preview-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const postId = e.target.dataset.id;
        this.showPreview(postId);
      });
    });
  }

  showPreview(postId) {
    const post = this.app.state.posts.find(p => p.id === postId);
    if (!post) return;
    this.modalTitle.textContent = post.title;
    this.modalDescription.textContent = post.description;
    this.modal.show();
    if (!post.viewed) {
      post.viewed = true;
      this.renderPosts();
    }
  }
}
