import path from 'path-browserify'
const icons = import.meta.glob('../../icons/svgs/*.svg')
const svgPath = Object.keys(icons)

const svgIcons = svgPath.reduce((res, pre) => {
  res.push(path.basename(pre, '.svg'))
  return res
}, [] as string[])

export default svgIcons
