import { defineExtension } from 'reactive-vscode'
import * as vscode from 'vscode'
import openWebview from './commands/openWebview'
import terminal from './utils/terminal'

const { activate, deactivate } = defineExtension((context) => {
  const openWebviewCommand = vscode.commands.registerCommand(
    'extension.dirge.open-webview',
    (uri: vscode.Uri) => {
      openWebview(context, uri)
    },
  )

  console.warn('vscode.env.appRoot:', vscode.env.appRoot)

  context.subscriptions.push(openWebviewCommand)

  terminal.sendText('\\x1b[31m这是红色文本\\x1b[0m')

  terminal.log('log你们好啊')

  terminal.info('info你们好啊')

  terminal.warn('warn你们好啊')
  terminal.error('error你们好啊')
})

export { activate, deactivate }
