import fs from "fs";
import Jimp from "jimp";
import path from 'path';
import url from 'url';
import axios from 'axios';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL) {
  return new Promise(async (resolve, reject) => {
    try {
      const imageBuffer = await fetchImageBuffer(inputURL);
      const photo = await Jimp.read(imageBuffer);
      const outpath =
        __dirname + "/tmp/filtered." + Math.floor(Math.random() * 2000) + ".jpg";
      await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(outpath, (img) => {
          resolve(outpath);
        });
    } catch (error) {
      reject(error);
    }
  });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
// files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files) {
  try {
    for (let file of files) {
      await fs.unlinkSync(file);
    }
  } catch (unlinkErr) {
    console.error(`Error deleting file ${filteredpath}:`, unlinkErr);
  }
}

export function isValidUrl(url) {
  try {
      new URL(url);
      return true;
  } catch (_) {
      return false;
  }
}

async function fetchImageBuffer(imageUrl) {
  try {    
    const response = await axios({
        url: imageUrl,
        method: 'GET',
        responseType: 'arraybuffer',
    });
  
    if (response.headers['content-type'].startsWith('image/')) {
        return Buffer.from(response.data, 'binary');
    } else {
        throw new Error('URL does not point to a valid image.');
    }
  } catch (error) {
    console.error('Unexpected error:', error.message);
    throw new Error('Unexpected error while fetching image buffer.');
  }
}