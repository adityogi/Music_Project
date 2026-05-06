/**
 * Manual Metadata Overrides for Supermix Library
 * Based on Library_Structure_2026-05-06.txt
 */

export const manualMetadataDB = {
  // --- Root Level Tracks ---
  "'Gallan Goodiyaan' Full VIDEO Song - Dil Dhadakne Do - T-Series.mp3": {
    title: "Gallan Goodiyaan",
    artist: "Shankar Mahadevan, Yashita Sharma, Manish Kumar Tipu",
    album: "Dil Dhadakne Do"
  },
  "24kGoldn - Mood (Official Video) ft. iann dior.wav": {
    title: "Mood",
    artist: "24kGoldn ft. iann dior",
    album: "Mood (Single)"
  },

  // --- 2 Unlimited ---
  "01 Get Ready For This [Orchestral Mix].mp3": { title: "Get Ready For This (Orchestral Mix)", artist: "2 Unlimited", album: "Get Ready!" },
  "02 Twilight Zone [Club Mix].mp3": { title: "Twilight Zone (Club Mix)", artist: "2 Unlimited", album: "Get Ready!" },

  // --- 3 Idiots Soundtrack ---
  "Aal Izz Well.wav": { title: "Aal Izz Well", artist: "Sonu Nigam, Shaan, Swanand Kirkire", album: "3 Idiots" },
  "Give Me Some Sunshine.wav": { title: "Give Me Some Sunshine", artist: "Suraj Jagan, Sharman Joshi", album: "3 Idiots" },

  // --- 50 Cent ---
  "50 Cent - 21 Questions (Official Music Video) ft. Nate Dogg.wav": {
    title: "21 Questions",
    artist: "50 Cent ft. Nate Dogg",
    album: "Get Rich or Die Tryin'"
  },

  // --- ABBA Gold ---
  "01 Dancing Queen.wav": { title: "Dancing Queen", artist: "ABBA", album: "ABBA Gold" },
  "02 Knowing Me, Knowing You.wav": { title: "Knowing Me, Knowing You", artist: "ABBA", album: "ABBA Gold" },
  "14 Gimme! Gimme! Gimme! (A Man After Midnight).wav": { title: "Gimme! Gimme! Gimme!", artist: "ABBA", album: "ABBA Gold" },

  // --- Adele ---
  "Adele - Easy On Me (Official Video).wav": { title: "Easy On Me", artist: "Adele", album: "30" },
  "Adele - Hello (Official Music Video).wav": { title: "Hello", artist: "Adele", album: "25" },

  // --- Ajit Kadkade ---
  "01 Shree Ganesh Deva.wav": { title: "Shree Ganesh Deva", artist: "Ajit Kadkade", album: "Shree Ganesh Deva" },

  // --- Alisha Chinai ---
  "01 Made In India.mp3": { title: "Made In India", artist: "Alisha Chinai", album: "Best Of Me" },

  // --- Billy Joel (Fixing the 'Track X' issue) ---
  "01 Track 1.wav": { title: "Piano Man", artist: "Billy Joel", album: "Greatest Hits" },
  "02 Track 2.wav": { title: "Uptown Girl", artist: "Billy Joel", album: "Greatest Hits" },

  // --- Bollywood Compilation ---
  "'AGAR TUM SAATH HO' Full VIDEO song | Tamasha | Ranbir Kapoor, Deepika Padukone | T-Series.wav": {
    title: "Agar Tum Saath Ho",
    artist: "Alka Yagnik, Arijit Singh",
    album: "Tamasha"
  },
  "Naacho Naacho (Full Video) RRR - NTR, Ram Charan | M M Kreem | SS Rajamouli | Vishal Mishra & Rahul.wav": {
    title: "Naacho Naacho",
    artist: "Vishal Mishra, Rahul Sipligunj",
    album: "RRR"
  }
};

/**
 * Utility to get metadata if ID3 tags are missing
 */
export const getFallbackMetadata = (filename) => {
  return manualMetadataDB[filename] || null;
};