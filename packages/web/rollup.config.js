import typescript from 'rollup-plugin-typescript2'

export default {
	input: 'src/index.ts',
	plugins: [
		typescript({
			tsconfig: './tsconfig.json',
		}),
	],
	output: [
		{
			format: 'es',
			file: 'dist/lib/index.esm.js',
		},
	],
}
