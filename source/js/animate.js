import { ctx as ctxSource, filename, canvas as canvasSource } from './image.js'

const canvas = document.getElementById('canvas-animate')
const ctx = canvas.getContext('2d')
ctx.imageSmoothingEnabled = false
const info = document.getElementById('info-animate')
const buttonPlay = document.getElementById('play')
const inputSpeed = document.getElementById('speed')
const inputFrames = document.getElementById('frames')
const inputX = document.getElementById('x')
const inputY = document.getElementById('y')
const inputW = document.getElementById('w')
const inputH = document.getElementById('h')
let isPlaying = false
let imageData, pixelData
let x = 0
let y = 0
let w
let h
let speed
let frames = 1
let currentFrame
let prevTime = 0
let dT
let intervalID

export function changeSpeed(event) {
  speed = parseInt(event.target.value)
}
export function changeFrames(event) {
  frames = parseInt(event.target.value)
}
export function changeX(event) {
  x = parseInt(event.target.value)
}
export function changeY(event) {
  y = parseInt(event.target.value)
}
export function changeW(event) {
  w = parseInt(event.target.value)
  canvas.width = w
  nextFrame(0)
}
export function changeH(event) {
  h = parseInt(event.target.value)
  canvas.height = h
  nextFrame(0)
}

export function togglePlay() {
  isPlaying = !isPlaying
  buttonPlay.innerText = isPlaying ? 'Pause' : 'Play'
  if (isPlaying) {
    intervalID = self.requestAnimationFrame(run)
  } else {
    self.cancelAnimationFrame(intervalID)
  }
}

export function loadAnimation() {
  w = canvasSource.width
  h = canvasSource.height
  frames = 1
  currentFrame = 1
  speed = 100
  storage({ save: false})
  updateUI()
  nextFrame(0)
}

export function storage({save}) {
  let key = filename
  if (key === undefined || key === '') return console.error(`localStorage key is '${key}'`)
  if (save) {
    localStorage.setItem(key, JSON.stringify({speed, frames, x, y, w, h}))
    info.innerText += ' (stored)'
  } else {
    let storage = localStorage.getItem(key)
    if (storage === null) return console.error('localStorage entry not found')
    storage = JSON.parse(storage)
    speed = storage.speed
    frames = storage.frames
    x = storage.x
    y = storage.y
    w = storage.w
    h = storage.h
    updateUI()
    info.innerText += ' (loaded)'
  }
}

export function mod(val, modifier) {
  switch (val) {
    case 'frames':
      frames = modFunction(modifier)(frames)
      break
    case 'x':
      x = modFunction(modifier)(x)
      break
    case 'y':
      y = modFunction(modifier)(y)
      break
    case 'w':
      w = modFunction(modifier)(w)
      break
    case 'h':
      h = modFunction(modifier)(h)
      break
  }
  updateUI()
  nextFrame(0)
}

function modFunction(modifier) {
  switch (modifier) {
    case '/2':
      return x => x / 2
    case '*2':
      return x => x * 2
    case '+w':
      return x => x + w
    case '-w':
      return x => x - w
    case '+h':
      return x => x += h
    case '-h':
      return x => x - h
    case '/frames':
      return x => Math.floor(x / frames)
  }
}

function run(time) {
  dT = time - prevTime
  if (isPlaying && dT >= speed) {
    nextFrame(1)
    prevTime = time
  }
  intervalID = requestAnimationFrame(run)
}

export function nextFrame(d) {
  if (currentFrame + d > frames) {
    currentFrame = 1
  } else if (currentFrame + d < 1) {
    currentFrame = frames
  } else {
    currentFrame += d
  }
  info.innerText = `${w}x${h} - ${currentFrame}/${frames} @${1/(speed/1000)}fps`
  renderAlt()
}

function updateUI() {
  canvas.width = w
  canvas.height = h
  if (h >= w) {
    canvas.style = 'height: inherit'
  } else {
    canvas.style = 'width: inherit'
  }
  inputX.value = x
  inputY.value = y
  inputW.value = w
  inputH.value = h
  inputFrames.value = frames
  inputSpeed.value = speed
  info.innerText = `${w}x${h} - ${currentFrame}/${frames}`
}

// // requires single image
// function render() {
//   ctx.clearRect(0, 0, canvas.width, canvas.height)
//   let xx = x + (currentFrame - 1) * w
//   let yy = y
//   while (xx >= imgSource.width) {
//     xx -= imgSource.width
//     yy += h
//   }
//   ctx.drawImage(
//     imgSource,
//     xx,
//     yy,
//     w,
//     h,
//     0,
//     0,
//     w,
//     h
//   )
// }

function renderAlt() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  let xx = x + (currentFrame - 1) * w
  let yy = y
  while (xx >= canvasSource.width) {
    xx -= canvasSource.width
    yy += h
  }
  imageData = ctxSource.getImageData(
    xx,
    yy,
    w,
    h
  )
  ctx.putImageData(imageData, 0, 0)
}
