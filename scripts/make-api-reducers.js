const fs = require('fs');
const path = require('path');

const [, service] = process.argv.find((arg) => arg.includes('--service')).split('=');
const paths = process.argv.filter((arg) => arg.includes('.generated'));

const services = [
  'PROFILE',
  'COGNITO',
  'POST',
  'UPLOAD',
  'LOCALITY',
  'CHAT',
  'POSTBEHAVIOR',
  'CONNECTION',
  'SEARCH',
  'HISTORY',
];

if (!services.includes(service)) {
  throw Error('you should pass a valid service');
}

fs.writeFileSync(path.join(__dirname, service + 'GeneratedPaths.json'), JSON.stringify(paths));

function makeAPIReducers(paths, service) {
  // starts from the package json path.
  const apiPath = `src/redux/${service}_APIs.ts`;

  const APIs = paths.reduce(
    (acc, path) => {
      const importValue = 'src/' + path.split('src/')[1].replace('.ts', '');
      const pathKey = getKey(importValue);

      if (acc.imports[pathKey]) {
        throw new Error(`Duplicate Name:${pathKey}`);
      }
      return {
        imports: {
          ...acc?.imports,
          [`api as ${pathKey}`]: importValue,
        },
        reducers: {
          ...acc?.reducers,
          [`[${pathKey}.reducerPath]`]: `${pathKey}.reducer`,
        },
        middleware: [...acc?.middleware, `${pathKey}.middleware`],
      };
    },
    { imports: {}, reducers: {}, middleware: [] }
  );

  let content = '';
  Object.entries(APIs.imports).forEach(([key, value]) => {
    content += `import { ${key} } from '${value}' \n`;
  });
  content += `export const reducers = { \n`;
  Object.entries(APIs.reducers).forEach(([key, value]) => {
    content += `  ${key}: ${value}, \n`;
  });
  content += `} \n`;
  content += `export const middleware = [${APIs.middleware.join(', ')}]`;

  fs.writeFile(apiPath, content, (err) => {
    if (err) {
      throw new Error(err.message);
    }
  });
}

function getKey(value) {
  function toCamelCase(str) {
    return str
      .replace(/\s(.)/g, function ($1) {
        return $1.toUpperCase();
      })
      .replace(/\s/g, '')
      .replace(/^(.)/, function ($1) {
        return $1.toLowerCase();
      });
  }
  const names = value?.split('/');
  const last = names[names.length - 1];
  return toCamelCase(last?.replace('.generated', 'Api'));
}

makeAPIReducers(paths, service);
