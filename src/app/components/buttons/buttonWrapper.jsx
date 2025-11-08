'use client'
import Play from './play'
import Clear from './clear'
import { styled } from '@mui/system'

const FlexDiv = styled('div')({
  display: 'flex',
})


export default function ButtonWrapper() {
  return (
    <>
        <FlexDiv>
            <Play />
            <Clear />
        </FlexDiv>
    </>
  )
}
