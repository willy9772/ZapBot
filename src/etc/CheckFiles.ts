import fs from 'fs';
import path from 'path';

export default function () {

    if (!fs.existsSync(path.join(__dirname, '../../config.json'))) {
        throw 'config.json is missing, run `npm run config` to create it';
    }

    // @ts-ignore
    global.cacheDir = path.join(__dirname, '../../.cache');

    if (!fs.existsSync(path.join(__dirname, '../../.cache'))) {
        fs.mkdirSync(path.join(__dirname, '../../.cache'));
    }

    console.log('All files are present');
}