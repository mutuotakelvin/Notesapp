import React,{useState, useEffect} from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import {nanoid} from "nanoid"
import { data } from "./data"


export default function App() {
    const [notes, setNotes] = useState( 
        // Lazy initialization
        () => JSON.parse(localStorage.getItem("notes")) 
        ||[])
    const [currentNoteId, setCurrentNoteId] = React.useState(
        (notes[0] && notes[0].id) || ""
    )
    
    function createNewNote() {
        const newNote = {
            id: nanoid(),
            body: "# Type your markdown note's title here"
        }
        setNotes(prevNotes => [newNote, ...prevNotes])
        setCurrentNoteId(newNote.id)
    }
    
    function updateNote(text) {
        // Put the most recently-modified note at the top

        setNotes(oldNotes => {
            const newArray = []
            for(let i = 0; i < oldNotes.length; i++) {
                const oldNote = oldNotes[i]
                if(oldNote.id === currentNoteId) {
                    newArray.unshift({ ...oldNote, body: text })
                } else {
                    newArray.push(oldNote)
                }
            }
            return newArray
        })
        
        // Create a new empty array
      // Loop over the original array
          // if the id matches
              // put the updated note at the 
              // beginning of the new array
          // else
              // push the old note to the end
              // of the new array
      // return the new array
        // This code does no rearange the notes
        // setNotes(oldNotes => oldNotes.map(oldNote => {
        //     return oldNote.id === currentNoteId
        //         ? { ...oldNote, body: text }
        //         : oldNote
        // }))
    }
    
    useEffect(()=>{
        localStorage.setItem("notes",JSON.stringify(notes))
    },[notes])

    function findCurrentNote() {
        return notes.find(note => {
            return note.id === currentNoteId
        }) || notes[0]
    }

    console.log(notes[0].body.substr(0,6))
    
    return (
        <main>
        {
            notes.length > 0 
            ?
            <Split 
                sizes={[30, 70]} 
                direction="horizontal" 
                className="split"
            >
                <Sidebar
                    notes={notes}
                    currentNote={findCurrentNote()}
                    setCurrentNoteId={setCurrentNoteId}
                    newNote={createNewNote}
                />
                {
                    currentNoteId && 
                    notes.length > 0 &&
                    <Editor 
                        currentNote={findCurrentNote()} 
                        updateNote={updateNote} 
                    />
                }
            </Split>
            :
            <div className="no-notes">
                <h1>You have no notes</h1>
                <button 
                    className="first-note" 
                    onClick={createNewNote}
                >
                    Create one now
                </button>
            </div>
            
        }
        </main>
    )
}
