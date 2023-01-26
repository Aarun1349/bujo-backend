import { createAction } from "@reduxjs/toolkit";

const AddUser = createAction('bujo/adduser')
const DeleteUser = createAction('bujo/deleteuser')
const UpdateUser = createAction('bujo/updateuser')
const LoginUser = createAction('bujo/loginuser')
const LogoutUser = createAction('bujo/logoutuser')


export  {AddUser,DeleteUser,UpdateUser,LoginUser,LogoutUser}