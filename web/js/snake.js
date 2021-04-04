//const base = require('./base')
import {
    dropFirst,
    dropLast,
    merge,
    mod,
    prop,
    rnd,
    spec
} from './base.js'
import {NORTH,SOUTH,EAST, WEST} from './constants.js'

// Point operations
const pointEq = p1 => p2 => p1.x == p2.x && p1.y == p2.y

// //Booleans
const willEat = state => pointEq(nextHead(state))(state.apple)
const willCrash = state => state.snake.find(pointEq(nextHead(state)))
// -1 + 1 === 0 ---> a valid move

const validMove = move => state => typeof move !== 'undefined'? state.moves[0].x + move.x !== 0 || state.moves[0].u + move.y != 0 : false

//Next values based on state 
const nextMoves = state => state.moves.length > 1 ? dropFirst(state.moves) : state.moves
// Update the position of the Apple 
const nextApple = state => willEat(state) ? rndPos(state) : state.apple
const nextHead = state => state.snake.length === 0 ? { x: 2, y: 2 } : {
    x: mod(state.cols)(state.snake[0].x + state.moves[0].x),
    y: mod(state.rows)(state.snake[0].y + state.moves[0].y)
}

const nextSnake = state => {
    if (willCrash(state))
        return []
    if (willEat(state))
        return [nextHead(state)].concat(state.snake)
    return [nextHead(state)].concat(dropLast(state.snake))
}

// Random Position Picker for the Position of the Apple
const rndPos = table => ({
    x: rnd(0)(table.cols - 1),
    y: rnd(0)(table.rows - 1)
})

//inital State
const initialState = () => ({
    cols: 20,
    rows: 14,
    moves: [EAST],
    snake: [],
    apple: { x: 16, y: 2 },
})

const next = spec({
    rows: prop('rows'),
    cols: prop('cols'),
    moves: nextMoves,
    snake: nextSnake,
    apple: nextApple
})

const enqueue = (state, move) => {
    //stacking the moves to provide a behavious of stacking
    if (validMove(move)(state))
        return merge(state)({ moves: state.moves.concat([move]) })
    return state
}

export { initialState, enqueue, next }

//takes a state and return a new state
//it's like the way to get the next state when we pass the functionality that will update the current state
// An alternate implementation of the next function 
// const next = state => ({
//     rows: prop('rows')(state),
//     cols: prop('cols')(state),
//     moves: nextMoves(state),
//     snake: nextSnake(state),
//     apple: nextApple(state),
// })
