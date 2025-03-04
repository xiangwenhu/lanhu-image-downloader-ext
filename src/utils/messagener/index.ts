import type { BaseReqData, BaseResData, GlobalReqOptions } from 'async-messenger-js'
import type { ConfigData } from '../../types'
import type { BinDownloadOptions, DownloadOptions } from './index.types'
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { BaseAsyncMessenger, listener } from 'async-messenger-js'
import { downloadByOptions } from 'lanhu-image-downloader'
import * as vscode from 'vscode'
import { TerminalLogger } from '../terminal'
import { getCurrentWorkspaceFolder } from '../vscode'
import { EnumActionType } from './index.types'
import { optionsToEnv } from './util'

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
  async [EnumActionType.StartDownload](data: BaseResData<DownloadOptions>) {
    console.log('WebviewAsyncMessenger StartDownload', data)

    const { context } = this.ctx!

    const workspaceFolder = getCurrentWorkspaceFolder()!
    const configPath = path.join(workspaceFolder, 'lanhu.config.json')

    const options: BinDownloadOptions = {
      ...data.data!,
      configFilePath: configPath,
    } as any
    // downloadByOptions(options)

    // const cmdPath = path.join(context.extensionPath, '/dist/cmd')
    console.log('options:', options)

    const envObj = optionsToEnv(options)

    console.log('envObj:', envObj)

    const terminal = new TerminalLogger({
      // cwd: cmdPath,
      env: envObj,
      name: 'LanHu-Image-Downloader',
    })

    const scriptPath = path.join(context.extensionPath, '/node_modules/lanhu-image-downloader/dist/bin/index.js')
    // const scriptPath = path.join(context.extensionPath, '/dist/cmd/index.js')
    console.log('scriptPath:', scriptPath)
    terminal.send(`node ${scriptPath}`)
  }
}
