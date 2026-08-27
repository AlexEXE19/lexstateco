import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MyAccountPage from "./pages/MyAccountPage";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import PropertiesPage from "./pages/PropertiesPage";
import RedirectPage from "./pages/RedirectPage";
import GetStartedPage from "./pages/GetStartedPage";
import FeedbackModal from "./components/modals/FeedbackModal";
import { RootState } from "./state/store";
import { closeFeedbackModal } from "./state/feedback/feedbackSlice";
import { dismissFeedbackPrompt } from "./hooks/useFeedbackPrompt";

const App: React.FC = () => {
  const dispatch = useDispatch();
  const isFeedbackOpen = useSelector((state: RootState) => state.feedback.isOpen);
  const userId = useSelector((state: RootState) => state.user.id);

  const handleCloseFeedback = () => {
    dismissFeedbackPrompt(userId);
    dispatch(closeFeedbackModal());
  };

  return (
    <Router>
      <Navbar />
      <FeedbackModal isOpen={isFeedbackOpen} onClose={handleCloseFeedback} />
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
