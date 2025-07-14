import esbuild from 'esbuild'

esbuild.build({
  entryPoints: ['src/index.ts', 'src/tokenInfo.ts', 'src/contractType.ts'],
  bundle: true,
  // minify: true,
  platform: 'node',
  // format: 'esm',
  outdir: 'dist',
  loader: {
    '.gql': 'text',
  },
})
