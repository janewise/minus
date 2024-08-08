

//01
// import React, { useState, useEffect } from "react";
// import { getDatabase, ref, onValue, runTransaction } from "firebase/database";
// import { db } from "../../firebase";

// interface TransferProps {
//   userId: string | null;
// }

// const Transfer: React.FC<TransferProps> = ({ userId }) => {
//   const [inputValue, setInputValue] = useState<number>(0);
//   const [receiverId, setReceiverId] = useState<string>("");
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<boolean>(false);
//   const [totalTokens, setTotalTokens] = useState<number>(0);

//   useEffect(() => {
//     if (userId) {
//       const exchangeRef = ref(db, `users/${userId}/exchanges/tokens`);

//       const unsubscribe = onValue(exchangeRef, (snapshot) => {
//         const tokens = snapshot.val();
//         setTotalTokens(tokens || 0);
//       });

//       return () => unsubscribe();
//     }
//   }, [userId]);

//   const maxExchangeValue = Math.floor(totalTokens);
//   const isClickable = inputValue > 0 && inputValue <= totalTokens;

//   const handleMax = () => {
//     setInputValue(maxExchangeValue);
//   };

//   //
//   const handleReceiverIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setReceiverId(e.target.value);
//     setError(null);
//   };

//   const handleSend = () => {
//     if (!receiverId || !userId) {
//       setError("Receiver ID and User ID must be provided.");
//       return;
//     } 
//     if (receiverId === userId) {
//         setError("* Cannot use Own Referrer Id.");
//         return;
//       }

//     if (inputValue > totalTokens) {
//       setError("You do not have enough tokens.");
//       return;
//     }

//     const senderRef = ref(db, `users/${userId}/exchanges/tokens`);
//     const receiverRef = ref(db, `users/${receiverId}/exchanges/tokens`);

//     // Transaction to update both sender's and receiver's token balances
//     runTransaction(senderRef, (currentTokens) => {
//       if (currentTokens === null || currentTokens < inputValue) {
//         setError("Transaction failed: Insufficient tokens.");
//         return; // Abort the transaction
//       }
//       return currentTokens - inputValue;
//     })
//       .then(() => {
//         return runTransaction(receiverRef, (currentTokens) => {
//           return (currentTokens || 0) + inputValue;
//         });
//       })
//       .then(() => {
//         setSuccess(true);
//         setInputValue(0); // Reset input after successful transaction
//         setReceiverId("");
//       })
//       .catch((error) => {
//         setError("Transaction failed: " + error.message);
//       });
//   };

//   return (
//     <div>
//       <h3>Transfer Tokens</h3>
//       <div className="exchange">
//         <input
//           className="exin1"
//           type="text"
//           value={receiverId}
//           onChange={handleReceiverIdChange}
//           placeholder="Enter Receiver ID"
//           required
//         />
//         <div className="exbox1">
//           <input
//             className="exin1"
//             type="text"
//             value={inputValue}
//             onChange={(e) => setInputValue(Number(e.target.value))}
//             placeholder="Enter Token Amount"
//           />
//           <button
//             className={`exin2 ${isClickable ? "clickable" : "unclickable"}`}
//             onClick={handleMax}
//           >
//             Max
//           </button>
//         </div>
//         <button
//           className={`exin6 ${isClickable ? "clickable" : "unclickable"}`}
//           onClick={handleSend}
//           disabled={!isClickable}
//         >
//           Send
//         </button>
//         {error && <p style={{ color: "red" }}>{error}</p>}
//         {success && !error && (
//           <p style={{ color: "green" }}>Transfer successful!</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Transfer;


//02
// import { Button, Box, Typography, Modal, Snackbar } from "@mui/material";
// import React, { useState, useEffect } from "react";
// import { getDatabase, ref, onValue } from "firebase/database";
// import { db } from '../../firebase';


// const style = {
//   position: "absolute" as "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 350,
//   bgcolor: "rgb(14, 16, 17)",
//   border: "2px solid rgb(141, 130, 114)",
//   boxShadow: 24,
//   p: 3,
// };

// interface ExchangeProps {
//   userId: string | null; // Add userId prop to identify the user in Firebase
// }

// //
// const [open, setOpen] = React.useState(false);
//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);

// //D5-01
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

//       {/* <div className="exchange">
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

//        {/* <button
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
//       </div> */}
//        <form onSubmit={SendTokens}>
//           <h4 className="reftitle">Enter Referrer ID and Earn 20000</h4>
//           <input
//             type="text"
//             className="receiverId"
//             value={receiverId || ""}
//             onChange={handleReceiverIdChange}
//             placeholder="Enter Receiver ID"
//             required
//           />
//           <input
//              type="text"
//              className="sendTokens"
//              max={maxExchangeValue}
//             value={inputValue}
//             onChange={(e) => setInputValue(Number(e.target.value))}
//             placeholder="Enter Token Amount"
//             required
//           />
//           {errorMessage && <p className="error-message">{errorMessage}</p>}
//           <button type="submit" className="referbutton"     onClick={handleOpen}>
//             Send
//           </button>
//         </form>
//         <Modal
//         open={open}
//         onClose={handleClose}
//         aria-labelledby="modal-modal-title"
//         aria-describedby="modal-modal-description"
//       >
//         <Box sx={style}>
//           <Typography id="modal-modal-title" variant="h6" component="h2">
//             Success
//           </Typography>
//           <Typography id="modal-modal-description" sx={{ mt: 2 }}>
//             <h4> Sender:{userId} | Receiver:{receiverId}</h4>
//             <h4>Tokens:{inputValue}</h4>
//             <p>time of succcessfuuly send in (5.6.2024,UTC:00)</p>
//           </Typography>
//           <Button onClick={handleClose}>X</Button>
//         </Box>
//       </Modal>

//     {/*  */}
//     </div>
//   );
// };

// export default Transfer;

//03
import { Button, Box, Typography, Modal, Snackbar } from "@mui/material";
import React, { useState, useEffect } from "react";
import { ref, onValue, get, runTransaction } from "firebase/database";
import { db } from '../../firebase';
import "./transfer.css"

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  bgcolor: 'white',
  border: '1px solid rgb(141, 130, 114)',
  boxShadow: 24,
  p: 3,
  color: 'black',           // Text color set to black
  borderRadius: '8px',      // Border radius set to 8px
};

interface ExchangeProps {
  userId: string | null;
}

const Transfer: React.FC<ExchangeProps> = ({ userId }) => {
  const [inputValue, setInputValue] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [receiverId, setReceiverId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [open, setOpen] = useState(false);
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
    const maxValidValue = Math.floor(totalTokens);
    setInputValue(maxValidValue);
  };

  const handleReceiverIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReceiverId(e.target.value);
    setErrorMessage(""); // Clear the error message when the input changes
  };

  const handleOpen = () => {
    if (inputValue > totalTokens) {
      setErrorMessage("Please enter a valid token amount.");
      return;
    }

    if (!receiverId) {
      setErrorMessage("Please enter a valid receiver ID.");
      return;
    }

    const receiverRef = ref(db, `users/${receiverId}`);
    get(receiverRef).then((snapshot) => {
      if (!snapshot.exists()) {
        setErrorMessage("Please enter a valid receiver ID.");
        return;
      } else {
        setErrorMessage("");
        setOpen(true);
      }
    });
  };

  const handleClose = () => setOpen(false);

  const ConfirmTransfer = () => {
    if (!userId || !receiverId) return;

    const senderRef = ref(db, `users/${userId}/exchanges/tokens`);
    const receiverRef = ref(db, `users/${receiverId}/exchanges/tokens`);

    // Use runTransaction to ensure atomic updates
    runTransaction(senderRef, (currentTokens) => {
      if (currentTokens === null || currentTokens < inputValue) {
        setErrorMessage("Insufficient tokens.");
        return currentTokens;
      }

      return currentTokens - inputValue;
    })
      .then(() => {
        runTransaction(receiverRef, (currentTokens) => {
          return (currentTokens || 0) + inputValue;
        })
          .then(() => {
            setSuccess(true);
            setOpen(false);
            setInputValue(0);
            setReceiverId("");
            setErrorMessage("");
          })
          .catch((error) => {
            console.error("Error updating receiver's tokens:", error);
          });
      })
      .catch((error) => {
        console.error("Error updating sender's tokens:", error);
      });
  };

  return (
    <div>
      <form onSubmit={(e) => e.preventDefault()} className="transferForm">
        <h4 className="reftitle">Enter Receiver ID and Token Amount</h4>
        <input
          type="text"
          className="receiverId"
          value={receiverId || ""}
          onChange={handleReceiverIdChange}
          placeholder="Enter Receiver ID"
          required
        />
        <div style={{display:'flex',justifyContent:'center'}}><input
          type="number"
          className="sendTokens"
          value={inputValue}
          onChange={(e) => setInputValue(Number(e.target.value))}
          placeholder="Enter Token Amount"
          required
        /> <button
        className={`exin2 ${isClickable ? "clickable" : "unclickable"}`}
        onClick={handleMax}
      >
        Max
      </button></div>
        

        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="button" className="referbutton" onClick={handleOpen}>
          Send
        </button>
      </form>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <h3>Confirm Transfer</h3>
            <hr />
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <h5>Sender  : {userId}</h5>
            <h5>Receiver: {receiverId}</h5>
            <h5>Tokens: {inputValue}</h5>
            <p>Are you sure you want to send these tokens?</p>
            <hr />
          </Typography>
          <Button onClick={ConfirmTransfer} color="primary">confirm</Button>
          <Button onClick={handleClose} color="error">Cancel</Button>
        </Box>
      </Modal>
      {success && <Snackbar open={success} autoHideDuration={3000} message="Transfer successful!" onClose={() => setSuccess(false)} />}
    </div>
  );
};

export default Transfer;
