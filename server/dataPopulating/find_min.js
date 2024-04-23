const roomtypes = require('./roomType_fin.json')

let count = 0
let maxi = 0;
let mini = 60000;
for(let i=0;i<roomtypes.length;i++){
    count = count%3
    if(count == 0){
        if(i!== 0) console.log(mini," ",maxi)
        maxi = 0;
        mini = 60000;
        mini = Math.min(mini,roomtypes[i].price)
        maxi = Math.max(maxi,roomtypes[i].price)
    }
    else{
        mini = Math.min(mini,roomtypes[i].price)
        maxi = Math.max(maxi,roomtypes[i].price)
    }
    count+=1
    // console.log(roomtypes[i].roomType)
}
console.log(mini," ",maxi)