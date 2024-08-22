import { Button, Box, Typography, Modal, Snackbar } from "@mui/material";
import UpgradeState from "../classes/upgradeState";
import React, { useEffect, useRef } from "react";
import UpgradeEnergy from "../classes/upgradeEnergy";
import { saveUserDataToFirebase } from '../firebaseFunctions'; // Import your Firebase function



const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350,
  bgcolor: "rgb(14, 16, 17)",
  border: "2px solid rgb(141, 130, 114)",
  boxShadow: 24,
  p: 3,
};

export function SaveGame(props: {
  balanceRef: React.MutableRefObject<{ value: number }>;
  upgradeMap: React.MutableRefObject<Map<string, UpgradeState>>;
  upgradeEnergyMap: React.MutableRefObject<Map<string, UpgradeEnergy>>;
  userId: string | null  // Assuming you're passing userId as a prop
}) {
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  function handleSave() {
    localStorage.setItem(
      "balanceRef",
      JSON.stringify(props.balanceRef.current.value)
    );
    localStorage.setItem(
      "Upgradeclick",
      JSON.stringify(props.upgradeMap.current.get("clickUpgrade")!.level)
    );
    localStorage.setItem(
      "AC1Level",
      JSON.stringify(props.upgradeMap.current.get("autoClicker01")!.level)
    );
    localStorage.setItem(
      "AC2Level",
      JSON.stringify(props.upgradeMap.current.get("autoClicker02")!.level)
    );
    localStorage.setItem(
      "AC3Level",
      JSON.stringify(props.upgradeMap.current.get("autoClicker03")!.level)
    );
    localStorage.setItem(
      "AC4Level",
      JSON.stringify(props.upgradeMap.current.get("autoClicker04")!.level)
    );
    localStorage.setItem(
      "AC5Level",
      JSON.stringify(props.upgradeMap.current.get("autoClicker05")!.level)
    );
    localStorage.setItem(
      "AC6Level",
      JSON.stringify(props.upgradeMap.current.get("autoClicker06")!.level)
    );
    localStorage.setItem(
      "AC7Level",
      JSON.stringify(props.upgradeMap.current.get("autoClicker07")!.level)
    );
    
     //for Ref Card
     localStorage.setItem("RC1Level", JSON.stringify(props.upgradeMap.current.get('refClicker01')!.level))
     localStorage.setItem("RC2Level", JSON.stringify(props.upgradeMap.current.get('refClicker02')!.level))
     localStorage.setItem("RC3Level", JSON.stringify(props.upgradeMap.current.get('refClicker03')!.level))
     localStorage.setItem("RC4Level", JSON.stringify(props.upgradeMap.current.get('refClicker04')!.level))
     localStorage.setItem("RC5Level", JSON.stringify(props.upgradeMap.current.get('refClicker05')!.level))
    

     // Prepare data for Firebase D2
     const firebaseData = {
      balance: props.balanceRef.current.value,
      upgrades: {
        clickUpgrade: props.upgradeMap.current.get('clickUpgrade')!.level,
        autoClicker01: props.upgradeMap.current.get('autoClicker01')!.level,
        autoClicker02: props.upgradeMap.current.get('autoClicker02')!.level,
        autoClicker03: props.upgradeMap.current.get('autoClicker03')!.level,
        autoClicker04: props.upgradeMap.current.get('autoClicker04')!.level,
        autoClicker05: props.upgradeMap.current.get('autoClicker05')!.level,
        autoClicker06: props.upgradeMap.current.get('autoClicker06')!.level,
        autoClicker07: props.upgradeMap.current.get('autoClicker07')!.level,
        refClicker01: props.upgradeMap.current.get('refClicker01')!.level,
        refClicker02: props.upgradeMap.current.get('refClicker02')!.level,
      },
      //upgradeEnergy: {
        //energyPool: props.upgradeEnergyMap.current.get('energyPool')!.level,
    //energyFill: props.upgradeEnergyMap.current.get('energyfill')!.level,
      //},
      lastUpdated: new Date().getTime(),
    };

    // Save data to Firebase if userId is not null
    if (props.userId) {
      saveUserDataToFirebase(props.userId, firebaseData);
      setOpenSnackbar(false);
    } else {
      console.error("Cannot save data: userId is null.");
    }
  }
//D2

  function handleLoad() {
    props.balanceRef.current.value = parseInt(
      JSON.parse(localStorage.getItem("balanceRef") || "0")
    );
    loadUpgrade(
      "clickUpgrade",
      parseInt(JSON.parse(localStorage.getItem("Upgradeclick") || "0")),
      props.upgradeMap
    );
    loadUpgrade(
      "autoClicker01",
      parseInt(JSON.parse(localStorage.getItem("AC1Level") || "0")),
      props.upgradeMap
    );
    loadUpgrade(
      "autoClicker02",
      parseInt(JSON.parse(localStorage.getItem("AC2Level") || "0")),
      props.upgradeMap
    );
    loadUpgrade(
      "autoClicker03",
      parseInt(JSON.parse(localStorage.getItem("AC3Level") || "0")),
      props.upgradeMap
    );
    loadUpgrade(
      "autoClicker04",
      parseInt(JSON.parse(localStorage.getItem("AC4Level") || "0")),
      props.upgradeMap
    );
    loadUpgrade(
      "autoClicker05",
      parseInt(JSON.parse(localStorage.getItem("AC5Level") || "0")),
      props.upgradeMap
    );
    loadUpgrade(
      "autoClicker06",
      parseInt(JSON.parse(localStorage.getItem("AC6Level") || "0")),
      props.upgradeMap
    );
    loadUpgrade(
      "autoClicker07",
      parseInt(JSON.parse(localStorage.getItem("AC7Level") || "0")),
      props.upgradeMap
    );
    //ref card
    loadUpgrade('refClicker01', parseInt(JSON.parse(localStorage.getItem("RC1Level") || '0')), props.upgradeMap)
    loadUpgrade('refClicker02', parseInt(JSON.parse(localStorage.getItem("RC2Level") || '0')), props.upgradeMap)
    loadUpgrade('refClicker03', parseInt(JSON.parse(localStorage.getItem("RC3Level") || '0')), props.upgradeMap)
    loadUpgrade('refClicker04', parseInt(JSON.parse(localStorage.getItem("RC4Level") || '0')), props.upgradeMap)
    loadUpgrade('refClicker05', parseInt(JSON.parse(localStorage.getItem("RC5Level") || '0')), props.upgradeMap)
   
    // console.log("Game loaded");
    loadUpgradeEnergy(
      "energyPool",
      parseInt(JSON.parse(localStorage.getItem("pool") || "0")),
      props.upgradeEnergyMap
    );
    loadUpgradeEnergy(
      "energyfill",
      parseInt(JSON.parse(localStorage.getItem("refill") || "0")),
      props.upgradeEnergyMap
    );
  }

  useEffect(() => {
    handleLoad();

  }, []);

  const counter = useRef({ value: 0 });
  counter.current.value += 1;
  if (counter.current.value >= 10) {
    //1400
    handleSave();
    counter.current.value = 0;
  }

  function wipeSave() {
    props.balanceRef.current.value = parseInt(JSON.parse("0"));
    loadUpgrade("clickUpgrade", parseInt(JSON.parse("0")), props.upgradeMap);
    loadUpgrade("autoClicker01", parseInt(JSON.parse("0")), props.upgradeMap);
    loadUpgrade("autoClicker02", parseInt(JSON.parse("0")), props.upgradeMap);
    loadUpgrade("autoClicker03", parseInt(JSON.parse("0")), props.upgradeMap);
    loadUpgrade("autoClicker04", parseInt(JSON.parse("0")), props.upgradeMap);
    loadUpgrade("autoClicker05", parseInt(JSON.parse("0")), props.upgradeMap);
    loadUpgrade("autoClicker06", parseInt(JSON.parse("0")), props.upgradeMap);
    loadUpgrade("autoClicker07", parseInt(JSON.parse("0")), props.upgradeMap);
    //ref card
    loadUpgrade('refClicker01', parseInt(JSON.parse('0')), props.upgradeMap);
    loadUpgrade('refClicker02', parseInt(JSON.parse('0')), props.upgradeMap);
    loadUpgrade('refClicker03', parseInt(JSON.parse('0')), props.upgradeMap);
    loadUpgrade('refClicker04', parseInt(JSON.parse('0')), props.upgradeMap);
    loadUpgrade('refClicker05', parseInt(JSON.parse('0')), props.upgradeMap);
    
    loadUpgradeEnergy(
      "energyPool",
      parseInt(JSON.parse("0")),
      props.upgradeEnergyMap
    );
    loadUpgradeEnergy(
      "energyfill",
      parseInt(JSON.parse("0")),
      props.upgradeEnergyMap
    );
    localStorage.removeItem("balanceRef");
    localStorage.removeItem("Upgradeclick");
    localStorage.removeItem("AC1Level");
    localStorage.removeItem("AC2Level");
    localStorage.removeItem("AC3Level");
    localStorage.removeItem("AC4Level");
    localStorage.removeItem("AC5Level");
    localStorage.removeItem("AC6Level");
    localStorage.removeItem("AC7Level");
    //ref card
    localStorage.removeItem("RC1Level");
    localStorage.removeItem("RC2Level");
    localStorage.removeItem("RC3Level");
    localStorage.removeItem("RC4Level");
    localStorage.removeItem("RC5Level");

    localStorage.removeItem("pool");
    localStorage.removeItem("refill");
    props.balanceRef.current.value = parseInt(JSON.parse("0"));
    console.log("Game wiped");
    window.location.reload();
    handleClose();
  }
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCloseSnackbar = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <>
      <Button
        className="savehide"
        onClick={handleSave}
        style={{ margin: "10px 10px 30px 10px" }}
        variant="contained"
      >
        Save
      </Button>{" "}
      <br />
      <Button
        className="savehide"
        onClick={handleOpen}
        size="small"
        style={{ margin: "10px" }}
        variant="contained"
        color="error"
      >
        Wipe save
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            WARNING
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Do you REALLY want to wipe your save?
          </Typography>
          <Typography variant="caption">
            You will lose your progress, there is no going back!
          </Typography>
          <Button onClick={wipeSave}>Yes</Button>
          <Button onClick={handleClose}>No</Button>
        </Box>
      </Modal>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        message="Game saved"
      />
    </>
  );
}

const loadUpgrade = (
  id: string,
  level: number,
  upgradeMap: React.MutableRefObject<Map<string, UpgradeState>>
): void => {
  upgradeMap.current.get(id)!.loadUpgrade(level);
};
const loadUpgradeEnergy = (
  id: string,
  level: number,
  upgradeEnergyMap: React.MutableRefObject<Map<string, UpgradeEnergy>>
): void => {
  upgradeEnergyMap.current.get(id)!.loadUpgrade(level);
};


// import { Button, Box, Typography, Modal, Snackbar } from "@mui/material";
// import UpgradeState from "../classes/upgradeState";
// import React, { useEffect, useRef } from "react";
// import UpgradeEnergy from "../classes/upgradeEnergy";
// import { saveUserDataToFirebase } from '../firebaseFunctions'; // Import your Firebase function

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

// export function SaveGame(props: {
//   balanceRef: React.MutableRefObject<{ value: number }>;
//   upgradeMap: React.MutableRefObject<Map<string, UpgradeState>>;
//   upgradeEnergyMap: React.MutableRefObject<Map<string, UpgradeEnergy>>;
//   userId: string | null // Assuming you're passing userId as a prop
// }) {
//   const [openSnackbar, setOpenSnackbar] = React.useState(false);

//   function handleSave() {
//     localStorage.setItem(
//       "balanceRef",
//       JSON.stringify(props.balanceRef.current.value)
//     );
//     localStorage.setItem(
//       "Upgradeclick",
//       JSON.stringify(props.upgradeMap.current.get("clickUpgrade")!.level)
//     );
//     // Save autoClicker and refClicker levels to localStorage
//     ["autoClicker01", "autoClicker02", "autoClicker03", "autoClicker04", "autoClicker05", "autoClicker06", "autoClicker07", "refClicker01", "refClicker02", "refClicker03", "refClicker04", "refClicker05"].forEach((id) => {
//       localStorage.setItem(id, JSON.stringify(props.upgradeMap.current.get(id)!.level));
//     });

//     // Prepare data for Firebase
//     const firebaseData = {
//       balance: props.balanceRef.current.value,
//       upgrades: {
//         clickUpgrade: props.upgradeMap.current.get('clickUpgrade')!.level,
//         autoClicker01: props.upgradeMap.current.get('autoClicker01')!.level,
//         autoClicker02: props.upgradeMap.current.get('autoClicker02')!.level,
//         autoClicker03: props.upgradeMap.current.get('autoClicker03')!.level,
//         autoClicker04: props.upgradeMap.current.get('autoClicker04')!.level,
//         autoClicker05: props.upgradeMap.current.get('autoClicker05')!.level,
//         autoClicker06: props.upgradeMap.current.get('autoClicker06')!.level,
//         autoClicker07: props.upgradeMap.current.get('autoClicker07')!.level,
//         refClicker01: props.upgradeMap.current.get('refClicker01')!.level,
//         refClicker02: props.upgradeMap.current.get('refClicker02')!.level,
//       },
//       lastUpdated: new Date().getTime(),
//     };

//     // Save data to Firebase if userId is not null
//     if (props.userId) {
//       saveUserDataToFirebase(props.userId, firebaseData);
//       setOpenSnackbar(true);
//     } else {
//       console.error("Cannot save data: userId is null.");
//     }
//   }

//   function handleLoad() {
//     props.balanceRef.current.value = parseInt(
//       JSON.parse(localStorage.getItem("balanceRef") || "0")
//     );
//     loadUpgrade("clickUpgrade", parseInt(JSON.parse(localStorage.getItem("Upgradeclick") || "0")), props.upgradeMap);
    
//     // Load autoClicker and refClicker levels from localStorage
//     ["autoClicker01", "autoClicker02", "autoClicker03", "autoClicker04", "autoClicker05", "autoClicker06", "autoClicker07","refClicker01", "refClicker02", "refClicker03", "refClicker04", "refClicker05"].forEach((id) => {
//       loadUpgrade(id, parseInt(JSON.parse(localStorage.getItem(id) || "0")), props.upgradeMap);
//     });

//     loadUpgradeEnergy("energyPool", parseInt(JSON.parse(localStorage.getItem("pool") || "0")), props.upgradeEnergyMap);
//     loadUpgradeEnergy("energyfill", parseInt(JSON.parse(localStorage.getItem("refill") || "0")), props.upgradeEnergyMap);
//   }

//   useEffect(() => {
//     handleLoad();
//   }, []);

//   const counter = useRef({ value: 0 });
//   counter.current.value += 1;
//   if (counter.current.value >= 10) {
//     handleSave();
//     counter.current.value = 0;
//   }

//   function wipeSave() {
//     // Reset balance and upgrades
//     props.balanceRef.current.value = 0;
//     ["clickUpgrade", "autoClicker01", "autoClicker02", "autoClicker03", "autoClicker04", "autoClicker05", "autoClicker06", "autoClicker07", "refClicker01", "refClicker02", "refClicker03", "refClicker04", "refClicker05"].forEach((id) => {
//       loadUpgrade(id, 0, props.upgradeMap);
//     });
//     loadUpgradeEnergy("energyPool", 0, props.upgradeEnergyMap);
//     loadUpgradeEnergy("energyfill", 0, props.upgradeEnergyMap);

//     // Clear localStorage
//     localStorage.clear();
//     console.log("Game wiped");
//     window.location.reload();
//     handleClose();
//   }

//   const [open, setOpen] = React.useState(false);
//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);

//   const handleCloseSnackbar = (
//     event: React.SyntheticEvent | Event,
//     reason?: string
//   ) => {
//     if (reason === "clickaway") {
//       return;
//     }
//     setOpenSnackbar(false);
//   };

//   return (
//     <>
//       <Button
//         className="savehide"
//         onClick={handleSave}
//         style={{ margin: "10px 10px 30px 10px" }}
//         variant="contained"
//       >
//         Save
//       </Button>{" "}
//       <br />
//       <Button
//         className="savehide"
//         onClick={handleOpen}
//         size="small"
//         style={{ margin: "10px" }}
//         variant="contained"
//         color="error"
//       >
//         Wipe save
//       </Button>
//       <Modal
//         open={open}
//         onClose={handleClose}
//         aria-labelledby="modal-modal-title"
//         aria-describedby="modal-modal-description"
//       >
//         <Box sx={style}>
//           <Typography id="modal-modal-title" variant="h6" component="h2">
//             WARNING
//           </Typography>
//           <Typography id="modal-modal-description" sx={{ mt: 2 }}>
//             Do you REALLY want to wipe your save?
//           </Typography>
//           <Typography variant="caption">
//             You will lose your progress, there is no going back!
//           </Typography>
//           <Button onClick={wipeSave}>Yes</Button>
//           <Button onClick={handleClose}>No</Button>
//         </Box>
//       </Modal>
//       <Snackbar
//         open={openSnackbar}
//         autoHideDuration={2000}
//         onClose={handleCloseSnackbar}
//         message="Game saved"
//       />
//     </>
//   );
// }

// const loadUpgrade = (
//   id: string,
//   level: number,
//   upgradeMap: React.MutableRefObject<Map<string, UpgradeState>>
// ): void => {
//   upgradeMap.current.get(id)!.loadUpgrade(level);
// };

// const loadUpgradeEnergy = (
//   id: string,
//   level: number,
//   upgradeEnergyMap: React.MutableRefObject<Map<string, UpgradeEnergy>>
// ): void => {
//   upgradeEnergyMap.current.get(id)!.loadUpgrade(level);
// };
