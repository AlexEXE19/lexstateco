import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Lock, Mail, Phone, User } from "lucide-react";
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
    <div className="grid min-h-screen grid-cols-1 bg-slate-950 text-white md:grid-cols-[0.95fr_1fr]">
      <div className="relative order-2 flex items-center justify-center bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 px-6 py-12 md:order-1">
        <div className="w-full max-w-md rounded-3xl bg-white/5 p-8 shadow-2xl ring-1 ring-white/10 backdrop-blur">
          <div className="mb-8 space-y-2 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">
              Join LexEstateCo
            </p>
            <h2 className="text-3xl font-semibold">Create an account</h2>
            <p className="text-sm text-slate-300">
              Save searches, list faster, and pick up conversations seamlessly.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm text-slate-200">
                First name
                <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-blue-400">
                  <User size={16} className="text-blue-200" />
                  <input
                    type="text"
                    placeholder="Jane"
                    className="w-full bg-transparent text-white placeholder:text-slate-400 focus:outline-none"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
              </label>

              <label className="flex flex-col gap-2 text-sm text-slate-200">
                Last name
                <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-blue-400">
                  <User size={16} className="text-blue-200" />
                  <input
                    type="text"
                    placeholder="Doe"
                    className="w-full bg-transparent text-white placeholder:text-slate-400 focus:outline-none"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </label>
            </div>

            <label className="flex flex-col gap-2 text-sm text-slate-200">
              Email
              <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-blue-400">
                <Mail size={16} className="text-blue-200" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full bg-transparent text-white placeholder:text-slate-400 focus:outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </label>

            <label className="flex flex-col gap-2 text-sm text-slate-200">
              Password
              <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-blue-400">
                <Lock size={16} className="text-blue-200" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-transparent text-white placeholder:text-slate-400 focus:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </label>

            <label className="flex flex-col gap-2 text-sm text-slate-200">
              Phone
              <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-blue-400">
                <Phone size={16} className="text-blue-200" />
                <input
                  type="text"
                  placeholder="(555) 123-9876"
                  className="w-full bg-transparent text-white placeholder:text-slate-400 focus:outline-none"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </label>

            <button
              className="w-full rounded-2xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:-translate-y-[1px] hover:bg-blue-400"
              type="submit"
            >
              Create account
            </button>
          </form>
        </div>
      </div>

      <div className="relative order-1 overflow-hidden md:order-2">
        <div className="absolute inset-0 bg-[url('/registerimage.jpg')] bg-cover bg-center opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/95 to-blue-900/80" />
        <div className="absolute left-6 top-8 h-60 w-60 rounded-full bg-blue-500/30 blur-[120px]" />
        <div className="absolute bottom-10 right-4 h-56 w-56 rounded-full bg-cyan-400/25 blur-[120px]" />

        <div className="relative mx-auto flex h-full max-w-xl flex-col justify-center gap-6 px-10 py-16 text-white">
          <div className="inline-flex w-fit items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-white/15 backdrop-blur">
            <User size={16} />
            <span>Start your journey</span>
          </div>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
            Create, save, and move faster.
          </h1>
          <p className="max-w-lg text-slate-200">
            One account for listings, tours, and conversations. Keep everything
            in one calm, modern workspace.
          </p>
          <div className="grid grid-cols-2 gap-3 text-sm text-slate-200">
            <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
              <p className="text-lg font-semibold text-white">Verified</p>
              <p className="text-xs">Listings and agents</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
              <p className="text-lg font-semibold text-white">Saved sync</p>
              <p className="text-xs">Across all devices</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
