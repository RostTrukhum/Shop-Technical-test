import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    basket: []
}

const addBasketSlice = createSlice({
    name: 'addBasket',
    initialState,
    reducers: {
        addBasket: (state, action) => {
            state.basket.push(action.payload)
        },
        removeBasket: (state, action) => {
            state.basket = state.basket.filter(item => item.id !== action.payload.id)
        },
        incCounter: (state, action) => {
            state.basket[action.payload].counter++
        },
        decCounter: (state, action) => {
            state.basket[action.payload].counter -= 1
        }
    }
})

const {actions, reducer} = addBasketSlice

export default reducer

export const {
    addBasket,
    incCounter,
    decCounter,
    removeBasket
} = actions