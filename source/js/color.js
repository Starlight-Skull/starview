import { ctx as ctxSource, canvas as canvasSource } from './image.js'

const ulColors = document.getElementById('color-list')
let colorSet = []
let imageData
let colorData

// https://www.h3xed.com/programming/javascript-canvas-getimagedata-pixel-colors-slightly-off-in-firefox

export function parseImgColors() {
  if (canvasSource.height > 1000 || canvasSource.width > 1000) return
  imageData = ctxSource.getImageData(
    0,
    0,
    canvasSource.width,
    canvasSource.height
  )
  colorData = imageData.data
  colorSet = []
  ulColors.replaceChildren()
  for (let i = 0; i < colorData.length; i += 4) {
    if (colorData[i + 3] !== 255) continue
    if (colorSet.length > 50) {
      let p = document.createElement('p')
      p.innerText = 'Too many colors! (> 100)'
      colorSet = []
      ulColors.replaceChildren()
      ulColors.appendChild(p)
      break
    }
    const color = DecToHex(colorData[i], colorData[i + 1], colorData[i + 2])
    // const color = `rgb(${colorData[i]}, ${colorData[i + 1]}, ${
    //   colorData[i + 2]
    // })`
    if (!colorSet.includes(color)) {
      createColorElement(color, i)
    }
  }
}

function createColorElement(color, i) {
  let li = document.createElement('li')
  let input = document.createElement('input')
  let input2 = document.createElement('input')
  let button = document.createElement('button')
  li.appendChild(input)
  li.appendChild(input2)
  li.appendChild(button)
  input.value = color
  input2.value = color
  input.type = 'color'
  button.innerText = 'Apply'
  li.style.background = color
  button.style.background = color
  input.onchange = () => {
    button.style.background = input.value
    input2.value = input.value
  }
  input2.onchange = () => {
    button.style.background = input2.value
    input.value = input2.value
  }
  button.onclick = () => {
    replace([colorData[i], colorData[i + 1], colorData[i + 2]], input.value)
    ctxSource.putImageData(imageData, 0, 0)
    li.style.background = input.value
  }
  colorSet.push(color)
  ulColors.appendChild(li)
}

function replace(rgb1, rgb2) {
  if (!colorData) return
  const [r, g, b] = validate(rgb1)
  const [r2, g2, b2] = validate(rgb2)
  if (r === r2 && g === g2 && b === b2) return
  for (let i = 0; i < colorData.length; i += 4) {
    if (
      colorData[i] === r &&
      colorData[i + 1] === g &&
      colorData[i + 2] === b &&
      colorData[i + 3] === 255
    ) {
      colorData[i] = r2
      colorData[i + 1] = g2
      colorData[i + 2] = b2
    }
  }
}

function validate(col) {
  let rgb = []
  if (typeof col === 'string') {
    if (col.indexOf('#') === 0) rgb = HexToDec(col)
    else {
      rgb = col.substring(col.indexOf('(') + 1, col.indexOf(')')).split(',', 3)
    }
  } else if (Array.isArray(col) && col.length === 3) {
    rgb = col
  }
  rgb.map((x) => {
    x -= 0
    x = typeof x === 'number' ? (x > 0 ? x : 0) : 0
  })
  return rgb
}

function HexToDec(rgb) {
  let arr = rgb.split('', 7)
  return [parseInt(arr[1] + arr[2], 16), parseInt(arr[3] + arr[4], 16), parseInt(arr[5] + arr[6], 16)]
}
function DecToHex(r, g, b) {
  const fn = (x) => x.toString(16).padStart(2, '0')
  return `#${fn(r)}${fn(g)}${fn(b)}`
}
