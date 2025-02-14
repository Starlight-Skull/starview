import { loadAnimation } from './animate.js'
import { parseImgColors } from './color.js'
import { ctx as ctxSource, canvas as canvasSource, imgSource, restore } from './image.js'

const canvas = document.getElementById('canvas-uv')
const ctx = canvas.getContext('2d')
ctx.imageSmoothingEnabled = false
const info = document.getElementById('info-uv')
const img = document.getElementById('img-uv')

const sectionUV = document.getElementById('uv')
export function toggleUV() {
  sectionUV.classList.toggle('hidden')
}

export function loadUV(event) {
  img.src = URL.createObjectURL(event.target.files[0])
  img.onload = () => {
    info.innerText = `${img.width}x${img.height}`
    canvas.width = img.width
    canvas.height = img.height
    if (img.height >= img.width) {
      canvas.style = 'height: inherit'
    } else {
      canvas.style = 'width: inherit'
    }
    ctx.drawImage(img, 0, 0)
    // URL.revokeObjectURL(imgUV.src)
    if (imgSource.children.length > 0) {
      restore()
      applyUV()
    }
  }
}

export function applyUV() {
  let uvImgData = ctx.getImageData(0, 0, img.width, img.height)
  let uvData = uvImgData.data
  let imgData = ctxSource.getImageData(0, 0, canvasSource.width, canvasSource.height)
  let srcData = imgData.data

  for (let i = 0; i < srcData.length; i += 4) {
    if (srcData[i + 2] === 0) {
      let x = srcData[i + 0]
      let y = srcData[i + 1]
      let dI = (x + y * img.width) * 4
      srcData[i + 0] = uvData[dI + 0]
      srcData[i + 1] = uvData[dI + 1]
      srcData[i + 2] = uvData[dI + 2]
      srcData[i + 3] = uvData[dI + 3]
    }
  }
  ctxSource.clearRect(0, 0, canvasSource.width, canvasSource.height)
  ctxSource.putImageData(imgData, 0, 0)
  parseImgColors()
  loadAnimation()
}

function generateUV() {
  const size = 32
  canvas.width = size
  canvas.height = size
  canvas.style = 'height: inherit'
  let genImgData = ctx.createImageData(size, size)
  let genPixData = genImgData.data
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      let i = x * 4 + y * size * 4
      genPixData[i + 0] = x
      genPixData[i + 1] = y
      genPixData[i + 2] = 0
      genPixData[i + 3] = 255
    }
  }
  ctx.putImageData(genImgData, 0, 0)
}
