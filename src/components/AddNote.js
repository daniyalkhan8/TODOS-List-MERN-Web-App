import React, { useContext, useState } from 'react';
import NoteContext from '../contexts/notes/NoteContext';

const AddNote = (props) => {
    const context = useContext(NoteContext);
    const { addNote } = context;

    const [note, setnote] = useState({ title: "", description: "", tag: "" })

    const onChange = (e) => {
        setnote({...note, [e.target.name]: e.target.value})
    }

    const handleAdd = (e) => {
        e.preventDefault();
        addNote(note.title, note.description, note.tag);
        setnote({ title: "", description: "", tag: "" });
        props.showAlert("Note Added Successfully.", "success");
    }
    
    return (
        <div>
            <div className='container my-3'>
                <h1>Add a Note</h1>
                <form className='my-3'>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Note Title</label>
                        <input type="text" className="form-control" id="title" name='title' aria-describedby="emailHelp" value={note.title} onChange={onChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Note Description</label>
                        <input type="text" className="form-control" id="description" name='description' value={note.description} onChange={onChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="tag" className="form-label">Note Tag</label>
                        <input type="text" className="form-control" id="tag" name='tag' value={note.tag} onChange={onChange} />
                    </div>
                    <button disabled={note.title.length < 5 || note.description.length < 5} type="submit" className="btn btn-primary" onClick={handleAdd} >Add Note</button>
                </form>
            </div>
        </div>
    )
}

export default AddNote