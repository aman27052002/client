import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [inputUrl, setInputUrl] = useState("");
  const [shortId, setShortId] = useState(null);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const qrCanvasRef = useRef(null);
  const navigate = useNavigate();

  const BASE_URL = "https://short-url-2qqj.onrender.com/";

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${BASE_URL}/`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error();
      } catch (error) {
        navigate("/login");
      }
    };
    checkAuth();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setCopied(false);

    try {
      const response = await fetch(`${BASE_URL}/url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ url: inputUrl }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setShortId(data.shortID);
      generateQRCode(`${BASE_URL}/${data.shortID}`);
    } catch (error) {
      console.error("Error:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${BASE_URL}/${shortId}`);
      setCopied(true);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const generateQRCode = (url) => {
    const canvas = qrCanvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = 150;
    canvas.height = 150;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(30, 30, 90, 90); // Simplified QR representation
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-4 transition ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      <h1 className="text-3xl font-bold mb-6">🚀 URL Shortener</h1>
      <p className="mb-4 text-center max-w-md">Shorten long URLs and easily share them. Generate a QR code for quick mobile access!</p>
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-4 right-4 px-4 py-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition"
      >
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 shadow-md rounded-lg w-full max-w-md">
        <input
          type="url"
          placeholder="Enter a URL..."
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring focus:border-blue-500 text-black"
          required
        />
        <button type="submit" className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">
          Generate Short URL
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {shortId && (
        <div className="mt-6 p-4 bg-green-100 dark:bg-green-900 border-l-4 border-green-500 rounded">
          <p className="text-lg font-semibold">🔗 Your Shortened URL:</p>
          <a href={`${BASE_URL}/${shortId}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline">
            {BASE_URL}/{shortId}
          </a>
          <button onClick={copyToClipboard} className="ml-4 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition">
            📋 {copied ? "Copied!" : "Copy"}
          </button>
          <div className="mt-4 flex flex-col items-center">
            <p className="text-lg font-semibold">📱 Scan QR Code:</p>
            <canvas ref={qrCanvasRef} className="border-2 border-black dark:border-white mt-2" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;