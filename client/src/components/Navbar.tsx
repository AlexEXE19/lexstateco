import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../state/store";
import { logOutUser } from "../state/user/userSlice";
import { clearAuthToken } from "../utils/auth";

const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.user.id);

  const handleClick = () => {
    dispatch(logOutUser());
  };

  return (
    <nav className="sticky top-0 z-20 w-full bg-gradient-to-r from-slate-950 via-slate-900 to-blue-900/90 text-white shadow-2xl shadow-black/20 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <Link to="/home" className="flex items-center gap-3 text-white">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-lg font-black tracking-tight ring-1 ring-white/15">
            LE
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-semibold">LexEstateCo</span>
            <span className="text-xs text-slate-200">
              Homes without the noise
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {userId !== "-1" ? (
            <>
              <Link
                to="/account"
                className="rounded-xl px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:-translate-y-[1px] hover:bg-white/10"
              >
                My Account
              </Link>
              <Link to="/home">
                <button
                  onClick={handleClick}
                  className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:-translate-y-[1px] hover:bg-white/20"
                >
                  Logout
                </button>
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-xl px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:-translate-y-[1px] hover:bg-white/10"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-[1px] hover:bg-blue-400"
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
