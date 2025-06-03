import onChange from 'on-change'

export default class View {
  constructor(app) {
    this.app = app
    this.form = document.getElementById('rss-form')
    this.input = document.getElementById('rss-url')
    this.feedback = document.querySelector('.feedback')
    
    this.state = onChange({
      form: {
        valid: true,
        errors: [],
        value: ''
      },
      feeds: []
    }, this.render.bind(this))
  }

  init() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault()
      this.app.handleSubmit(this.state.form.value)
    })

    this.input.addEventListener('input', (e) => {
      this.state.form.value = e.target.value
      this.app.validateForm()
    })
  }

  render(path) {
    if (path === 'form.valid') {
      this.input.classList.toggle('is-invalid', !this.state.form.valid)
    }

    if (path === 'form.errors') {
      this.feedback.innerHTML = this.state.form.errors.join('<br>')
    }

    if (path === 'form.value') {
      this.input.value = this.state.form.value
    }

    if (path === 'feeds') {
      this.state.form.value = ''
      this.input.focus()
    }
  }
}
