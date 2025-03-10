import { existsSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { defineExtension } from 'reactive-vscode'
import * as vscode from 'vscode'
import openWebview from './commands/openWebview'
import { getCurrentWorkspaceFolder } from './utils/vscode'

console.log('process.env.NODE_ENV:', process.env.NODE_ENV)

const { activate, deactivate } = defineExtension((context) => {
  const openWebviewCommand = vscode.commands.registerCommand(
    'extension.dirge.open-webview',
    (uri: vscode.Uri) => {
      const workspaceFolder = getCurrentWorkspaceFolder()
      if (!workspaceFolder)
        return vscode.window.showErrorMessage('未打开任何工作区')

      const configPath = path.join(workspaceFolder, 'lanhu.config.json')
      if (!existsSync(configPath)) {
        return vscode.window.showErrorMessage('当前工作区下未配置lanhu.config.json')
      }

      openWebview(context, uri)
    },
  )

  console.warn('vscode.env.appRoot:', vscode.env.appRoot)

  context.subscriptions.push(openWebviewCommand)
})

export { activate, deactivate }
