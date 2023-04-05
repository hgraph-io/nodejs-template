import esbuild from 'esbuild'

esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  // minify: true,
	platform: 'node',
  // format: 'esm',
  outdir: 'dist',
  loader: {
    '.gql': 'text',
  },
})
