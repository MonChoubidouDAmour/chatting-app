import mysql2 from 'mysql2'
import dotenv from 'dotenv'
dotenv.config()


// This is a very week error handler. But alas, this isn't my original goal.
const errorHandling = (err) => err && console.error(err);

const pool = mysql2.createPool({
  host: process.env.HOST,
  user: process.env.MySQL_USER,
  database: process.env.MySQL_DATABASE,
  password: process.env.MySQL_PASSWORD
}).promise();


export const getMessagesMySQL = async (messageQuantity) => await pool.query('CALL getMessages(?)', [messageQuantity], errorHandling).then(res => res[0][0]);

export const sendMessageMySQL = async (userID, message) => await pool.query('CALL sendMessage(?,?)', [userID, message], errorHandling);

export const newUserMySQL = (username, password) => pool.query('CALL newUser(?,?)', [username, password], errorHandling);

export const getHashMySQL = async (username) => await pool.query('CALL getHash(?)', [username], errorHandling);

export const authenticateUserMySQL = (username, password) => pool.query('CALL authenticateUser(?,?)', [username, password], errorHandling);

