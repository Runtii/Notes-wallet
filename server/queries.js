const mysql = require("mysql");

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "Password",
  database: "noteswallet",
});

/**
 * gets users' credentials by its username
 * used mainly for validation
 *
 * @input
 * @param {*} username
 * @param {*} callback - callback function
 *
 * @returns
 * callback response if error occurs
 * or
 * result from DB
 */

/**
 *
 */
const getUserCredentialsByUsername = (username, callback) => {
  db.query("SELECT * FROM users where username = ?", [username], (err, res) => {
    if (err) {
      return callback({ response: "BAD CREDENTIALS" });
    }

    if (res === undefined) {
      return callback({ response: "BAD CREDENTIALS" });
    } else {
      return callback({ data: res });
    }
  });
};

/**
 * inserts new user into DB
 * @input
 * @param {*} username
 * @param {*} password - encrypted password
 * @param {*} callback - callback function
 *
 * @returns
 * callback message
 */
const insertNewUser = (username, password, callback) => {
  db.query(
    "INSERT INTO users (username,password) VALUES (?,?)",
    [username, password],
    (err, res) => {
      if (err) return callback({ response: "USER ALREADY EXISTS" });
      else return callback({ response: "REGISTERED" });
    }
  );
};

/**
 * inputs new note into DB
 *
 * @input
 * @param {*} title - title of new note
 * @param {*} note - note
 * @param {*} ownerID - owner ID
 * @param {*} callback - callback function
 *
 * @returns
 * callback message
 */
const addNote = (title, note, ownerID, callback) => {
  db.query(
    "INSERT INTO notes (title,note,owner) VALUES (?,?,?)",
    [title, note, ownerID],
    (err, res) => {
      if (err) return callback({ response: "ERROR" });
      else return callback({ response: "NOTE ADDED" });
    }
  );
};

/**
 * returns selected notes from DB
 *
 * @input
 * @param {*} userID - user ID we want to get notes for
 * @param {*} callback - callback function
 *
 * @returns
 * callback message and resources if everything went OK
 */
const getNotes = (userID, callback) => {
  db.query("SELECT * FROM notes where owner = ?", [userID], (err, res) => {
    if (err) {
      return callback({ response: "ERROR" + err });
    } else {
      return callback(res);
    }
  });
};

/**
 * updates note that is stored in DB
 *
 * @input
 * @param {*} title - new title of note
 * @param {*} note - new note
 * @param {*} IDNote - ID of note to be updated
 *
 * @returns
 * callback message
 */
//TODO
const updateNote = (title, note, IDNote, callback) => {
  db.query(
    "Update notes SET title = ?, note = ? where ID = ?",
    [title, note, IDNote],
    (err, res) => {
      if (err) return callback({ response: "ERROR " });
      else return callback({ response: "NOTE CHANGED" });
    }
  );
};

/**
 * deletes note from DB
 *
 * @input
 * @param {*} IDNote - ID of note to be deleted
 * @param {*} callback - callback function
 *
 * @returns
 * callback message
 */
const deleteNote = (IDNote, callback) => {
  db.query("DELETE FROM notes WHERE (ID = ?)", [IDNote], (err, res) => {
    if (err) return callback({ response: "ERROR" });
    else return callback({ response: "NOTE DELETED" });
  });
};
/**
 * gets user ID that owns password to be deleted (validation purposes)
 *
 * @param {*} IDNote - ID of password that ownership is being validated
 * @param {*} callback - callback function
 *
 * @returns
 * response message if error or ID of user
 */
const getOwnerID = (IDNote, callback) => {
  db.query("SELECT owner FROM notes where (ID = ?)", [IDNote], (err, res) => {
    if (err) {
      return callback({ response: "ERROR" });
    } else {
      return callback(res);
    }
  });
};
module.exports = {
  getOwnerID,
  addNote,
  deleteNote,
  updateNote,
  getNotes,
  insertNewUser,
  getUserCredentialsByUsername,
};
