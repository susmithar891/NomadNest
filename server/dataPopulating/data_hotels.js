const hotels = require('./Nomadnest.hotels.json');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto')
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

const Hotels = Promise.all(hotels.map(async (hotel, index) => {
    let temp = { ...hotel };
    temp.hotelName = hotelNames[index];
    const newDirPath = `./dataPopulating/scrape/hotels/${hotelNames[index]}/`;
    hotelNames[index] = hotelNames[index].replace(/ /g,"%20");

    try {
        const files = await fs.promises.readdir(newDirPath);
        const img = [];

        for (const file of files) {
            const currentFilePath = path.join(newDirPath, file);
            const randString = generateRandomString(32);
            const newFilePath = path.join(newDirPath, `${randString}.jpg`);

            await fs.promises.rename(currentFilePath, newFilePath);
            img.push(`https://storage.googleapis.com/nomadnest/hotels/${hotelNames[index]}/${randString}.jpg`);
        }

        console.log(img)

        temp.images = img;
    } catch (err) {
        console.error('Error reading directory or renaming files:', err);
    }
    // if(index === 0) console.log(temp)
    return temp;
}));


Hotels.then((hotels) => {
    const hotelNamesArray = hotels.map((hotel) => {
        return hotel});
        console.log(hotelNamesArray)
    fs.writeFile('hotels_fin.json', JSON.stringify(hotelNamesArray), (err) => {
    if (err) {
        console.error('Error writing to file:', err);
    } else {
        console.log('Data written to file successfully.');
    }
})
})
.catch((err) => {
    console.log(err)
})




// for (let i = 0; i < hotels.length; i++){
//     let temp = { ...hotels[i] };
//     temp.hotelName = hotelNames[i]
//     // const dirPath = `./dataPopulating/scrape/hotels/${i+1}/`
//     const newDirPath = `./dataPopulating/scrape/hotels/${hotelNames[i]}/`
//     // fs.rename(dirPath, newDirPath, err => {
//     //     if (err) {
//     //         console.error('Error renaming directory:', err);
//     //     } else {
//     //         console.log(`Directory renamed from ${dirPath} to ${newDirPath}`);
//     //     }
//     // });
//     fs.readdir(newDirPath, async (err, files) => {
//         if (err) {
//             console.error('Error reading directory:', err);
//             return;
//         }
//         img = []
//         await files.forEach(async(file) => {
//             const currentFilePath = path.join(newDirPath, file);
//             await fs.stat(currentFilePath, async(err, stats) => {
//                 if (err) {
//                     console.error('Error getting file stats:', err);
//                     return;
//                 }
//                 if (stats.isFile()) {
//                     const randString = generateRandomString(32)
//                     const newFilePath = path.join(newDirPath, `${randString}.jpg`); // Change the new filename here
//                     await fs.rename(currentFilePath, newFilePath, err => {
//                         if (err) {
//                             console.error(`Error renaming ${currentFilePath}:`, err);
//                         } else {
//                             // console.log(`Renamed ${currentFilePath} to ${newFilePath}`);
//                             // https://storage.googleapis.com/nomadnest/users/Akhil_3VNkf7WgUK5nzNZGedCZpCnaiNMHL4TI
//                             // img = ([...img,`https://storage.googleapis.com/nomadnest/hotels/${hotelNames[i]}/${randString}.jpg`])
//                             // console.log(`https://storage.googleapis.com/nomadnest/hotels/${hotelNames[i]}/${randString}.jpg`)
//                             img.push(`https://storage.googleapis.com/nomadnest/hotels/${hotelNames[i]}/${randString}.jpg`)
//                         }
//                     });

                    

//                 } else if (stats.isDirectory()) {
//                     // It's a directory
//                     console.log('Directory:', currentFilePath);
//                 }


//             });
//         });
//         console.log(img)
//         // temp.images = img
//     });
    
//     Hotels.push(temp)

// }

// const jsonData = JSON.stringify(Hotels, null, 2); // Convert roomTypes array to JSON string

