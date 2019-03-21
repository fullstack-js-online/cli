#!/usr/bin/env node

/*
 * @fullstackjs/cli
 *
 * (c) Kati Frantz <frantz@fullstackjs.online>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const ora = require('ora')
const util = require('util')
const chalk = require('chalk')
const program = require('commander')
const inquirer = require('inquirer')
const setupMernMysql = require('./projects/mern-mysql')
const setupMernMongodb = require('./projects/mern-mongodb')
const exec = util.promisify(require('child_process').exec)

const results = {}
const projects = {
  'MERN - MySQL': 'https://github.com/fullstack-js-online/fullstack-js-mern',
  'MERN - MongoDB': 'https://github.com/fullstack-js-online/fullstack-js-mern-mongodb' 
}

const selectProject = () => inquirer.prompt([{
  type: 'list',
  name: 'project',
  choices: ['MERN - MySQL', 'MERN - MongoDB'],
  message: 'What full stack project do you want to initialize ?',
}]).then(selected => {
  results.project = selected.project
})

const provideProjectName = () => inquirer.prompt([{
  type: 'input',
  name: 'name',
  message: 'What is the name of your project ?',
}]).then(input => {
  results.name = input.name
})

const cloneRepository = async () => await exec(`git clone ${projects[results.project]} ${process.cwd()}/${results.name}`)

const installDependencies = async () => {
  try {
    await exec(`cd ${results.name} && npm install`)

    return true
  } catch (e) {
    return false
  }
}

program.command('init')
  .alias('i')
  .description('Initialize a new fullstack javascript project')
  .action(() => {
    console.log(`
        🚀    ${chalk.blue('Let\'s launch your new fullstackjs project !')}
    `)
  })
  .action(async () => {
    await selectProject()
    await provideProjectName()
    console.log(`
    `)
    let spinner = ora(`Sit back and relax . We're cloning the ${results.project} starter project ...`).start()

    await cloneRepository()
    spinner.succeed('Successfully cloned repository.')

    console.log(`
    `)

    spinner = ora(`Installing dependencies. You might need a coffee for this one. ☕`).start()

    let isSuccessful = await installDependencies()

    if (!isSuccessful) {
      return spinner.fail('Oops. Failed to install dependencies for some reason. You\'ll have to do it manually. 😭')
    }

    // get the environment variables for this project.

    spinner.succeed('Successfully installed dependencies.')

    switch (results.project) {
      case 'MERN - MySQL':
        await setupMernMysql(results)
        return
      case 'MERN - MongoDB':
        await setupMernMongodb(results)
        return
      default:
        break;
    }
  })

program.parse(process.argv)
