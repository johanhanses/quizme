import inquirer from 'inquirer'
import fs from 'node:fs/promises'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataFile = join(__dirname, 'data.json')

export async function addQuestion() {
  console.log("Hello, let's add a new question!")
  const responses = await inquirer.prompt([
    {
      type: 'input',
      name: 'targetQuestion',
      message: 'What is your question?'
    },
    { type: 'input', name: 'targetAnswer', message: 'What is your answer?' }
  ])
  console.log(responses)

  const data = await fs.readFile(dataFile)
  const parsedData = JSON.parse(data.toString())

  parsedData.push({
    id: getId(parsedData),
    question: responses.targetQuestion,
    answer: responses.targetAnswer
  })

  await fs.writeFile(dataFile, JSON.stringify(parsedData))
}

export async function askQuestion() {
  const data = await fs.readFile(dataFile)
  const parsedData = JSON.parse(data.toString())
  const target = parsedData[Math.floor(Math.random() * parsedData.length)]
  const { question, answer } = target

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'useranswer',
      message: question
    }
  ])

  target.lastAnsweredCorrect = await checkAnswer(answers.useranswer, answer)
  target.lastAsked = Date.now().toString()

  const newData = parsedData.filter((q) => q.id !== target.id)
  newData.push(target)

  await fs.writeFile(dataFile, JSON.stringify(newData))
}

async function checkAnswer(input, answer) {
  console.log(`You answered ${input}.`)
  console.log(`The actual answer is: ${answer}`)

  const response = await inquirer.prompt([
    {
      message: 'Did you get it right?',
      name: 'check',
      type: 'confirm'
    }
  ])

  return response.check
}

function getId(data) {
  return Math.max(...data.map((d) => d.id)) + 1
}
