import fs from 'fs';
import path from 'path';
import heicConvert from 'heic-convert';

const dir = path.join(process.cwd(), 'uploads', 'tamchuc');
const targetDir = path.join(process.cwd(), 'uploads');
const dataFile = path.join(process.cwd(), 'data.json');

async function processMedia() {
  if (!fs.existsSync(dir)) {
    console.error('Directory does not exist:', dir);
    process.exit(1);
  }

  const files = fs.readdirSync(dir);
  const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  const tripId = 'tam-chuc';
  if (!data.photos[tripId]) data.photos[tripId] = [];

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    const filePath = path.join(dir, file);
    let newFilename = `tamchuc_import_${Date.now()}`;
    let finalExt = ext;
    let finalPath = '';

    console.log(`Processing ${file}...`);

    if (ext === '.heic') {
      try {
        const inputBuffer = fs.readFileSync(filePath);
        const outputBuffer = await heicConvert({
          buffer: inputBuffer,
          format: 'JPEG',
          quality: 0.5
        });
        finalExt = '.jpg';
        finalPath = path.join(targetDir, newFilename + finalExt);
        fs.writeFileSync(finalPath, outputBuffer);
      } catch (err) {
        console.error(`Failed to convert HEIC ${file}:`, err);
        continue;
      }
    } else if (['.jpg', '.jpeg', '.png', '.gif', '.mov', '.mp4'].includes(ext)) {
      finalPath = path.join(targetDir, newFilename + finalExt);
      fs.copyFileSync(filePath, finalPath);
    } else {
      console.log(`Skipping unsupported file ${file}`);
      continue;
    }

    const photoEntry = {
      id: Date.now().toString(),
      url: `/uploads/${newFilename}${finalExt}`,
      title: "Kỷ niệm Tam Chúc",
      author: "Vua Tuyển (Auto)",
      likes: [],
      timestamp: new Date().toISOString()
    };

    data.photos[tripId].push(photoEntry);
    
    // Slight delay to ensure unique timestamps/IDs
    await new Promise(r => setTimeout(r, 50));
  }

  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  console.log('Import complete! Successfully added to data.json');
}

processMedia().catch(console.error);
