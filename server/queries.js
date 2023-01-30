const mysql = require("mysql");

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "Password",
  database: "noteswallet",
});

const addNote = (title, note, owner, callback) => {
  db.query(
    "INSERT INTO notes (title,note,owner) VALUES (?,?,?)",
    [title, note, owner],
    (err, result) => {
      if (err) return callback({ response: "ERROR" + err });
      else return callback({ response: "NOTE ADDED" });
    }
  );
};

const deleteNote = (IDNote, callback) => {
  db.query("DELETE FROM notes WHERE (ID = ?)", [IDNote], (err, res) => {
    if (err) return callback({ response: "ERROR: " + err });
    else return callback({ response: "NOTE DELETED" });
  });
};

const updateNote = (title, note, IDNote) => {
  db.query(
    "Update notes SET title = ?, note = ? where ID = ?",
    [title, note, IDNote],
    (err, result) => {
      if (err) return callback({ response: "ERROR: " + err });
      else return callback({ response: "NOTE CHANGED" });
    }
  );
};

const getNotes = (userID, callback) => {
  db.query("SELECT * FROM notes where owner = ?", [userID], (err, res) => {
    if (err) {
      return callback({ response: "ERROR" + err });
    } else {
      return callback({ response: "OK", data: res });
    }
  });
};

const insertNewUser = (username, password, callback) => {
  db.query(
    "INSERT INTO users (username,password) VALUES (?,?)",
    [username, password],
    (err, result) => {
      if (err) return callback({ response: "ERROR:" + err });
      else return callback({ response: "REGISTERED" });
    }
  );
};
const getUserCredentialsByUsername = (username, callback) => {
  db.query(
    "SELECT * FROM users where username = ?",
    [username],
    (err, result) => {
      if (err) {
        return callback({ response: "ERROR:" + err });
      }

      if (result === undefined) {
        return callback({ response: "Podano złe dane" });
      } else {
        return callback(result);
      }
    }
  );
};

module.exports = {
  addNote,
  deleteNote,
  updateNote,
  getNotes,
  insertNewUser,
  getUserCredentialsByUsername,
};
