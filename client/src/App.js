import "./App.css";
import Axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [page, setPage] = useState("LOGIN");

  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");

  const [hidedNotes, setHidedNotes] = useState(false);
  const [DBNotes, setDBNotes] = useState([
    {
      ID: -1,
      title: "Uwaga!",
      note: "Tutaj pojawią się twoje notatki ale najpierw musisz jakąś stworzyć!",
    },
  ]);

  const goTo = (Page) => {
    setPage(Page);
  };

  const logIn = () => {
    Axios.post("http://localhost:3001/login", {
      username: username,
      password: password,
    }).then((response) => {
      if (response.data.response === "AUTH") goTo("USER PANEL");
    });
  };

  const register = () => {
    Axios.put("http://localhost:3001/register", {
      username: username,
      password: password,
    }).then((response) => {
      if (response.data.response === "REGISTERED") {
        goTo("LOGIN");
      } else {
      }
    });
  };

  const addNote = () => {
    Axios.put("http://localhost:3001/addNote", {
      username: username,
      password: password,
      title: title,
      note: note,
    }).then((response) => {
      if (response.data.response === "NOTE ADDED") {
        document.getElementById("title").value = "";
        document.getElementById("note").value = "";
      } else {
      }
    });
  };

  const getNotes = () => {
    Axios.post("http://localhost:3001/getNotes", {
      username: username,
      password: password,
    }).then((response) => {
      if (response.statusText === "OK") {
        setDBNotes(response.data);
      }
    });
  };

  const updateNote = (IDNote) => {
    Axios.put("http://localhost:3001/updateNote", {
      username: username,
      password: password,
      IDNote: IDNote,
    }).then((response) => {
      if (response.data.response === "AUTH") {
        goTo("LOGIN");
      } else {
      }
    });
  };

  const deleteNote = (IDNote) => {
    Axios.delete("http://localhost:3001/deleteNote", {
      username: username,
      password: password,
      IDNote: IDNote,
    }).then((response) => {
      if (response.data.response === "AUTH") {
        goTo("LOGIN");
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
    else document.getElementById(ID).style.display = "block";
  };

  const hideNotes = () => {
    if (!hidedNotes && DBNotes && page === "NOTES PANEL") {
      DBNotes.map((val, keyPassword) => {
        //setVisibility("edit" + val);
        return 0;
      });
      setHidedNotes(true);
    }
  };

  useEffect(() => {
    hideNotes();
  }, [DBNotes]);

  useEffect(() => {
    if (page === "NOTES PANEL") {
      getNotes();
    }
  }, [page]);

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
                edit note with ID = {val.ID}
                <form className="userPanel">
                  <label for="title">NOWY TYTUŁ NOTATKI</label>
                  <input
                    type="text"
                    className="userPanel"
                    id="title"
                    onChange={(event) => {
                      setTitle(event.target.value);
                    }}
                  ></input>
                  <label for="note">NOWA TREŚĆ NOTATKI</label>
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

  function printButtons(ID) {
    return (
      <div>
        <button
          id={"edit" + ID}
          className="edit"
          onClick={() => {
            updateNote(ID);
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
