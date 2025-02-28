import type { BaseReqData, BaseResData, GlobalReqOptions } from 'async-messenger-js'
import type { ConfigData } from '../../types'
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { BaseAsyncMessenger, listener } from 'async-messenger-js'
import * as vscode from 'vscode'
import { getCurrentWorkspaceFolder } from '../vscode'
import { EnumActionType } from './index.types'

export class WebviewAsyncMessenger extends BaseAsyncMessenger<{
  panel: vscode.WebviewPanel
  context: vscode.ExtensionContext
  uri: vscode.Uri
}> {
  constructor(options: GlobalReqOptions = {}) {
    super(options)
  }

  subscribe() {
    const { panel } = this.ctx!

    /**
     * 收到webview的消息
     */
    const onDidReceiveMessage = async (message: any = {}) => {
      try {
        console.log('onDidReceiveMessage:收到页面消息:', message)
        if (!message || !message.type) {
          return vscode.window.showErrorMessage(`onDidReceiveMessage: 消息异常`, JSON.stringify(message))
        }
        this.onMessage!(message)
      }
      catch (err: any) {
        vscode.window.showErrorMessage(`执行脚本命令异常:`, err.message)
        console.log('onDidReceiveMessage err:', err)
      }
    }

    panel.webview.onDidReceiveMessage(onDidReceiveMessage, panel.webview)

    return () => { }
  }

  request(data: BaseReqData & {
    source: string
  }) {
    const { panel } = this.ctx!
    data.source = 'VSCode'
    return panel?.webview.postMessage(data)
  }

  @listener({ type: 'GetConfig' })
  async GetConfig(data: BaseResData) {
    console.log('WebviewAsyncMessenger GetConfig', data)
    const workspaceFolder = getCurrentWorkspaceFolder()
    if (!workspaceFolder)
      return

    const { uri } = this.ctx!

    const configPath = path.join(workspaceFolder, 'lanhu.config.json')

    if (!existsSync(configPath))
      return vscode.window.showInformationMessage('lanhu.config.json文件不存在')

    const config: ConfigData = JSON.parse(await readFile(configPath, 'utf-8'))

    this.invokeOnly({
      type: EnumActionType.GetConfig,
      requestId: data.responseId,
      data: {
        teamId: config.teamId,
        targetFolder: uri.fsPath,
      },
    })
  }

  @listener()
  async [EnumActionType.StartDownload](data: BaseResData) {
    console.log('WebviewAsyncMessenger StartDownload', data)
  }
}
