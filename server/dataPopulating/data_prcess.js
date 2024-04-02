const hotels = require('./Nomadnest.hotels.json');
const roomtypes = require('./roomType_in.json');
const fs = require('fs');

const roomTypes = [];

const Hotels = [];

let count = 0;
for (let i = 0; i < hotels.length; i++) {
    for (let j = 0; j < roomtypes.length; j++) {
        let temp = { ...roomtypes[j] };
        temp.hotelId = hotels[i]._id.$oid;
        count += 1;
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

