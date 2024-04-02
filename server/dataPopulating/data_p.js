const roomtypes = require('./roomType_fin.json')
const fs = require('fs');

roomtypes.forEach((ele) => {
    ele["avaliableRooms"] = 10
    ele["reservedRooms"] = 0
})

const jsonData = JSON.stringify(roomtypes, null, 2); // Convert roomTypes array to JSON string


fs.writeFile('roomType_fin.json', jsonData, (err) => {
    if (err) {
        console.error('Error writing to file:', err);
    } else {
        console.log('Data written to file successfully.');
    }
});