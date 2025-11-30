'use client'
import { styled } from '@mui/system'
import { memo } from 'react'

const GenerationWrapper = styled('div')(({ status }) => {
  return {
    fontWeight: 'bold',
  }
})

export default function GenerationDisplay({ generation }) {

  return (
    <>
      <GenerationWrapper >
        Generation: {generation}
      </GenerationWrapper>
    </>
  )
}
