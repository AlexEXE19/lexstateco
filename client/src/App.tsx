import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
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

// The properties page is a fixed-viewport, map-first layout with its own
// internal scrolling - it doesn't get a footer, and the shell around it
// switches to a flex column so the page fills exactly the space left under
// Navbar instead of relying on a hardcoded navbar-height offset.
const AppShell: React.FC = () => {
  const location = useLocation();
  const isPropertiesPage = location.pathname === "/properties";

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
    <div
      className={
        isPropertiesPage ? "flex h-screen flex-col overflow-hidden" : undefined
      }
    >
      <Navbar />

      <SidePanel />

      <FeedbackModal isOpen={isFeedbackOpen} onClose={handleCloseFeedback} />
      <div className={isPropertiesPage ? "min-h-0 flex-1" : undefined}>
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
      {!isPropertiesPage && <Footer />}
    </div>
  );
};

const App: React.FC = () => (
  <Router>
    <AppShell />
  </Router>
);

export default App;
