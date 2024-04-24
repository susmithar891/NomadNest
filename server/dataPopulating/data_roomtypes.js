const hotels = require('./hotels_fin.json');
const roomtypes = require('./roomType_in.json');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { random } = require('lodash');

function generateRandomString(length) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var st = '';
    for (let i = 0; i < length; i++) {
        // Generate a random index to select a character from the charset
        const randomIndex = crypto.randomInt(0, charset.length);
        // Append the randomly selected character to the string
        st += charset[randomIndex];
    }

    return st;
}

const roomTypes = [];
const hotelNames = [
    "Grand Hotel",
    "Royal Palace",
    "Sunset Resort",
    "Ocean View Inn",
    "Mountain Lodge",
    "Golden Sands Hotel",
    "Majestic Suites",
    "Starlight Hotel",
    "Emerald Retreat",
    "Luxury Haven"
];

let count = 0;
for (let i = 0; i < hotels.length; i++) {
    for (let j = 0; j < roomtypes.length; j++) {
        let temp = { ...roomtypes[j] };
        temp.hotelId = hotels[i]._id.$oid;
        temp.hotelName = hotels[i].hotelName;
        // const dirPath = `./dataPopulating/scrape/roompreview/${i+1}/`;
        const newDirPath = `./dataPopulating/scrape/roompreview/${hotelNames[i]}/`;
        const prices = [15000,20000,25000,30000,35000,40000,45000,50000,55000]
        const files = fs.readdirSync(newDirPath);
        const currentFilePath = path.join(newDirPath, `${j+1}.jpg`);
        const newFilePath = path.join(newDirPath, `${temp.roomType}.jpg`);
        const randomIndex = Math.floor(j*3 + Math.random() * 3);
        const randomPrice = prices[randomIndex];
        temp.price = randomPrice
        let hname = hotelNames[i].replace(/ /g,"%20")
        temp.roomPrev = `https://storage.googleapis.com/nomadnest/roompreview/${hname}/${temp.roomType}.jpg`         
        fs.renameSync(currentFilePath, newFilePath);
        roomTypes.push(temp);

    }
}


const jsonData = JSON.stringify(roomTypes, null, 2); // Convert roomTypes array to JSON string


fs.writeFile('roomType_fin.json', jsonData, (err) => {
    if (err) {
        console.error('Error writing to file:', err);
    } else {
        console.log('Data written to file successfully.');
    }
});

