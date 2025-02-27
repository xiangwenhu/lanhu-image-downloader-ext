import path from 'node:path'
import * as vscode from 'vscode'
import { WebviewAsyncMessenger } from '../utils/messagener'
import { createWeViewContentFormUrl } from '../utils/webview'

let panel: vscode.WebviewPanel | undefined
// const rootPath = vscode.workspace.workspaceFolders![0].uri.fsPath || '.'

/**
 * 打开webview
 * @param context
 * @param uri
 * @returns
 */
export default async function openWebview(
  context: vscode.ExtensionContext,
  uri: vscode.Uri,
) {
  console.info('context:', context)
  if (panel) {
    vscode.window.showInformationMessage(`蓝湖图片下载页面 已经打开`)
    panel.webview.postMessage({
      type: 'init',
      data: {
        targetFolder: uri.fsPath,
      },
    })
    return
  }
  try {
    console.info('openWebview:', uri.fsPath)
    // 创建webview
    panel = vscode.window.createWebviewPanel(
      'lanhu-image-download', // viewType
      '蓝湖下载选项', // 视图标题
      vscode.ViewColumn.One, // 显示在编辑器的哪个部位
      {
        enableScripts: true, // 启用JS，默认禁用
        retainContextWhenHidden: true, // webview被隐藏时保持状态，避免被重置
      },
    )

    // 获取当前扩展的根目录路径
    // const extensionPath = context.extensionPath

    // 生产使用： 构造本地 HTML 文件的完整路径
    // const htmlFilePath = '/dist/htmls/index.html'
    // const htmlContent = getWebViewContent(context, htmlFilePath, panel);

    const htmlFilePath = '/dist/htmls/proxy.html'
    // const htmlContent = getWebViewContent(context, htmlFilePath, panel)
    const resourcePath = path.join(context.extensionPath, htmlFilePath)
    const htmlContent = await createWeViewContentFormUrl(resourcePath, { $$url: 'http://localhost:5173' })

    console.log('htmlContent:', htmlContent)
    // 设置 Webview 的 HTML 内容
    panel.webview.html = htmlContent

    let messenger = new WebviewAsyncMessenger({
      autoGenerateRequestId: false,
    })
    messenger.setContext({
      panel,
      context,
      uri,
    })

    messenger.activate()

    panel.onDidDispose(() => {
      panel = undefined
      messenger.setContext(undefined as any)
      // @ts-ignore
      messenger = undefined
    })

    // panel.webview.onDidReceiveMessage(onDidReceiveMessage, panel.webview)
  }
  catch (err: any) {
    vscode.window.showErrorMessage(`extension.demo.openWebview error:`, err.message)
    console.log('extension.demo.openWebview error', err)
  }
}
