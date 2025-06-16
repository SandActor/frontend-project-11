import { Modal } from 'bootstrap'

export const initView = (app) => {
  const form = document.getElementById('rss-form')
  const input = document.getElementById('url')
  const submitBtn = document.querySelector('button[type="submit"]')
  const successAlert = document.getElementById('success-alert')
  const feedsContainer = document.getElementById('feeds')
  const postsContainer = document.getElementById('posts')
  const modal = new Modal(document.getElementById('previewModal'))
  const modalTitle = document.querySelector('#previewModalLabel')
  const modalDescription = document.querySelector('#modalDescription')

  const showSuccess = () => {
    successAlert.textContent = 'RSS успешно загружен'
    successAlert.classList.remove('d-none')
    setTimeout(() => successAlert.classList.add('d-none'), 5000)
  }

  const showError = (message) => {
    const form = document.getElementById('rss-form');
    const button = form.querySelector('button[type="submit"]');
    
    const existingError = form.querySelector('.error-text-node');
    if (existingError) existingError.remove();
    
    const errorText = document.createTextNode(message);
    
    const wrapper = document.createElement('span');
    wrapper.className = 'error-text-node';
    wrapper.style.color = '#dc3545';
    wrapper.style.display = 'block';
    wrapper.style.margin = '0.5rem 0';
    wrapper.style.fontSize = '0.875em';
    
    wrapper.appendChild(errorText);
    form.insertBefore(wrapper, button);
    
    document.getElementById('url').classList.add('is-invalid');
  };

  const clearErrors = () => {
    const form = document.getElementById('rss-form');
    const error = form.querySelector('.error-text-node');
    if (error) error.remove();
    
    document.getElementById('url').classList.remove('is-invalid');
  };

  const resetForm = () => {
    form.reset()
    clearErrors()
    input.focus()
  }

  const renderFeeds = () => {
    feedsContainer.innerHTML = app.state.feeds
      .map(feed => `
        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title"><strong>${feed.title}</strong></h5>
            <p class="card-text">${feed.description}</p>
          </div>
        </div>
      `).join('')
  }

  const renderPosts = () => {
    postsContainer.innerHTML = app.state.posts
      .map(post => {
        const linkClass = post.viewed ? 'text-secondary' : 'fw-bold'
        return `
          <div class="mb-3 d-flex justify-content-between align-items-start bg-white p-3 rounded shadow-sm">
            <a href="${post.link}" target="_blank" class="${linkClass}" data-id="${post.id}">
              ${post.title}
            </a>
            <button class="btn btn-sm btn-outline-primary ms-2 preview-btn" data-id="${post.id}">Предпросмотр</button>
          </div>
        `
      }).join('')
    
    postsContainer.querySelectorAll('.preview-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const postId = e.target.dataset.id
        showPreview(postId)
      })
    })
  }

  const showPreview = (postId) => {
    const post = app.state.posts.find(p => p.id === postId)
    if (!post) return
    modalTitle.textContent = post.title
    modalDescription.textContent = post.description
    const closeBtn = document.createElement("button");
    closeBtn.id = "modal-close-btn";
    closeBtn.className = "btn btn-secondary";
    closeBtn.textContent = "Закрыть";
    closeBtn.onclick = () => modal.hide();
    modalTitle.appendChild(closeBtn);
    modal.show()
    if (!post.viewed) {
      post.viewed = true
      renderPosts()
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const url = input.value.trim()
    
    const originalBtnText = submitBtn.textContent
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Загрузка...'
    
    app.validateForm(url)
    .then(() => app.handleSubmit(url))
    .then(({ feeds, posts }) => {
      app.updateState({ feeds, posts });
      renderFeeds(feeds);
      renderPosts(posts);
      showSuccess();
      resetForm();
    })
    .catch((error) => {
      showError(error.message);
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    });
  })

  app.onUpdatePosts = () => {
    renderPosts()
  }
}
