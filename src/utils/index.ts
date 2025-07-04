import { TItemOrderProduct } from 'src/types/order-product'

type TLanguage = 'vi' | 'en'
interface IFormatCurrencyOptions {
  language?: TLanguage // 'vi' | 'en'
  exchangeRate?: number // (1 USD = 24,500 VND)
  minimumFractionDigits?: number
}

export const toFullName = (lastName: string, middleName: string, firstName: string, language: string) => {
  if (language === 'vi') {
    return [lastName, middleName, firstName].filter(Boolean).join(' ')
  } else {
    return [firstName, middleName, lastName].filter(Boolean).join(' ')
  }
}

export const ConvertBase64 = (file: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
  })

export const separationFullName = (fullName: string, language: string) => {
  const result = {
    firstName: '',
    middleName: '',
    lastName: ''
  }

  const arrFullName = fullName.trim().split(' ').filter(Boolean)
  if (arrFullName.length === 1) {
    if (language === 'vi') {
      result.firstName = arrFullName.join()
    } else if (language === 'en') {
      result.lastName = arrFullName.join()
    }
  } else if (arrFullName.length === 2) {
    if (language === 'vi') {
      result.lastName = arrFullName[0]
      result.firstName = arrFullName[1]
    } else if (language === 'en') {
      result.lastName = arrFullName[1]
      result.firstName = arrFullName[0]
    }
  } else if (arrFullName.length >= 3) {
    if (language === 'vi') {
      result.lastName = arrFullName[0]
      result.middleName = arrFullName.slice(1, -1).join(' ')
      result.firstName = arrFullName[arrFullName.length - 1]
    } else if (language === 'en') {
      result.lastName = arrFullName[arrFullName.length - 1]
      result.middleName = arrFullName.slice(1, -1).join(' ')
      result.firstName = arrFullName[0]
    }
  }

  return result
}

export const getAllValueOfObject = (obj: any, arrExlude?: string[]) => {
  try {
    const values: string[] = []
    for (const key in obj) {
      if (typeof obj[key] === 'object') {
        values.push(...getAllValueOfObject(obj[key], arrExlude))
      } else {
        if (!arrExlude?.includes(obj[key])) {
          values.push(obj[key])
        }
      }
    }

    return values
  } catch (error) {
    return []
  }
}

export const formatFilter = (filter: any) => {
  const result: Record<string, string> = {}
  Object.keys(filter)?.forEach((key: string) => {
    if (Array.isArray(filter[key]) && filter[key]?.length > 0) {
      result[key] = filter[key].join('|')
    } else if (filter[key]) {
      result[key] = filter[key]
    }
  })

  return result
}

export const stringToSlug = (str: string) => {
  // remove accents
  const from = 'àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ',
    to = 'aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy'
  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(RegExp(from[i], 'gi'), to[i])
  }

  str = str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\-]/g, '-')
    .replace(/-+/g, '-')

  return str
}

export const formatNumberToLocal = (
  value: number | string,
  { language = 'vi', exchangeRate = 24500, minimumFractionDigits = 0 }: IFormatCurrencyOptions = {}
): string => {
  const amount = Number(value)
  if (isNaN(amount)) return String(value)

  const locale = language === 'en' ? 'en-US' : 'vi-VN'
  const currency = language === 'en' ? 'USD' : 'VND'

  const finalAmount = language === 'en' ? amount / exchangeRate : amount

  return finalAmount.toLocaleString(locale, {
    style: 'currency',
    currency,
    currencyDisplay: 'symbol',
    useGrouping: true,
    minimumFractionDigits
  })
}

export const formatNumber = (value: string | number) => {
  if (!value) return ''

  // C1
  const convertValuetoArray = Array.from(String(value))

  let insertPosition = convertValuetoArray.length - 3

  while (insertPosition > 0) {
    convertValuetoArray.splice(insertPosition, 0, '.')
    insertPosition -= 3
  }

  const result = convertValuetoArray.join('')

  return result

  // C2
  // return new Intl.NumberFormat('vi-VN').format(Number(value))
}

export const convertHTMLToDraft = async (html: string) => {
  // Dynamically import required libraries
  const { EditorState, ContentState } = await import('draft-js')
  const { default: htmlToDraft } = await import('html-to-draftjs')

  if (!html) return EditorState.createEmpty()

  const blocksFromHtml = htmlToDraft(html)
  const { contentBlocks, entityMap } = blocksFromHtml
  const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap)

  return EditorState.createWithContent(contentState)
}

export const cloneDeep = (data: any) => {
  try {
    return JSON.parse(JSON.stringify(data))
  } catch (error) {
    return data
  }
}

export const convertUpdateProductToCart = (orderItems: TItemOrderProduct[], addItem: TItemOrderProduct) => {
  try {
    let result = []
    const cloneOrderItems = cloneDeep(orderItems)

    const findItems = cloneOrderItems.find((item: TItemOrderProduct) => item.product === addItem.product)
    if (findItems) {
      findItems.amount += addItem.amount
    } else {
      cloneOrderItems.push(addItem)
    }
    result = cloneOrderItems.filter((item: TItemOrderProduct) => item.amount)

    return result
  } catch (error) {
    return orderItems
  }
}

export const convertUpdateMultipleProductsCart = (orderItems: TItemOrderProduct[], addItems: TItemOrderProduct[]) => {
  try {
    let result = []

    const cloneOrderItems = cloneDeep(orderItems)
    addItems.forEach(addItem => {
      const findItems = cloneOrderItems.find((item: TItemOrderProduct) => item.product === addItem.product)
      if (findItems) {
        findItems.amount += addItem.amount
      } else {
        cloneOrderItems.push(addItem)
      }
    })
    result = cloneOrderItems.filter((item: TItemOrderProduct) => item.amount)

    return result
  } catch (error) {
    return orderItems
  }
}

export const isExpiry = (startDate: Date | null, endDate: Date | null) => {
  if (startDate && endDate) {
    const currentTime = new Date().getTime()
    const startDateTime = new Date(startDate).getTime()
    const endDateTime = new Date(endDate).getTime()

    return startDateTime <= currentTime && endDateTime > currentTime
  }

  return false
}

export const getTextFromHTML = (data: string) => {
  const container = document.createElement('div')
  container.innerHTML = data

  return container.textContent || container.innerText
}
