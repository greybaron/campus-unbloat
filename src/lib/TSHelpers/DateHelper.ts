export function getDateAsUrlParam(date: Date): string {
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

export function getAltDayString(selectedDate: Date): string {
	// date is guaranteed to not be today
	const today = new Date();

	// get day difference
	const diff = selectedDate.getDate() - today.getDate();
	switch (diff) {
		case -2:
			return 'Vorgestern';
		case -1:
			return 'Gestern';
		case 1:
			return 'Morgen';
		case 2:
			return 'Übermorgen';
		default:
			return `${String(selectedDate.getDate()).padStart(2, '0')}.${String(selectedDate.getMonth() + 1).padStart(2, '0')}.`;
	}
}

export function inThirteenWeeks() {
	const date = new Date();
	date.setDate(date.getDate() + 13 * 7); // 13 weeks ≙ 1 semester
	return date;
}

export function dateIsToday(date: Date): boolean {
	const today = new Date();
	return (
		date.getDate() === today.getDate() &&
		date.getMonth() === today.getMonth() &&
		date.getFullYear() === today.getFullYear()
	);
}
