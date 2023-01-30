const express = require("express");
const app = express();
const PORT = 3001;
const cors = require("cors");
const {
  getOwnerID,
  addNote,
  deleteNote,
  updateNote,
  getNotes,
  insertNewUser,
  getUserCredentialsByUsername,
} = require("./queries");
const { encrypt, decrypt } = require("./encryptionHandler");
app.use(cors());
app.use(express.json());

/**
 * validates password
 * @param {*} password - password sent via request
 * @param {*} hash - hash of password from DB
 * @returns boolean
 */
const validatePassword = (password, hash) => {
  if (password === decrypt(hash)) {
    return true;
  } else return false;
};

/**
 * login end point
 */
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.send({ response: "ERROR EMPTY CREDENTIALS" });
    return 0;
  }
  getUserCredentialsByUsername(username, function (credentials) {
    let status = "";
    if (credentials.response === "BAD CREDENTIALS")
      res.send({ response: credentials.response });

    const validation = validatePassword(password, credentials.data[0].password);
    if (validation) {
      status = "LOGGED IN";
      res.send({ response: "AUTH" });
      return 0;
    } else {
      res.send({ response: "Złe dane!" });
    }
  });
});

/**
 * register end point
 */
app.put("/register", (req, res) => {
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.send({ response: "ERROR EMPTY CREDENTIALS" });
    return 0;
  }
  const encrypted = encrypt(password);
  insertNewUser(username, encrypted, function (newUserStatus) {
    if (newUserStatus.response) res.send(newUserStatus.response);
  });
});

/**
 * add note end point
 */
app.put("/addNote", (req, res) => {
  const { username, password, title, note } = req.body;

  if (title === "" || note === "") {
    res.send({ response: "ERROR EMPTY TITLE OR NOTE" });
    return 0;
  }
  if (username === "" || password === "") {
    res.send({ response: "ERROR EMPTY CREDENTIALS" });
    return 0;
  }

  getUserCredentialsByUsername(username, function (credentials) {
    let status = "";
    if (credentials.response === "BAD CREDENTIALS")
      res.send({ response: credentials.response });

    const validation = validatePassword(password, credentials.data[0].password);
    if (!validation) res.send({ response: "BAD CREDENTIALS" });
    if (validation) {
      if (password != null || userID != null) {
        addNote(
          encrypt(title),
          encrypt(note),
          credentials.data[0].ID,
          function (resultOfAddPassword) {
            res.send(resultOfAddPassword);
          }
        );
      }
    }
  });
});

/**
 * get notes end point
 */
app.post("/getNotes", (req, res) => {
  const { username, password } = req.body;
  if (username === "" || password === "") {
    res.send({ response: "EMPTY CREDENTIALS" });
    return 0;
  }
  getUserCredentialsByUsername(username, function (credentials) {
    const validation = validatePassword(password, credentials.data[0].password);
    if (!validation) res.send({ response: "BAD CREDENTIALS" });
    getNotes(credentials.data[0].ID, function (resultOfGetNotes) {
      result = resultOfGetNotes;
      let returnTable = [];
      result.map((val, key) => {
        returnTable.push({
          ID: val.ID,
          title: decrypt(val.title),
          note: decrypt(val.note),
        });
      });
      res.send(returnTable);
    });
  });
});

/**
 * update notes end point
 */
app.put("/updateNote", (req, res) => {
  const { username, password, IDNote, title, note } = req.body;
  if (title === "" || note === "") {
    res.send({ response: "ERROR EMPTY TITLE OR NOTE" });
    return 0;
  }
  if (username === "" || password === "") {
    res.send({ response: "ERROR EMPTY CREDENTIALS" });
    return 0;
  }

  getUserCredentialsByUsername(username, function (credentials) {
    const validation = validatePassword(password, credentials.data[0].password);
    if (!validation) res.send({ response: "BAD CREDENTIALS" });
    validateOwnership(credentials.data[0].ID, IDNote, (ownerValidation) => {
      if (!ownerValidation) {
        res.send({ response: "NOT OWNER" });
        return 0;
      }
      updateNote(encrypt(title), encrypt(note), IDNote, function (callback) {
        res.send(callback);
        return 0;
      });
    });
  });
});

/**
 * validates ownership of note
 * @param {*} IDUser - id of user from request
 * @param {*} IDNote - id of password
 * @param {*} callback - boolean
 */
const validateOwnership = (IDUser, IDNote, callback) => {
  getOwnerID(IDNote, (IDInDB) => {
    if (IDUser === IDInDB[0].owner) return callback(true);
    else return callback(false);
  });
};

/**
 * delete note end point
 */
app.post("/deleteNote", (req, res) => {
  const { username, password, IDNote } = req.body;
  if (IDNote === "") {
    res.send({ response: "ERROR EMPTY ID" });
    return 0;
  }
  if (username === "" || password === "") {
    res.send({ response: "ERROR EMPTY CREDENTIALS" });
    return 0;
  }
  getUserCredentialsByUsername(username, function (credentials) {
    const validation = validatePassword(password, credentials.data[0].password);
    if (!validation) res.send({ response: "BAD CREDENTIALS" });
    validateOwnership(credentials.data[0].ID, IDNote, (ownerValidation) => {
      if (!ownerValidation) {
        res.send({ response: "NOT OWNER" });
        return 0;
      }
      deleteNote(IDNote, function (callback) {
        res.send(callback);
        return 0;
      });
    });
  });
});

/**
 * makes app listen on port 3001
 */
app.listen(PORT, () => {
  console.log("Server is running");
});
