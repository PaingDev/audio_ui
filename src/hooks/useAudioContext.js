import { createContext, useContext } from "react"

export const AudioPlayerContext = createContext({
  analyser: undefined,
  playing: false
})

export const useAudioPlayerContext = () => {
  return useContext(AudioPlayerContext)
}
