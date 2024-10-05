import React, { useRef, useEffect, useReducer, useState } from "react";
import { ref, update } from "firebase/database";
import { db } from "../../firebase"; 
import polygonlogo from "./polygonMatic.png"
import "./connect.css"

export function Connect() {

  const [userId, setUserId] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState(""); // State to store the wallet address
  const [successMessage, setSuccessMessage] = useState(""); // State to store the success message
  const [errorMessage, setErrorMessage] = useState(""); // State to store any error message

  
  useEffect(() => {
    // Initialize the Telegram Web App SDK
    const initTelegram = () => {
      const tg = window.Telegram.WebApp;
      tg.ready();
      // Debug logging
      console.log('Telegram Web App SDK initialized');
      console.log('tg.initDataUnsafe:', tg.initDataUnsafe);

      const user = tg.initDataUnsafe?.user;
    };

    if (window.Telegram) {
      console.log('Telegram SDK is already loaded');
      initTelegram();
    } else {
      console.log('Waiting for Telegram SDK to be ready');
      window.addEventListener('TelegramWebAppReady', initTelegram);
    }

    return () => {
      window.removeEventListener('TelegramWebAppReady', initTelegram);
    };
  }, []);

  
  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent form from reloading the page
    if (!walletAddress || !userId) {
      setErrorMessage("Please enter a valid wallet address and user ID.");
      return;
    }

    // Path to the user in Firebase
    const userRef = ref(db, "users/" + userId);

    // Data structure to update in Firebase
    const structuredData = {
      addresswallet: {
        polygonwallet: walletAddress,
      },
    };

    try {
      // Update Firebase with the new wallet address
      await update(userRef, structuredData);
      setSuccessMessage("Wallet address updated successfully!");
      setWalletAddress(""); // Clear the input field after successful update
      setErrorMessage(""); // Clear any error messages
    } catch (error) {
      console.error("Error updating wallet address:", error);
      setErrorMessage("Failed to update wallet address. Please try again.");
    }
  };

  return (
    <>
      <div className="overlay">
        <div className="container-fluid connectform">
      
      <img src={polygonlogo} alt="polygon logo" className="polygonlogo"/>

          <form onSubmit={handleSubmit} className="adressform">
            <div>
              <input
              className="userwalletinputfield"
                type="text"
                id="walletAddress"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="Enter your wallet address"
                required
              />
            </div>
            <button type="submit" className="connectbutton">Connect</button>
          </form>
        </div>
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
          {/* {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>} */} 
      </div>
    </>
  );
}
