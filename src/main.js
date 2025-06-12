import 'bootstrap/dist/css/bootstrap.min.css'
import './styles.css'
import { createApp } from './app.js'
import { initView } from './view.js'

document.addEventListener('DOMContentLoaded', () => {
  const app = createApp()
  initView(app)
})
