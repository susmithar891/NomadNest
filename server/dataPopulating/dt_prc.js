const rooms = require('./rooms.json')
const hotels = require('./Nomadnest.hotels.json');
const roomtypes = require('./roomType_in.json');
const fs = require('fs');


const Rooms = []

room_num = []

for(let i=0;i<hotels.length;i++){
    for(let j=0;j<roomtypes.length;j++){
        for(let k=0;k<rooms.length;k++){
            let temp = { ...rooms[k]}
            temp.hotelId = hotels[i]._id.$oid
            temp.roomType = roomtypes[j].roomType
            
            let randomNumber = Math.floor(Math.random() * (500 - 100 + 1)) + 100;
            while(randomNumber in room_num){
                randomNumber = Math.floor(Math.random() * (500 - 100 + 1)) + 100;
            }
            room_num.push(randomNumber)
            temp.roomNo = randomNumber
            Rooms.push(temp)
        }

    }
}


const jsonData = JSON.stringify(Rooms, null, 2); // Convert roomTypes array to JSON string

fs.writeFile('rooms_fin.json', jsonData, (err) => {
    if (err) {
        console.error('Error writing to file:', err);
    } else {
        console.log('Data written to file successfully.');
    }
});
