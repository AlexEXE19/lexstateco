import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import baseURL from "../config/baseUrl";

const RegisterPage: React.FC = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const userData = {
      firstName,
      lastName,
      email,
      password,
      phone,
    };

    try {
      const response = await axios.post(`${baseURL}/users/register`, userData);

      if (response.status === 201) {
        navigate("/login");
      } else {
        alert("Error registering user, please try again.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Right side: Image */}
      <div className="w-1/2 h-full">
        <img
          src="registerimage.jpg"
          alt="Register Illustration"
          className="w-full h-full object-cover"
        />
      </div>
      {/* Left side: Form */}
      <div className="w-1/2 flex justify-center items-center">
        <div className="max-w-sm p-10 hover:border-2 hover:border-blue-600 hover:rounded-2xl duration-75">
          <h2 className="text-3xl text-blue-600 font-bold mb-4">
            Create an Account
          </h2>
          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="First Name"
              className="block w-full p-2 mb-2 border rounded hover:border-black transition-all"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              className="block w-full p-2 mb-2 border rounded hover:border-black transition-all"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              className="block w-full p-2 mb-2 border rounded hover:border-black transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="block w-full p-2 mb-2 border rounded hover:border-black transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="text"
              placeholder="Phone"
              className="block w-full p-2 mb-4 border rounded hover:border-black transition-all"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <button
              className="w-full py-2 bg-blue-600 text-white text-lg font-bold rounded shadow-md border border-blue-700 hover:bg-blue-700 transition-all hover:border-blue-600"
              type="submit"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
