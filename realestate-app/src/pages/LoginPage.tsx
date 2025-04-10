import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { User } from "../types/types";

interface LoginPageProps {
  setCurrentUser: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ setCurrentUser }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/users/auth", {
        email,
        password,
      });

      if (response.data.user) {
        console.log("User logged in:", response.data.user);
        setCurrentUser(response.data.user);
        navigate("/account", { state: { currentUser: response.data.user } });
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
