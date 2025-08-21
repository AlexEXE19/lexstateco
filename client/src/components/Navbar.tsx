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
    <nav className="bg-blue-600 p-3 py-4 w-full fixed z-10">
      <div className="container mx-auto flex justify-between items-center pl-5 pr-5">
        <Link to="/" className="text-white text-3xl font-bold">
          LexEstateCo
        </Link>

        <div className="space-x-4">
          {userId !== "-1" ? (
            <>
              <Link
                to="/account"
                className="text-center text-lg border-2 font-bold text-white px-4 py-2 hover:bg-blue-500 rounded-md transition"
              >
                My Account
              </Link>
              <Link to="/">
                <button
                  onClick={handleClick}
                  className="text-center text-lg border-2 font-bold text-white px-4 py-2 hover:bg-blue-500 rounded-md transition"
                >
                  Logout
                </button>
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-center text-lg border-2 font-bold text-white px-4 py-2 hover:bg-blue-500 rounded-md transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-center text-lg border-2 font-bold text-white px-4 py-2 hover:bg-blue-500 rounded-md transition"
              >
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
