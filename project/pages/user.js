"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "../app/components/NavBar";

function UserPage() {
  const [userData, setUserData] = useState(null);
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateMessage, setUpdateMessage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const buyerID = sessionStorage.getItem("buyerID");
    if (!buyerID) {
      router.push("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const userResponse = await fetch(`/api/user/${buyerID}`);
        if (!userResponse.ok) throw new Error("Failed to fetch user data");
        const userData = await userResponse.json();

        const addressResponse = await fetch(`/api/address?buyerID=${buyerID}`);
        if (!addressResponse.ok) throw new Error("Failed to fetch address");
        const { address } = await addressResponse.json();

        setUserData(userData);
        setAddress(address);  // Setting fetched address to state
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();  // Fetch user and address every time the page loads

  }, [router]);  // Re-run when the router changes (like after login)

  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    setUpdateMessage(null);

    const buyerID = sessionStorage.getItem("buyerID");
    try {
      const response = await fetch("/api/update-address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ buyerID, ...address }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to update address");

      // Directly set the updated address instead of re-fetching
      setAddress({
        street: address.street,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
      });

      setUpdateMessage("Address updated successfully!");
      setIsEditing(false); // Disable edit mode after update
    } catch (err) {
      setUpdateMessage("Error updating address: " + err.message);
    }
  };

  if (loading) return <div className="text-center text-xl">Loading...</div>;
  if (error) return <div className="text-center text-xl text-red-500">Error: {error}</div>;

  return (
    <div>
      <Navbar />
      <div className="max-w-3xl mx-auto p-6 rounded-lg mt-8 border-[#E63946] border-2">
        <h1 className="text-3xl font-semibold text-center text-[#E63946] mb-6">User Information</h1>
        {userData && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[rgb(29,53,87)]">Account</h2>
            <p className="font-small text-gray-500"><strong>Username:</strong> {userData.Username}</p>
            <p className="font-small text-gray-500"><strong>Email:</strong> {userData.Email}</p>
            <p className="font-small text-gray-500"><strong>Role:</strong> {userData.Role}</p>
          </div>
        )}

        <div className="space-y-4 mt-6">
          <h2 className="text-xl font-bold text-[#1D3557]">Address</h2>
          {!isEditing ? (
            <div className="space-y-2">
              <p className="font-small text-gray-500"><strong>Street:</strong> {address.street}</p>
              <p className="font-small text-gray-500"><strong>City:</strong> {address.city}</p>
              <p className="font-small text-gray-500"><strong>State:</strong> {address.state}</p>
              <p className="font-small text-gray-500"><strong>Zip Code:</strong> {address.zipCode}</p>
              <button
                className="transition w-full bg-[#3a86ff] hover:bg-[#3477e1] text-white p-2 rounded mt-4"
                onClick={() => setIsEditing(true)}
              >
                Edit Address
              </button>
            </div>
          ) : (
            <form onSubmit={handleUpdateAddress} className="space-y-4">
              <input
                type="text"
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                placeholder="Street"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                placeholder="City"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                placeholder="State"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                value={address.zipCode}
                onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                placeholder="Zip Code"
                className="w-full p-2 border rounded"
              />
              <button type="submit" className="transition w-full bg-[#3a86ff] hover:bg-[#3477e1]  text-white p-2 rounded">
                Update Address
              </button>
            </form>
          )}
        </div>

        {updateMessage && <p className="text-center mt-4 text-red-400">{updateMessage}</p>}
      </div>
    </div>
  );
}

export default UserPage;
