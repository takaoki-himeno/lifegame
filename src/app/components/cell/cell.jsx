'use client'
import { styled } from '@mui/system'
import { useState, useCallback } from 'react'

const StyledCell = styled('div')(({ status }) => {
  return {
    width: '10px',
    height: '10px',
    border: '1px solid #ccc',
    backgroundColor: status ? '#000' : '#fff' ,
  }
})

export default function Cell(props) {
  const [status, setStatus] = useState(props.initialStatus || 0)

  const handleClick = useCallback(() => {
    setStatus(currentStatus => !currentStatus)
  }, [])

  return (
    <>
      <StyledCell onClick={handleClick} status={status} />
    </>
  )
}
