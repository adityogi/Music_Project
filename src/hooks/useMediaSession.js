import { useEffect } from 'react';

export function useMediaSession({ 
  currentSong, 
  audioRef, 
  playNext, 
  playPrev, 
  togglePlay,
  setProgress
}) {
  useEffect(() => {
    // Check if the browser actually supports the Media Session API
    if (!('mediaSession' in navigator)) return;

    if (currentSong) {
      // 1. Send the song metadata to the Operating System
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentSong.title,
        artist: currentSong.artist,
        album: currentSong.album,
        artwork: currentSong.coverUrl ? [
          { src: currentSong.coverUrl, sizes: '512x512', type: 'image/jpeg' }
        ] : []
      });

      // 2. Map OS hardware buttons to our Zustand player functions
      navigator.mediaSession.setActionHandler('play', () => {
        if (audioRef.current) audioRef.current.play();
        togglePlay(true); // Assuming togglePlay can force state
      });
      
      navigator.mediaSession.setActionHandler('pause', () => {
        if (audioRef.current) audioRef.current.pause();
        togglePlay(false);
      });
      
      navigator.mediaSession.setActionHandler('previoustrack', playPrev);
      navigator.mediaSession.setActionHandler('nexttrack', playNext);
      
      // Allow scrubbing from the OS Control Center!
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (audioRef.current && details.fastSeek && 'fastSeek' in audioRef.current) {
          audioRef.current.fastSeek(details.seekTime);
        } else if (audioRef.current) {
          audioRef.current.currentTime = details.seekTime;
        }
        setProgress(details.seekTime);
      });
    }

    // Cleanup when the component unmounts
    return () => {
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = null;
        navigator.mediaSession.setActionHandler('play', null);
        navigator.mediaSession.setActionHandler('pause', null);
        navigator.mediaSession.setActionHandler('previoustrack', null);
        navigator.mediaSession.setActionHandler('nexttrack', null);
        navigator.mediaSession.setActionHandler('seekto', null);
      }
    };
  }, [currentSong, playNext, playPrev, togglePlay, audioRef, setProgress]);
}