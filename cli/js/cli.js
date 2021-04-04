// ToDo - Complete cli in future

// These imports won't work because currently nodejs uses CommonJs - Will try to find the equivalent in future 
// import {
//     adjust,
//     id,
//     k,
//     map,
//     pipe,
//     rep,
// } from './common/js/base.js'
// import { NORTH, SOUTH, EAST, WEST } from './common/js/contants.js'
// import { initialState, next } from './common/js/snake.js'
// import readline from 'readline'
// redrawing each time is resource extensive



const snake = require('../../common/js/snake.js')
const base = require('../../common/js/base.js')
const readline = require('readline')

let state = snake.initialState()

const Matrix = {
    make: table => base.rep(base.rep('.')(table.cols))(table.rows),
    set: val => pos => base.adjust(pos.y)(base.adjust(pos.x)(base.k(val))),
    addSnake: state => base.pipe(...base.map(Matrix.set('X'))(state.snake)),
    addApple: state => Matrix.set('o')(state.apple),
    addCrash: state => state.snake.length === 0 ? base.map(base.map(base.k('#'))) : base.id,
    toString: coordinates => coordinates.map(coordinate => coordinate.join(' ')).join('\r\n'),
    fromState: state => base.pipe(
        Matrix.make,
        Matrix.addSnake(state),
        Matrix.addApple(state),
        Matrix.addCrash(state),
    )(state)
}

readline.emitKeypressEvents(process.stdin)
process.stdin.setRawMode(true)
process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'c')
        process.exit()
    switch (key.name.toUpperCase()) {
        case 'W':
        case 'UP':
            state = snake.enqueue(state, snake.NORTH)
            break;
        case 'A':
        case 'LEFT':
            state = snake.enqueue(state, snake.WEST)
            break;
        case 'S':
        case 'DOWN':
            state = snake.enqueue(state, snake.SOUTH)
            break;
        case 'D':
        case 'RIGHT':
            state = snake.enqueue(state, snake.EAST)
            break;
        default:
            break;
    }
})
const show = () => console.log('\x1Bx' + Matrix.toString(Matrix.fromState(state)))
const step = () => state = snake.next(state)

setInterval(() => {
    console.clear()
    step();
    show();
}, 80)

// validity of the moves is missing in this case - some issue present
// clearing of the previous print is