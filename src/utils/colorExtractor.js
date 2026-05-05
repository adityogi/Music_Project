export const extractDominantColor = (imageUrl) => {
  return new Promise((resolve) => {
    if (!imageUrl) {
      resolve('rgba(250, 35, 59, 0.15)'); // Default Apple Red
      return;
    }

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      
      // Scale down drastically for performance
      canvas.width = 50;
      canvas.height = 50;
      ctx.drawImage(img, 0, 0, 50, 50);
      
      const data = ctx.getImageData(0, 0, 50, 50).data;
      let r = 0, g = 0, b = 0, count = 0;

      // Sample every 4th pixel
      for (let i = 0; i < data.length; i += 16) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count++;
      }

      r = Math.floor(r / count);
      g = Math.floor(g / count);
      b = Math.floor(b / count);

      // Return a soft, transparent version of the color
      resolve(`rgba(${r}, ${g}, ${b}, 0.25)`);
    };

    img.onerror = () => resolve('rgba(250, 35, 59, 0.15)');
    img.src = imageUrl;
  });
};