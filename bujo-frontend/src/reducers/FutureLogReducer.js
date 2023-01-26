import { createReducer } from "@reduxjs/toolkit";
import {AddFutureLog,DeleteFutureLog,AddTaskToFutureLog} from '../actions/futureLogAction'
const initialState=[]
const FutureLogReducer = createReducer(initialState,(builder)=>{
    builder.addCase(AddFutureLog,(state,action)=>{
        console.log('Action',action.payload)
        state.notes.push(action.payload)
       })
    
       builder.addCase(DeleteFutureLog,(state,action)=>{
        console.log('Action',action.payload)
        // state.notes.pop(action.payload)
       })
    
       builder.addCase(AddTaskToFutureLog,(state,action)=>{
        console.log('Action',action.payload)
        // state.notes.pop(action.payload)
       })

});

export default FutureLogReducer