import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { AppModalTypes } from '../../types/types'

const initialState: Record<AppModalTypes, boolean> = {
	personalProfileModal: false,
}

/**
 * Drawer Slice
 */
export const modalsSlice = createSlice({
	name: 'modals',
	initialState,
	reducers: {
		changeProfileModalState: (state, action: PayloadAction<boolean>) => {
			state.personalProfileModal = action.payload
		},
	},
})

// Action creators are generated for each case reducer function
export const { changeProfileModalState } = modalsSlice.actions

export default modalsSlice.reducer
