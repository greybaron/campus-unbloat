import { join } from 'path';
import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';
import { skeleton } from '@skeletonlabs/tw-plugin';

export default {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	theme: {
		extend: {
			maxHeight: {
				'safe-screen': 'calc(100dvh - 168px)',
				'safe-screen-with-header': 'calc(100dvh - 226px)' //assuming header is 58px incl. padding and stuff
			}
		},
		screens: {
			sm: '480px',
			md: '640px',
			lg: '820px'
		}
	},
	plugins: [
		forms,
		skeleton({
			themes: {
				preset: [
					{
						name: 'crimson',
						enhancements: true
					}
				]
			}
		})
	]
} satisfies Config;
