import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { logInUser } from "../state/user/userSlice";
import { useDispatch } from "react-redux";
import baseURL from "../config/baseUrl";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${baseURL}/users/auth`, {
        email,
        password,
      });

      if (response.data.user) {
        navigate("/account");
        dispatch(
          logInUser({
            id: response.data.user.id,
            firstName: response.data.user.firstName,
            lastName: response.data.user.lastName,
            email: response.data.user.email,
            password: response.data.user.password,
            phone: response.data.user.phone,
          })
        );
      }
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        alert("Invalid credentials. Please try again or create an account.");
      } else {
        alert("An error occurred. Please try again later.");
      }
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          className="block w-full p-2 mb-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="block w-full p-2 mb-4 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="w-full py-2 bg-blue-500 text-white rounded"
          type="submit"
        >
          Login
        </button>
      </form>
      <p className="mt-4 text-center">
        Don't have an account?{" "}
        <Link to="/register" className="text-blue-500">
          Create one
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
