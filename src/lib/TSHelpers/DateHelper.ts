function getFormattedDate(date: Date): string {
	const year = date.getFullYear();
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const day = date.getDate().toString().padStart(2, '0');
	return `${year}-${month}-${day}`;
}

function getNextMonday(date: Date): Date {
	const day = date.getDay();
	const daysToAdd = day === 0 ? 1 : 7 - day + 1;
	date.setDate(date.getDate() + daysToAdd);
	return date;
}

export function getNextWeekday(): Date {
	const today = new Date();
	const day = today.getDay();

	if (day === 6 || day === 0) {
		// Saturday or Sunday
		return getNextMonday(today);
	}

	return today;
}

export function getNextWeekdayString(): string {
	return getFormattedDate(getNextWeekday());
}

export function convertToBerlinTime(dateUTC: Date): Date {
	const options: Intl.DateTimeFormatOptions = {
		timeZone: 'Europe/Berlin',
		year: 'numeric',
		month: 'numeric',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric',
		hour12: false
	};

	const formatter = new Intl.DateTimeFormat('de-DE', options);
	const parts = formatter.formatToParts(dateUTC);

	const year = parseInt(parts.find((p) => p.type === 'year')?.value || '0', 10);
	const month = parseInt(parts.find((p) => p.type === 'month')?.value || '0', 10) - 1; // Monate sind 0-basiert
	const day = parseInt(parts.find((p) => p.type === 'day')?.value || '0', 10);
	const hour = parseInt(parts.find((p) => p.type === 'hour')?.value || '0', 10);
	const minute = parseInt(parts.find((p) => p.type === 'minute')?.value || '0', 10);
	const second = parseInt(parts.find((p) => p.type === 'second')?.value || '0', 10);

	return new Date(year, month, day, hour, minute, second);
}
