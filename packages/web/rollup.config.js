import typescript from 'rollup-plugin-typescript2'
import babel from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import del from 'rollup-plugin-delete'
import serve from 'rollup-plugin-serve'
import { resolve } from 'path'
import { terser } from 'rollup-plugin-terser'
import cleanup from 'rollup-plugin-cleanup'

import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
const __dirname = dirname(fileURLToPath(import.meta.url))

export default {
	input: 'src/index.ts',
	plugins: [
		nodeResolve({
			browser: true,
		}),
		typescript({
			tsconfig: './tsconfig.json',
		}),
		babel({
			exclude: 'node_modules/**',
		}),
		del({ targets: 'dist/*' }),
		serve({
			port: '8080',
			openPage: '/index.html',
		}),
		terser(),
		cleanup(),
	],
	output: [
		{
			format: 'es',
			file: resolve(__dirname, './dist/index.esm.js'),
		},
		{
			format: 'cjs',
			file: resolve(__dirname, './dist/index.cjs.js'),
		},
		{
			format: 'umd',
			file: resolve(__dirname, './dist/index.js'),
			name: 'fsnet',
		},
	],
}
