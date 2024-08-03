// import { db } from "./firebase";
// import { ref, set, update, get, child , push } from "firebase/database";

// // Function to send user data to Firebase
// export const sendUserDataToFirebase = (
//   userId: string,
//   autoIncrement: number
// ) => {
//   if (!userId) return;

//   set(ref(db, "users/" + userId), {
//     autoIncrement: autoIncrement,
//     timestamp: new Date().toISOString(),
//   });
// };

// // Function to update user's autoIncrement value in Firebase
// export const updateUserAutoIncrementInFirebase = (
//   userId: string,
//   autoIncrement: number
// ) => {
//   if (!userId) return;

//   update(ref(db, "users/" + userId), {
//     autoIncrement: autoIncrement,
//   });
// };

// export const storeReferral = async (userId: string, referredBy: string): Promise<void> => {
//   const referralsRef = ref(db, `referrals/${referredBy}`);
//   const newReferralRef = push(referralsRef);
//   await set(newReferralRef, { userId, timestamp: Date.now() });
// };

// export const getReferredUsersCount = async (userId: string): Promise<number> => {
//   const referralsRef = ref(db, `referrals/${userId}`);
//   const snapshot = await get(referralsRef);

//   if (snapshot.exists()) {
//     const referralsData = snapshot.val();
//     return Object.keys(referralsData).length;
//   } else {
//     return 0;
//   }
// };

import { db } from "./firebase";
import { ref, set, update, get, DataSnapshot } from "firebase/database";

export const sendUserDataToFirebase = (
  userId: string,
  autoIncrement: number,
  initialInviteCount: number = 0
) => {
  if (!userId) return;

  const userRef = ref(db, "users/" + userId);
  get(userRef)
    .then((snapshot) => {
      if (!snapshot.exists()) {
        set(userRef, {
          autoIncrement: autoIncrement,
          timestamp: new Date().toISOString(),
          inviteCount: initialInviteCount, // Set initialInviteCount only if data doesn't exist
        });
      } else {
        console.log(
          `User data already exists for ${userId}. Skipping initialization.`
        );
      }
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
    });
};

export const updateUserAutoIncrementInFirebase = (
  userId: string,
  autoIncrement: number
) => {
  if (!userId) return;

  update(ref(db, "users/" + userId), {
    autoIncrement: autoIncrement,
  });
};

export const updateUserInviteCountInFirebase = async (
  userId: string,
  inviteCount: number
) => {
  if (!userId) return;

  await update(ref(db, "users/" + userId), {
    inviteCount: inviteCount,
  });
};

export const initializeUserData = async (userId: string) => {
  const userRef = ref(db, "users/" + userId);
  const snapshot = await get(userRef);
  if (!snapshot.exists()) {
    await set(userRef, {
      autoIncrement: 0,
      inviteCount: 0, // Initialize inviteCount to 0 when initializing user data
      timestamp: new Date().toISOString(),
    });
  }
};

export const handleNewUserWithReferral = async (
  newUserId: string,
  referrerId: string
) => {
  // Initialize new user data
  await initializeUserData(newUserId);

  // Increment referrer's invite count
  const referrerRef = ref(db, "users/" + referrerId);
  const snapshot = await get(referrerRef);
  if (snapshot.exists()) {
    const currentInviteCount = snapshot.val().inviteCount || 0;
    //alert(`Fb Current invite count for referrer ${referrerId}: ${currentInviteCount}`); // Log current invite count
    await updateUserInviteCountInFirebase(referrerId, currentInviteCount + 1);
  } else {
    // alert(`Fb No data found for referrer ${referrerId}`);
  }
};

export const getUserInviteCount = async (userId: string) => {
  const userRef = ref(db, "users/" + userId);
  const snapshot = await get(userRef);

  if (snapshot.exists()) {
    const data = snapshot.val();
    //alert(`Fb Data fetched for user ${userId}: ${JSON.stringify(data)}`);  // Log the entire data
    return data.inviteCount || 0;
  } else {
    //alert(`Fb No data found for user ${userId}`);
  }
  // return 0;
};

//second for airtask
export const saveUserDataToFirebase = (userId: string, data: any) => {
  if (!userId) return;

  const userRef = ref(db, 'users/' + userId);

  const structuredData = {
    // autoIncrement: data.autoIncrement || 0,
    // inviteCount: data.inviteCount || 0,
    upgrades: {
      clickUpgrade: data.upgrades?.clickUpgrade || 0,
      autoClicker01: data.upgrades?.autoClicker01 || 0,
      autoClicker02: data.upgrades?.autoClicker02 || 0,
      autoClicker03: data.upgrades?.autoClicker03 || 0,
      autoClicker04: data.upgrades?.autoClicker04 || 0,
      autoClicker05: data.upgrades?.autoClicker05 || 0,
      autoClicker06: data.upgrades?.autoClicker06 || 0,
      autoClicker07: data.upgrades?.autoClicker07 || 0,
      refClicker01: data.upgrades?.refClicker01 || 0,
      refClicker02: data.upgrades?.refClicker02 || 0,
    },
    lastUpdated: data.lastUpdated || new Date().getTime(),
  };

  update(userRef, structuredData).catch((error) => {
    console.error("Error saving user data:", error);
  });
};