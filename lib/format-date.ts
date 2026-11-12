const portugueseMonths = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
] as const

function parseDate(isoDate: string) {
  const date = new Date(isoDate)
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatPostDate(isoDate: string) {
  const date = parseDate(isoDate)
  if (!date) return "Data indisponível"

  return `${date.getUTCDate()} de ${portugueseMonths[date.getUTCMonth()]} de ${date.getUTCFullYear()}`
}

export function formatMemberSince(isoDate: string) {
  const date = parseDate(isoDate)
  if (!date) return "Data indisponível"

  return `${portugueseMonths[date.getUTCMonth()]} de ${date.getUTCFullYear()}`
}
