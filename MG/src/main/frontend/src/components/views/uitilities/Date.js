export function formatDate(dateString, withWeekday) {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-GB', {
    weekday: withWeekday ? 'short' : undefined,
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export const getDateString = (date, withDay) => {
  const dateStr = date.toLocaleDateString('sv-SE');
  return withDay ? dateStr : dateStr.slice(0, 7);
}

export const getTodayDateString = (withDay = true) => getDateString(new Date(), withDay);

export const getTodayCurrentMinutes = () => {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
};