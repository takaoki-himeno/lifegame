'use client'
import { styled } from '@mui/system'
import { memo } from 'react'

const GenerationWrapper = styled('div')(({ status }) => {
  return {
    fontWeight: 'bold',
  }
})

function GenerationDisplay({ generation }) {

  return (
    <>
      <GenerationWrapper >
        Generation: {generation}
      </GenerationWrapper>
    </>
  )
}

export default memo(GenerationDisplay)