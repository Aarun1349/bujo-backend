import { createReducer } from "@reduxjs/toolkit";
import {AddNote,DeleteNote,UpdateNote} from '../actions/notesAction'
const initialState=[]
const NotesReducer = createReducer(initialState,(builder)=>{
   builder.addCase(AddNote,(state,action)=>{
    console.log('Action',action.payload)
    state.notes.push(action.payload)
   })

   builder.addCase(DeleteNote,(state,action)=>{
    console.log('Action',action.payload)
    // state.notes.pop(action.payload)
   })

   builder.addCase(UpdateNote,(state,action)=>{
    console.log('Action',action.payload)
    // state.notes.pop(action.payload)
   })

});

export default NotesReducer;