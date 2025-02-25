import { readFileSync } from 'node:fs'
import path from 'node:path'
import * as vscode from 'vscode'

/**
 * 使用正则表达式替换 HTML 内容中的 script 和 link 标签的 src 和 href 属性。
 *
 * @param htmlContent - 原始 HTML 内容。
 * @param webview - VS Code 的 WebView 实例。
 * @param extensionPath - 扩展的根目录路径。
 * @returns 替换后的 HTML 内容。
 */
export function replaceResourcePaths(htmlContent: string, webview: vscode.Webview, extensionPath: string): string {
  // 定义正则表达式来匹配 <script> 和 <link> 标签中的 src 和 href 属性
  const resourceRegex = /(<(?:script|link)[^>]+(?:src|href)=")([^"]+)(")/gi

  const result = htmlContent.replace(resourceRegex, (match, p1, p2, p3) => {
    // 如果资源路径是以 http 或 https 开头，则不替换
    if (p2.startsWith('http://') || p2.startsWith('https://')) {
      return match
    }

    const absPath = path.join(extensionPath, p2)
    // 构造对应的 vscode.Uri 对象，并通过 webview.asWebviewUri 方法将其转换为可以在 WebView 中使用的安全 URI
    const resourcePath = vscode.Uri.file(absPath).with({ scheme: 'vscode-resource' })
    // const url = `${p1}${webview.asWebviewUri(resourcePath)}${p3}`
    const url = `${p1}${resourcePath}${p3}`
    return url
  })

  return result
}

/**
 * https://code.visualstudio.com/api/extension-guides/webview
 * @param context
 * @param templatePath
 * @param panel
 * @returns
 */
export function getWebViewContent(context: vscode.ExtensionContext, templatePath: string, panel: vscode.WebviewPanel) {
  const resourcePath = path.join(context.extensionPath, templatePath)
  const htmlContent = readFileSync(resourcePath, 'utf-8')

  const htmlStr = htmlContent.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (m, $1, $2) => {
    if ($2.startsWith('http://') || $2.startsWith('https://')) {
      return m
    }

    const lPath = vscode.Uri.joinPath(context.extensionUri, $2)
    const uri = panel.webview.asWebviewUri(lPath)

    const url = `${$1 + uri.toString()}"`
    return url
  })
  return htmlStr
}
