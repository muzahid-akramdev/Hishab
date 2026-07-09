export function getRange(filter) {
  const now = new Date();

  const startOfDay = (d) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  };
  const endOfDay = (d) => {
    const x = new Date(d);
    x.setHours(23, 59, 59, 999);
    return x;
  };

  let start = null;
  let end = null;

  switch (filter) {
    case 'today':
      start = startOfDay(now);
      end = endOfDay(now);
      break;
    case 'week': {
      const day = now.getDay(); // 0 = Sunday
      const diffToMonday = day === 0 ? 6 : day - 1;
      start = startOfDay(new Date(now));
      start.setDate(now.getDate() - diffToMonday);
      end = endOfDay(now);
      break;
    }
    case 'month':
      start = startOfDay(new Date(now.getFullYear(), now.getMonth(), 1));
      end = endOfDay(now);
      break;
    case 'all':
    default:
      start = null;
      end = null;
  }

  return { start, end };
}
