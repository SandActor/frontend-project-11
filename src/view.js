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
    clearErrors()

    const errorElement = document.createElement('div')
    errorElement.className = 'text-danger mt-2'
    errorElement.textContent = message
    errorElement.setAttribute('data-testid', 'validation-error')

    const formGroup = input.closest('.form-floating')
    formGroup.appendChild(errorElement)

    input.classList.add('is-invalid')
  }

  const clearErrors = () => {
    const formGroup = input.closest('.form-floating')
    const existingErrors = formGroup.querySelectorAll('.text-danger, .invalid-feedback')
    existingErrors.forEach(error => error.remove())
    input.classList.remove('is-invalid')
  }

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
      .map((post) => {
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

    postsContainer.querySelectorAll('.preview-btn').forEach((btn) => {
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
    const closeBtn = document.createElement('button')
    closeBtn.id = 'modal-close-btn'
    closeBtn.className = 'btn btn-secondary'
    closeBtn.textContent = 'Закрыть'
    closeBtn.onclick = () => modal.hide()
    modalTitle.appendChild(closeBtn)
    modal.show()
    if (!post.viewed) {
      post.viewed = true
      renderPosts()
    }
  }

  let isSubmitting = false

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    if (isSubmitting) return
    isSubmitting = true

    clearErrors()
    const url = input.value.trim()

    const originalBtnText = submitBtn.textContent

    submitBtn.disabled = true
    submitBtn.textContent = 'Загрузка...'

    app.validateForm(url)
      .then(() => app.handleSubmit(url))
      .then(({ feeds, posts }) => {
        app.updateState({ feeds, posts })
        renderFeeds(feeds)
        renderPosts(posts)
        showSuccess()
        resetForm()
      })
      .catch((error) => {
        const errorMessage = error.message.includes('ValidationError')
          ? error.errors.join(', ')
          : error.message.includes('valid')
            ? 'Ресурс не содержит валидный RSS'
            : error.message
        showError(errorMessage)
      })
      .finally(() => {
        isSubmitting = false
        submitBtn.disabled = false
        submitBtn.textContent = originalBtnText
      })
  })

  app.onUpdatePosts = () => {
    renderPosts()
  }
}
