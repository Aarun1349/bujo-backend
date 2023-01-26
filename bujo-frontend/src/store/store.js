import { configureStore } from "@reduxjs/toolkit";
import NotesReducer from "../reducers/NotesReducer";
import UserReducer from "../reducers/UserReducer";
import CollectionReducer from "../reducers/CollectionReducer";
import FutureLogReducer from "../reducers/FutureLogReducer";
import BulletsReducer from "../reducers/BulletsReducer";
const store = configureStore({
  reducer: {
    users: UserReducer,
    notes: NotesReducer,
    bullets: BulletsReducer,
    futureLog: FutureLogReducer,
    collection: CollectionReducer,
  },
});

export default store;
