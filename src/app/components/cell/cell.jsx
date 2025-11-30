'use client'
import { styled } from '@mui/system'
import { memo, useCallback } from 'react'

const StyledCell = styled('div')(({ status }) => {
  return {
    width: '15px',
    height: '15px',
    border: '1px solid #222',
    backgroundColor: status ? '#65bbe9' : '#888' ,
  }
})

function Cell({ status, row, col, clickHandlerCell }) {
  const handleClick = useCallback(() => {
    clickHandlerCell(row, col)
  }, [row, col, clickHandlerCell, status])

  return (
    <>
      <StyledCell onClick={handleClick} status={status} />
    </>
  )
}

export default memo(Cell)