import React, { useState, useEffect } from "react";
import "../style/UserProfile.css";
import { Container, Row, Col } from "reactstrap";

import EditProfileDetails from "../components/UserProfile/EditProfileDetails";
import ActivityHistory from "../components/UserProfile/ActivityHistory";
import ChangePassword from "../components/UserProfile/ChangePassword";

// Navigation
import { useNavigate } from "react-router-dom";
// Firebase
import { db, auth } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

// Redux
import { useDispatch } from "react-redux";
import { userLogInState, userLogOutState } from "../store/UserSlice/userSlice";

// Toast
import { showSuccessToast } from "../components/Toast/Toast";

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //------------------ Retrieve User Data ------------------//
  const [userLoggedUid, setUserLoggedUid] = useState(null);
  const [userData, setUserData] = useState(null);

  const getUserData = () => {
    const userDataRef = collection(db, "UserData"); // getting the UserData collection
    const queryData = query(userDataRef, where("uid", "==", userLoggedUid));

    getDocs(queryData).then((querySnapshot) => {
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          setUserData(doc.data());
        });
      } else {
        console.log("Empty user document");
      }
    });
  };
  useEffect(() => {
    getUserData();
  }, [userLoggedUid]);

  //------------------ Redux (when the page is refresh the data will persist) ------------------//
  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser && authUser.emailVerified === true) {
        // Logged In Action
        dispatch(
          userLogInState({
            email: authUser.email,
            lastSignIn: authUser.metadata.lastSignInTime,
            emailVerified: authUser.emailVerified.toString(),
          })
        );
        setUserLoggedUid(authUser.uid);
      } else {
        // Logged Out action
        dispatch(userLogOutState());
        setUserLoggedUid(null);
      }
    });
  }, []);

  //------------------ Control visibility of section ------------------//
  const [showSection, setShowSection] = useState("");

  const handleSectionClick = (section) => {
    setShowSection(section);
  };

  const handleSave = () => {
    setShowSection("");
  };

  return (
    <section>
      <Container>
        <Row>
          <Col lg="6" md="6" style={{ border: "1px solid red" }}>
            <div>
              <h5>User Profile</h5>
              <p>
                Full Name:&nbsp;
                {`${userData?.firstName} ${userData?.lastName}`}
              </p>
              <p>
                Email:&nbsp;
                {userData?.email}
              </p>
              <p>
                Contact Number:&nbsp;
                {userData?.contactNumber}
              </p>
              <p>
                Address:&nbsp;
                {userData?.address}
              </p>
            </div>
            <div className="userProfile_btns">
              <button onClick={() => handleSectionClick("editProfile")}>
                Edit Profile
              </button>
              <button onClick={() => handleSectionClick("activityHistory")}>
                Activity History
              </button>

              <button onClick={() => handleSectionClick("changePassword")}>
                Change Password
              </button>
            </div>
          </Col>

          <Col lg="6" md="6" style={{ border: "1px solid red" }}>
            {showSection === "editProfile" && (
              <EditProfileDetails userData={userData} onSave={handleSave} />
            )}
            {showSection === "activityHistory" && (
              <ActivityHistory onSave={handleSave} />
            )}

            {showSection === "changePassword" && (
              <ChangePassword onSave={handleSave} />
            )}
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default UserProfile;
