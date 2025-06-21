import React, { useState, useEffect } from "react";
import { icp_crud_dapp_backend } from "declarations/icp-crud-dapp-backend";

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const fetchNotes = async () => {
    const res = await icp_crud_dapp_backend.get_notes();
    setNotes(res);
  };

  const createNote = async () => {
    await icp_crud_dapp_backend.create_note(title, content);
    fetchNotes();
  };

  const updateNote = async (id) => {
    await icp_crud_dapp_backend.update_note(id, title, content);
    fetchNotes();
  };

  const deleteNote = async (id) => {
    await icp_crud_dapp_backend.delete_note(id);
    fetchNotes();
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="App">
      <h1>ICP CRUD Notes</h1>
      <input placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
      <input placeholder="Content" onChange={(e) => setContent(e.target.value)} />
      <button onClick={createNote}>Add</button>
      <ul>
        {notes.map((n) => (
          <li key={n.id}>
            <strong>{n.title}</strong> — {n.content}
            <button onClick={() => updateNote(n.id)}>Edit</button>
            <button onClick={() => deleteNote(n.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
