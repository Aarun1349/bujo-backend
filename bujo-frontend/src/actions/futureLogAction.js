import { createAction } from "@reduxjs/toolkit";

const AddFutureLog = createAction('bujo/addfuturelog')
const DeleteFutureLog = createAction('bujo/deletefuturelog')
const AddTaskToFutureLog = createAction('bujo/addtasktofuturelog')


export  {AddFutureLog,DeleteFutureLog,AddTaskToFutureLog}