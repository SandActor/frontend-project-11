import * as yup from 'yup'

const createSchema = (existingUrls) => {
  return yup.object().shape({
    url: yup
      .string()
      .required('URL обязателен')
      .url('Некорректный URL')
      .test(
        'unique-url',
        'Этот RSS-поток уже добавлен',
        (value) => !existingUrls.includes(value)
      )
  })
}

export { createSchema }
