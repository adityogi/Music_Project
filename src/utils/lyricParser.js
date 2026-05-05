export const parseLRC = (lrcText) => {
  const lines = lrcText.split('\n');
  const lyrics = [];
  
  // Regex to match [mm:ss.xx] or [mm:ss:xx]
  const timeRegex = /\[(\d{2}):(\d{2})(?:\.(\d{2,3}))?\]/;

  lines.forEach(line => {
    const match = timeRegex.exec(line);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const milliseconds = match[3] ? parseInt(match[3].padEnd(3, '0'), 10) : 0;
      
      const timeInSeconds = (minutes * 60) + seconds + (milliseconds / 1000);
      const text = line.replace(timeRegex, '').trim();
      
      if (text) {
        lyrics.push({ time: timeInSeconds, text });
      }
    }
  });

  return lyrics;
};