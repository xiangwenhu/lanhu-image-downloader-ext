export function removeEnter(str: string = ''): string {
  return str.replace(/\n+/g, '')
}
