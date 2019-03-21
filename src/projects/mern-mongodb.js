/*
 * @fullstackjs/cli
 *
 * (c) Kati Frantz <frantz@fullstackjs.online>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const fs = require('fs')
const ora = require('ora')
const path = require('path')
const util = require('util')
const chalk = require('chalk')
const rimraf = require('rimraf')
const inquirer = require('inquirer')
const randomstring = require('randomstring')
const exec = util.promisify(require('child_process').exec)

const setupMernMongodb = async ({ name: projectName }) => {
  const env = {}
  const { port } = await inquirer.prompt([{
    type: 'input',
    name: 'port',
    default: 4001,
    message: 'What port should your project run on ?'
  }])

  env.PORT = port

  const { database_url } = await inquirer.prompt([{
    type: 'input',
    name: 'database_url',
    message: 'Enter the mongodb connection uri'
  }])

  env.DATABASE_URL = database_url

  const { mail_host } = await inquirer.prompt([{
    type: 'input',
    name: 'mail_host',
    default: 'smtp.mailtrap.io',
    message: 'Enter the smtp mail host'
  }])

  env.MAIL_HOST = mail_host

  const { mail_port } = await inquirer.prompt([{
    type: 'input',
    default: 2525,
    name: 'mail_port',
    message: 'Enter the smtp mail port'
  }])

  env.MAIL_PORT = mail_port

  const { mail_username } = await inquirer.prompt([{
    default: '',
    type: 'input',
    name: 'mail_username',
    message: 'Enter the smtp mail username'
  }])

  env.MAIL_USERNAME = mail_username

  const { mail_password } = await inquirer.prompt([{
    default: '',
    type: 'input',
    name: 'mail_password',
    message: 'Enter the smtp mail password'
  }])

  env.MAIL_PASSWORD = mail_password

  env.NODE_ENV = 'development'
  env.JWT_SECRET = randomstring.generate(32)
  env.APP_URL = `http://localhost:${env.PORT}`

  const envFileContent = `
PORT=${env.PORT}
NODE_ENV=${env.NODE_ENV}
APP_URL=${env.APP_URL}

DATABASE_URL=${env.DATABASE_URL}

MAIL_FROM=
MAIL_PORT=${env.MAIL_PORT}
MAIL_HOST=${env.MAIL_HOST}
MAIL_USERNAME=${env.MAIL_USERNAME}
MAIL_PASSWORD=${env.MAIL_PASSWORD}

JWT_SECRET=${env.JWT_SECRET}
`

  console.log(`
  `)
  let spinner = ora('Creating environment file ...').start()

  fs.writeFileSync(path.resolve(process.cwd(), projectName, '.env'), envFileContent)

  rimraf.sync(path.resolve(process.cwd(), projectName, '.git'))

  spinner.succeed('Successfully created environment file.')

  console.log(`

    🎉  ${chalk.blue('Project generated successfully !')}

    🚀  ${chalk.green('Build something amazing.')}

    To run your project, cd into your project and run ${chalk.blue('npm run dev')} or ${chalk.blue('yarn dev')}

  `)
}

module.exports = setupMernMongodb
