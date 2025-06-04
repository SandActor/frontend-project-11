import 'bootstrap/dist/css/bootstrap.min.css'
import './styles.css'
import App from './app.js'
import View from './view.js'

document.addEventListener('DOMContentLoaded', () => {
  const app = new App()
  const view = new View(app)
  view.init()
})
