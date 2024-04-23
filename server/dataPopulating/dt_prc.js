const rooms = require('./rooms.json')
const hotels = require('./hotels_fin.json');
const roomtypes = require('./roomType_fin.json');
const fs = require('fs');


const Rooms = []

room_num = []


console.log(hotels.length)
console.log(roomtypes.length)
console.log(rooms.length)
let count  = 0
for(let i=0;i<hotels.length;i++){
    for(let j=0;j<roomtypes.length;j++){
        for(let k=0;k<rooms.length;k++){
            let temp = { ...rooms[k]}
            temp.hotelId = hotels[i]._id.$oid
            temp.hotelName = hotels[i].hotelName
            temp.roomType = roomtypes[j].roomType
            temp.price = roomtypes[j].price
            let randomNumber = Math.floor(Math.random() * (500 - 100 + 1)) + 100;
            while(randomNumber in room_num){
                randomNumber = Math.floor(Math.random() * (500 - 100 + 1)) + 100;
            }
            room_num.push(randomNumber)
            temp.roomNo = randomNumber
            delete temp.preview
            Rooms.push(temp)
            count+=1;
            console.log(count)
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
