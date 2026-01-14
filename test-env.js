require('dotenv').config();

console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('PORT:', process.env.PORT);