'use client'
import { memo } from 'react'
import Cell from './cell'
import { styled } from '@mui/system'

const FlexDiv = styled('div')({
  display: 'flex',
})

export default function CellWrapper({ status, clickHandlerCell }) {
  return (
    <>
      {status.map((row, rowIndex) => (
        <FlexDiv key={rowIndex}>
          {row.map((cellStatus, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              row={rowIndex}
              col={colIndex}
              status={cellStatus}
              clickHandlerCell={clickHandlerCell}
            />
          ))}
        </FlexDiv>
      ))}
    </>
  )
}
