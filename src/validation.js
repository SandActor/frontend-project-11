import * as yup from 'yup'

yup.setLocale({
  mixed: {
    required: 'Поле обязательно для заполнения',
    notOneOf: 'RSS уже существует',
  },
  string: {
    url: 'Ссылка должна быть валидным URL',
  },
})

const normalizeUrl = (url) => {
  try {
    const urlObj = new URL(url)
    return urlObj.origin + urlObj.pathname
  } catch {
    return url
  }
}

const createSchema = (existingUrls) => {
  return yup.object().shape({
    url: yup
      .string()
      .required()
      .url()
      .transform((value) => value.trim())
      .notOneOf(existingUrls),
  })
}

export { createSchema, normalizeUrl }
