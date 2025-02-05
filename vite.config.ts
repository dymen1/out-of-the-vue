import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

const src = resolve(__dirname, 'src');
const test = resolve(__dirname, 'test');
const snapshots = resolve(__dirname, 'snapshots');

export default defineConfig({
    plugins: [ vue() ],
    resolve: {
        alias: { '@': src, '@test': test }
    },
    test: {
        resolveSnapshotPath: (testPath, snapExtension) => `${ snapshots }/${ testPath }${ snapExtension }`
    }
});
