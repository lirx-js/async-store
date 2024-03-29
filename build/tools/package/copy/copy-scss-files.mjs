import { join, resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createDirectory, exploreDirectory, copyFile } from '../../misc/fs-helpers.mjs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT_PATH = resolve(join(__dirname, '../../../../'));
const SRC_PATH = join(ROOT_PATH, 'src');
const DIST_PATH = join(ROOT_PATH, 'dist');
const DIST_ESM_PATH = join(DIST_PATH, 'src');

function copyScssFiles() {
  return exploreDirectory(SRC_PATH, (entryPath, entry) => {
    const name = entry.name;
    if (
      entry.isFile()
      && (
        name.endsWith('variables.scss')
        || name.endsWith('functions.scss')
        || name.endsWith('mixins.scss')
        || (/^_(.*)\.scss$/).test(name)
      )
    ) {
      const destPath = join(DIST_ESM_PATH, relative(SRC_PATH, entryPath));
      return createDirectory(dirname(destPath))
        .then(() => {
          return copyFile(entryPath, destPath);
        });
    }
  });
}


copyScssFiles()
  .catch((error) => {
    console.error(error);
  });


