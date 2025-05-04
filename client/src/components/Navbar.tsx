import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../state/store";
import { logOutUser } from "../state/user/userSlice";

// Navbar buttons route the user into his account or homepage
const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.user.id);

  const handleClick = () => {
    dispatch(logOutUser());
  };

  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">
          LexEstateCo
        </Link>

        <div className="space-x-4">
          {userId !== "-1" ? (
            <>
              <Link to="/account" className="text-white px-4 py-2">
                My Account
              </Link>
              <Link to="/">
                <button onClick={handleClick} className="text-white px-4 py-2">
                  Logout
                </button>
              </Link>
            </>
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
