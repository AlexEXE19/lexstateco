import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MyAccountPage from "./pages/MyAccountPage";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import PropertiesPage from "./pages/PropertiesPage";
import RedirectPage from "./pages/RedirectPage";
import GetStartedPage from "./pages/GetStartedPage";

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/get-started" element={<GetStartedPage />} />
        <Route path="/properties" element={<PropertiesPage />}></Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/account" element={<MyAccountPage />} />

        <Route path="*" element={<RedirectPage />} />
      </Routes>
      {/* <hr /> */}
      <Footer />
    </Router>
  );
};

export default App;
