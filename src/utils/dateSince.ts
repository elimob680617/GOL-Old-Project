export const dateSince = (date: string) => {
  const newDate: any = new Date(date);
  const seconds = Math.floor(((new Date() as any) - newDate) / 1000);

  let interval = seconds / 31536000;

  if (interval > 1) {
    return newDate.getDate() + '/' + (newDate.getMonth() + 1) + '/' + newDate.getFullYear();
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return newDate.getDate() + '/' + (newDate.getMonth() + 1) + '/' + newDate.getFullYear();
  }
  interval = seconds / 86400;
  if (interval > 1 && interval < 2) {
    return 'A day ago';
  } else if (interval >= 2) {
    return newDate.getDate() + '/' + (newDate.getMonth() + 1) + '/' + newDate.getFullYear();
  }
  interval = seconds / 3600;
  if (interval > 1 && interval < 2) {
    return 'An hour ago';
  } else if (interval >= 2) {
    return Math.floor(interval) + ' hours ago';
  }
  interval = seconds / 60;
  if (interval > 1 && interval < 2) {
    return 'A minute ago';
  } else if (interval >= 2) {
    return Math.floor(interval) + ' minutes ago';
  }
  return 'A moment ago';
};
