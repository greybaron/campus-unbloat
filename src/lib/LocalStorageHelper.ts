import { writable } from 'svelte/store';

export function persistentStore(key: string, initial: unknown) {
	const storedValue = localStorage.getItem(key);
	const initialValue = storedValue ? JSON.parse(storedValue) : initial;
	const store = writable(initialValue);

	store.subscribe((value) => {
		localStorage.setItem(key, JSON.stringify(value));
	});

	return store;
}
