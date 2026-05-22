import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomeManager from "./components/homeManager/HomeManager";
import HomeStaff from "./components/homeStaff/HomeStaff";
import Login from "./components/login/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/manager/*" element={<HomeManager />} />
        <Route path="/staff/*" element={<HomeStaff />} />
        <Route path="/login" element={<Login />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
