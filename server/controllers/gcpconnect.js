const { Storage } = require('@google-cloud/storage')
const Multer = require('multer')
require('dotenv').config()



const projectId = 'centered-oasis-418917'

const storage = new Storage({
    projectId,
    credentials : {
        "type": "service_account",
        "project_id": process.env.GOOGLE_OAUTH_project_id,
        "private_key_id": process.env.GOOGLE_OAUTH_private_key_id,
        "private_key": process.env.GOOGLE_OAUTH_private_key,
        "client_email": process.env.GOOGLE_OAUTH_client_email,
        "client_id": process.env.GOOGLE_OAUTH_client_id,
        "auth_uri": process.env.GOOGLE_OAUTH_auth_uri,
        "token_uri": process.env.GOOGLE_OAUTH_token_uri,
        "auth_provider_x509_cert_url": process.env.GOOGLE_OAUTH_auth_provider_x509_cert_url,
        "client_x509_cert_url": process.env.GOOGLE_OAUTH_client_x509_cert_url,
        "universe_domain": process.env.GOOGLE_OAUTH_universe_domain
    }
    

})

const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    }
})


const bucket = storage.bucket('nomadnest')


module.exports = { multer, bucket }