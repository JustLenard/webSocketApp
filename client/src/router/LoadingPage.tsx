import { PropsWithChildren, Suspense } from 'react'
import AppSpinner from '../components/AppSpinner'

const LoadingPage: React.FC<PropsWithChildren> = ({ children }) => {
	return <Suspense fallback={<AppSpinner text="Loading" />}>{children}</Suspense>
}

export default LoadingPage
