'use client'
import Play from './play'
import Clear from './clear'
import { styled } from '@mui/system'

const FlexDiv = styled('div')({
  display: 'flex',
  justifyContent: 'center',
})


export default function ButtonWrapper({ clickHandlerPlay, clickHandlerClear, isPlaying, ...props }) {
  return (
    <>
        <FlexDiv {...props}>
            <Play clickHandlerPlay={ clickHandlerPlay } isPlaying={ isPlaying } />
            <Clear clickHandlerClear={ clickHandlerClear }/>
        </FlexDiv>
    </>
  )
}
