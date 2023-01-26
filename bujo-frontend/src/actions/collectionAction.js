import { createAction } from "@reduxjs/toolkit";

const AddCollection = createAction('bujo/addcollection')
const AddItemToCollection = createAction('bujo/additemtocollelction')
const DeleteCollection = createAction('bujo/deletecollection')


export  {AddCollection,AddItemToCollection,DeleteCollection};