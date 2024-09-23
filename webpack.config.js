import path from 'path';
import webpack from 'webpack';

export default {
	mode: 'production',
	entry: './build/index.js',
	target: 'node',
	output: {
		path: path.resolve('build', 'webpack'),
		chunkFormat: 'commonjs'
	},
	plugins: [
		new webpack.optimize.LimitChunkCountPlugin({
			maxChunks: 1
		})
	],
	experiments: {
		topLevelAwait: true
	}
};
