'use client'
import CellWrapper from './cell/cellWrapper'
import ButtonWrapper from './buttons/buttonWrapper'
import GenerationDisplay from './generationDisplay'
import { useCallback, useRef, useState } from 'react'
import { styled } from '@mui/system'

const SIZE = {
  ROWS: 30,
  COLS: 30,
}

const getInitialStatus = () => Array(SIZE.ROWS)
  .fill()
  .map(() => Array(SIZE.COLS).fill(false))

const StyledButtonWrapper = styled(ButtonWrapper)(() => ({
	marginTop: '20px',
}))

const calcutateNextStatus = (currentStatus) => {
	const newStatus = currentStatus.map(row => row.slice())
	currentStatus.forEach((row, rowIndex) => {
		row.forEach((cellStatus, colIndex) => {
			let liveNeighbors = 0
			for (let i = -1; i <= 1; i++) {
				for (let j = -1; j <= 1; j++) {
					if (i === 0 && j === 0) continue
					const newRow = rowIndex + i
					const newCol = colIndex + j
					if (newRow >= 0 && newRow < SIZE.ROWS && newCol >= 0 && newCol < SIZE.COLS) {
						if (currentStatus[newRow][newCol]) {
							liveNeighbors++
						}
					}
				}
			}
			if (cellStatus) {
				if (liveNeighbors < 2 || liveNeighbors > 3) {
					newStatus[rowIndex][colIndex] = false
				}
			} else {
				if (liveNeighbors ===	3) {
					newStatus[rowIndex][colIndex] = true
				}
			}
		})
	})
	return newStatus
}

export default function App() {
	const [ currentStatus, setCurrentStatus ] = useState(getInitialStatus())
	const [ isPlaying, setIsPlaying ] = useState(false)

	const playRef = useRef(null)
	const generationRef = useRef(0)

	// Clear 押された
	const clickHandlerClear = useCallback(() => {
		setCurrentStatus(getInitialStatus())
		setIsPlaying(false)
		generationRef.current = 0
		if (playRef.current) {
			clearInterval(playRef.current)
			playRef.current = null
		}	
	}, [getInitialStatus, setCurrentStatus])
	
	// Play 押された
	const clickHandlerPlay = useCallback(() => {
		if (isPlaying) {
			setIsPlaying(false)
			clearInterval(playRef.current)
			playRef.current = null
			return
		}
		
		setIsPlaying(true)

		playRef.current = setInterval(() => {
			setCurrentStatus((prevStatus) => calcutateNextStatus(prevStatus))
			generationRef.current += 1
		}, 100)
		setCurrentStatus((prevStatus) => calcutateNextStatus(prevStatus))
	}, [isPlaying, currentStatus, setIsPlaying, setCurrentStatus])

	// random 押された
	const clickHandlerRandom = useCallback(() => {
		if (isPlaying) return
		const getRandomInitialStatus = () => Array(SIZE.ROWS)
			.fill()
			.map(() => 
				Array(SIZE.COLS)
					.fill()
					.map(() => Math.random() > 0.7)
			)
		setCurrentStatus(getRandomInitialStatus())
		generationRef.current = 0
	}, [setCurrentStatus])

	// セルがクリックされた
	const clickHandlerCell = useCallback((row, col) => {
		const tempStatus = currentStatus.slice()
		tempStatus[row][col] = !tempStatus[row][col]
		setCurrentStatus(tempStatus)
	}, [currentStatus, setCurrentStatus])

	if (!currentStatus) return

	return (
		<>
			<CellWrapper status={ currentStatus } clickHandlerCell={ clickHandlerCell } />
			<StyledButtonWrapper clickHandlerClear={ clickHandlerClear } clickHandlerPlay={ clickHandlerPlay } clickHandlerRandom={ clickHandlerRandom } isPlaying={ isPlaying } />
			<GenerationDisplay generation={ generationRef.current } />
		</>
	)
}
