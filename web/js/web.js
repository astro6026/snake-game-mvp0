import {initialState, enqueue, next } from './snake.js'
import {NORTH,SOUTH,EAST, WEST} from './constants.js'

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

let state = initialState()

//Drawing Tile Utils - where you just add the tile
const x = c=> Math.round(c* canvas.width/state.cols)
const y = r => Math.round(r* canvas.height/state.rows)

//Controlling the graphics - Using Canvas to draw the snake, apple and indicator for crash
const draw = () => {
    //clear
    ctx.fillStyle = '#232323'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    // draw snake
    ctx.fillStyle = 'rgb(0,200,50)'
    state.snake.forEach(p=> ctx.fillRect(x(p.x), y(p.y), x(1), y(1)))
    //draw apples 
    ctx.fillStyle = 'rgb(255,50,0)'
    ctx.fillRect(x(state.apple.x),y(state.apple.y),x(1), y(1))
    //add crash => Indicating a crash
    if(state.snake.length === 0) {
        ctx.fillStyle = 'rgb(255,0,0)'
        ctx.fillRect(0,0,canvas.width,canvas.height)
    }
}

// Game Loop Update
const step = t1 => t2 => {
    if(t2-t1>100) {
        state = next(state)
        draw()
        window.requestAnimationFrame(step(t2))
    }
    else {
        // handles redrawing only when a signficant amount of time has passes
        window.requestAnimationFrame(step(t1))
    }
}


//Listener for key events that also updates the state
window.addEventListener('keydown', e => {
    switch(e.key) {
        case 'w' :
        case 'ArrowUp':
            state = enqueue(state, NORTH)
            break;
        case 'a':
        case 'ArrowLeft':
            state = enqueue(state, WEST)
            break
        case 's' : 
        case 'ArrowDown':
            state = enqueue(state, SOUTH)
            break
        case 'd': 
        case 'ArrowRight':
            state = enqueue(state, EAST)
            break
        default:
            //PlaceHolder if needed
            break;
    }
})
// Main 
draw()
// Check what this window.requestAnimationFrame works
window.requestAnimationFrame(step(0))