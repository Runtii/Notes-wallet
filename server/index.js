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

const validatePassword = (password, hash) => {
  if (password === decrypt(hash)) {
    return true;
  } else return false;
};
app.post("/login", (req, res) => {
  const { username, password } = req.body;

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

app.put("/register", (req, res) => {
  const { username, password } = req.body;
  const encrypted = encrypt(password);
  insertNewUser(username, encrypted, function (newUserStatus) {
    if (newUserStatus.response) res.send(newUserStatus.response);
  });
});

app.put("/addNote", (req, res) => {
  const { username, password, title, note } = req.body;

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

app.post("/getNotes", (req, res) => {
  const { username, password } = req.body;
  getUserCredentialsByUsername(username, function (credentials) {
    const validation = validatePassword(password, credentials.data[0].password);
    if (!validation) res.send({ response: "BAD CREDENTIALS" });
    getNotes(credentials.data[0].ID, function (resultOfGetNotes) {
      result = resultOfGetNotes.data;
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
//TODO
app.post("/updateNote", (req, res) => {
  const { userID, password, IDPassword } = req.body;

  getUserCredentialsByID(userID, (credentials) => {
    const validation = validatePassword(
      password,
      credentials[0].password,
      credentials[0].salt
    );
    if (!validation) {
      res.send({ response: "NOT VALIDATED" });
      return 0;
    }

    validateOwnership(userID, IDPassword, (ownerValidation) => {
      if (!ownerValidation) {
        res.send({ response: "NOT AN OWNER" });
        return 0;
      }

      deletePassword(IDPassword, function (callback) {
        res.send(callback);
        return 0;
      });
    });
  });
});

const validateOwnership = (IDUser, IDNote, callback) => {
  getOwnerID(IDNote, (IDInDB) => {
    console.log(IDInDB);
    if (IDUser === IDInDB[0].id_user) return callback(true);
    else return callback(false);
  });
};

app.post("/deleteNote", (req, res) => {
  const { username, password, IDNote } = req.body;
  getUserCredentialsByUsername(username, function (credentials) {
    const validation = validatePassword(password, credentials.data[0].password);
    if (!validation) res.send({ response: "BAD CREDENTIALS" });
    validateOwnership(credentials.data[0].ID, IDNote, (ownerValidation) => {
      if (!ownerValidation) {
        res.send({ response: "NOT OWNER" });
        return 0;
      }
      deletePassword(IDNote, function (callback) {
        res.send(callback);
        return 0;
      });
    });
  });
});

app.listen(PORT, () => {
  console.log("Server is running");
});
