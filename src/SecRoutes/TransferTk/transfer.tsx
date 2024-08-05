// // export default Exchange;
// import React, { useState, useEffect } from "react";
// import { getDatabase, ref, onValue } from "firebase/database";
// import { db } from '../../firebase';

// interface ExchangeProps {
//   userId: string | null; // Add userId prop to identify the user in Firebase
// }

// //D4-01dow is for exchange mechasim
// const Transfer: React.FC<ExchangeProps> = ({ userId }) => {
//   const [inputValue, setInputValue] = useState<number>(0); // Start with 0
//   const [error, setError] = useState<string | null>(null); // State for error message
//   const [success, setSuccess] = useState<boolean>(false); // State for success feedback
// //
//    const [receiverId, setReceiverId] = useState<string | null>(null);
//    const [errorMessage, setErrorMessage] = useState<string>("");
//    //

//   //D5-01 Token show
// const [totalTokens, settotalTokens] = useState<number>(0);

// useEffect(() => {
//   if (userId) {
//     const exchangeRef = ref(db, `users/${userId}/exchanges/tokens`);

//     const unsubscribe = onValue(exchangeRef, (snapshot) => {
//       const tokens = snapshot.val();
//       settotalTokens(tokens || 0);
//       alert(`Exchange amount updated: ${tokens}`);
//     });

//     // Cleanup the subscription on unmount
//     return () => unsubscribe();
//   }
// }, [userId]);

//   const maxExchangeValue = Math.floor(totalTokens);

//   const isClickable = inputValue > 0 && inputValue <= totalTokens;

//   const handleMax = () => {
//     // Calculate the maximum exchangeable value that is a multiple of the exchange rate
//     const maxValidValue =
//       Math.floor(totalTokens);
//     setInputValue(maxValidValue);
//   };

//   //D5-02
//   const handleReceiverIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setReceiverId(e.target.value);
//     setErrorMessage(""); // Clear the error message when the input changes
//   };

//   return (
//     <div>

//       <div className="exchange">
//       <input
//             className="exin1"
//             type="text"
//             value={receiverId || ""}
//             onChange={handleReceiverIdChange}
//             placeholder="Enter REceiver ID"
//             required
//           />
//             {errorMessage && <p className="error-message">{errorMessage}</p>}
//         <div className="exbox1">
//           <input
//             className="exin1"
//             type="text"
//             value={inputValue.toFixed(1)}
//           />
//           <button
//             className={`exin2 ${isClickable ? "clickable" : "unclickable"}`}
//             onClick={handleMax}
//           >
//             Max
//           </button>
//         </div>
//         {/*  */}

//         <button
//           className={`exin6 ${isClickable ? "clickable" : "unclickable"}`}
//           onClick={}
//           disabled={!isClickable}
//         >
//          Send
//         </button>
//         {error && <p style={{ color: "red" }}>{error}</p>}
//         {success && !error && (
//           <p style={{ color: "green" }}>Exchange successful!</p>
//         )}
//       </div>

//     {/*  */}
//     </div>
//   );
// };

// export default Transfer;

//
import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue, runTransaction } from "firebase/database";
import { db } from "../../firebase";

interface TransferProps {
  userId: string | null;
}

const Transfer: React.FC<TransferProps> = ({ userId }) => {
  const [inputValue, setInputValue] = useState<number>(0);
  const [receiverId, setReceiverId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [totalTokens, setTotalTokens] = useState<number>(0);

  useEffect(() => {
    if (userId) {
      const exchangeRef = ref(db, `users/${userId}/exchanges/tokens`);

      const unsubscribe = onValue(exchangeRef, (snapshot) => {
        const tokens = snapshot.val();
        setTotalTokens(tokens || 0);
      });

      return () => unsubscribe();
    }
  }, [userId]);

  const maxExchangeValue = Math.floor(totalTokens);
  const isClickable = inputValue > 0 && inputValue <= totalTokens;

  const handleMax = () => {
    setInputValue(maxExchangeValue);
  };

  //
  const handleReceiverIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReceiverId(e.target.value);
    setError(null);
  };

  const handleSend = () => {
    if (!receiverId || !userId) {
      setError("Receiver ID and User ID must be provided.");
      return;
    } 
    if (receiverId === userId) {
        setError("* Cannot use Own Referrer Id.");
        return;
      }

    if (inputValue > totalTokens) {
      setError("You do not have enough tokens.");
      return;
    }

    const senderRef = ref(db, `users/${userId}/exchanges/tokens`);
    const receiverRef = ref(db, `users/${receiverId}/exchanges/tokens`);

    // Transaction to update both sender's and receiver's token balances
    runTransaction(senderRef, (currentTokens) => {
      if (currentTokens === null || currentTokens < inputValue) {
        setError("Transaction failed: Insufficient tokens.");
        return; // Abort the transaction
      }
      return currentTokens - inputValue;
    })
      .then(() => {
        return runTransaction(receiverRef, (currentTokens) => {
          return (currentTokens || 0) + inputValue;
        });
      })
      .then(() => {
        setSuccess(true);
        setInputValue(0); // Reset input after successful transaction
        setReceiverId("");
      })
      .catch((error) => {
        setError("Transaction failed: " + error.message);
      });
  };

  return (
    <div>
      <h3>Transfer Tokens</h3>
      <div className="exchange">
        <input
          className="exin1"
          type="text"
          value={receiverId}
          onChange={handleReceiverIdChange}
          placeholder="Enter Receiver ID"
          required
        />
        <div className="exbox1">
          <input
            className="exin1"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(Number(e.target.value))}
            placeholder="Enter Token Amount"
          />
          <button
            className={`exin2 ${isClickable ? "clickable" : "unclickable"}`}
            onClick={handleMax}
          >
            Max
          </button>
        </div>
        <button
          className={`exin6 ${isClickable ? "clickable" : "unclickable"}`}
          onClick={handleSend}
          disabled={!isClickable}
        >
          Send
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && !error && (
          <p style={{ color: "green" }}>Transfer successful!</p>
        )}
      </div>
    </div>
  );
};

export default Transfer;
