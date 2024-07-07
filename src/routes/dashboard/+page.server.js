export function load({ cookies }) {
	const user_basic = cookies.get('user_basic');

	return {
		user_basic
	};
}
