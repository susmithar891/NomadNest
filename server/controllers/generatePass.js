const crypto = require('crypto');

function generateRandomPassword(length) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}[]';
    let password = '';
    for (let i = 0; i < length; i++) {
        // Generate a random index to select a character from the charset
        const randomIndex = crypto.randomInt(0, charset.length);
        // Append the randomly selected character to the password
        password += charset[randomIndex];
    }

    return password;
}




module.exports = generateRandomPassword