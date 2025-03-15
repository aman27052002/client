import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
   const BASE_URL = "https://short-url-2qqj.onrender.com"
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Invalid email or password");

      navigate("/"); // Redirect to Home on success
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen transition ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      <h1 className="text-3xl font-bold mb-6">🔐 Login</h1>

      <button onClick={() => setDarkMode(!darkMode)} className="absolute top-4 right-4 px-4 py-2 rounded-full bg-gray-800 text-white hover:bg-gray-700">
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      <form onSubmit={handleLogin} className="bg-white dark:bg-gray-800 p-6 shadow-md rounded-lg w-full max-w-md">
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 mb-3 border rounded-md text-black" required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 mb-3 border rounded-md text-black" required />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">Login</button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <p className="mt-4">Don't have an account? <a href="/signup" className="text-blue-500">Sign up</a></p>
    </div>
  );
};

export default Login;
