
import React, { useRef, useEffect, useReducer, useState } from "react";
//for ts
import UpgradeState from "../classes/upgradeState";
import UpgradeEnergy from "../classes/upgradeEnergy";
//
import UpgradeButton from "../components/Cards/upgradeButton";
import { ShareBal } from "../components/ShareBalance/sharebalance";
import { SaveGame } from "../components/saveGame";
//firebase
import { sendUserDataToFirebase,updateUserAutoIncrementInFirebase} from '../firebaseFunctions';
import { ref, onValue } from "firebase/database";
import { db } from '../firebase';

export function Freemine() {
  const balanceRef = useRef({ value: 0 });
  const forceUpdate = useReducer(x => x + 1, 0)[1];

  const [energy, setEnergy] = useState(10000);
  const [maxEnergy, setMaxEnergy] = useState(10000);
  const [refillRate, setRefillRate] = useState(1);
  const [lastUpdated, setLastUpdated] = useState(Date.now());
   //user
  const [userId, setUserId] = useState<string | null>(null);
//  exchange
const [totalExchange, setTotalExchange] = useState<number>(0); // State for total exchange amount

  const [isInitialLoad, setIsInitialLoad] = useState(true); // Flag to check if initial load is done

  // Load state from localStorage on mount For energy and autoincrement on window close
  useEffect(() => {
    const storedEnergy = localStorage.getItem('energy');
    const storedMaxEnergy = localStorage.getItem('maxEnergy');
    const storedRefillRate = localStorage.getItem('refillRate');
    const storedLastUpdated = localStorage.getItem('lastUpdated');
//down is for autoincrement
 const storedBalance = localStorage.getItem('balance');
 const storedAutoIncrement = localStorage.getItem('autoIncrement');

    if (storedEnergy && storedMaxEnergy && storedRefillRate && storedLastUpdated && storedBalance && storedAutoIncrement) {
      const timePassed = (Date.now() - parseInt(storedLastUpdated, 10)) / 1000; // time in seconds
      console.log("timePassed (seconds):", timePassed);

      const storedRefillRateNum = parseInt(storedRefillRate, 10);
      const calculatedEnergy = Math.min(parseInt(storedEnergy, 10) + Math.floor(timePassed * storedRefillRateNum), parseInt(storedMaxEnergy, 10));
      
      console.log("calculatedEnergy:", calculatedEnergy);

      setEnergy(calculatedEnergy);
      setMaxEnergy(parseInt(storedMaxEnergy, 10));
      setRefillRate(storedRefillRateNum);
      setLastUpdated(Date.now());

//dowm is for autoincrement time on offline
    const storedAutoIncrementNum = parseFloat(storedAutoIncrement);
     const calculatedBalance = parseFloat(storedBalance) + Math.min(storedAutoIncrementNum * timePassed, storedAutoIncrementNum * 7200);
     balanceRef.current.value = Math.round(calculatedBalance * 100) / 100;
    }
    setIsInitialLoad(false); // Set initial load flag to false after loading from localStorage
  }, []);

  // Save state to localStorage only after the initial load is complete
  useEffect(() => {
    if (!isInitialLoad) {
      localStorage.setItem('energy', energy.toString());
      localStorage.setItem('maxEnergy', maxEnergy.toString());
      localStorage.setItem('refillRate', refillRate.toString());
      localStorage.setItem('lastUpdated', lastUpdated.toString());
 //down is auto increment
      localStorage.setItem('balance', balanceRef.current.value.toString());
      localStorage.setItem('autoIncrement', autoIncrement.toString());

    }
  }, [energy, maxEnergy, refillRate, lastUpdated, isInitialLoad]);
  
  //
  useEffect(() => {
    // Initialize the Telegram Web App SDK
    const initTelegram = () => {
      const tg = window.Telegram.WebApp;
      tg.ready();
      // Debug logging
      console.log('Telegram Web App SDK initialized');
      console.log('tg.initDataUnsafe:', tg.initDataUnsafe);

      const user = tg.initDataUnsafe?.user;

      if (user) {
        const id = user.id.toString();
        setUserId(user.id.toString());
        sendUserDataToFirebase(id, autoIncrement);
      }
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

//up is user

//D4
useEffect(() => {
  if (userId) {
    const exchangeRef = ref(db, `users/${userId}/exchanges/amount`);

    const unsubscribe = onValue(exchangeRef, (snapshot) => {
      const amount = snapshot.val();
      setTotalExchange(amount || 0);
      alert(`Exchange amount updated: ${amount}`);
    });

    // Cleanup the subscription on unmount
    return () => unsubscribe();
  }
}, [userId]);

//routuerchange
const upgradeMap = useRef(
  new Map<string, UpgradeState>([
    ["clickUpgrade", new UpgradeState(15, 2, 1, 2)],
    ["autoClicker01", new UpgradeState(80, 2, 0, 0.1)],
    ["autoClicker02", new UpgradeState(200, 2, 0, 0.5)],
    ["autoClicker03", new UpgradeState(1000, 2, 0, 0.8)],
    ["autoClicker04", new UpgradeState(5000, 2, 0, 1)],
    ["autoClicker05", new UpgradeState(5000, 2, 0, 1)],
    ["autoClicker06", new UpgradeState(5000, 2, 0, 1)],
    ["autoClicker07", new UpgradeState(10000, 2, 0, 1.5)],
    //ref card
    ["refClicker01", new UpgradeState(500, 2, 0, 1)],
    ["refClicker02", new UpgradeState(1500, 2, 0, 1.5)],
    ["refClicker03", new UpgradeState(1500, 2, 0, 1.5)],
    ["refClicker04", new UpgradeState(4000, 2, 0, 2)],
    ["refClicker05", new UpgradeState(4000, 2, 0, 2)],
      //ref card
      ["adsClicker01", new UpgradeState(500, 2, 0, 1)],
      ["adsClicker02", new UpgradeState(1500, 2, 0, 1.5)],
      ["adsClicker03", new UpgradeState(50, 2, 0, 0.1)],
      ["adsClicker04", new UpgradeState(150, 2, 0, 0.1)],
  ])
);

const upgradeEnergyMap = useRef(new Map<string, UpgradeEnergy>([
  ['energyPool', new UpgradeEnergy(40, 1.4, 50,0)],
  ['energyfill', new UpgradeEnergy(70, 2,0, 1)],
   // Add other entries as needed
]));

let autoIncrement: number =
    Math.round(
      (upgradeMap.current.get("autoClicker01")!.increment +
        upgradeMap.current.get("autoClicker02")!.increment +
        upgradeMap.current.get("autoClicker03")!.increment +
        upgradeMap.current.get("autoClicker04")!.increment +
        upgradeMap.current.get("autoClicker05")!.increment +
        upgradeMap.current.get("autoClicker06")!.increment +
        upgradeMap.current.get("autoClicker07")!.increment +
        //ref card
        upgradeMap.current.get("refClicker01")!.increment +
        upgradeMap.current.get("refClicker02")!.increment +
        upgradeMap.current.get("refClicker03")!.increment +
        upgradeMap.current.get("refClicker04")!.increment +
        upgradeMap.current.get("refClicker05")!.increment +
        //ads
        upgradeMap.current.get("adsClicker01")!.increment +
        upgradeMap.current.get("adsClicker02")!.increment +
        upgradeMap.current.get("adsClicker03")!.increment +
        upgradeMap.current.get("adsClicker04")!.increment) * 
        100
    ) / 100 - (totalExchange/3600);

    //downdatabase
    // useEffect(() => {
    //   if (userId !== null) {
    //     updateUserAutoIncrementInFirebase(userId, autoIncrement);
    //   }
    // }, [autoIncrement]);
//updatabse

  useEffect(() => {
    const interval = setInterval(() => {
      balanceRef.current.value = Math.round((balanceRef.current.value + (autoIncrement / 10)) * 100) / 100;
      forceUpdate();
    }, 100);

    return () => clearInterval(interval);
  });

  useEffect(() => {
    const refillInterval = setInterval(() => {
      setEnergy((prevEnergy) => {
        const newEnergy = Math.min(prevEnergy + refillRate, maxEnergy);
        setLastUpdated(Date.now());
        return newEnergy;
      });
    }, 1000);

    return () => clearInterval(refillInterval);
  }, [refillRate, maxEnergy]);

  const upgradeInvocationHandler = (
    id: string,
    upgradeMap: React.MutableRefObject<Map<string, UpgradeState>>,
    upgradeEnergyMap: React.MutableRefObject<Map<string, UpgradeEnergy>>,
    balanceRef: React.MutableRefObject<{ value: number }>,
    setMaxEnergy: React.Dispatch<React.SetStateAction<number>>,
    setRefillRate: React.Dispatch<React.SetStateAction<number>>,
  ): void => {
    if (upgradeMap.current.has(id)) {
      const cost = upgradeMap.current.get(id)!.currentCost;
      if (upgradeMap.current.get(id)!.upgrade(balanceRef.current.value)) {
        console.log(`Upgraded ${id} component.`);
        balanceRef.current.value = Math.round((balanceRef.current.value - cost) * 100) / 100;
      } else {
        console.log(`Balance is too low to upgrade ${id} component.`);
      }
    }
  }

  const handleRewardClaimed = () => {
    forceUpdate(); // Force an update to reflect the new balance
  };

  return (
    <>
                <SaveGame
  balanceRef={balanceRef}
  upgradeMap={upgradeMap}
  // upgradeEnergyMap={upgradeEnergyMap}
  userId={userId} 
 />
              <ShareBal
            balanceRef={balanceRef}
            clickIncrement={upgradeMap.current.get("clickUpgrade")!.increment}
            autoIncrement={autoIncrement}
            refillRate={refillRate}
          />

              <div className="row center">
              <div className="col-6">
                  <UpgradeButton
                    id="autoClicker01"
                    name="Slime"
                    level={upgradeMap.current.get("autoClicker01")!.level}
                    cost={upgradeMap.current.get("autoClicker01")!.currentCost}
                    increment={
                      upgradeMap.current.get("autoClicker01")!.incrementAdd
                    }
                    balance={balanceRef.current.value}
                    autoIncrementTotal={autoIncrement}
                    clickHandler={(id) => {
                      upgradeInvocationHandler(
                        id,
                        upgradeMap,
                        upgradeEnergyMap,
                        balanceRef,
                        setMaxEnergy,
                        setRefillRate
                      );
                    }}
                  />
                  <UpgradeButton
                    id="autoClicker03"
                    name="Warrior"
                    level={upgradeMap.current.get("autoClicker03")!.level}
                    cost={upgradeMap.current.get("autoClicker03")!.currentCost}
                    increment={
                      upgradeMap.current.get("autoClicker03")!.incrementAdd
                    }
                    balance={balanceRef.current.value}
                    autoIncrementTotal={autoIncrement}
                    clickHandler={(id) => {
                      upgradeInvocationHandler(
                        id,
                        upgradeMap,
                        upgradeEnergyMap,
                        balanceRef,
                        setMaxEnergy,
                        setRefillRate
                      );
                    }}
                  />
                  <UpgradeButton
                    id="autoClicker05"
                    name="ELF"
                    level={upgradeMap.current.get("autoClicker05")!.level}
                    cost={upgradeMap.current.get("autoClicker05")!.currentCost}
                    increment={
                      upgradeMap.current.get("autoClicker05")!.incrementAdd
                    }
                    balance={balanceRef.current.value}
                    autoIncrementTotal={autoIncrement}
                    clickHandler={(id) => {
                      upgradeInvocationHandler(
                        id,
                        upgradeMap,
                        upgradeEnergyMap,
                        balanceRef,
                        setMaxEnergy,
                        setRefillRate
                      );
                    }}
                  />
                  <UpgradeButton
                    id="autoClicker07"
                    name="Wizard"
                    level={upgradeMap.current.get("autoClicker07")!.level}
                    cost={upgradeMap.current.get("autoClicker07")!.currentCost}
                    increment={
                      upgradeMap.current.get("autoClicker07")!.incrementAdd
                    }
                    balance={balanceRef.current.value}
                    autoIncrementTotal={autoIncrement}
                    clickHandler={(id) => {
                      upgradeInvocationHandler(
                        id,
                        upgradeMap,
                        upgradeEnergyMap,
                        balanceRef,
                        setMaxEnergy,
                        setRefillRate
                      );
                    }}
                  />
                </div>
                <div className=" col-6">
                  <UpgradeButton
                    id="autoClicker02"
                    name="Goblin"
                    level={upgradeMap.current.get("autoClicker02")!.level}
                    cost={upgradeMap.current.get("autoClicker02")!.currentCost}
                    increment={
                      upgradeMap.current.get("autoClicker02")!.incrementAdd
                    }
                    balance={balanceRef.current.value}
                    autoIncrementTotal={autoIncrement}
                    clickHandler={(id) => {
                      upgradeInvocationHandler(
                        id,
                        upgradeMap,
                        upgradeEnergyMap,
                        balanceRef,
                        setMaxEnergy,
                        setRefillRate
                      );
                    }}
                  />
                  <UpgradeButton
                    id="autoClicker04"
                    name="Knight"
                    level={upgradeMap.current.get("autoClicker04")!.level}
                    cost={upgradeMap.current.get("autoClicker04")!.currentCost}
                    increment={
                      upgradeMap.current.get("autoClicker04")!.incrementAdd
                    }
                    balance={balanceRef.current.value}
                    autoIncrementTotal={autoIncrement}
                    clickHandler={(id) => {
                      upgradeInvocationHandler(
                        id,
                        upgradeMap,
                        upgradeEnergyMap,
                        balanceRef,
                        setMaxEnergy,
                        setRefillRate
                      );
                    }}
                  />
                  <UpgradeButton
                    id="autoClicker06"
                    name="Dwarf"
                    level={upgradeMap.current.get("autoClicker06")!.level}
                    cost={upgradeMap.current.get("autoClicker06")!.currentCost}
                    increment={
                      upgradeMap.current.get("autoClicker06")!.incrementAdd
                    }
                    balance={balanceRef.current.value}
                    autoIncrementTotal={autoIncrement}
                    clickHandler={(id) => {
                      upgradeInvocationHandler(
                        id,
                        upgradeMap,
                        upgradeEnergyMap,
                        balanceRef,
                        setMaxEnergy,
                        setRefillRate
                      );
                    }}
                  />
                </div>
              </div>

          {/*down are overlay and container  */}
    </>
  )
}


// <div className="col-6">
                  
//                   <AdsCard
//                     id="adsClicker01"
//                     ads="https://www.google.com/"
//                     password={getCurrentPassword(["first1", "second2", "third3"])} 
//                     name="Ads"
//                     level={upgradeMap.current.get("adsClicker01")!.level}
//                     cost={upgradeMap.current.get("adsClicker01")!.currentCost}
//                     increment={
//                       upgradeMap.current.get("adsClicker01")!.incrementAdd
//                     }
//                     balance={balanceRef.current.value}
//                     autoIncrementTotal={autoIncrement}
//                     clickHandler={(id) => {
//                       upgradeInvocationHandler(
//                         id,
//                         upgradeMap,
//                         upgradeEnergyMap,
//                         balanceRef,
//                         setMaxEnergy,
//                         setRefillRate
//                       );
//                     }}
//                   />
//                    <AdsCard
//                     id="adsClicker03"
//                     ads="https://www.google.com/"
//                     password={getCurrentPassword([ '12er34AM', '12er34PM','56qw78AM', '56qw78PM',  '90ty12AM', '90ty12PM','34ui56AM', '34ui56PM','78op90AM', '78op90PM','ab12cdAM', 'ab12cdPM', 'ef12ghAM', 'ef12ghPM'])} 
//                     name="Ads3"
//                     level={upgradeMap.current.get("adsClicker03")!.level}
//                     cost={upgradeMap.current.get("adsClicker03")!.currentCost}
//                     increment={
//                       upgradeMap.current.get("adsClicker03")!.incrementAdd
//                     }
//                     balance={balanceRef.current.value}
//                     autoIncrementTotal={autoIncrement}
//                     clickHandler={(id) => {
//                       upgradeInvocationHandler(
//                         id,
//                         upgradeMap,
//                         upgradeEnergyMap,
//                         balanceRef,
//                         setMaxEnergy,
//                         setRefillRate
//                       );
//                     }}
//                   />
//                 </div>
//                 <div className=" col-6">
//                 <AdsCard
//                     id="adsClicker02"
//                     ads="https://www.google.com/"
//                     password={getCurrentPassword([
//                       '12qw34AM', '12qw34PM', // Day 1 (Sunday)
//                       '56er78AM', '56er78PM', // Day 2 (Monday)
//                       '90ty12AM', '90ty12PM', // Day 3 (Tuesday)
//                       '34ui56AM', '34ui56PM', // Day 4 (Wednesday)
//                       '78op90AM', '78op90PM', // Day 5 (Thursday)
//                       'ab12cdAM', 'ab12cdPM', // Day 6 (Friday)
//                       'ef34ghAM', 'ef34ghPM'  // Day 7 (Saturday)
//                     ])}
//                     name="Ads22"
//                     level={upgradeMap.current.get("adsClicker02")!.level}
//                     cost={upgradeMap.current.get("adsClicker02")!.currentCost}
//                     increment={
//                       upgradeMap.current.get("adsClicker02")!.incrementAdd
//                     }
//                     balance={balanceRef.current.value}
//                     autoIncrementTotal={autoIncrement}
//                     clickHandler={(id) => {
//                       upgradeInvocationHandler(
//                         id,
//                         upgradeMap,
//                         upgradeEnergyMap,
//                         balanceRef,
//                         setMaxEnergy,
//                         setRefillRate
//                       );
//                     }}
//                   />
//                    <AdsCard
//                     id="adsClicker04"
//                     ads="https://www.google.com/"
//                     password={getCurrentPassword(["4first1", "4second2", "4third3"])} 
//                     name="Ads4"
//                     level={upgradeMap.current.get("adsClicker04")!.level}
//                     cost={upgradeMap.current.get("adsClicker04")!.currentCost}
//                     increment={
//                       upgradeMap.current.get("adsClicker04")!.incrementAdd
//                     }
//                     balance={balanceRef.current.value}
//                     autoIncrementTotal={autoIncrement}
//                     clickHandler={(id) => {
//                       upgradeInvocationHandler(
//                         id,
//                         upgradeMap,
//                         upgradeEnergyMap,
//                         balanceRef,
//                         setMaxEnergy,
//                         setRefillRate
//                       );
//                     }}
//                   />
                 
//                 </div>