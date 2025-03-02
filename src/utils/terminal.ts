import * as vscode from 'vscode'

class TerminalLogger {
  private terminalName: string
  private terminal?: vscode.Terminal

  /**
   * 构造函数
   * @param terminalName 终端名称
   */
  constructor(terminalName: string = 'LanHu-Image-Download') {
    this.terminalName = terminalName
  }

  /**
   * 初始化或获取指定名称的终端
   * @returns 当前使用的终端实例
   */
  private getOrCreateTerminal(): vscode.Terminal {
    if (!this.terminal || !vscode.window.terminals.find(t => t.name === this.terminalName)) {
      // 如果终端不存在，则创建一个新的
      this.terminal = vscode.window.createTerminal({
        name: this.terminalName,
        shellPath: 'C:\\Windows\\System32\\cmd.exe',
      })
    }
    return this.terminal
  }

  /**
   * 清除终端内容
   */
  clear(): void {
    const terminal = this.getOrCreateTerminal()
    terminal.sendText('clear', true) // 发送 clear 命令清除终端内容
    terminal.show()
  }

  /**
   * 关闭并删除终端
   */
  dispose(): void {
    const terminal = vscode.window.terminals.find(t => t.name === this.terminalName)
    if (terminal) {
      terminal.dispose()
      this.terminal = undefined
    }
  }

  private sendLog(...messages: any[]) {
    const formattedMessages = messages.map(message =>
      typeof message === 'object' ? JSON.stringify(message) : message,
    ).join(' ')

    const terminal = this.getOrCreateTerminal()

    terminal.sendText(`${formattedMessages}`, false)
  }

  log(...messages: any[]) {
    this.sendLog('\\x1B\[37m', ...messages) // 白色
  }

  info(...messages: any[]) {
    this.sendLog('\\x1B\[32m', ...messages) // 绿色
  }

  warn(...messages: any[]) {
    this.sendLog('\\x1B\[33m', ...messages) // 黄色
  }

  error(...messages: any[]) {
    this.sendLog('\\x1B\[31m', ...messages) // 红色
  }

  sendText(...messages: any[]) {
    this.sendLog(...messages)
  }
}
export default new TerminalLogger()
