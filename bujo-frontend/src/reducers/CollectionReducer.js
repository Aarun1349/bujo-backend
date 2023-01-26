import { createReducer } from "@reduxjs/toolkit";
import {AddCollection,DeleteCollection,AddItemToCollection} from '../actions/collectionAction'
const initialState=[]
const CollectionReducer = createReducer(initialState,(builder)=>{
    builder.addCase(AddCollection,(state,action)=>{
        console.log('Action',action.payload)
        state.notes.push(action.payload)
       })
    
       builder.addCase(DeleteCollection,(state,action)=>{
        console.log('Action',action.payload)
        // state.notes.pop(action.payload)
       })
    
       builder.addCase(AddItemToCollection,(state,action)=>{
        console.log('Action',action.payload)
        // state.notes.pop(action.payload)
       })

});

export default CollectionReducer;