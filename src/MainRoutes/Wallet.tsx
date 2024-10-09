// import React, { useRef, useEffect, useReducer, useState } from "react";
// //for ts
// import UpgradeState from "../classes/upgradeState";
// import UpgradeEnergy from "../classes/upgradeEnergy";
// //
// import { SaveGame } from "../components/saveGame";
// //firebase
// import { sendUserDataToFirebase,updateUserAutoIncrementInFirebase} from '../firebaseFunctions';
// //wallet
// import {SwapMain} from "../SecRoutes/SwapTk/swapmain";
// import Transfer from "../SecRoutes/TransferTk/transfer";
// import { db } from '../firebase';
// import { ref, onValue } from "firebase/database";

// export function Wallet() {
//   const balanceRef = useRef({ value: 0 });
//   const forceUpdate = useReducer(x => x + 1, 0)[1];

//   const [energy, setEnergy] = useState(10000);
//   const [maxEnergy, setMaxEnergy] = useState(10000);
//   const [refillRate, setRefillRate] = useState(1);
//   const [lastUpdated, setLastUpdated] = useState(Date.now());
//    //user
//   const [userId, setUserId] = useState<string | null>(null);
// //  exchange
// const [totalExchange, setTotalExchange] = useState<number>(0); // State for total exchange amount
//   const [isInitialLoad, setIsInitialLoad] = useState(true); // Flag to check if initial load is done

//   // Load state from localStorage on mount For energy and autoincrement on window close
//   useEffect(() => {
//     const storedEnergy = localStorage.getItem('energy');
//     const storedMaxEnergy = localStorage.getItem('maxEnergy');
//     const storedRefillRate = localStorage.getItem('refillRate');
//     const storedLastUpdated = localStorage.getItem('lastUpdated');
// //down is for autoincrement
//  const storedBalance = localStorage.getItem('balance');
//  const storedAutoIncrement = localStorage.getItem('autoIncrement');

//     if (storedEnergy && storedMaxEnergy && storedRefillRate && storedLastUpdated && storedBalance && storedAutoIncrement) {
//       const timePassed = (Date.now() - parseInt(storedLastUpdated, 10)) / 1000; // time in seconds
//       console.log("timePassed (seconds):", timePassed);

//       const storedRefillRateNum = parseInt(storedRefillRate, 10);
//       const calculatedEnergy = Math.min(parseInt(storedEnergy, 10) + Math.floor(timePassed * storedRefillRateNum), parseInt(storedMaxEnergy, 10));
      
//       console.log("calculatedEnergy:", calculatedEnergy);

//       setEnergy(calculatedEnergy);
//       setMaxEnergy(parseInt(storedMaxEnergy, 10));
//       setRefillRate(storedRefillRateNum);
//       setLastUpdated(Date.now());

// //dowm is for autoincrement time on offline
//     const storedAutoIncrementNum = parseFloat(storedAutoIncrement);
//      const calculatedBalance = parseFloat(storedBalance) + Math.min(storedAutoIncrementNum * timePassed, storedAutoIncrementNum * 7200);
//      balanceRef.current.value = Math.round(calculatedBalance * 100) / 100;
//     }
//     setIsInitialLoad(false); // Set initial load flag to false after loading from localStorage
//   }, []);

//   // Save state to localStorage only after the initial load is complete
//   useEffect(() => {
//     if (!isInitialLoad) {
//       localStorage.setItem('energy', energy.toString());
//       localStorage.setItem('maxEnergy', maxEnergy.toString());
//       localStorage.setItem('refillRate', refillRate.toString());
//       localStorage.setItem('lastUpdated', lastUpdated.toString());
//  //down is auto increment
//       localStorage.setItem('balance', balanceRef.current.value.toString());
//       localStorage.setItem('autoIncrement', autoIncrement.toString());

//     }
//   }, [energy, maxEnergy, refillRate, lastUpdated, isInitialLoad]);
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
//         sendUserDataToFirebase(id, autoIncrement);
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

  
// //up is user

// //D4
// useEffect(() => {
//   if (userId) {
//     const exchangeRef = ref(db, `users/${userId}/exchanges/amount`);

//     const unsubscribe = onValue(exchangeRef, (snapshot) => {
//       const amount = snapshot.val();
//       setTotalExchange(amount || 0);
//       alert(`Exchange amount updated: ${amount}`);
//     });

//     // Cleanup the subscription on unmount
//     return () => unsubscribe();
//   }
// }, [userId]);

// //routuerchange
//   const upgradeMap = useRef(
//     new Map<string, UpgradeState>([
//       ["clickUpgrade", new UpgradeState(15, 2, 1, 2)],
//       ["autoClicker01", new UpgradeState(80, 2, 0, 0.1)],
//       ["autoClicker02", new UpgradeState(200, 2, 0, 0.5)],
//       ["autoClicker03", new UpgradeState(1000, 2, 0, 0.8)],
//       ["autoClicker04", new UpgradeState(5000, 2, 0, 1)],
//       ["autoClicker05", new UpgradeState(5000, 2, 0, 1)],
//       ["autoClicker06", new UpgradeState(5000, 2, 0, 1)],
//       ["autoClicker07", new UpgradeState(10000, 2, 0, 1.5)],
//       //ref card
//       ["refClicker01", new UpgradeState(500, 2, 0, 1)],
//       ["refClicker02", new UpgradeState(1500, 2, 0, 1.5)],
//       ["refClicker03", new UpgradeState(1500, 2, 0, 1.5)],
//       ["refClicker04", new UpgradeState(4000, 2, 0, 2)],
//       ["refClicker05", new UpgradeState(4000, 2, 0, 2)],
//     ])
//   );

//   const upgradeEnergyMap = useRef(new Map<string, UpgradeEnergy>([
//     ['energyPool', new UpgradeEnergy(40, 1.4, 50,0)],
//     ['energyfill', new UpgradeEnergy(70, 2,0, 1)],
//      // Add other entries as needed
//   ]));

//   let autoIncrement: number =
//       Math.round(
//         (upgradeMap.current.get("autoClicker01")!.increment +
//           upgradeMap.current.get("autoClicker02")!.increment +
//           upgradeMap.current.get("autoClicker03")!.increment +
//           upgradeMap.current.get("autoClicker04")!.increment +
//           upgradeMap.current.get("autoClicker05")!.increment +
//           upgradeMap.current.get("autoClicker06")!.increment +
//           upgradeMap.current.get("autoClicker07")!.increment +
//           //ref card
//           upgradeMap.current.get("refClicker01")!.increment +
//           upgradeMap.current.get("refClicker02")!.increment +
//           upgradeMap.current.get("refClicker03")!.increment +
//           upgradeMap.current.get("refClicker04")!.increment +
//           upgradeMap.current.get("refClicker05")!.increment) *
//           100
//       ) / 100 - (totalExchange/3600);

//     //downdatabase
//     useEffect(() => {
//       if (userId !== null) {
//         updateUserAutoIncrementInFirebase(userId, autoIncrement);
//       }
//     }, [autoIncrement]);
// //updatabse

//   useEffect(() => {
//     const interval = setInterval(() => {
//       balanceRef.current.value = Math.round((balanceRef.current.value + (autoIncrement / 10)) * 100) / 100;
//       forceUpdate();
//     }, 100);

//     return () => clearInterval(interval);
//   });

//   useEffect(() => {
//     const refillInterval = setInterval(() => {
//       setEnergy((prevEnergy) => {
//         const newEnergy = Math.min(prevEnergy + refillRate, maxEnergy);
//         setLastUpdated(Date.now());
//         return newEnergy;
//       });
//     }, 1000);

//     return () => clearInterval(refillInterval);
//   }, [refillRate, maxEnergy]);

//   const upgradeInvocationHandler = (
//     id: string,
//     upgradeMap: React.MutableRefObject<Map<string, UpgradeState>>,
//     upgradeEnergyMap: React.MutableRefObject<Map<string, UpgradeEnergy>>,
//     balanceRef: React.MutableRefObject<{ value: number }>,
//     setMaxEnergy: React.Dispatch<React.SetStateAction<number>>,
//     setRefillRate: React.Dispatch<React.SetStateAction<number>>,
//   ): void => {
//     if (upgradeMap.current.has(id)) {
//       const cost = upgradeMap.current.get(id)!.currentCost;
//       if (upgradeMap.current.get(id)!.upgrade(balanceRef.current.value)) {
//         console.log(`Upgraded ${id} component.`);
//         balanceRef.current.value = Math.round((balanceRef.current.value - cost) * 100) / 100;
//       } else {
//         console.log(`Balance is too low to upgrade ${id} component.`);
//       }
//     }
//   }

//   const handleRewardClaimed = () => {
//     forceUpdate(); // Force an update to reflect the new balance
//   };

//   return (
//     <>
//       <div className="overlay">
//         <div className="container-fluid">
//         <SaveGame
//   balanceRef={balanceRef}
//   upgradeMap={upgradeMap}
//   upgradeEnergyMap={upgradeEnergyMap}
//   userId={userId} 
//  />
//           {/* <Swap autoIncrement={autoIncrement} userId={userId}/>
//           <Transfer userId={userId}/> */}
//           <SwapMain />
//         </div>
//       </div>
//     </>
//   )
// }

//02
// import React, {useState } from "react";
// import { ref, get } from "firebase/database";
// import { db } from "../firebase";
// import { Route, Routes, NavLink, Navigate } from "react-router-dom";
// import { SwapMain } from "../SecRoutes/SwapTk/swapmain";
// import { TransferMain } from "../SecRoutes/TransferTk/transfermain";
// import "./SecNavcss/walletnav.css";

// export function Wallet() {

//   const [connectedWallet, setConnectedWallet] = useState<string | null>(null)

//    // Function to fetch and set the connected wallet from Firebase
//    const fetchUserWallet = async (userId: string) => {
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

//   return (
//     <>
//       <div className="overlay">
//         <div className="container-fluid">
//           <div className= "connectwalletnav">
//           {!connectedWallet ? (
//             <NavLink to="/connect" className= "minelink"> Connect </NavLink>
//           ):(
//           <NavLink to="/connect" className= "minelink">{connectedWallet} </NavLink>)}
         
//           </div>
       
//           <nav className="wallet_nav">
//             <ul>
//               <li>
//                 <NavLink 
//                   to="/wallet/swapmain" 
//                   className={({ isActive }) => isActive ? "minelink active" : "minelink"}
//                 >
//                   Swap
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink 
//                   to="/wallet/transfermain" 
//                   className={({ isActive }) => isActive ? "minelink active" : "minelink"}
//                 >
//                  Transfer
//                 </NavLink>
//               </li>
//             </ul>
//           </nav>

//           <Routes>
//             <Route path="/" element={<Navigate to="swapmain" />} />
//             <Route path="swapmain" element={<SwapMain />} />
//             <Route path="transfermain" element={<TransferMain />} />
//           </Routes>
//         </div>
//       </div>
//     </>
//   );
// }
// {/* <div className="connectwalletnav">
// {/* If no wallet is connected, show the "Connect" link */}
// {!connectedWallet ? (
//   <NavLink to="/connect" className="minelink walletconnect">Connect</NavLink>
// ) : (
//   // If wallet is connected, display the shortened address
//   <NavLink to="/connect" className="minelink walletaddress">
//     {shortenAddress(connectedWallet)}
//   </NavLink>
// )}
// </div> */}


//03
import React, { useState, useEffect } from "react";
import { ref, get } from "firebase/database";
import { db } from "../firebase";
import { Route, Routes, NavLink, Navigate } from "react-router-dom";
import { SwapMain } from "../SecRoutes/SwapTk/swapmain";
import { TransferMain } from "../SecRoutes/TransferTk/transfermain";
import "./SecNavcss/walletnav.css";

export function Wallet() {
  const [userId, setUserId] = useState<string | null>(null);
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);

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

  // Function to shorten the wallet address (e.g., 0x0C68b...45B3E)
  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <>
      <div className="overlay">
        <div className="container-fluid">
         

          <nav className="wallet_nav">
            <ul>
              <li>
                <NavLink 
                  to="/wallet/swapmain" 
                  className={({ isActive }) => isActive ? "minelink active" : "minelink"}
                >
                  Swap
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/wallet/transfermain" 
                  className={({ isActive }) => isActive ? "minelink active" : "minelink"}
                >
                  Transfer
                </NavLink>
              </li>
            </ul>
          </nav>

          <Routes>
            <Route path="/" element={<Navigate to="swapmain" />} />
            <Route path="swapmain" element={<SwapMain />} />
            <Route path="transfermain" element={<TransferMain />} />
          </Routes>
        </div>
      </div>
    </>
  );
}
