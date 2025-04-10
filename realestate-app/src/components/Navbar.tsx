import { Link } from "react-router-dom";
import { User } from "../types/types";

interface NavbarProps {
  currentUser: User | null;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser }) => {
  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">
          LexEstateCo
        </Link>

        <div className="space-x-4">
          {currentUser ? (
            <Link
              to="/account"
              className="text-white px-4 py-2"
              state={{ currentUser }}
            >
              My Account
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-white px-4 py-2">
                Login
              </Link>
              <Link to="/register" className="text-white px-4 py-2">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
