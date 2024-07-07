import { json } from '@sveltejs/kit';

export async function GET({ cookies }) {
	const token = cookies.get('jwt');

	if (!token) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const response = await fetch(`${import.meta.env.VITE_API_URL}/get_grades`, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});

	if (!response.ok) {
		return json({ error: 'Failed to fetch grades' }, { status: response.status });
	}

	const grades = await response.json();
	return json(grades);
}
