// import React, { useRef, useEffect, useState } from "react";
// import { db } from "../../firebase";
// import { ref, onValue, get, runTransaction } from "firebase/database";
// import "./claim.css"

// export function Claimtk(){

//     const [totalTokens, setTotalTokens] = useState<number>(0);
//     const [walletAddress, setWalletAddress] = useState(""); // State to store the wallet address
//     const [userId, setUserId] = useState<string | null>(null);
//     const [connectedWallet, setConnectedWallet] = useState<string | null>(null); // State to store the connected wallet

//     useEffect(() => {
//         // Initialize the Telegram Web App SDK
//         const initTelegram = () => {
//           const tg = window.Telegram.WebApp;
//           tg.ready();
//           console.log("Telegram Web App SDK initialized");
//           console.log("tg.initDataUnsafe:", tg.initDataUnsafe);
    
//           const user = tg.initDataUnsafe?.user;
    
//           if (user) {
//             setUserId(user.id.toString());
//             fetchUserWallet(user.id.toString());
//           }
//         };
    
//         if (window.Telegram) {
//           console.log("Telegram SDK is already loaded");
//           initTelegram();
//         } else {
//           console.log("Waiting for Telegram SDK to be ready");
//           window.addEventListener("TelegramWebAppReady", initTelegram);
//         }
    
//         return () => {
//           window.removeEventListener("TelegramWebAppReady", initTelegram);
//         };
//       }, []);
    
// //02
//   // Function to fetch and set the connected wallet from Firebase
//   const fetchUserWallet = async (userId: string) => {
//     const userRef = ref(db, "users/" + userId);
//     try {
//       const snapshot = await get(userRef);
//       if (snapshot.exists()) {
//         const userData = snapshot.val();
//         const wallet = userData?.addresswallet?.polygonwallet || null;
//         setConnectedWallet(wallet);
//       } else {
//         setConnectedWallet(null);
//       }
//     } catch (error) {
//       console.error("Error fetching wallet address:", error);
//       setConnectedWallet(null);
//     }
//   };
// //03
// useEffect(() => {
//     if (userId) {
//       const exchangeRef = ref(db, `users/${userId}/exchanges/tokens`);

//       const unsubscribe = onValue(exchangeRef, (snapshot) => {
//         const tokens = snapshot.val();
//         setTotalTokens(tokens || 0);
//       });

//       return () => unsubscribe();
//     }
//   }, [userId]);


//     return(
//         <div className="Claim">
//             <div className="claimtoken">
//                 <div className="claimnote">
//                     <p>Total Token - {totalTokens}</p>
//                     <p>Transition fee  - 20%</p>
//                     <hr />
//                     <p>Claimable Token  - 33333</p>
//                 </div>
//             </div>

//             <button className="claimbutton">
//           Claim
//         </button>
//         </div>
//     );

// };

import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { ref, onValue, get, runTransaction } from "firebase/database";
import "./claim.css";

export function Claimtk() {
  const [totalTokens, setTotalTokens] = useState<number>(0);
  const [walletAddress, setWalletAddress] = useState(""); // State to store the wallet address
  const [userId, setUserId] = useState<string | null>(null);
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null); // State to store the connected wallet
  const [claimableTokens, setClaimableTokens] = useState<number>(0); // State to store claimable tokens
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State to store error message

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

  useEffect(() => {
    if (userId) {
      const exchangeRef = ref(db, `users/${userId}/exchanges/tokens`);

      const unsubscribe = onValue(exchangeRef, (snapshot) => {
        const tokens = snapshot.val();
        setTotalTokens(tokens || 0);

        // Calculate the claimable tokens after reducing 20%
        const claimable = tokens ? tokens * 0.8 : 0;
        setClaimableTokens(claimable);
      });

      return () => unsubscribe();
    }
  }, [userId]);

  // Function to handle the claim button click
  const handleClaim = async () => {
    setErrorMessage(null); // Reset error message before validating

    // Check for errors
    if (!connectedWallet) {
      setErrorMessage("Wallet address is required.");
      return;
    }
    if (totalTokens <= 0) {
      setErrorMessage("Insufficient tokens to claim.");
      return;
    }

    const userRef = ref(db, "users/" + userId);
    try {
      await runTransaction(userRef, (userData) => {
        if (userData) {
          // Update the user's wallet address and set pending/claim states
          userData.addresswallet = {
            polygonwallet: walletAddress,
          };
          userData.pendingstate = true;
          userData.claimstate = false; // Initially set claim state to false
          return userData;
        }
      });

      console.log("Claim process started, pending state set.");
    } catch (error) {
      console.error("Error claiming tokens:", error);
      setErrorMessage("Error during the claim process.");
    }
  };

  return (
    <div className="Claim">
      <div className="claimtoken">
        <div className="claimnote">
          <p>Total Token - {totalTokens}</p>
          <p>Transition fee - 20%</p>
          <hr />
          <p>Claimable Token - {claimableTokens}</p>
        </div>
      </div>

      <button className="claimbutton" onClick={handleClaim}>
        Claim
      </button>

      {errorMessage && <p className="error">{errorMessage}</p>}
    </div>
  );
}
