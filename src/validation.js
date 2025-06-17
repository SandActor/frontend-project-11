import * as yup from 'yup'
import i18n from './i18n'

yup.setLocale({
  string: {
    url: () => 'Ссылка должна быть валидным URL',
  },
  mixed: {
    notOneOf: () => 'RSS уже существует',
    required: () => 'Поле не должно быть пустым',
  },
})

const normalizeUrl = (url) => {
  try {
    const urlObj = new URL(url)
    return urlObj.origin + urlObj.pathname
  } catch {
    return url
  }
};

const createSchema = (existingUrls) => {
  return yup.object().shape({
    url: yup
      .string()
      .required()
      .url()
      .transform((value) => value.trim())
      .notOneOf(existingUrls, 'RSS уже существует')
      .test(
        'unique-url',
        i18n.t('form.errors.duplicate'),
        (value) => {
          const normalizedValue = normalizeUrl(value)
          const normalizedExisting = existingUrls.map(normalizeUrl)
          return !normalizedExisting.includes(normalizedValue)
        }
      ),
  })
}

export { createSchema, normalizeUrl }
