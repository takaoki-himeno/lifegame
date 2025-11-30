'use client'
import { styled } from '@mui/system'

export default function Play({ clickHandlerPlay, isPlaying }) {
  return (
    <>
        <button onClick={ clickHandlerPlay }>{ isPlaying ? 'Stop' : 'Play' }</button>
    </>
  )
}
