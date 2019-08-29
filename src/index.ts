import recursive from 'recursive-readdir'
import os from 'os'
import fs from 'fs'

const readline = require('readline-promise').default
const homedir = `${os.homedir()}/Code/cazana/trade-portal/src`

const getComponents = async () => {
  const files = await recursive(homedir, ['!*.vue'])
  return files.map(file => {
    const name = file.match(/.+(\/.+)\.vue$/)
    return name ? name[1] : ''
  })
}

const getFiles = async () => {
  return recursive(homedir, ['!*.{js,ts,vue}'])
}

const getImports = (file: string, onLine: any) => {
  const reader = readline.createInterface({
    input: fs.createReadStream(file),
    crlfDelay: Infinity
  })

  reader.on('line', onLine)

  return new Promise(resolve => reader.on('close', resolve))
}

const init = async () => {
  try {
    // get .vue file names
    const components = await getComponents()

    // get .{js|ts|vue} source files
    const files = await getFiles()

    // extract imports from source files
    const lines: string[] = []
    await Promise.all(
      files.map(async file => {
        await getImports(file, (line: string) => {
          const isImport = line.includes('import')
          if (isImport) {
            lines.push(line)
          }
        })
      })
    )

    // find components within  source files
    const matches: string[] = []
    lines.forEach((source: string) => {
      components.forEach((component: string) => {
        const isMatch = source.includes(component)
        if (isMatch) {
          matches.push(component)
        }
      })
    })

    // dedupe component imports
    const unique = Array.from(new Set(matches))

    // compare original list to matches
    const unused = [
      ...components.filter(x => !unique.includes(x)),
      ...unique.filter(x => !components.includes(x))
    ].map(value => value.trim().split('/')[1])

    return unused
  } catch (err) {
    throw err
  }
}

init()
