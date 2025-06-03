import * as yup from 'yup'
import i18n from './i18n'

yup.setLocale({
  mixed: {
    required: () => i18n.t('form.errors.required'),
  },
  string: {
    url: () => i18n.t('form.errors.url'),
  }
})

const createSchema = (existingUrls) => {
  return yup.object().shape({
    url: yup
      .string()
      .required()
      .url()
      .test(
        'unique-url',
        i18n.t('form.errors.duplicate'),
        (value) => !existingUrls.includes(value)
      )
  })
}

export { createSchema }
