import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState } from "react";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MyAccountPage from "./pages/MyAccountPage";
import Navbar from "./components/Navbar";
import { User } from "./types/types";

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  console.log(currentUser);

  return (
    <Router>
      <Navbar currentUser={currentUser} />
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/login"
            element={<LoginPage setCurrentUser={setCurrentUser} />}
          />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/account"
            element={
              <MyAccountPage
                currentUser={{
                  id: "3",
                  firstName: "Alex",
                  lastName: "Ion",
                  email: "alx@gmail.com",
                  password: "123",
                  phone: "123456",
                }}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
