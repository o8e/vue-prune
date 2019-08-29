#!/usr/bin/env node

import recursive from 'recursive-readdir'
import readline from 'readline'
import fs from 'fs'

const dir = './'

const getComponents = async () => {
  const files = await recursive(dir, ['!*.vue'])
  return files.map(file => {
    const name = file.match(/.+(\/.+)\.vue$/)
    return name ? name[1] : ''
  })
}

const getFiles = async () => {
  return recursive(dir, ['!*.{js,ts,vue}'])
}

const getImports = (file: string, onLine: any) => {
  const reader = readline.createInterface({
    input: fs.createReadStream(file),
    crlfDelay: Infinity
  })

  reader.on('line', onLine)

  return new Promise(resolve => reader.on('close', resolve))
}

const run = async () => {
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

    console.log(unused)
  } catch (err) {
    throw err
  }
}

run()
