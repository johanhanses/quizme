#! /Users/johan/.nvm/versions/node/v18.6.0/bin/node
import { addQuestion, askQuestion } from './lib.js'

const flags = []

process.argv.forEach((arg) => {
  if (/^-/.test(arg)) {
    flags.push(arg.replaceAll('-', ''))
  }
})

if (flags.includes('a') || flags.includes('add')) {
  addQuestion()
} else {
  askQuestion()
}
