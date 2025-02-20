import type { Uri } from 'vscode'
import { logger } from '../utils/logger'

export default function (uri: Uri) {
  logger.info('uri:', uri)
}
