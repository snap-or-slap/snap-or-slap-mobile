const VIETNAM_OFFSET_MS = 7 * 60 * 60 * 1000;

function parseDateKey(dateKey) {
	const [year, month, day] = String(dateKey || '').split('-').map(Number);
	return { year, month, day };
}

export function getVietnamDate(date = new Date()) {
	return new Date(date.getTime() + VIETNAM_OFFSET_MS);
}

export function toVietnamDateKey(date = new Date()) {
	const vietnamDate = getVietnamDate(date);
	const year = vietnamDate.getUTCFullYear();
	const month = `${vietnamDate.getUTCMonth() + 1}`.padStart(2, '0');
	const day = `${vietnamDate.getUTCDate()}`.padStart(2, '0');
	return `${year}-${month}-${day}`;
}

export function toVietnamMinutes(date = new Date()) {
	const vietnamDate = getVietnamDate(date);
	return vietnamDate.getUTCHours() * 60 + vietnamDate.getUTCMinutes();
}

export function toMinutes(timeValue = '00:00') {
	const [hours, minutes] = String(timeValue || '00:00').split(':').map(Number);
	return hours * 60 + minutes;
}

export function enumerateDateKeys(startsOn, endsOn) {
	const startParts = parseDateKey(startsOn);
	const endParts = parseDateKey(endsOn);
	const current = new Date(Date.UTC(startParts.year, startParts.month - 1, startParts.day));
	const end = new Date(Date.UTC(endParts.year, endParts.month - 1, endParts.day));
	const dates = [];

	while (current <= end) {
		dates.push(`${current.getUTCFullYear()}-${`${current.getUTCMonth() + 1}`.padStart(2, '0')}-${`${current.getUTCDate()}`.padStart(2, '0')}`);
		current.setUTCDate(current.getUTCDate() + 1);
	}

	return dates;
}

export function createVietnamTriggerDate(dateKey, timeValue = '00:00') {
	const { year, month, day } = parseDateKey(dateKey);
	const [hour, minute] = String(timeValue || '00:00').split(':').map(Number);
	return new Date(Date.UTC(year, month - 1, day, hour - 7, minute, 0, 0));
}

export function isFutureVietnamDateTime(dateKey, timeValue = '00:00', now = new Date()) {
	const currentDateKey = toVietnamDateKey(now);
	if (dateKey > currentDateKey) {
		return true;
	}
	if (dateKey < currentDateKey) {
		return false;
	}
	return toMinutes(timeValue) > toVietnamMinutes(now);
}