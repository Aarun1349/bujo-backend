import { createReducer } from "@reduxjs/toolkit";
import {AddUser,DeleteUser,UpdateUser,LoginUser,LogoutUser} from '../actions/userActions'
const initialState=[]
const UserReducer = createReducer(initialState,((builder)=>{
    builder.addCase(AddUser,(state,action)=>{
        console.log('Action',action.payload)
    })
    builder.addCase(DeleteUser,(state,action)=>{
        console.log('Action',action.payload)
    })
    builder.addCase(UpdateUser,(state,action)=>{
        console.log('Action',action.payload)
    })
    builder.addCase(LoginUser,(state,action)=>{
        console.log('Action',action.payload)
    })
    builder.addCase(LogoutUser,(state,action)=>{
        console.log('Action',action.payload)
    })

}));

export default UserReducer;