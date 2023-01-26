import { createReducer } from "@reduxjs/toolkit";
import {AddBullet,DeleteBullet,UpdateBullet} from '../actions/bulletAction'
const initialState=[]
const BulletsReducer = createReducer(initialState,(builder)=>{
    builder.addCase(AddBullet,(state,action)=>{
        console.log('Action',action.payload)
        state.notes.push(action.payload)
       })
    
       builder.addCase(DeleteBullet,(state,action)=>{
        console.log('Action',action.payload)
        // state.notes.pop(action.payload)
       })
    
       builder.addCase(UpdateBullet,(state,action)=>{
        console.log('Action',action.payload)
        // state.notes.pop(action.payload)
       })

});

export default BulletsReducer;