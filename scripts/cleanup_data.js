import fs from 'fs';
import path from 'path';

const dataFile = path.join(process.cwd(), 'data.json');
const uploadsDir = path.join(process.cwd(), 'uploads');

if (!fs.existsSync(dataFile)) {
  console.error("data.json not found!");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
let removedCount = 0;

for (const tripId in data.photos) {
  const photos = data.photos[tripId];
  const validPhotos = [];
  
  for (const photo of photos) {
    if (!photo.url) continue;
    
    // Extract filename from URL (e.g. /uploads/filename.ext)
    const filename = photo.url.split('/').pop();
    const filePath = path.join(uploadsDir, filename);
    
    if (fs.existsSync(filePath)) {
      validPhotos.push(photo);
    } else {
      console.log(`Removed orphaned photo entry in trip ${tripId}: ${photo.url}`);
      removedCount++;
    }
  }
  
  data.photos[tripId] = validPhotos;
}

fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
console.log(`Cleanup complete! Removed ${removedCount} orphaned photo entries from data.json.`);
