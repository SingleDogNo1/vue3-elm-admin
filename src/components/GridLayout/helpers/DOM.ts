type Dir = 'ltr' | 'rtl' | 'auto'
let currentDir: Dir = 'auto'

function hasDocument() {
  return typeof document !== 'undefined'
}

function hasWindow() {
  return typeof window !== 'undefined'
}

export function getDocumentDir() {
  if (!hasDocument()) {
    return currentDir
  }
  const direction =
    typeof document.dir !== 'undefined'
      ? document.dir
      : document.getElementsByTagName('html')[0].getAttribute('dir')
  return direction
}

export function setDocumentDir(dir: Dir) {
  if (!hasDocument) {
    currentDir = dir
    return
  }

  const html = document.getElementsByTagName('html')[0]
  html.setAttribute('dir', dir)
}

export function addWindowEventListener(event: string, callback) {
  if (!hasWindow) {
    callback()
    return
  }
  window.addEventListener(event, callback)
}

export function removeWindowEventListener(event: string, callback) {
  if (!hasWindow) {
    return
  }
  window.removeEventListener(event, callback)
}
