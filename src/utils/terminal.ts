import * as vscode from 'vscode'

export class TerminalLogger {
  private terminal?: vscode.Terminal
  private options: vscode.TerminalOptions

  /**
   * 构造函数
   * @param terminalName 终端名称
   */
  constructor(options: vscode.TerminalOptions) {
    this.options = options
  }

  /**
   * 初始化或获取指定名称的终端
   * @returns 当前使用的终端实例
   */
  private getOrCreateTerminal(): vscode.Terminal {
    const terminal = vscode.window.terminals.find(t => t.name === this.options.name)
    if (terminal)
      terminal.dispose()

    // 如果终端不存在，则创建一个新的
    this.terminal = vscode.window.createTerminal(this.options)
    this.terminal.show()
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
    const terminal = vscode.window.terminals.find(t => t.name === this.options.name)
    if (terminal) {
      terminal.dispose()
      this.terminal = undefined
    }
  }

  send(...messages: any[]) {
    const formattedMessages = messages.map(message =>
      typeof message === 'object' ? JSON.stringify(message) : message,
    ).join(' ')

    const terminal = this.getOrCreateTerminal()

    terminal.sendText(`${formattedMessages}`, true)
  }
}
