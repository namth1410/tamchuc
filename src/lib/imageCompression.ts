import heic2any from 'heic2any';

export const compressImage = async (file: File, maxWidth = 1920, quality = 0.7): Promise<File> => {
  if (file.type === 'image/gif' || file.name.match(/\.(gif|mp4|mov|webm)$/i)) {
    return file;
  }

  let processFile = file;

  if (file.name.match(/\.(heic|heif)$/i) || file.type === 'image/heic') {
    try {
      const convertedBlob = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.8
      });
      const blobToUse = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
      processFile = new File([blobToUse], file.name.replace(/\.(heic|heif)$/i, '.jpg'), { type: 'image/jpeg' });
    } catch (err) {
      console.warn("Lỗi khi decode HEIC trên Client, bỏ qua và dùng file gốc:", err);
    }
  }

  if (!processFile.type.startsWith('image/')) return processFile;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(processFile);
    reader.onload = event => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(processFile);
        
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (!blob) return resolve(processFile);
          const compressedFile = new File([blob], processFile.name.replace(/\.[^/.]+$/, ".jpg"), {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        }, 'image/jpeg', quality);
      };
      img.onerror = error => reject(error);
    };
    reader.onerror = error => reject(error);
  });
};
