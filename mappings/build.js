/* eslint-env node, es6 */

const fs = require('fs')
const path = require('path')
const preferredOrder = '.exports='

function sortHash (mappingTuple) {
  const index = preferredOrder.indexOf(mappingTuple[0])
  if (index > -1) {
    return '\u0000' + String.fromCharCode(index)
  }
  return '\u0020' + mappingTuple[0]
}

function sortFn (a, b) {
  a = sortHash(a)
  b = sortHash(b)
  if (a < b) {
    return -1
  } else if (a > b) {
    return 1
  } else {
    return 0
  }
}

function convertMapping (map) {
  const tuples = []
  for (const key in map) {
    if (key === map[key]) {
      continue
    }
    tuples.push([
      key,
      map[key]
    ])
  }
  tuples.sort(sortFn)
  const keysStr = tuples.map((tuple) => tuple[0]).join('')
  const valuesStr = tuples.map((tuple) => tuple[1]).join('')
  return `\
/* eslint-disable */
// This file is autogenerated, do not edit it by hands
// Use mapping/build.js instead

module.exports = require('./convert')(
  ${JSON.stringify(keysStr)},
  ${JSON.stringify(valuesStr)}
)
`
}

for (const locale of [
  'by',
  'de',
  'es',
  'he',
  'kk',
  'ru',
  'uk'
]) {
  fs.writeFileSync(
    path.resolve(__dirname, '..', `${locale}.js`),
    convertMapping(require(`./${locale}`))
  )
}
