const fs = require('fs-extra')
const path = require('path')
const inquirer = require('inquirer')

const Generator = require('./Generator')

module.exports = async function (name, options) {
  // 验证是否正常取到值
  console.log('>>> create.js', name, options)

  // 当前命令行选择的目录
  const cwd = process.cwd()
  // 需要创建的目录地址
  const targetAir = path.join(cwd, name)

  // 目录是否已经存在？
  if (fs.existsSync(targetAir)) {
    // 是否为强制创建？
    if (options.force) {
      await fs.remove(targetAir)
    } else {
      // TODO：询问用户是否确定要覆盖

      const { action } = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: 'Target directory already exists Pick an action:',
          choices: [
            {
              name: 'Overwrite',
              value: 'overwrite',
            },
            {
              name: 'Cancel',
              value: false,
            },
          ],
        },
      ])

      if (!action) return

      if (action === 'overwrite') {
        console.log('\r\nRemoving...')

        await fs.remove(targetAir)
      }
    }
  }

  // 开始创建项目
  const generator = new Generator(name, targetAir)
  generator.create()
}
