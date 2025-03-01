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
      this.terminal = vscode.window.createTerminal(this.terminalName)
    }
    return this.terminal
  }

  /**
   * 输出日志到终端
   * @param message 要输出的日志信息
   */
  log(message: string): void {
    const terminal = this.getOrCreateTerminal()
    // 直接发送日志消息，而不是使用 echo
    terminal.sendText(message, true) // 第二个参数为 true 表示不添加到历史记录
    terminal.show() // 确保终端可见
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
}
export default new TerminalLogger()
