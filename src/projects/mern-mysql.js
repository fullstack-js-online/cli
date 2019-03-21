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

const setupMernMysql = async ({ name: projectName }) => {
  const env = {}
  const { port } = await inquirer.prompt([{
    type: 'input',
    name: 'port',
    default: 4001,
    message: 'What port should your project run on ?'
  }])

  env.PORT = port

  const { database_name } = await inquirer.prompt([{
    type: 'input',
    name: 'database_name',
    message: 'Enter the mysql database name'
  }])

  env.DB_DATABASE = database_name

  const { database_username } = await inquirer.prompt([{
    type: 'input',
    name: 'database_username',
    message: 'Enter the mysql database user'
  }])

  env.DB_USERNAME = database_username

  const { database_password } = await inquirer.prompt([{
    default: '',
    type: 'input',
    name: 'database_password',
    message: 'Enter the mysql database user password'
  }])

  env.DB_USER_PASSWORD = database_password

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

  env.TEST_DATABASE_CLIENT = 'mysql2'
  env.TEST_DB_DATABASE = `${env.DB_DATABASE}_test`
  env.TEST_DB_USERNAME = 'root'
  env.TEST_DB_USER_PASSWORD = ''

  env.NODE_ENV = 'development'
  env.DATABASE_CLIENT = 'mysql2'
  env.JWT_SECRET = randomstring.generate(32)
  env.APP_URL = `http://localhost:${env.PORT}`

  const envFileContent = `
PORT=${env.PORT}
NODE_ENV=${env.NODE_ENV}
APP_URL=${env.APP_URL}

DATABASE_CLIENT=${env.DATABASE_CLIENT}
DB_DATABASE=${env.DB_DATABASE}
DB_USERNAME=${env.DB_USERNAME}
DB_USER_PASSWORD=${env.DB_USER_PASSWORD}

TEST_DATABASE_CLIENT=${env.TEST_DATABASE_CLIENT}
TEST_DB_DATABASE=${env.TEST_DB_DATABASE}
TEST_DB_USERNAME=${env.TEST_DB_USERNAME}
TEST_DB_USER_PASSWORD=${env.TEST_DB_USER_PASSWORD}

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
  `)
  spinner = ora('Running migrations ...').start()

  await exec(`cd ${projectName} && npm run migrate`)

  spinner.succeed('Successfully ran migrations.')

  console.log(`

    🎉  ${chalk.blue('Project generated successfully !')}

    🚀  ${chalk.green('Build something amazing.')}

    To run your project, cd into your project and run ${chalk.blue('npm run dev')} or ${chalk.blue('yarn dev')}

  `)
}

module.exports = setupMernMysql
