import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Navbar from "./components/layout/Navbar";
import SidePanel from "./components/layout/SidePanel";
import Footer from "./components/layout/Footer";
import FeedbackModal from "./components/modals/FeedbackModal";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PropertiesPage from "./pages/PropertiesPage";
import RedirectPage from "./pages/RedirectPage";
import GetStartedPage from "./pages/GetStartedPage";
import ViewPropertyPage from "./pages/ViewPropertyPage";
import UserProfilePage from "./pages/UserProfilePage";
import ManagePage from "./pages/ManagePage";
import SettingsPage from "./pages/SettingsPage";

import { RootState } from "./state/store";
import { closeFeedbackModal } from "./state/feedback/feedbackSlice";

import { dismissFeedbackPrompt } from "./hooks/useFeedbackPrompt";
import { useClientMetadata } from "./hooks/useClientMetadata";

const AppShell: React.FC = () => {
  const dispatch = useDispatch();
  const isFeedbackOpen = useSelector(
    (state: RootState) => state.feedback.isOpen,
  );
  const userId = useSelector((state: RootState) => state.user.id);

  const handleCloseFeedback = () => {
    dismissFeedbackPrompt(userId);
    dispatch(closeFeedbackModal());
  };
  useClientMetadata();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <SidePanel />

      <FeedbackModal isOpen={isFeedbackOpen} onClose={handleCloseFeedback} />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/get-started" element={<GetStartedPage />} />
          <Route path="/properties" element={<PropertiesPage />}></Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile/me" element={<UserProfilePage />} />
          <Route path="/profile/manage" element={<ManagePage />} />
          <Route path="/properties/:id" element={<ViewPropertyPage />} />
          <Route path="/settings" element={<SettingsPage />} />

          <Route path="*" element={<RedirectPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

const App: React.FC = () => (
  <Router>
    <AppShell />
  </Router>
);

export default App;
