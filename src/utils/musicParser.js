import * as mm from 'music-metadata';

export const parseLocalFolder = async (files) => {
  const parsedSongs = [];
  const albumMap = new Map();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    if (file.type.startsWith('audio/') || /\.(mp3|wav|m4a|flac)$/i.test(file.name)) {
      try {
        // Parse the embedded ID3 tags
        const metadata = await mm.parseBlob(file);
        const tags = metadata.common;

        // Fallbacks: If a file is missing tags, fall back to folder names
        const pathParts = file.webkitRelativePath.split('/');
        let fallbackArtist = pathParts.length >= 3 ? pathParts[1] : 'Unknown Artist';
        let fallbackAlbum = pathParts.length >= 4 ? pathParts[2] : 'Unknown Album';
        let fallbackTitle = file.name.replace(/\.[^/.]+$/, "").replace(/^\d+[\s-]*\.?\s*/, '');

        const artist = tags.artist || tags.albumartist || fallbackArtist;
        const album = tags.album || fallbackAlbum;
        const title = tags.title || fallbackTitle;

        // Extract the embedded cover art image
        let coverUrl = null;
        if (tags.picture && tags.picture.length > 0) {
          const picture = tags.picture[0];
          const blob = new Blob([picture.data], { type: picture.format });
          coverUrl = URL.createObjectURL(blob);
        }

        const song = {
          id: file.webkitRelativePath,
          file,
          url: URL.createObjectURL(file),
          title,
          artist,
          album,
          coverUrl,
          duration: metadata.format.duration || 0, // We now get duration before playing!
          trackNo: tags.track?.no || null
        };
        
        parsedSongs.push(song);

        // Group into Albums
        const albumKey = `${artist}|${album}`;
        if (!albumMap.has(albumKey)) {
          // Keep the gradient as a fallback if the song has no embedded art
          const hash = albumKey.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
          const h = [0, 45, 180, 200, 280, 320][hash % 6];
          
          albumMap.set(albumKey, { 
            title: album, 
            artist, 
            songs: [],
            coverUrl: coverUrl, // Assign the first song's cover to the album
            gradient: `linear-gradient(135deg, hsl(${h}, 80%, 40%), hsl(${(h + 20) % 360}, 80%, 20%))`
          });
        } else if (!albumMap.get(albumKey).coverUrl && coverUrl) {
            // If we found a cover later in the album, update the album cover
            albumMap.get(albumKey).coverUrl = coverUrl;
        }

        albumMap.get(albumKey).songs.push(song);
      } catch (err) {
        console.warn(`Could not parse metadata for ${file.name}`, err);
      }
    }
  }

  // Sort albums alphabetically, and sort songs within albums by track number
  const albums = Array.from(albumMap.values()).sort((a, b) => a.artist.localeCompare(b.artist));
  albums.forEach(album => {
      album.songs.sort((a, b) => (a.trackNo || 0) - (b.trackNo || 0));
  });

  return { songs: parsedSongs, albums };
};