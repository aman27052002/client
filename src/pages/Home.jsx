import axios from "axios";
import QRCode from "qrcode"; // Import QR Code library

const Home = () => {
  const [inputUrl, setInputUrl] = useState("");
  const [shortId, setShortId] = useState(null);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [copied, setCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const navigate = useNavigate();

  const BASE_URL = "http://localhost:3000";


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setCopied(false);
    setQrCodeUrl(null);

    try {
      const response = await axios.post(
        `${BASE_URL}/url`,
        { url: inputUrl },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      const generatedShortId = response.data.shortID;
      setShortId(generatedShortId);
      generateQRCode(`${BASE_URL}/${generatedShortId}`);
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

  const generateQRCode = async (url) => {
    try {
      const qrDataUrl = await QRCode.toDataURL(url, {
        width: 200,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      });
      setQrCodeUrl(qrDataUrl);
    } catch (error) {
      console.error("QR Code generation failed:", error);
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-4 transition ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      <h1 className="text-3xl font-bold mb-2">🚀 URL Shortener & QR Code Generator</h1>
      <p className="mb-4 text-center max-w-md text-lg">
        Instantly shorten long URLs, generate QR codes, and share with ease! Perfect for quick mobile access. 📱🔗
      </p>
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-4 right-4 px-4 py-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition"
      >
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      {/* URL Input Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 shadow-md rounded-lg w-full max-w-md">
        <label className="block text-lg font-semibold mb-2">Enter your long URL:</label>
        <input
          type="url"
          placeholder="https://example.com"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring focus:border-blue-500 text-black"
          required
        />
        <button type="submit" className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">
          ✂️ Shorten & Generate QR Code
        </button>
      </form>

      {/* Error Message */}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* Display Shortened URL and QR Code */}
      {shortId && (
        <div className="mt-6 p-4 bg-green-100 dark:bg-green-900 border-l-4 border-green-500 rounded">
          <p className="text-lg font-semibold">🔗 Your Shortened URL:</p>
          <div className="flex items-center justify-between gap-2">
            <a
              href={`${BASE_URL}/${shortId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 underline font-medium"
            >
              {BASE_URL}/{shortId}
            </a>
            <button
              onClick={copyToClipboard}
              className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
            >
              📋 {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          {/* QR Code Section */}
          {qrCodeUrl && (
            <div className="mt-4 flex flex-col items-center">
              <p className="text-lg font-semibold">📱 Scan QR Code:</p>
              <img src={qrCodeUrl} alt="QR Code" className="border-2 border-black dark:border-white mt-2" />
            </div>
          )}
        </div>
      )}

      {/* User Engagement Section */}
      <div className="mt-8 text-center">
        <h2 className="text-2xl font-bold">🌍 Why Use This Tool?</h2>
        <ul className="list-disc text-lg mt-2 space-y-2">
          <li>🔗 **Shorten Long Links** – No more messy URLs! Simplify and share with ease.</li>
          <li>📱 **Generate QR Codes** – Scan instantly on mobile devices.</li>
          <li>🚀 **Fast & Free** – No sign-up required, instant results!</li>
          <li>🌙 **Light & Dark Mode** – Choose your preferred theme.</li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
