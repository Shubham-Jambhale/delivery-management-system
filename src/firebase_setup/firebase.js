// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/database";
import { getDatabase, ref, update } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAV0ZP0EroSaHbOs6jtbSae5Ohj3hKt9C8",
  authDomain: "hoosiertrack-c719c.firebaseapp.com",
  projectId: "hoosiertrack-c719c",
  storageBucket: "hoosiertrack-c719c.appspot.com",
  messagingSenderId: "60324795017",
  appId: "1:60324795017:web:939d6aac6dc2e6a2706c58",
  measurementId: "G-ZMK7Z6J9EN",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const database = firebase.database();

const usersRef = database.ref("users");
const bookingRef = database.ref("Bookings");

function signUpUser(name, email, password, userType, q1, a1, q2, a2) {
  const newUserRef = usersRef.push(); // Create a new key with the username directly so no duplicates will be there.
  const newUser = {
    name: name,
    email: email,
    password: password,
    userType: userType,
    question1: q1,
    answer1: a1,
    question2: q2,
    answer2: a2
  };
  newUserRef
    .set(newUser)
    .then(() => {
      console.log("User added to Firebase!");
    })
    .catch((error) => {
      console.error("Error adding user to Firebase: ", error);
    });
}

function bookinginsert(
  username,
  packagesize,
  sourceaddress,
  destinationaddress,
  servicedetails,
  serviceprovider,
  driver,
  amount,
  status,
  id,
  payment_id
) {
  const newbookingRef = bookingRef.push(); // Create a new key with the username directly so no duplicates will be there.
  const bookingins = {
    username: username,
    packagesize: packagesize,
    sourceaddress: sourceaddress,
    destinationaddress: destinationaddress,
    servicedetails: servicedetails,
    serviceprovider: serviceprovider,
    driver: driver,
    amount: amount,
    status: status,
    id: id,
    payment_id: payment_id,
  };
  newbookingRef
    .set(bookingins)
    .then(() => {
      console.log("User added to Firebase!");
    })
    .catch((error) => {
      console.error("Error adding user to Firebase: ", error);
    });
}

export const get_user = async (username) => {
  let user_exist = false;
  const snapshot = await usersRef.once("value");
  if (snapshot.exists()) {
    snapshot.forEach((childsnap) => {
      const childData = childsnap.child("name").val();
      if (childData === username) {
        // alert("inside ifff");
        user_exist = true;
      }
    });
  }
  return user_exist;
};

export const get_email = async (email) => {
  let user_exist = false;
  const snapshot = await usersRef.once("value");
  if (snapshot.exists()) {
    snapshot.forEach((childsnap) => {
      const childData = childsnap.child("email").val();
      if (childData === email) {
        // alert("inside ifff");
        user_exist = true;
      }
    });
  }
  return user_exist;
};

export const get_question1 = async (email) => {
  let email_exist = null;
  const snapshot = await usersRef.once("value");
  if (snapshot.exists()) {
    snapshot.forEach((childsnap) => {
      const childData = childsnap.child("email").val();
      if (childData === email) {
        // alert("inside ifff");
        email_exist = childsnap.child("question1").val();;
      }
    });
  }
  return email_exist;
};

export const get_answer1 = async (email) => {
  let email_exist = null;
  const snapshot = await usersRef.once("value");
  if (snapshot.exists()) {
    snapshot.forEach((childsnap) => {
      const childData = childsnap.child("email").val();
      if (childData === email) {
        // alert("inside ifff");
        email_exist = childsnap.child("answer1").val();
      }
    });
  }
  return email_exist;
};

export const get_question2 = async (email) => {
  let email_exist = null;
  const snapshot = await usersRef.once("value");
  if (snapshot.exists()) {
    snapshot.forEach((childsnap) => {
      const childData = childsnap.child("email").val();
      if (childData === email) {
        // alert("inside ifff");
        email_exist = childsnap.child("question2").val();
      }
    });
  }
  return email_exist;
};

export const get_answer2 = async (email) => {
  let email_exist = null;
  const snapshot = await usersRef.once("value");
  if (snapshot.exists()) {
    snapshot.forEach((childsnap) => {
      const childData = childsnap.child("email").val();
      if (childData === email) {
        // alert("inside ifff");
        email_exist = childsnap.child("answer2").val();
      }
    });
  }
  return email_exist;
};

export const getNameFromEmail = async (email) => {
  let email_exist = null;
  const snapshot = await usersRef.once("value");
  if (snapshot.exists()) {
    snapshot.forEach((childsnap) => {
      const childData = childsnap.child("email").val();
      if (childData === email) {
        // alert("inside ifff");
        email_exist = childsnap.child("username").val();
      }
    });
  }
  return email_exist;
};

export const get_email_val = async (email) => {
  let email_exist = null;
  const snapshot = await usersRef.once("value");
  if (snapshot.exists()) {
    snapshot.forEach((childsnap) => {
      const childData = childsnap.child("name").val();
      if (childData === email) {
        // alert("inside ifff");
        email_exist = childsnap.child("email").val();
      }
    });
  }
  return email_exist;
};
// export const changePassword = async (email, pword) => {
//   let timeChange = null;
//   const snapshot = await usersRef.once("value");
//   if (snapshot.exists()) {
//     snapshot.forEach((childsnap) => {
//       const childData = childsnap.child("email").val();
//       if (childData === email) {
// 		//timeChange = childsnap.child("passwordChange").val();
// 		//let currentTime = Date().toLocaleString('en-GB', { timeZone: 'America/New_York' });
// 		database.ref("-users/"+childsnap.key).update({password: pword});
//       }
//     });
//   }
//   return timeChange;
// }
export const changePassword = async (email, pword) => {
  const usersRef = database.ref("users");
  usersRef.once("value").then((snapshot) => {
  snapshot.forEach((userSnapshot) => {
    const user = userSnapshot.val();
    if (user.email === email) {
      const userRef = userSnapshot.ref;
      userRef.update({
        password: pword
      });
      return;
    }
  });
});
}
  
function generateTrackingId() {
  const chars = "0123456789";
  let trackingId = "";
  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    trackingId += chars[randomIndex];
  }
  return trackingId;
}

function createTracking() {
  const trackingId = generateTrackingId();
  firebase.database().ref("trackingIds").push({
    id: trackingId,
    status: "pending",
    driver: "unassigned",
  });
  console.log("New tracking ID created:", trackingId);
}

function getTrackingIds() {
  return database
    .ref("trackingIds")
    .once("value")
    .then((snapshot) => snapshot.val());
}

const packageRef = database.ref("package");
function Package(id, origin, destination, Status, action) {
  const setpackage = packageRef.push(); // Create a new key with the username directly so no duplicates will be there.
  const packages = {
    trackingId: id,
    origin: origin,
    destination: destination,
    status: Status,
    action: action,
  };
  setpackage
    .set(packages)
    .then(() => {
      console.log("Package added to Firebase!");
    })
    .catch((error) => {
      console.error("Error adding package to Firebase: ", error);
    });
}
//Function to update details to delivery driver page

const bookingsRef = database.ref("Bookings");

export const get_driver = async (driver) => {
  const bookingsSnapshot = await bookingsRef.once("value");
  const usersSnapshot= await usersRef.once("value");
  const matchingRows = [];
  let countIndex = 0;
  if (usersSnapshot.exists()) {
    usersSnapshot.forEach((userChildSnapshot) => 
    {
      const userName = userChildSnapshot.child("name").val(); 
  if (bookingsSnapshot.exists()) {
   
    bookingsSnapshot.forEach((bookingChildSnapshot, index) => 
    {
      
      const driverName = bookingChildSnapshot.child("driver").val();
      
      if (driverName === userName) 
      {
        
        console.log(Object.keys(bookingsSnapshot.val())[countIndex])
        matchingRows.push({ ...bookingChildSnapshot.val(), uuid: Object.keys(bookingsSnapshot.val())[countIndex] });
        countIndex++;
      }
    });
  }
});
return matchingRows;
}
  
}


//function to update status field in Bookings table based on chnages made by driver in his UI
const updateBookingStatus = (id, newStatus, packages) => {
  //const bookingRef = database.ref(`Bookings/${id}/status`);
  //console.log(bookingRef);
  // bookingRef.set(newStatus)
  //   .then(() => console.log(`Booking ${id} status updated to ${newStatus}`))
  //   .catch((error) => console.error(`Error updating booking status: ${error}`));
  // const bookingRef = database.ref(`Bookings/${id}`);
  // console.log(bookingRef);
  // bookingRef.update(newStatus)
  //   .then((res) => {
  //     console.log(`Booking ${id} status updated to ${newStatus}`)
  //     console.log(res)
  //   })
  //   .catch((error) => console.error(`Error updating booking status: ${error}`));

  const db = getDatabase();
  const updates = {

  }
  console.log(packages)
  updates['/Bookings/' + packages.uuid] = {
    ...packages, status: newStatus
  }
  update(ref(db), updates).then(e => console.log(e))





  // const setBookings = bookingsRef.push(); 
  // const bookings = {
  //   id: id,
  //   status: newStatus
  // };
  // setBookings
  //   .set(bookings)
  //   .then(() => {
  //     console.log("Booking details added to Firebase!");
  //   })
  //   .catch((error) => {
  //     console.error("Error adding booking details to Firebase: ", error);
  //   });  
}







export { updateBookingStatus };
export { signUpUser };
export { createTracking };
export { getTrackingIds, Package, generateTrackingId };
export { bookinginsert };
export default firebase;
