import * as musicMetadata from 'music-metadata-browser';

export async function parseLocalFolder(rawFiles, onProgress) {
  const songs = [];
  const albumsMap = new Map();
  const coverCache = new Map(); // CACHE: Prevent duplicate image blobs in memory

  let processedCount = 0;

  for (const file of rawFiles) {
    try {
      const metadata = await musicMetadata.parseBlob(file);
      const tags = metadata.common;
      
      const title = tags.title || file.name.replace(/\.[^/.]+$/, "");
      const artist = tags.artist || tags.albumartist || 'Unknown Artist';
      const albumName = tags.album || 'Unknown Album';
      
      // OPTIMIZATION: Check if we already created a cover URL for this album
      let coverUrl = coverCache.get(albumName);

      if (!coverUrl && tags.picture && tags.picture.length > 0) {
        const picture = tags.picture[0];
        const blob = new Blob([picture.data], { type: picture.format });
        coverUrl = URL.createObjectURL(blob);
        coverCache.set(albumName, coverUrl); // Save to cache
      }

      const song = {
        id: `${file.name}-${file.size}`,
        title,
        artist,
        album: albumName,
        coverUrl,
        url: URL.createObjectURL(file),
        file: file,
        duration: metadata.format.duration || 0,
      };

      songs.push(song);

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
      console.warn(`Skipping metadata for ${file.name}`);
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

    // Report progress back to the UI every 10 files to avoid overwhelming the main thread
    processedCount++;
    if (onProgress && processedCount % 10 === 0) {
      onProgress(processedCount, rawFiles.length);
    }
  }

  // Final progress update
  if (onProgress) onProgress(rawFiles.length, rawFiles.length);

  const albums = Array.from(albumsMap.values());
  albums.sort((a, b) => a.title.localeCompare(b.title));
  songs.sort((a, b) => a.title.localeCompare(b.title));

  return { songs, albums };
}