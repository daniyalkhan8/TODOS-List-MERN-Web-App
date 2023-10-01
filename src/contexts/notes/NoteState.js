import { useState } from "react";
import NoteContext from "./NoteContext";

const NoteState = (props) => {
    const hostpath = `http://localhost:5000`;

    const notesInitial = []

    const [notes, setNotes] = useState(notesInitial);

    // Fetch All Notes Client Side
    const getNotes = async () => {
        // API Call for Fetching All Note
        const response = await fetch(`${hostpath}/api/notes/fetchallnotes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            }
        });
        const fetchedNotes = await response.json();
        setNotes(fetchedNotes);
    }


    // Adding a note client side
    const addNote = async (title, description, tag) => {
        // API Call for Adding a Note
        const response = await fetch(`${hostpath}/api/notes/addnote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({title, description, tag})
        });

        // Client Side Adding a Note
        const note = await response.json();
        setNotes(notes.concat(note))        
    }

    // Deleting a note client side
    const deleteNote = async (id) => {
        // API Call for Deleting a Note
        const response = await fetch(`${hostpath}/api/notes/deletenote/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            }
        });

        // Client Side Deleting a Note
        const newNotes = notes.filter((note) => { return note._id !== id });
        setNotes(newNotes);
    }

    // Update a note client side
    const editNote = async (id, title, description, tag) => {
        // API Call for Edititng a Note
        const response = await fetch(`${hostpath}/api/notes/updatenote/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({title, description, tag})
        });

        let newNotesJson = JSON.parse(JSON.stringify(notes));

        // Client Side Editting a Note
        for (let noteidx = 0; noteidx < newNotesJson.length; noteidx++) {
            if (newNotesJson[noteidx]._id === id) {
                newNotesJson[noteidx].title = title;
                newNotesJson[noteidx].description = description;
                newNotesJson[noteidx].tag = tag;
                break;
            }
        }
        setNotes(newNotesJson);
    }

    return (
        <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
            {props.children}
        </NoteContext.Provider>
    );
}

export default NoteState;