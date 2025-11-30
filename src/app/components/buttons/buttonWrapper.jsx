'use client'
import Play from './play'
import Random from './random'
import Clear from './clear'
import { styled } from '@mui/system'

const FlexDiv = styled('div')({
  display: 'flex',
  justifyContent: 'center',
})


export default function ButtonWrapper({ clickHandlerPlay, clickHandlerClear, clickHandlerRandom, isPlaying, ...props }) {
  return (
    <>
        <FlexDiv {...props}>
            <Play clickHandlerPlay={ clickHandlerPlay } isPlaying={ isPlaying } />
            <Random clickHandlerRandom={ clickHandlerRandom }/>
            <Clear clickHandlerClear={ clickHandlerClear }/>
        </FlexDiv>
    </>
  )
}
