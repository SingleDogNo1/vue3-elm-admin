import Clipboard from 'clipboard'
import { ElMessage } from 'element-plus'

function clipboardSuccess() {
  ElMessage({
    message: 'Copy successfully',
    type: 'success',
    duration: 1500,
  })
}

function clipboardError() {
  ElMessage({
    message: 'Copy failed',
    type: 'error',
  })
}

export function useClipboard(text, event) {
  const clipboard = new Clipboard(event.target, {
    text: () => text,
  })
  clipboard.on('success', () => {
    clipboardSuccess()
    clipboard.destroy()
  })
  clipboard.on('error', () => {
    clipboardError()
    clipboard.destroy()
  })
}
