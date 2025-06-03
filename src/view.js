export default class View {
  constructor(app) {
    this.app = app;
    this.form = document.getElementById('rss-form');
    this.input = document.getElementById('rss-url');
    this.feedback = document.querySelector('.feedback-message');
    
    this.state = onChange({
      form: {
        valid: null,  // null, true или false
        error: '',
        value: ''
      },
      feeds: []
    }, this.render.bind(this));
  }

  render(path) {
    if (path === 'form.valid') {
      this.updateValidationState();
    }

    if (path === 'form.value') {
      this.input.value = this.state.form.value;
    }

    if (path === 'feeds') {
      this.resetForm();
    }
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
    this.form.classList.remove('was-validated');
    this.input.classList.remove('is-valid', 'is-invalid');
    this.input.value = '';
    this.feedback.classList.remove('d-block');
    this.input.focus();
  }

  init() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.form.classList.add('was-validated');
      this.app.handleSubmit(this.state.form.value);
    });

    this.input.addEventListener('input', (e) => {
      this.state.form.value = e.target.value;
      this.app.validateForm();
    });
  }
}
