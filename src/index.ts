import { defineExtension } from 'reactive-vscode'
import * as vscode from 'vscode'
import imageDownload from './commands/imageDownload'
import openWebview from './commands/openWebview'

const { activate, deactivate } = defineExtension((context) => {
  const openWebviewCommand = vscode.commands.registerCommand(
    'extension.dirge.open-webview',
    (uri: vscode.Uri) => {
      openWebview(context, uri)
    },
  )

  console.warn('vscode.env.appRoot:', vscode.env.appRoot)

  context.subscriptions.push(openWebviewCommand)
})

export { activate, deactivate }
