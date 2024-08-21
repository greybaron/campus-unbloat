import { getDiffInDays, padIt } from '$lib/TSHelpers/DateHelper';
import type { Event, EventUnix } from '$lib/types';

export function unixEventsToEvents(uEvents: Array<EventUnix>): Array<Event> {
	const events: Event[] = [];

	uEvents.forEach((event) => {
		events.push({
			start: new Date(event.start),
			end: new Date(event.end),
			title: event.title,
			textColor: event.textColor,
			instructor: event.instructor,
			room: event.room,
			remarks: event.remarks,
			color: event.color
		});
	});

	return events;
}

export function getCurrentEvents(events: Event[], targetDate = new Date()): Array<Event> {
	// Setze Uhrzeit auf 0:00:00, um nur das Datum zu vergleichen
	targetDate.setHours(0, 0, 0, 0);

	return events.filter((event) => {
		const eventStart = new Date(event.start);
		eventStart.setHours(0, 0, 0, 0);

		return eventStart.getTime() === targetDate.getTime();
	});
}

export function getAltNoEventString(selectedDate: Date): string {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	selectedDate.setHours(0, 0, 0, 0);

	const diffInDays = getDiffInDays(selectedDate, today);

	const weekDays = [
		'Sonntag',
		'Montag',
		'Dienstag',
		'Mittwoch',
		'Donnerstag',
		'Freitag',
		'Samstag'
	];

	if (diffInDays < -1) {
		return `Am ${weekDays[selectedDate.getDay()]}, dem ${padIt(String(selectedDate.getDate()))}.${padIt(String(selectedDate.getMonth() + 1))}., fand keine Vorlesung statt! 🚀`;
	} else if (diffInDays == -1) {
		return 'Gestern fand keine Vorlesung statt! 🚀';
	} else if (diffInDays == 0) {
		return 'Heute findet keine Vorlesung statt! 🚀';
	} else if (diffInDays == 1) {
		return 'Morgen findet keine Vorlesung statt! 🚀';
	} else {
		return `Am ${weekDays[selectedDate.getDay()]}, dem ${padIt(String(selectedDate.getDate()))}.${padIt(String(selectedDate.getMonth() + 1))}., findet keine Vorlesung statt! 🚀`;
	}
}
