const VIETNAM_OFFSET_MS = 7 * 60 * 60 * 1000;

type DateKeyParts = {
  year: number;
  month: number;
  day: number;
};

function parseDateKey(dateKey: string): DateKeyParts {
  const [year, month, day] = dateKey.split('-').map(Number);

  return { year, month, day };
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

export function getVietnamDate(date: Date = new Date()): Date {
  return new Date(date.getTime() + VIETNAM_OFFSET_MS);
}

export function toVietnamDateKey(date: Date = new Date()): string {
  const vietnamDate = getVietnamDate(date);
  const year = vietnamDate.getUTCFullYear();
  const month = pad(vietnamDate.getUTCMonth() + 1);
  const day = pad(vietnamDate.getUTCDate());

  return `${year}-${month}-${day}`;
}

export function toVietnamMinutes(date: Date = new Date()): number {
  const vietnamDate = getVietnamDate(date);

  return vietnamDate.getUTCHours() * 60 + vietnamDate.getUTCMinutes();
}

export function toMinutes(timeValue: string = '00:00'): number {
  const [hours = 0, minutes = 0] = timeValue.split(':').map(Number);

  return hours * 60 + minutes;
}

export function enumerateDateKeys(startsOn: string, endsOn: string): string[] {
  const startParts = parseDateKey(startsOn);
  const endParts = parseDateKey(endsOn);
  const current = new Date(Date.UTC(startParts.year, startParts.month - 1, startParts.day));
  const end = new Date(Date.UTC(endParts.year, endParts.month - 1, endParts.day));
  const dates: string[] = [];

  while (current <= end) {
    dates.push(`${current.getUTCFullYear()}-${pad(current.getUTCMonth() + 1)}-${pad(current.getUTCDate())}`);
    current.setUTCDate(current.getUTCDate() + 1);
  }

  return dates;
}

export function createVietnamTriggerDate(dateKey: string, timeValue: string = '00:00'): Date {
  const { year, month, day } = parseDateKey(dateKey);
  const [hour = 0, minute = 0] = timeValue.split(':').map(Number);

  return new Date(Date.UTC(year, month - 1, day, hour - 7, minute, 0, 0));
}

export function isFutureVietnamDateTime(
  dateKey: string,
  timeValue: string = '00:00',
  now: Date = new Date()
): boolean {
  const currentDateKey = toVietnamDateKey(now);

  if (dateKey > currentDateKey) {
    return true;
  }

  if (dateKey < currentDateKey) {
    return false;
  }

  return toMinutes(timeValue) > toVietnamMinutes(now);
}
