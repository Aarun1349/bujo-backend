import { createAction } from "@reduxjs/toolkit";

const AddBullet = createAction('bujo/addbullet')
const DeleteBullet = createAction('bujo/deletebullet')
const UpdateBullet = createAction('bujo/updatebullet')


export  {AddBullet,DeleteBullet,UpdateBullet}