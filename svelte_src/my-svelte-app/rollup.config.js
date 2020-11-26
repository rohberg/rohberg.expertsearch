import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import serve from 'rollup-plugin-serve'
import svelte from 'rollup-plugin-svelte';
import { terser } from 'rollup-plugin-terser';

const production = !process.env.ROLLUP_WATCH;

export default {
    input: 'src/main.js',
    output: {
        sourcemap: true,
        format: 'iife',
        name: 'my_svelte_app',
        file: '../../src/rohberg/expertsearch/svelte_apps/my-svelte-app/bundle.js'
    },
    plugins: [
        svelte({
            /// enables compiling to native customElement (webcomponent):
            customElement: false,
            // enable run-time checks when not in production
            dev: !production,
            // we'll extract any component CSS out into
            // a separate file - better for performance
            css: css => {
                css.write('bundle.css');
            }
        }),

        // If you have external dependencies installed from
        // npm, you'll most likely need these plugins. In
        // some cases you'll need additional configuration -
        // consult the documentation for details:
        // https://github.com/rollup/plugins/tree/master/packages/commonjs
        resolve({
            browser: true,
            dedupe: ['svelte']
        }),
        commonjs(),

        // In dev mode, call `npm run start` once
        // the bundle has been generated
        !production && serve({
          contentBase: '../../src/rohberg/expertsearch/svelte_apps/my-svelte-app',
          open: true
        }),

        // Watch the `public` directory and refresh the
        // browser on changes when not in production
        !production && livereload({
          verbose: false,
          watch: '../../src/rohberg/expertsearch/svelte_apps/my-svelte-app'
        }),

        // If we're building for production (npm run build
        // instead of npm run dev), minify
        production && terser(),
        
        replace({
            // two level deep object should be stringified
            __myapp: JSON.stringify({
              env: {
                isProd: production,          
                API_URL: process.env.API_URL,
                PORTAL_TYPE: process.env.PORTAL_TYPE
              }
            }),
          }),
    ],
    watch: {
        clearScreen: false
    }
};
