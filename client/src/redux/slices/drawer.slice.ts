import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { Drawers } from '../../types/types'

const initialState: Record<Drawers, boolean> = {
	right: false,
	left: false,
}

/**
 * Drawer Slice
 */
export const drawerSlice = createSlice({
	name: 'drawer',
	initialState,
	reducers: {
		setRightDrawerState: (state, action: PayloadAction<boolean>) => {
			state.right = action.payload
		},
		setLeftDrawerState: (state, action: PayloadAction<boolean>) => {
			state.left = action.payload
		},
	},
})

// Action creators are generated for each case reducer function
export const { setLeftDrawerState, setRightDrawerState } = drawerSlice.actions

export default drawerSlice.reducer
