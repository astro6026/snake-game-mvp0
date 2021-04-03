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

let state = initialState()

const Matrix = {
    make: table => rep(rep('.')(table.cols))(table.rows),
    set: val => pos => adjust(pos.y)(adjust(pos.x)(k(val))),
    addSnake: state => pipe(...map(Matrix.set('X'))(state.snake)),
    addApple: state => Matrix.set('o')(state.apple),
    addCrash: state => state.snake.length === 0 ? map(map(k('#'))) : id,
    toString: coordinates => coordinates.map(coordinate => coordinate.join(' ')).join('\r\n'),
    fromState: state => pipe(
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
            state = snake.enqueue(state, NORTH)
            break;
        case 'A':
        case 'LEFT':
            state = snake.enqueue(state, WEST)
            break;
        case 'S':
        case 'DOWN':
            state = snake.enqueue(state, SOUTH)
            break;
        case 'D':
        case 'RIGHT':
            state = snake.enqueue(state, EAST)
            break;
        default:
            break;
    }
})
const show = () => console.log('\x1Bx' + Matrix.toString(Matrix.fromState(State)))
const step = () => state = next(state)

setInterval(() => {
    step();
    show();
}, 80)
