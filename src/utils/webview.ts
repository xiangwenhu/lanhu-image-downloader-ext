import { readFileSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import * as vscode from 'vscode'

/**
 * https://code.visualstudio.com/api/extension-guides/webview
 * <script type="module" crossorigin src="https://file%2B.vscode-resource.vscode-cdn.net/d%3A/projects/lanhu-image-downloader-ext/dist/htmls/assets/index-DAeTjnuH.js"></script>
 * @param context
 * @param templatePath
 * @param panel
 * @returns
 */
export function getWebViewContent(context: vscode.ExtensionContext, templatePath: string, panel: vscode.WebviewPanel) {
  const resourcePath = path.join(context.extensionPath, templatePath)
  const htmlContent = readFileSync(resourcePath, 'utf-8')

  const resourceDir = path.dirname(resourcePath)
  const relativePath = path.relative(context.extensionPath, resourceDir)

  const htmlStr = htmlContent.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (m, $1, $2: string) => {
    if ($2.startsWith('http://') || $2.startsWith('https://') || $2.startsWith('data:')) {
      return m
    }

    const lPath = vscode.Uri.joinPath(context.extensionUri, relativePath, $2)
    const uri = panel.webview.asWebviewUri(lPath)

    const url = `${$1 + uri.toString()}"`
    return url
  })
  return htmlStr
}

export function getWebViewContentFromUrl(url: string): Promise<string> {
  return fetch(url).then(res => res.text())
}

export async function createWeViewContentFormUrl(templatePath: string, data: Record<string, string>) {
  let content = await readFile(templatePath, 'utf-8')

  for (const [key, value] of Object.entries(data)) {
    content = content.replaceAll(key, value)
  }

  return content
}
