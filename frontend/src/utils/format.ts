export const formatPrice = (cents: number, currency: string) => {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: (currency ?? 'eur').toUpperCase(),
  }).format(cents / 100);
};

export const formatOrderWhen = (
  iso: string | null | undefined,
  opts: {
    dateStyle?: Intl.DateTimeFormatOptions['dateStyle'];
  } = {},
) => {
  const { dateStyle = 'medium' } = opts;

  if (!iso) return '';

  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat(undefined, {
    dateStyle,
    timeStyle: 'short',
  }).format(date);
};
