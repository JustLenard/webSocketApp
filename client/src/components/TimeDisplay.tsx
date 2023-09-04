import 'dayjs/plugin/timezone'
import React, { useEffect, useState } from 'react'
import { utcTimeToHumanTime } from '../utils/helpers'

type Props = {
	date: Date
}

const TimeDisplay: React.FC<Props> = ({ date }) => {
	const [currentTime, setCurrentTime] = useState(utcTimeToHumanTime(date))

	useEffect(() => {
		// Update the time every minute
		const intervalId = setInterval(() => {
			setCurrentTime(utcTimeToHumanTime(date))
		}, 60000)

		// Clean up the interval when the component unmounts
		return () => clearInterval(intervalId)
	}, [date])

	return <>{currentTime}</>
}

export default TimeDisplay
