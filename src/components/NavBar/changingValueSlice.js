import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    activeCurrency: 0
}

const changingValueSlice = createSlice({
    name: 'changingValue',
    initialState,
    reducers: {
        activeChangingValue: (state, action) => {
            state.activeCurrency = action.payload
        }
    }
})

const {actions, reducer} = changingValueSlice

export default reducer

export const {
    activeChangingValue
} = actions