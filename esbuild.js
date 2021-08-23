const esbuild = require('esbuild');
const sassPlugin = require('esbuild-plugin-sass');

esbuild.build({
  minify: true,
  bundle: true,
  target: 'es6',
  plugins: [sassPlugin()],
  outfile: 'dist/app.js',
  entryPoints: ['src/index.tsx'],
}).catch((e) => console.error(e.message));
