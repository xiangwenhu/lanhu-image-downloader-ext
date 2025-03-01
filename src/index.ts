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

  terminal.log('你们好啊')
})

export { activate, deactivate }
