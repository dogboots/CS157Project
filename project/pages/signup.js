import { useState } from "react";
import { useRouter } from "next/router";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [streetName, setStreetName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email, streetName, city, state, zipCode }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        setError(error);
        return;
      }

      // Redirect to login page after successful signup
      router.push("/login");
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="bg-white shadow-2xl rounded-xl p-10 w-full max-w-md">
        <h1 className="text-4xl font-bold text-center text-green-600 mb-8 tracking-tight">
          Sign Up
        </h1>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-lg" role="alert">
            <p className="font-medium">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSignup} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="col-span-2">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="col-span-2">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="col-span-2">
              <input
                type="text"
                placeholder="Street Name"
                value={streetName}
                onChange={(e) => setStreetName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="col-span-2">
              <input
                type="text"
                placeholder="Zip Code"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold 
            hover:bg-green-600 transition duration-300 ease-in-out 
            transform hover:-translate-y-1 hover:scale-102 
            focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
          >
            Sign Up
          </button>
        </form>
        
        <p className="text-center text-gray-500 text-sm mt-6">
          Already have an account? <a href="/login" className="text-green-600 hover:underline">Log in</a>
        </p>
      </div>
    </div>
  );
}