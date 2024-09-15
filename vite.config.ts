import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { fontawesomeSubset } from 'fontawesome-subset';
import { resolve } from 'path';
import { promises as fs } from 'fs';

async function copyFontAwesome() {
	try {
		const sourcePath = resolve(
			'node_modules',
			'@fortawesome/fontawesome-free',
			'css',
			'all.min.css'
		);

		const destinationPath = resolve('src', 'lib', 'fonts', 'css', 'all.min.css');

		// Ensure the destination directory exists
		await fs.mkdir(resolve('src', 'lib', 'fonts', 'css'), { recursive: true });

		// copy fontawesome min css (so that relative paths dont point to node_modules)
		await fs.copyFile(sourcePath, destinationPath);

		console.log('fontawesome all.min.cs copied to', destinationPath);
	} catch (error) {
		console.error('Error copying FontAwesome CSS:', error);
	}
}

export default defineConfig({
	plugins: [
		sveltekit(),
		purgeCss(),
		{
			name: 'faSubset',
			buildStart: async () => {
				fontawesomeSubset(
					{
						solid: [
							'xmark',
							'up-right-and-down-left-from-center',
							'check',
							'rotate-right',
							'arrow-left',
							'arrow-right',
							'info-circle',
							'calendar',
							'info',
							'plus',
							'flask-vial',
							'leaf',
							'egg',
							'drumstick-bite',
							'burger',
							'fish',
							'mortar-pestle',
							'carrot',
							'square-plus',
							'wheelchair-move',
							'utensils',
							'recycle',
							'user-tie',
							'bars',
							'coins',
							'chart-column',
							'circle-arrow-right',
							'right-from-bracket',
							'up-down-left-right',
							'bell',
							'pen',
							'ban',
							'question',
							'square-pen',
							'square-check'
						],
						regular: ['_'],
						brands: ['github']
					},
					'src/lib/fonts/webfonts'
				);
				await copyFontAwesome();
			}
		}
	]
});
