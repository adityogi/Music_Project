import * as musicMetadata from 'music-metadata-browser';

export async function parseLocalFolder(rawFiles) {
  const songs = [];
  const albumsMap = new Map();

  for (const file of rawFiles) {
    try {
      // Parse the ID3 tags using music-metadata-browser
      const metadata = await musicMetadata.parseBlob(file);
      const tags = metadata.common;
      
      // Clean up metadata fallbacks
      const title = tags.title || file.name.replace(/\.[^/.]+$/, ""); // Strip extension
      const artist = tags.artist || tags.albumartist || 'Unknown Artist';
      const albumName = tags.album || 'Unknown Album';
      
      // Extract Cover Art
      let coverUrl = null;
      if (tags.picture && tags.picture.length > 0) {
        const picture = tags.picture[0];
        const blob = new Blob([picture.data], { type: picture.format });
        coverUrl = URL.createObjectURL(blob);
      }

      // Create the Song Object
      const song = {
        id: `${file.name}-${file.size}-${file.lastModified}`,
        title,
        artist,
        album: albumName,
        coverUrl,
        url: URL.createObjectURL(file), // Creates a local streaming URL
        file: file, // Keep reference to original file
        duration: metadata.format.duration || 0,
      };

      songs.push(song);

      // Group into Albums Map
      const albumKey = `${albumName}-${artist}`;
      if (!albumsMap.has(albumKey)) {
        albumsMap.set(albumKey, {
          id: albumKey,
          title: albumName,
          artist: artist,
          coverUrl: coverUrl,
          songs: []
        });
      }
      albumsMap.get(albumKey).songs.push(song);

    } catch (err) {
      console.warn(`Could not parse metadata for ${file.name}, using fallbacks.`, err);
      // Fallback if parsing fails
      const fallbackSong = {
        id: `${file.name}-${file.size}`,
        title: file.name.replace(/\.[^/.]+$/, ""),
        artist: 'Unknown Artist',
        album: 'Unknown Album',
        coverUrl: null,
        url: URL.createObjectURL(file),
        file: file,
        duration: 0
      };
      songs.push(fallbackSong);
    }
  }

  // Convert the Albums Map back to an array
  const albums = Array.from(albumsMap.values());

  // Sort Albums and Songs alphabetically
  albums.sort((a, b) => a.title.localeCompare(b.title));
  songs.sort((a, b) => a.title.localeCompare(b.title));

  return { songs, albums };
}