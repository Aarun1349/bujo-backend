import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Navigation from "./components/Navigation/Navigation";
import Signup from "./components/Signup/Signup";
function App() {
  return (
    <div className="App">
      <Navigation />
      <Routes>
        <Route exact path="/" element={<Login />}></Route>
        <Route exact path="/signup" element={<Signup />}></Route>
        {/* <Route exact ='/usernotes' element={<Notes/>}></Route> */}
        {/* <Route exact ='/collections' element={<Collections/>}></Route> */}
        {/* <Route exact ='/futurelog' element={<FutureLogs/>}></Route> */}
        {/* <Route exact ='/bullets' element={<Bullets/>}></Route> */}
        {/* <Route exact ='/404' element={<NotFound/>}></Route> */}
      </Routes>
    </div>
  );
}

export default App;
