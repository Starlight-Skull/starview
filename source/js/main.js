import {
  changeFrames,
  changeH,
  changeSpeed,
  changeW,
  changeX,
  changeY,
  mod,
  nextFrame,
  storage as store,
  togglePlay
} from './animate.js'
import { parseImgColors } from './color.js'
import { loadSource, restore } from './image.js'
import { applyUV, loadUV, toggleUV } from './uv.js'

document.addEventListener('DOMContentLoaded', () => {
  window.loadUV = loadUV
  window.loadSource = loadSource
  window.togglePlay = togglePlay
  window.nextFrame = nextFrame
  window.changeSpeed = changeSpeed
  window.changeFrames = changeFrames
  window.store = store
  window.mod = mod
  window.changeX = changeX
  window.changeY = changeY
  window.changeW = changeW
  window.changeH = changeH
  window.applyUV = applyUV
  window.restore = restore
  window.toggleUV = toggleUV
  window.parseImgColors = parseImgColors
})
