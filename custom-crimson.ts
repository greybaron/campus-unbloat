import type { CustomThemeConfig } from '@skeletonlabs/tw-plugin';

export const customCrimson: CustomThemeConfig = {
	name: 'custom-crimson',
	properties: {
		// =~= Theme Properties =~=
		'--theme-font-family-base': `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
		'--theme-font-family-heading': `system-ui`,
		'--theme-font-color-base': 'var(--color-surface-900)',
		'--theme-font-color-dark': 'var(--color-surface-50)',
		'--theme-rounded-base': '24px',
		'--theme-rounded-container': '24px',
		'--theme-border-base': '1px',
		// =~= Theme On-X Colors =~=
		'--on-primary': '255 255 255',
		'--on-secondary': '255 255 255',
		'--on-tertiary': '0 0 0',
		'--on-success': '0 0 0',
		'--on-warning': '0 0 0',
		'--on-error': '0 0 0',
		'--on-surface': '255 255 255',
		// =~= Theme Colors  =~=
		// primary | #d4163c
		'--color-primary-50': '249 220 226', // #f9dce2
		'--color-primary-100': '246 208 216', // #f6d0d8
		'--color-primary-200': '244 197 206', // #f4c5ce
		'--color-primary-300': '238 162 177', // #eea2b1
		'--color-primary-400': '225 92 119', // #e15c77
		'--color-primary-500': '212 22 60', // #d4163c
		'--color-primary-600': '191 20 54', // #bf1436
		'--color-primary-700': '159 17 45', // #9f112d
		'--color-primary-800': '127 13 36', // #7f0d24
		'--color-primary-900': '104 11 29', // #680b1d
		// secondary | #4685af
		'--color-secondary-50': '227 237 243', // #e3edf3
		'--color-secondary-100': '218 231 239', // #dae7ef
		'--color-secondary-200': '209 225 235', // #d1e1eb
		'--color-secondary-300': '181 206 223', // #b5cedf
		'--color-secondary-400': '126 170 199', // #7eaac7
		'--color-secondary-500': '70 133 175', // #4685af
		'--color-secondary-600': '63 120 158', // #3f789e
		'--color-secondary-700': '53 100 131', // #356483
		'--color-secondary-800': '42 80 105', // #2a5069
		'--color-secondary-900': '34 65 86', // #224156
		// tertiary | #c0b6b4
		'--color-tertiary-50': '246 244 244', // #f6f4f4
		'--color-tertiary-100': '242 240 240', // #f2f0f0
		'--color-tertiary-200': '239 237 236', // #efedec
		'--color-tertiary-300': '230 226 225', // #e6e2e1
		'--color-tertiary-400': '211 204 203', // #d3cccb
		'--color-tertiary-500': '192 182 180', // #c0b6b4
		'--color-tertiary-600': '173 164 162', // #ada4a2
		'--color-tertiary-700': '144 137 135', // #908987
		'--color-tertiary-800': '115 109 108', // #736d6c
		'--color-tertiary-900': '94 89 88', // #5e5958
		// success | #c1dd97
		'--color-success-50': '246 250 239', // #f6faef
		'--color-success-100': '243 248 234', // #f3f8ea
		'--color-success-200': '240 247 229', // #f0f7e5
		'--color-success-300': '230 241 213', // #e6f1d5
		'--color-success-400': '212 231 182', // #d4e7b6
		'--color-success-500': '193 221 151', // #c1dd97
		'--color-success-600': '174 199 136', // #aec788
		'--color-success-700': '145 166 113', // #91a671
		'--color-success-800': '116 133 91', // #74855b
		'--color-success-900': '95 108 74', // #5f6c4a
		// warning | #e4c25e
		'--color-warning-50': '251 246 231', // #fbf6e7
		'--color-warning-100': '250 243 223', // #faf3df
		'--color-warning-200': '248 240 215', // #f8f0d7
		'--color-warning-300': '244 231 191', // #f4e7bf
		'--color-warning-400': '236 212 142', // #ecd48e
		'--color-warning-500': '228 194 94', // #e4c25e
		'--color-warning-600': '205 175 85', // #cdaf55
		'--color-warning-700': '171 146 71', // #ab9247
		'--color-warning-800': '137 116 56', // #897438
		'--color-warning-900': '112 95 46', // #705f2e
		// error | #d27f81
		'--color-error-50': '248 236 236', // #f8ecec
		'--color-error-100': '246 229 230', // #f6e5e6
		'--color-error-200': '244 223 224', // #f4dfe0
		'--color-error-300': '237 204 205', // #edcccd
		'--color-error-400': '224 165 167', // #e0a5a7
		'--color-error-500': '210 127 129', // #d27f81
		'--color-error-600': '189 114 116', // #bd7274
		'--color-error-700': '158 95 97', // #9e5f61
		'--color-error-800': '126 76 77', // #7e4c4d
		'--color-error-900': '103 62 63', // #673e3f
		// surface | #2D2D2D
		'--color-surface-50': '224 224 224', // #e0e0e0
		'--color-surface-100': '213 213 213', // #d5d5d5
		'--color-surface-200': '203 203 203', // #cbcbcb
		'--color-surface-300': '171 171 171', // #ababab
		'--color-surface-400': '108 108 108', // #6c6c6c
		'--color-surface-500': '45 45 45', // #2D2D2D
		'--color-surface-600': '41 41 41', // #292929
		'--color-surface-700': '34 34 34', // #222222
		'--color-surface-800': '27 27 27', // #1b1b1b
		'--color-surface-900': '22 22 22' // #161616
	}
};
