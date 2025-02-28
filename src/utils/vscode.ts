import * as vscode from 'vscode'

export function getCurrentWorkspaceFolder() {
  const workspaceFolders = vscode.workspace.workspaceFolders

  if (workspaceFolders) {
    // 如果有打开的工作区，取第一个工作区目录
    const currentWorkspaceFolder = workspaceFolders[0].uri.fsPath
    return currentWorkspaceFolder
  }
  else {
    return null
  }
}
