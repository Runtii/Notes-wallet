import "./App.css";
import Axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [page, setPage] = useState("LOGIN");

  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");

  const [DBNotes, setDBNotes] = useState([
    {
      ID: -1,
      title: "Uwaga!",
      note: "Tutaj pojawią się twoje notatki ale najpierw musisz jakąś stworzyć!",
    },
  ]);

  /**
   * changes page that user sees
   *
   * @input
   * @param {*} Page name of page to change to
   */
  const goTo = (Page) => {
    setPage(Page);
  };

  /**
   * makes request to login user
   * @input
   * @param username - username that was inputted into form
   * @param password - password that was inputted into form
   */
  const logIn = () => {
    Axios.post("http://localhost:3001/login", {
      username: username,
      password: password,
    }).then((response) => {
      if (response.data.response === "AUTH") goTo("USER PANEL");
    });
  };
  /**
   * makes request to register new user
   *
   * @input
   * @param username - username that was inputted into form
   * @param password - password that was inputted into form
   */
  const register = () => {
    Axios.put("http://localhost:3001/register", {
      username: username,
      password: password,
    }).then((response) => {
      if (response.data === "REGISTERED") {
        goTo("LOGIN");
      } else {
      }
    });
  };
  /**
   * makes request to add new note into DB
   *
   * @input
   * @param username - username that was inputted into form while logging in
   * @param password - password that was inputted into form while logging in
   * @param title - title of new note
   * @param note - content of new note
   */
  const addNote = () => {
    if (title !== "" && note !== "")
      Axios.put("http://localhost:3001/addNote", {
        username: username,
        password: password,
        title: title,
        note: note,
      }).then((response) => {
        if (response.data.response === "NOTE ADDED") {
          document.getElementById("title").value = "";
          document.getElementById("note").value = "";
          setTitle("");
          setNote("");
        } else {
        }
      });
  };
  /**
   * gets all users' notes from DB
   *
   * @param username - username that was inputted into form while logging in
   * @param password - password that was inputted into form while logging in
   */
  const getNotes = () => {
    hideAll();
    Axios.post("http://localhost:3001/getNotes", {
      username: username,
      password: password,
    }).then((response) => {
      if (response.statusText === "OK") {
        setDBNotes(response.data);
      }

      if (response.data.length === 0) {
        setDBNotes([
          {
            ID: -1,
            title: "Uwaga!",
            note: "Tutaj pojawią się twoje notatki ale najpierw musisz jakąś stworzyć!",
          },
        ]);
      }
    });
  };

  /**
   * Support function for updateNote handles empty strings (user don't want to update some part of note), makes request with given params
   *
   * @input auto
   * @param username - username that was inputted into form while logging in
   * @param password - password that was inputted into form while logging in
   *
   * @input from function
   * @param {*} IDNote - id of note to be updated
   * @param {*} titleIN - new title
   * @param {*} noteIN - new note
   */
  const updateNoteEmptyString = (IDNote, titleIN, noteIN) => {
    Axios.put("http://localhost:3001/updateNote", {
      username: username,
      password: password,
      IDNote: IDNote,
      title: titleIN,
      note: noteIN,
    }).then((response) => {
      if (response.data.response === "NOTE CHANGED") {
        document.getElementById("editTitle" + IDNote).value = "";
        document.getElementById("editNote" + IDNote).value = "";
        setTitle("");
        setNote("");
        hideAll();
        getNotes();
      }
    });
  };

  /**
   *  triggers update note function
   *
   * @param {*} IDNote - id of note to be updated
   * @param {*} titleIN - new title
   * @param {*} noteIN - new note
   *
   * also clears value after sending request
   */
  const updateNote = (IDNote, titleIN, noteIN) => {
    if (title === "" && note === "") {
      return 0;
    }
    if (title === "") {
      updateNoteEmptyString(IDNote, titleIN, note);
    } else if (note === "") {
      updateNoteEmptyString(IDNote, title, noteIN);
    } else {
      updateNoteEmptyString(IDNote, title, note);
    }
    document.getElementById("editTitle" + IDNote).value = "";
    document.getElementById("editNote" + IDNote).value = "";
    document.getElementById("editTitle" + IDNote).innerHTML = "";
    document.getElementById("editNote" + IDNote).innerHTML = "";
  };
  /**
   * deletes notes
   * @param {*} IDNote - id of note to be deleted
   * @param username - username that was inputted into form while logging in
   * @param password - password that was inputted into form while logging in
   */
  const deleteNote = (IDNote) => {
    Axios.post("http://localhost:3001/deleteNote", {
      username: username,
      password: password,
      IDNote: IDNote,
    }).then((response) => {
      if (response.data.response === "NOTE DELETED") {
        DBNotes.map((val, key) => {
          document.getElementById("edit" + val.ID).style.display = "none";
        });
        getNotes();
      } else {
      }
    });
  };

  /**
   * function that changes visibility of share component by ID of it
   * @param {*} ID - ID of component to change visibility
   */
  const setVisibility = (ID) => {
    if (document.getElementById(ID).style.display === "block")
      document.getElementById(ID).style.display = "none";
    else {
      hideAll();
      document.getElementById(ID).style.display = "block";
    }
  };

  /**
   * hides all edit
   */
  const hideAll = () => {
    DBNotes.map((val, key) => {
      document.getElementById("edit" + val.ID).style.display = "none";
    });
  };

  /**
   * triggers request to get notes after changing page to notes panel
   */
  useEffect(() => {
    if (page === "NOTES PANEL") {
      getNotes();
    }
  }, [page]);

  /**
   *
   * @returns content of login page
   */
  function loginPage() {
    return (
      <div className="Content" id="register">
        <h1>Logowanie</h1>
        <form>
          <label for="username">Nazwa użytkownika</label>
          <input
            type="text"
            id="username"
            className="login"
            placeholder="Login"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />

          <label for="password">Hasło</label>
          <input
            type="password"
            id="password"
            className="password"
            placeholder="Hasło"
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
          <button
            onClick={(event) => {
              event.preventDefault();
              document.getElementById("password").value = "";
              document.getElementById("username").value = "";
              logIn();
            }}
          >
            Zaloguj
          </button>
          <button
            onClick={(event) => {
              event.preventDefault();
              document.getElementById("password").value = "";
              document.getElementById("username").value = "";
              setPassword("");
              setUsername("");
              goTo("REGISTER");
            }}
          >
            Przejdź do strony zakładania konta
          </button>
        </form>
      </div>
    );
  }

  /**
   *
   * @returns content of register page
   */
  function registerPage() {
    return (
      <div className="Content" id="rejestracja">
        <h1>Tworzenie konta</h1>
        <form>
          <label for="username">Nazwa użytkownika</label>
          <input
            type="text"
            id="username"
            className="username"
            placeholder="Login"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <label for="password">Hasło</label>
          <input
            type="password"
            id="password"
            className="password"
            placeholder="Hasło"
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />

          <button
            onClick={(event) => {
              event.preventDefault();
              document.getElementById("password").value = "";
              document.getElementById("username").value = "";
              register();
            }}
          >
            Zarejestruj
          </button>
          <button
            onClick={(event) => {
              event.preventDefault();
              setPassword("");
              setUsername("");
              document.getElementById("password").value = "";
              document.getElementById("username").value = "";
              goTo("LOGIN");
            }}
          >
            Przejdź do strony logowania
          </button>
        </form>
      </div>
    );
  }

  /**
   *
   * @returns content of user panel
   */
  function userPanel() {
    return (
      <div className="Content" id="userPanel">
        <div className="ICON"></div>
        <div className="leftMenu">
          <button
            className="userPanel"
            id="showNotes"
            onClick={() => {
              goTo("NOTES PANEL");
              getNotes();
            }}
          >
            Pokaż zachowane notatki
          </button>
          <button
            className="userPanel"
            onClick={() => {
              goTo("LOGIN");
              setPassword("");
              setUsername("");
              setDBNotes([
                {
                  ID: -1,
                  title: "Uwaga!",
                  note: "Tutaj pojawią się twoje notatki ale najpierw musisz jakąś stworzyć!",
                },
              ]);
            }}
          >
            Wyloguj
          </button>
        </div>
        <div className="rightMenu">Cześć {username}!</div>
        <form className="userPanel">
          <label for="title">TYTUŁ NOWEJ NOTATKI</label>
          <input
            type="text"
            className="userPanel"
            id="title"
            onChange={(event) => {
              setTitle(event.target.value);
            }}
          ></input>
          <label for="note">TREŚĆ NOWEJ NOTATKI</label>
          <textarea
            type="text"
            className="userPanel"
            id="note"
            onChange={(event) => {
              setNote(event.target.value);
            }}
          ></textarea>
          <button
            className="userPanel"
            onClick={(event) => {
              event.preventDefault();
              addNote();
            }}
          >
            Dodaj notatkę
          </button>
        </form>
      </div>
    );
  }
  /**
   *
   * @returns content of notes panel
   */
  function notesPanel() {
    return (
      <div className="Content" id="userPanel">
        <div className="ICON"></div>
        <div className="leftMenu">
          <button
            className="userPanel"
            id="showPanel"
            onClick={() => {
              goTo("USER PANEL");
            }}
          >
            Dodaj notatkę
          </button>
          <button
            className="userPanel"
            onClick={() => {
              goTo("LOGIN");
              setPassword("");
              setUsername("");
              setDBNotes([
                {
                  ID: -1,
                  title: "Uwaga!",
                  note: "Tutaj pojawią się twoje notatki ale najpierw musisz jakąś stworzyć!",
                },
              ]);
            }}
          >
            Wyloguj
          </button>
        </div>
        <div className="rightMenu">Cześć {username}!</div>
        <h2>NOTATKI</h2>
        {DBNotes.map((val, key) => {
          return (
            <div key={key} className="newNote">
              <div
                className="editPage"
                id={"edit" + val.ID}
                style={{
                  display: "none",
                }}
              >
                Edytuj notatkę o tytule {val.title}
                <form className="userPanel">
                  <label for="title">NOWY TYTUŁ NOTATKI</label>
                  <input
                    type="text"
                    className="editTitle"
                    id={"editTitle" + val.ID}
                    onChange={(event) => {
                      setTitle(event.target.value);
                    }}
                  ></input>
                  <label for="note">NOWA TREŚĆ NOTATKI</label>
                  <textarea
                    type="text"
                    className="editNote"
                    id={"editNote" + val.ID}
                    onChange={(event) => {
                      setNote(event.target.value);
                    }}
                  ></textarea>
                  <button
                    className="userPanel"
                    onClick={(event) => {
                      event.preventDefault();
                      updateNote(val.ID, val.title, val.note);
                    }}
                  >
                    Zapisz
                  </button>
                </form>
              </div>

              <h4 className="title">{val.title}</h4>
              <div className="noteBackground">
                <h6>{val.note}</h6>
                {val.ID === -1 ? "" : printButtons(val.ID)}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  /**
   * support function for edit form (prints buttons)
   *
   * @param {*} ID - id of note that is linked with this edit form
   * @returns buttons
   */
  function printButtons(ID) {
    return (
      <div>
        <button
          id={"editButton" + ID}
          className="edit"
          onClick={() => {
            setVisibility("edit" + ID);
            document.getElementById("editTitle" + ID).value = "";
            document.getElementById("editNote" + ID).value = "";
            document.getElementById("editTitle" + ID).innerHTML = "";
            document.getElementById("editNote" + ID).innerHTML = "";
            setTitle("");
            setNote("");
          }}
        />
        <button
          id={"delete" + ID}
          className="delete"
          onClick={() => {
            deleteNote(ID);
          }}
        />
      </div>
    );
  }

  /**
   *
   * @returns returns specified page
   */
  function printPage() {
    switch (page) {
      case "LOGIN":
        return loginPage();

      case "REGISTER":
        return registerPage();

      case "USER PANEL":
        return userPanel();

      case "NOTES PANEL":
        return notesPanel();

      default:
        return loginPage();
    }
  }

  /**
   * base return of content
   */
  return (
    <div className="App">
      <div class="background">
        <div class="shape"></div>
        <div class="shape"></div>
        <div class="shape"></div>
      </div>
      <header className="App-header">{printPage()}</header>
    </div>
  );
}

export default App;
