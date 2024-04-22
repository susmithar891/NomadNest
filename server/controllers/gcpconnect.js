const {Storage} = require('@google-cloud/storage')
const Multer = require('multer')



const projectId = 'centered-oasis-418917'

const keyFilename = './gcp_key.json'

const storage = new Storage({
    projectId,
    keyFilename
})

const multer = Multer({
    storage : Multer.memoryStorage(),
    limits : {
        fileSize : 5*1024*1024
    }
})


const bucket = storage.bucket('nomadnest')


module.exports = {multer ,bucket}
