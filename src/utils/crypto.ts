import CryptoJS from 'crypto-js'

// encode
export function encrypt(data: object): string {
  const jsonString = JSON.stringify(data)
  const encrypted = CryptoJS.AES.encrypt(jsonString, process.env.NEXT_PUBLIC_SECRET_KEY as string).toString()

  return encodeURIComponent(encrypted)
}

// Decode
export function decrypt(encrypted: string): object {
  const decoded = decodeURIComponent(encrypted)
  const bytes = CryptoJS.AES.decrypt(decoded, process.env.NEXT_PUBLIC_SECRET_KEY as string)
  const jsonString = bytes.toString(CryptoJS.enc.Utf8)

  return JSON.parse(jsonString)
}
