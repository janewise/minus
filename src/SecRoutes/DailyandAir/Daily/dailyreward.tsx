import React, { useState, useEffect } from "react";
import "./Dailyreward.css";

interface DailyrewardProps {
  balanceRef: React.MutableRefObject<{ value: number }>;
  onRewardClaimed: () => void;
}

const dailyRewards = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];

const Dailyreward: React.FC<DailyrewardProps> = ({ balanceRef, onRewardClaimed }) => {
  const [currentDay, setCurrentDay] = useState<number>(1);
  const [claimableDay, setClaimableDay] = useState<number>(1);
  const [lastClaimTimestamp, setLastClaimTimestamp] = useState<number>(Date.now());
  const [hasClaimed, setHasClaimed] = useState<boolean>(false);
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const [claimedDays, setClaimedDays] = useState<boolean[]>(Array(10).fill(false));

  useEffect(() => {
    const storedDay = localStorage.getItem("currentDay");
    const storedClaimableDay = localStorage.getItem("claimableDay");
    const storedTimestamp = localStorage.getItem("lastClaimTimestamp");
    const storedHasClaimed = localStorage.getItem("hasClaimed");
    const storedClaimedDays = localStorage.getItem("claimedDays");

    if (storedDay && storedTimestamp && storedClaimableDay && storedHasClaimed && storedClaimedDays) {
      const day = parseInt(storedDay, 10);
      const claimable = parseInt(storedClaimableDay, 10);
      const timestamp = parseInt(storedTimestamp, 10);
      const hasClaimed = storedHasClaimed === "true";
      const claimed = JSON.parse(storedClaimedDays);

      const currentTime = Date.now();
      const timeDifference = currentTime - timestamp;

      console.log("Stored Day:", day);
      console.log("Stored Claimable Day:", claimable);
      console.log("Stored Timestamp:", timestamp);
      console.log("Current Time:", currentTime);
      console.log("Time Difference (minutes):", timeDifference / (60 * 1000));

      setCurrentDay(day);
      setClaimableDay(claimable);
      setLastClaimTimestamp(timestamp);
      setHasClaimed(hasClaimed);
      setClaimedDays(claimed);

      if (timeDifference > 60 * 1000 && timeDifference <= 120 * 1000 && hasClaimed) { // 1 minute to 2 minutes
        const nextClaimableDay = claimable === 10 ? 1 : claimable + 1;
        setClaimableDay(nextClaimableDay);
        setHasClaimed(false);
        console.log(`Time difference exceeded 1 minute. Next claimable day: ${nextClaimableDay}`);
      } else if (timeDifference > 120 * 1000) { // 2 minutes
        setCurrentDay(1);
        setClaimableDay(1);
        setHasClaimed(false);
        setClaimedDays(Array(10).fill(false));
        console.log("Time difference exceeded 2 minutes. Reset to day 1.");
      }
    }

    setInitialLoad(false);
  }, []);

  useEffect(() => {
    if (!initialLoad) {
      localStorage.setItem("currentDay", currentDay.toString());
      localStorage.setItem("claimableDay", claimableDay.toString());
      localStorage.setItem("lastClaimTimestamp", lastClaimTimestamp.toString());
      localStorage.setItem("hasClaimed", hasClaimed.toString());
      localStorage.setItem("claimedDays", JSON.stringify(claimedDays));
      console.log("Updated Current Day:", currentDay);
      console.log("Updated Claimable Day:", claimableDay);
      console.log("Updated Last Claim Timestamp:", lastClaimTimestamp);
      console.log("Updated Has Claimed:", hasClaimed);
    }
  }, [currentDay, claimableDay, lastClaimTimestamp, hasClaimed, claimedDays, initialLoad]);

  const handleClaimReward = (day: number) => {
    if (day !== claimableDay || hasClaimed || initialLoad) return;

    const reward = dailyRewards[day - 1];
    balanceRef.current.value += reward;
    onRewardClaimed();

    const nextDay = currentDay === 10 ? 1 : currentDay + 1;
    const nextClaimableDay = nextDay;

    setCurrentDay(nextDay);
    setClaimableDay(nextClaimableDay);
    setLastClaimTimestamp(Date.now());
    setHasClaimed(true);

    const updatedClaimedDays = [...claimedDays];
    updatedClaimedDays[day - 1] = true;

    if (day === 10) {
      setClaimedDays(Array(10).fill(false));
      setCurrentDay(1);
      setClaimableDay(1);
      console.log("Completed day 10, resetting to day 1.");
    } else {
      setClaimedDays(updatedClaimedDays);
    }

    console.log(`Reward for Day ${day} claimed: ${reward} coins`);
    console.log("Next Current Day:", nextDay);
    console.log("Next Claimable Day:", nextClaimableDay);
  };

  return (
    <div className="D3-box">
      <h2>Daily Reward</h2>
      <div className="daily-reward-container row">
        <div className="col-4">
        <div 
          className={`card ${claimedDays[0] ? "claimed" : claimableDay === 1 && !hasClaimed && !initialLoad ? "active" : ""}`}
          onClick={() => handleClaimReward(1)}
        >
          <h4>Day-1</h4>
          <p>100 Coins</p>
        </div>
        </div>
        <div className="col-4">
        <div
          className={`card ${claimedDays[2] ? "claimed" : claimableDay === 3 && !hasClaimed && !initialLoad ? "active" : ""}`}
          onClick={() => handleClaimReward(3)}
        >
          <h4>Day-2</h4>
          <p>300 Coins</p>
        </div>  </div>
        <div className="col-4">   <div
        className={`card ${claimedDays[3] ? "claimed" : claimableDay === 4 && !hasClaimed && !initialLoad ? "active" : ""}`}
          onClick={() => handleClaimReward(4)}
        >
          <h4>Day-3</h4>
          <p>400 Coins</p>
        </div> </div>
        <div className="col-4">  <div
          className={`card ${claimedDays[4] ? "claimed" : claimableDay === 5 && !hasClaimed && !initialLoad ? "active" : ""}`}
          onClick={() => handleClaimReward(5)}
        >
          <h4>Day-4</h4>
          <p>500 Coins</p>
        </div></div>
        <div className="col-4"><div
          className={`card ${claimedDays[5] ? "claimed" : claimableDay === 6 && !hasClaimed && !initialLoad ? "active" : ""}`}
          onClick={() => handleClaimReward(6)}
        >
          <h4>Day-5</h4>
          <p>600 Coins</p>
        </div>  </div>
        <div className="col-4"><div
          className={`card ${claimedDays[6] ? "claimed" : claimableDay === 7 && !hasClaimed && !initialLoad ? "active" : ""}`}
          onClick={() => handleClaimReward(7)}
        >
          <h4>Day-6</h4>
          <p>700 Coins</p>
        </div> </div>
        <div className="col-4"><div
          className={`card ${claimedDays[7] ? "claimed" : claimableDay === 8 && !hasClaimed && !initialLoad ? "active" : ""}`}
          onClick={() => handleClaimReward(8)}
        >
          <h4>Day-7</h4>
          <p>800 Coins</p>
        </div></div>
        <div className="col-4"><div
          className={`card ${claimedDays[8] ? "claimed" : claimableDay === 9 && !hasClaimed && !initialLoad ? "active" : ""}`}
          onClick={() => handleClaimReward(9)}
        >
          <h4>Day-8</h4>
          <p>900 Coins</p>
        </div></div>
        <div className="col-4"><div
          className={`card ${claimedDays[9] ? "claimed" : claimableDay === 10 && !hasClaimed && !initialLoad ? "active" : ""}`}
          onClick={() => handleClaimReward(10)}
        >
          <h4>Day-9</h4>
          <p>1000 Coins</p>
        </div></div>
        <div className="col-12"><div
          className={`card ${claimedDays[1] ? "claimed" : claimableDay === 2 && !hasClaimed && !initialLoad ? "active" : ""}`}
          onClick={() => handleClaimReward(2)}
        >
          <h4>Random Bonus</h4>
          <p>200 Coins</p>
        </div>
      </div>
      {/*  */}
      </div>
    </div>
  );
};

export default Dailyreward;
