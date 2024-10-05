// import React, { useRef, useEffect, useReducer, useState } from "react";
// import { ref, update } from "firebase/database";
// import { db } from "../../firebase";
// import polygonlogo from "./polygonMatic.png"
// import "./connect.css"

// export function Connect() {

//   const [userId, setUserId] = useState<string | null>(null);
//   const [walletAddress, setWalletAddress] = useState(""); // State to store the wallet address
//   const [successMessage, setSuccessMessage] = useState(""); // State to store the success message
//   const [errorMessage, setErrorMessage] = useState(""); // State to store any error message

//   useEffect(() => {
//     // Initialize the Telegram Web App SDK
//     const initTelegram = () => {
//       const tg = window.Telegram.WebApp;
//       tg.ready();
//       // Debug logging
//       console.log('Telegram Web App SDK initialized');
//       console.log('tg.initDataUnsafe:', tg.initDataUnsafe);

//       const user = tg.initDataUnsafe?.user;

//       if (user) {
//         const id = user.id.toString();
//         setUserId(user.id.toString());
//       }
//     };

//     if (window.Telegram) {
//       console.log('Telegram SDK is already loaded');
//       initTelegram();
//     } else {
//       console.log('Waiting for Telegram SDK to be ready');
//       window.addEventListener('TelegramWebAppReady', initTelegram);
//     }

//     return () => {
//       window.removeEventListener('TelegramWebAppReady', initTelegram);
//     };
//   }, []);

//   // Function to handle form submission
//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault(); // Prevent form from reloading the page
//     if (!walletAddress || !userId) {
//       setErrorMessage("Please enter a valid wallet address and user ID.");
//       return;
//     }

//     // Path to the user in Firebase
//     const userRef = ref(db, "users/" + userId);

//     // Data structure to update in Firebase
//     const structuredData = {
//       addresswallet: {
//         polygonwallet: walletAddress,
//       },
//     };

//     try {
//       // Update Firebase with the new wallet address
//       await update(userRef, structuredData);
//       setSuccessMessage("Wallet address updated successfully!");
//       setWalletAddress(""); // Clear the input field after successful update
//       setErrorMessage(""); // Clear any error messages
//     } catch (error) {
//       console.error("Error updating wallet address:", error);
//       setErrorMessage("Failed to update wallet address. Please try again.");
//     }
//   };

//   return (
//     <>
//       <div className="overlay">
//         <div className="container-fluid connectform">

//       <img src={polygonlogo} alt="polygon logo" className="polygonlogo"/>

//           <form onSubmit={handleSubmit} className="adressform">
//             <div>
//               <input
//               className="userwalletinputfield"
//                 type="text"
//                 id="walletAddress"
//                 value={walletAddress}
//                 onChange={(e) => setWalletAddress(e.target.value)}
//                 placeholder="Enter your wallet address"
//                 required
//               />
//             </div>
//             <button type="submit" className="connectbutton">Connect</button>
//           </form>
//         </div>
//       {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
//           {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
//       </div>
//     </>
//   );
// }

//02
// import React, { useRef, useEffect, useState } from "react";
// import { ref, update, get } from "firebase/database";
// import { db } from "../../firebase";
// import polygonlogo from "./polygonMatic.png";
// import "./connect.css";

// export function Connect() {

//   const [userId, setUserId] = useState<string | null>(null);
//   const [walletAddress, setWalletAddress] = useState(""); // State to store the wallet address
//   const [successMessage, setSuccessMessage] = useState(""); // State to store the success message
//   const [errorMessage, setErrorMessage] = useState(""); // State to store any error message

//   useEffect(() => {
//     // Initialize the Telegram Web App SDK
//     const initTelegram = () => {
//       const tg = window.Telegram.WebApp;
//       tg.ready();
//       console.log('Telegram Web App SDK initialized');
//       console.log('tg.initDataUnsafe:', tg.initDataUnsafe);

//       const user = tg.initDataUnsafe?.user;

//       if (user) {
//         setUserId(user.id.toString());
//       }
//     };

//     if (window.Telegram) {
//       console.log('Telegram SDK is already loaded');
//       initTelegram();
//     } else {
//       console.log('Waiting for Telegram SDK to be ready');
//       window.addEventListener('TelegramWebAppReady', initTelegram);
//     }

//     return () => {
//       window.removeEventListener('TelegramWebAppReady', initTelegram);
//     };
//   }, []);

//   // Function to handle form submission
//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault(); // Prevent form from reloading the page
//     if (!walletAddress || !userId) {
//       setErrorMessage("Please enter a valid wallet address and user ID.");
//       return;
//     }

//     // Path to the user in Firebase
//     const userRef = ref(db, "users/" + userId);

//     try {
//       // Fetch the existing addresswallet data
//       const snapshot = await get(userRef);

//       if (snapshot.exists()) {
//         const userData = snapshot.val();
//         const existingAddressWallet = userData.addresswallet || {};

//         // Update only the polygonwallet field
//         const updatedData = {
//           addresswallet: {
//             ...existingAddressWallet,
//             polygonwallet: walletAddress,
//           },
//         };

//         // Update Firebase with the new wallet address
//         await update(userRef, updatedData);

//         setSuccessMessage("Wallet address updated successfully!");
//         setWalletAddress(""); // Clear the input field after successful update
//         setErrorMessage(""); // Clear any error messages
//       } else {
//         setErrorMessage("User data does not exist.");
//       }
//     } catch (error) {
//       console.error("Error updating wallet address:", error);
//       setErrorMessage("Failed to update wallet address. Please try again.");
//     }
//   };

//   return (
//     <>
//       <div className="overlay">
//         <div className="container-fluid connectform">

//       <img src={polygonlogo} alt="polygon logo" className="polygonlogo"/>

//           <form onSubmit={handleSubmit} className="adressform">
//             <div>
//               <input
//               className="userwalletinputfield"
//                 type="text"
//                 id="walletAddress"
//                 value={walletAddress}
//                 onChange={(e) => setWalletAddress(e.target.value)}
//                 placeholder="Enter your wallet address"
//                 required
//               />
//             </div>
//             <button type="submit" className="connectbutton">Connect</button>
//           </form>
//         </div>
//       {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
//           {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
//       </div>
//     </>
//   );
// }

//03
import React, { useRef, useEffect, useState } from "react";
import { ref, update, get } from "firebase/database";
import { db } from "../../firebase";
import polygonlogo from "./polygonMatic.png";
import { Snackbar } from "@mui/material";
import "./connect.css";

export function Connect() {
  const [userId, setUserId] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState(""); // State to store the wallet address
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null); // State to store the connected wallet
  const [successMessage, setSuccessMessage] = useState<boolean>(false); // State to store the success message
  const [SuccessDisconnect, setSuccessDisconnect] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState(""); // State to store any error message

  useEffect(() => {
    // Initialize the Telegram Web App SDK
    const initTelegram = () => {
      const tg = window.Telegram.WebApp;
      tg.ready();
      console.log("Telegram Web App SDK initialized");
      console.log("tg.initDataUnsafe:", tg.initDataUnsafe);

      const user = tg.initDataUnsafe?.user;

      if (user) {
        setUserId(user.id.toString());
        fetchUserWallet(user.id.toString());
      }
    };

    if (window.Telegram) {
      console.log("Telegram SDK is already loaded");
      initTelegram();
    } else {
      console.log("Waiting for Telegram SDK to be ready");
      window.addEventListener("TelegramWebAppReady", initTelegram);
    }

    return () => {
      window.removeEventListener("TelegramWebAppReady", initTelegram);
    };
  }, []);

  // Function to fetch and set the connected wallet from Firebase
  const fetchUserWallet = async (userId: string) => {
    const userRef = ref(db, "users/" + userId);
    try {
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const userData = snapshot.val();
        const wallet = userData?.addresswallet?.polygonwallet || null;
        setConnectedWallet(wallet);
      } else {
        setConnectedWallet(null);
      }
    } catch (error) {
      console.error("Error fetching wallet address:", error);
      setConnectedWallet(null);
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent form from reloading the page
    if (!walletAddress || !userId) {
      setErrorMessage("Please enter a valid wallet address and user ID.");
      return;
    }

    const userRef = ref(db, "users/" + userId);

    const structuredData = {
      addresswallet: {
        polygonwallet: walletAddress,
      },
    };

    try {
      // Update Firebase with the new wallet address
      await update(userRef, structuredData);
      setSuccessMessage(true);
      setConnectedWallet(walletAddress); // Set connected wallet after success
      setWalletAddress(""); // Clear the input field after successful update
      setErrorMessage(""); // Clear any error messages
    } catch (error) {
      console.error("Error updating wallet address:", error);
      setErrorMessage("Failed to update wallet address. Please try again.");
    }
  };

  //shorten
  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Function to handle disconnect
  const handleDisconnect = async () => {
    if (!userId) return;
    const userRef = ref(db, "users/" + userId);

    const structuredData = {
      addresswallet: {
        polygonwallet: "",
      },
    };

    try {
      // Update Firebase to reset the wallet address
      await update(userRef, structuredData);
      setSuccessDisconnect(true);
      setConnectedWallet(null); // Reset the connected wallet
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      setErrorMessage("Failed to disconnect wallet. Please try again.");
    }
  };

  return (
    <>
      <div className="overlay">
        <div className="container-fluid connectform">
          <img src={polygonlogo} alt="polygon logo" className="polygonlogo" />

          {/* Conditionally show form if no wallet is connected */}
          {!connectedWallet ? (
            <form onSubmit={handleSubmit} className="adressform">
              <h5>Enter your Polygon WalletAddress</h5>
              <br />
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
              <button type="submit" className="connectbutton">
                Connect
              </button>
            </form>
          ) : (
            <div className="wallet-connected">
              <h5>  {shortenAddress(connectedWallet)}</h5>
              <button className="disconnectbutton" onClick={handleDisconnect}>
                Disconnect
              </button>
            </div>
          )}
        </div>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </div>
      {successMessage && (
            <Snackbar
              open={successMessage}
              autoHideDuration={1500}
              message="Connect Successful!"
              onClose={() => setSuccessMessage(false)}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              ContentProps={{
                sx: { backgroundColor: "green", color: "white" },
              }}
            />
          )}
            
            {SuccessDisconnect && (
            <Snackbar
              open={SuccessDisconnect}
              autoHideDuration={1500}
              message="Wallet Disconnect!"
              onClose={() =>  setSuccessDisconnect(false)}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              ContentProps={{
                sx: { backgroundColor: "red", color: "white", },
              }}
            />
          )}
    </>
  );
}
