const suffixes = ['', 'k', 'M', 'B', 'T']

export function compactFormat(n) {
  if (isNaN(n)) return null
  
  if (n < 1000) return n
  
  const divisor = Math.floor(Math.log10(Math.abs(n)) / 3)
  
  const formattedNumber = Math.round(n / Math.pow(10, divisor * 3))
  
  return formattedNumber + suffixes[divisor];
}

export function formatAmount(amount, currencyCode) {
  let currency = currencyCode
  
  if (currencyCode === 'POUND') {
    currency = 'GBP'
  } else if (currencyCode === 'LIRA') {
    currency = 'TRY'
  } else if (currencyCode === 'EURO') {
    currency = 'EUR'
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2
  }).format(amount)
}
