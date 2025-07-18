import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'node_modules/docx/dist/index.mjs',
  output: {
    file: 'conversor/js/docx.umd.js',
    format: 'umd',
    name: 'docx'
  },
  plugins: [resolve()]
}; 