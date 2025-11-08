'use client'
import Cell from './cell'
import { styled } from '@mui/system'

const FlexDiv = styled('div')({
  display: 'flex',
})

const SIZE = {
  ROWS: 50,
  COLS: 50,
}

const masterStatus = Array(SIZE.ROWS)
  .fill()
  .map(() => Array(SIZE.COLS).fill(false))

export default function CellWrapper() {
  return (
    <>
      {masterStatus.map((row, rowIndex) => (
        <FlexDiv key={rowIndex}>
          {row.map((cellStatus, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              row={rowIndex}
              col={colIndex}
              status={cellStatus}
            />
          ))}
        </FlexDiv>
      ))}
    </>
  )
}
