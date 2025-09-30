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
    <nav className="bg-blue-600 p-3 py-4 w-full sticky z-10">
      <div className="container mx-auto flex justify-between items-center pl-5 pr-5">
        <Link to="/" className="text-white text-3xl font-bold">
          LexEstateCo
        </Link>

        <div className="space-x-4">
          {userId !== "-1" ? (
            <>
              <Link
                to="/account"
                className="text-center text-lg border-2 border-blue-600 font-bold text-white w-32 px-4 py-2 flex-1 hover:border-white rounded-md transition"
              >
                My Account
              </Link>
              <Link to="/">
                <button
                  onClick={handleClick}
                  className="text-center text-lg border-2 border-blue-600 font-bold text-white w-32 px-4 py-2 flex-1 hover:border-white rounded-md transition"
                >
                  Logout
                </button>
              </Link>
            </>
          ) : (
            <>
              <div className="flex w-full">
                <Link
                  to="/login"
                  className="text-center text-lg border-2 border-blue-600 font-bold text-white w-32 px-4 py-2 flex-1 hover:border-white rounded-md transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-center text-lg border-2 border-blue-600 font-bold text-white w-32 px-4 py-2 flex-1 hover:border-white rounded-md transition"
                >
                  Register
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
