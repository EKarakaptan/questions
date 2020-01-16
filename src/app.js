import { Question } from './question'
import { createModal, isValid } from './utils'
import { getAuthForm, authWithEmailAndPassword } from './auth'
import './styles.css'

const form = document.getElementById('form')
const modalBtn = document.getElementById('modal-btn')
const input = form.querySelector('#question-input')
const submitBtn = form.querySelector('#submit')

window.onload = event => Question.renderList

form.onsubmit = event => {
  event.preventDefault()
  submitFormHandler()
}

modalBtn.onclick = event => openModal()

input.addEventListener('input', () => {
  submitBtn.disabled = !isValid(input.value)
})

function submitFormHandler(event) {
  if (isValid(input.value)) {
    // preventDefault()
    const question = {
      text: input.value.trim(),
      date: new Date().toJSON()
    }

    submitBtn.disabled = true

    Question.create(question).then(() => {
      input.value = ''
      input.className = ''
      submitBtn.disabled = false
    })
  }
}

function openModal() {
  createModal('Авторизация', getAuthForm())
  document.getElementById('auth-form').onsubmit = event => {
    event.preventDefault()
    authFormHandler(event), { once: true }
  }
  // document
  //   .getElementById('auth-form')
  //   .addEventListener('submit', authFormHandler, { once: true })
}

function authFormHandler(event) {
  const btn = event.target.querySelector('button')
  const email = event.target.querySelector('#email').value
  const password = event.target.querySelector('#password').value

  btn.disabled = true
  authWithEmailAndPassword(email, password)
    .then(Question.fetch)
    .then(renderModalAfterAuth)
    .then(() => (btn.disabled = false))
}

function renderModalAfterAuth(content) {
  if (typeof content === 'string') {
    createModal('Ошибка', content)
  } else {
    createModal('Список Вопросов', Question.listToHTML(content))
  }
  console.log(content)
}
