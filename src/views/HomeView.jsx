import React, { useEffect, useState } from 'react';
import { Music, History, Loader2 } from 'lucide-react';
import { getDirectoryHandle } from '../utils/db';
import { verifyPermission, extractFilesFromHandle } from '../utils/dropReader';
import { parseLocalFolder } from '../utils/musicParser';
import { usePlayerStore } from '../store/usePlayerStore';

export default function HomeView() {
  const [savedHandle, setSavedHandle] = useState(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const { setLibrary, setView } = usePlayerStore();

  // On boot, check IndexedDB to see if we saved a folder previously
  useEffect(() => {
    getDirectoryHandle().then((handle) => {
      if (handle) setSavedHandle(handle);
    });
  }, []);

  const handleRestore = async () => {
    setIsRestoring(true);
    try {
      // Prompt the user to re-grant read access to the saved folder
      const hasPermission = await verifyPermission(savedHandle);
      if (hasPermission) {
        const rawFiles = await extractFilesFromHandle(savedHandle);
        const { songs, albums } = await parseLocalFolder(rawFiles);
        setLibrary(songs, albums);
        setView('library');
      }
    } catch (error) {
      console.error("Failed to restore library:", error);
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-apple-red opacity-10 blur-[100px] rounded-full pointer-events-none"></div>
      
      <Music size={64} className="text-apple-red mb-6 relative z-10" />
      <h1 className="text-4xl font-bold mb-4 relative z-10 text-apple-text">Your Local Music</h1>
      
      {savedHandle ? (
        <div className="flex flex-col items-center relative z-10 mt-4 bg-apple-border/20 p-6 rounded-2xl border border-apple-border/50 backdrop-blur-sm">
            <p className="text-apple-text font-medium mb-2 flex items-center gap-2">
                <History size={18} className="text-apple-muted" />
                Found previous library: <span className="text-apple-red">{savedHandle.name}</span>
            </p>
            <button 
                onClick={handleRestore}
                disabled={isRestoring}
                className="mt-4 bg-apple-red text-white px-8 py-3 rounded-lg font-semibold hover:bg-apple-red-hover transition shadow flex items-center gap-2 disabled:opacity-50"
            >
                {isRestoring ? <Loader2 size={20} className="animate-spin" /> : <Music size={20} />}
                {isRestoring ? 'Restoring Library...' : 'Restore Library'}
            </button>
        </div>
      ) : (
        <p className="text-apple-muted relative z-10">Select "Open Folder" in the sidebar to load your library.</p>
      )}
    </div>
  );
}