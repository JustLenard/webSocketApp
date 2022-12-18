// const tailwindColors: number[] = [
// 	50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950,
// ]

const tailwindShades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]

const tailwindColors = [
	'slate',
	'gray',
	'zinc',
	'neutral',
	'stone',
	'red',
	'orange',
	'amber',
	'yellow',
	'lime',
	'green',
	'emerald',
	'teal',
	'cyan',
	'sky',
	'blue',
	'indigo',
	'violet',
	'purple',
	'fuchsia',
	'pink',
	'rose',
]

export const getColorNumber = () => {
	const arr: number[] = []

	for (let i = 50; i < 1000; i + 50) {
		arr.push(i)
	}

	return arr
}

export const chooseRandomColor = () => {
	const randomShade = Math.floor(Math.random() * tailwindShades.length)
	const randomColor = Math.floor(Math.random() * tailwindColors.length)
	const number = tailwindShades[randomShade]
	const color = tailwindColors[randomColor]
	const tailwindClass = `bg-${color}-${number}`
	console.log('This is tailwindClass', tailwindClass)

	// console.log('This is number', number)
	// console.log('This is res', number)
	// console.log(`bg-${color}-${number}`)
	// return `bg-${color}-${number}`
	// return 'bg-pink-700 '
	return tailwindClass
}
