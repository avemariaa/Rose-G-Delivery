import React, { useState, useEffect } from "react";
import "../style/UserProfile.css";
import { Container, Row, Col } from "reactstrap";

import PersonalInfoImg from "../assets/images/personal-info.svg";
import DefaultAvatar from "../assets/images/user.png";
import EditProfileDetails from "../components/UserProfile/EditProfileDetails";
import ActivityHistory from "../components/UserProfile/ActivityHistory";
import ChangePassword from "../components/UserProfile/ChangePassword";
import TitlePageBanner from "../components/UI/TitlePageBanner";

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
    if (showSection === section) {
      setShowSection("");
    } else {
      setShowSection(section);
    }
  };

  const [newProfileImage, setNewProfileImage] = useState("");
  const [fileName, setFileName] = useState("");
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newContactNumber, setNewContactNumber] = useState("");
  const [newAddress, setNewAddress] = useState("");

  const handleSave = (newUserData) => {
    // update the user data using new UserData
    setUserData(newUserData);
    setShowSection("");
    getUserData();
  };

  const handleChangePassSave = () => {
    setShowSection("");
  };

  return (
    <section>
      <Container className="mb-5">
        <TitlePageBanner title="My Account" />
        <Row>
          {/* Left Column */}
          <Col lg="6" md="6" className="userProfile__left-container">
            <div className="userProfile__details">
              <h5>User Profile</h5>
              <Row>
                {/* Profile Avatar */}
                <Col lg="12">
                  <div className="userProfile__avatar">
                    {userData?.profileImageUrl ? (
                      <img src={userData.profileImageUrl} alt="User Avatar" />
                    ) : (
                      <img src={DefaultAvatar} alt="Default Avatar" />
                    )}
                  </div>
                </Col>
                {/* User Details */}
                <Col lg="12">
                  <div className="userProfile__group">
                    {/* Full Name */}
                    <div className="userProfile__item">
                      <label>Full Name:&nbsp;</label>
                      <span>{`${userData?.firstName} ${userData?.lastName}`}</span>
                    </div>

                    {/* Email */}
                    <div className="userProfile__item">
                      <label>Email:&nbsp;</label>
                      <span>{userData?.email}</span>
                    </div>

                    {/* Contact Number */}
                    <div className="userProfile__item">
                      <label>Contact Number:&nbsp;</label>
                      <span>{userData?.contactNumber}</span>
                    </div>

                    {/* Address */}
                    <div className="userProfile__item">
                      <label>Address:&nbsp;</label>
                      <span>{userData?.address}</span>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
            {/* Profile Page Buttons */}
            <div className="userProfile__btns">
              <button onClick={() => handleSectionClick("editProfile")}>
                Edit Profile
              </button>
              <button onClick={() => handleSectionClick("activityHistory")}>
                Order History
              </button>

              <button onClick={() => handleSectionClick("changePassword")}>
                Change Password
              </button>
            </div>
          </Col>

          {/* Right Column */}
          <Col lg="6" md="6" className="userProfile__right-container">
            {/* Welcome Section */}
            {showSection === "" && (
              <div className="empty__section">
                <img src={PersonalInfoImg} alt="Personal Info Image" />
                <h6>
                  Welcome to your account page! Click one of the buttons to get
                  started.
                </h6>
              </div>
            )}

            {/* Edit Profile */}
            {showSection === "editProfile" && (
              <EditProfileDetails
                userData={userData}
                onSave={handleSave}
                newProfileImage={newProfileImage}
                setNewProfileImage={setNewProfileImage}
                fileName={fileName}
                setFileName={setFileName}
                newFirstName={newFirstName}
                setNewFirstName={setNewFirstName}
                newLastName={newLastName}
                setNewLastName={setNewLastName}
                newEmail={newEmail}
                setNewEmail={setNewEmail}
                newContactNumber={newContactNumber}
                setNewContactNumber={setNewContactNumber}
                newAddress={newAddress}
                setNewAddress={setNewAddress}
              />
            )}

            {/* Activity History / Order History */}
            {showSection === "activityHistory" && (
              <ActivityHistory onSave={handleSave} />
            )}

            {/* Change Password */}
            {showSection === "changePassword" && (
              <ChangePassword onSave={handleChangePassSave} />
            )}
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default UserProfile;
