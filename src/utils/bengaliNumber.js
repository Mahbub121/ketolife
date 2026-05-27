const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']

export function toBnNum(n) {
  return String(n)
    .split('')
    .map((d) => bnDigits[+d] ?? d)
    .join('')
}

export default toBnNum
