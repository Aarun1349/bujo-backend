import { createAction } from "@reduxjs/toolkit";

const AddNote = createAction('bujo/addnote')
const DeleteNote = createAction('bujo/deletenote')
const UpdateNote = createAction('bujo/updatenote')


export  {AddNote,DeleteNote,UpdateNote}