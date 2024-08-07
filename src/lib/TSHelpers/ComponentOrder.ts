export const components: string[] = [
	'BasicInfoTile',
	'GradesTile',
	'MensaTile',
	'CalendarTile',
	'ExamSignupTile',
	'BlockplanTile'
];

export const tileNames: Map<string, string> = new Map([
	['BasicInfoTile', 'Deine Infos'],
	['GradesTile', 'Noten'],
	['ExamSignupTile', 'Prüfungen'],
	['MensaTile', 'Mensa'],
	['CalendarTile', 'Kalender'],
	['BlockplanTile', 'Blockplan']
]);

export function validateComponentOrder(order: string[]): boolean {
	if (
		order.length == components.length &&
		components.every((e) => {
			return order.includes(e);
		})
	) {
		return true;
	} else {
		return false;
	}
}
