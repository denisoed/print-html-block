import { rollup } from 'rollup';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const name = 'printMe';
const input = 'index.js';
const external = ['jquery'];
const globals = { jquery: 'jQuery' };

export default [
  {
    input,
    output: { file: pkg.module, format: 'es' },
    external,
    plugins: [terser()]
  },
  {
    input,
    output: { file: pkg.main, format: 'umd', name, sourcemap: true, globals },
    external,
    plugins: [terser()]
  },
  {
    input,
    output: { file: pkg.browser, format: 'umd', name, sourcemap: true, globals },
    external,
    plugins: [terser()]
  }
];
