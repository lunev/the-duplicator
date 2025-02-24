import fs from 'fs';
import path from 'path';
import extractZip from 'extract-zip';

// Get the zip file path from the command line arguments
const zipFilePath = process.argv[2];

// Get the current directory using import.meta.url
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const outputFolder = path.join(__dirname, './build-versions');

// Ensure the build-versions folder exists
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder, { recursive: true });
}

// Check if the zip file path is provided
if (!zipFilePath) {
  console.error('Please provide a zip file path.');
  process.exit(1);
}

// Extract the zip file to the build-versions folder
extractZip(zipFilePath, { dir: outputFolder }, (err) => {
  if (err) {
    console.error('Error extracting the zip file', err);
  } else {
    console.log(`Successfully extracted the zip to ${outputFolder}`);
  }
});

// npm run build-prev -- ./chrome-extension/chrome-extension-v5.0.1.zip
