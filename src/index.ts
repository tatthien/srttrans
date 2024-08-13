#!/usr/bin/env node

import { Command } from 'commander'
import fs from 'node:fs'
import { stringifySync, parseSync } from 'subtitle'
import { AnthropicTranslator } from './translator';

const program = new Command()

// @TODO: move to utils
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const translator = new AnthropicTranslator()

program
  .command('translate')
  .description('Translate an SRT file')
  .argument('<path>', 'path to SRT file')
  .option('-s, --source <string>', 'source language')
  .option('-t, --target <string>', 'target language')
  .action(async (path, options) => {
    const chunkSize = 50
    const input = fs.readFileSync(path, 'utf-8')
    const nodes = parseSync(input)
    console.log(`Total nodes: ${nodes.length}`)

    for (let i = 0; i < nodes.length; i += chunkSize) {
      console.log(`Translating chunk ${i} to ${i + chunkSize}`)
      const chunk = nodes.slice(i, i + chunkSize)
      const text = chunk.map(node => node.type === 'cue' ? node.data.text : '').join('%%%')
      const translatedText = await translator.translate({
        text,
        source: options.source || 'english',
        target: options.target || 'vietnamese'
      })

      const translatedTextArr = translatedText.split('%%%')

      for (const [index, node] of chunk.entries()) {
        if (node.type === 'cue') {
          node.data.text = translatedTextArr[index]
        }
      }

      await sleep(1200)
    }
    const output = stringifySync(nodes, { format: 'SRT' })
    fs.writeFileSync(path.replace('.srt', '-translated.srt'), output)
  });

program.parse(process.argv);
