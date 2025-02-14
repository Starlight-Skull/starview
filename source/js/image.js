import { parseImgColors } from './color.js'
import { loadAnimation } from './animate.js'

export const canvas = document.getElementById('canvas-source')
export const ctx = canvas.getContext('2d')
ctx.imageSmoothingEnabled = false
ctx.willReadFrequently = true
const info = document.getElementById('info-source')
export const imgSource = document.getElementById('img-source')
export let filename = ''

export function loadSource(event) {
  const files = event.target.files
  if (!files) return
  filename = files[0].name
  canvas.width = 0
  canvas.height = 0
  imgSource.replaceChildren()
  for(let i = 0; i < files.length; i++) {
    const img = document.createElement('img')
    img.src = URL.createObjectURL(files[i])
    img.onload = (event) => {
      const file = event.target
      canvas.width += file.width
      canvas.height = Math.max(canvas.height, file.height)
      imgSource.appendChild(img)
      // URL.revokeObjectURL(file.src)
      if (i === files.length - 1) {
        if (canvas.height >= canvas.width) {
          canvas.style = 'height: inherit'
        } else {
          canvas.style = 'width: inherit'
        }
        info.innerText = `${canvas.width}x${canvas.height}`
        restore()
      }
    }
  }
}

export function restore() {
  // ctx.filter = "hue-rotate(180deg)"
  for (let j = 0, x = 0, y = 0; j < imgSource.children.length; j++) {      
    ctx.drawImage(imgSource.children[j], x, y)
    x += imgSource.children[j].width
  }
  parseImgColors()
  loadAnimation()
}
