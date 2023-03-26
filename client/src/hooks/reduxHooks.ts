import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../store/store'

// export const useAppDispatch = () => useDispatch<AppDispatch>
export const useAppDispatch: () => AppDispatch = useDispatch // Export a hook that can be reused to resolve types

export const useAppSelector = () => useSelector<RootState>
