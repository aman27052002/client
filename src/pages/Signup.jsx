import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState(""); // New state for name
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    const BASE_URL = "https://short-url-2qqj.onrender.com/"
    try {
      const response = await fetch(`${BASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) throw new Error("Signup failed. Try again.");

      navigate("/login"); // Redirect to Login on success
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen transition ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      <h1 className="text-3xl font-bold mb-6">📝 Signup</h1>

      <button onClick={() => setDarkMode(!darkMode)} className="absolute top-4 right-4 px-4 py-2 rounded-full bg-gray-800 text-white hover:bg-gray-700">
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      <form onSubmit={handleSignup} className="bg-white dark:bg-gray-800 p-6 shadow-md rounded-lg w-full max-w-md">
        <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 mb-3 border rounded-md text-black" required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 mb-3 border rounded-md text-black" required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 mb-3 border rounded-md text-black" required />
        <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-2 mb-3 border rounded-md text-black" required />
        <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600">Sign Up</button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <p className="mt-4">Already have an account? <a href="/login" className="text-blue-500">Login</a></p>
    </div>
  );
};

export default Signup;
