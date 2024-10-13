import adapterAuto from '@sveltejs/adapter-auto'
import adapterNode from '@sveltejs/adapter-node'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: getAdapter()
	},
	preprocess: [vitePreprocess()],
	vitePlugin: {
		hot: {
			preserveLocalState: true
		}
	}
};

function getAdapter() {
	const env = process.env.NODE_ENV || 'development'

	if (env === 'production') {
		return adapterNode({
			out: 'build',
			precompress: true,  // Optimize for production
		})
	} else {
		// Default for local development or other environments
		return adapterAuto()
	}
}

export default config
