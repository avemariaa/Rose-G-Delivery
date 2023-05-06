import React, { useState } from "react";
import "../style/Registration.css";

// Icons or  Images
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

// Navigation
import { Link, useNavigate } from "react-router-dom";

// Firebase
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  onAuthStateChanged,
} from "firebase/auth";
import { addDoc, collection, setDoc, doc, updateDoc } from "firebase/firestore";

// Toast
import { showSuccessToast, showErrorToast } from "../components/Toast/Toast";

const Registration = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [fNameFocus, setFNameFocus] = useState(false);
  const [lNameFocus, setLNameFocus] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [cPasswordFocus, setCPasswordFocus] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

  const [customErrorMsg, setCustomErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState(null);

  /* -------------------- First Name Validation -------------------- */
  const [checkFirstName, setCheckFirstName] = useState(false);
  const handleFirstName = (text) => {
    setFirstName(text);
    let reg = /^[A-Za-z ]+$/; // valid alphabet with space
    if (reg.test(text)) {
      setCheckFirstName(false);
    } else {
      setCheckFirstName(true);
    }
  };

  /* -------------------- Last Name Validation -------------------- */
  const [checkLastName, setCheckLastName] = useState(false);
  const handleLastName = (text) => {
    setLastName(text);
    let reg = /^[A-Za-z ]+$/; // valid alphabet with space
    if (reg.test(text)) {
      setCheckLastName(false);
    } else {
      setCheckLastName(true);
    }
  };

  /* -------------------- Email Validation -------------------- */
  const [checkValidEmail, setCheckValidEmail] = useState(false);
  const handleCheckEmail = (text) => {
    let re = /\S+@\S+\.\S+/;
    let regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

    setEmail(text);
    if (re.test(text) || regex.test(text)) {
      setCheckValidEmail(false);
    } else {
      setCheckValidEmail(true);
    }
  };

  /* -------------------- Password Validation -------------------- */
  const [checkValidPassword, setCheckValidPassword] = useState(false);
  const handleCheckPassword = (text) => {
    let regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,}$/;

    setPassword(text);
    if (regex.test(text)) {
      setCheckValidPassword(false);
    } else {
      setCheckValidPassword(true);
    }
  };

  /* -------------------- Sign Up Button Fucntion -------------------- */
  const handleSignUp = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setCustomErrorMsg("Password doesn't match");
      return;
    }
    if (
      checkFirstName === true ||
      checkLastName === true ||
      checkValidEmail === true ||
      checkValidPassword === true
    ) {
      setCustomErrorMsg("Follow the required format");
      return;
    }

    try {
      createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          const user = userCredential.user;

          // Add user data to Firestore
          const userDocRef = doc(db, "UserData", user.uid);
          await setDoc(userDocRef, {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            role: "User",
            uid: user.uid,
          });

          // Send email verification
          await sendEmailVerification(auth.currentUser);
          showSuccessToast("Send an email verification", 1000);

          // Listen for changes in authentication state
          onAuthStateChanged(auth, async (user) => {
            if (user && user.emailVerified) {
              // Update user data in Firestore
              const userDocRef = doc(db, "UserData", user.uid);
              await updateDoc(userDocRef, {
                emailVerified: "Verified",
              });

              showSuccessToast("Email verified", 1000);
            }
          });

          signOut(auth);
          setFirstName("");
          setLastName("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          navigate("/login");
        })
        .catch((error) => {
          showErrorToast("Sign up firebase error", error.message);
          if (
            firstName.length === 0 &&
            lastName.length === 0 &&
            email.length === 0 &&
            password.length === 0 &&
            confirmPassword.length === 0
          ) {
            setCustomErrorMsg("Fill out the form");
          } else if (
            (firstName.length === 0 &&
              lastName.length === 0 &&
              email.length === 0) ||
            password.length === 0 ||
            confirmPassword.length === 0
          ) {
            setCustomErrorMsg("Fill out the form");
          } else if (
            error.message ===
            "Firebase: The email address is already in use by another account. (auth/email-already-in-use)."
          ) {
            setCustomErrorMsg("Email already exists");
          } else if (
            error.message ===
            "Firebase: The email address is badly formatted. (auth/invalid-email)."
          ) {
            setCustomErrorMsg("Invalid Email");
          } else if (
            error.message ===
            "Firebase: Password should be at least 6 characters (auth/weak-password)."
          ) {
            setCustomErrorMsg(`Password should be at least 8 characters, 1 numeric character, 1 lowercase letter, 1
              uppercase letter, 1 special character`);
          } else {
            setCustomErrorMsg(error.message);
          }
        });
    } catch (error) {
      showErrorToast("Sign up system error", error.message);
    }
  };

  return (
    <div className="registration__body">
      <div className="authForm__container">
        <h5 className="mb-3">Create An Account!</h5>
        {/*------------------ Registration Content ----------------- */}

        {/*------------------ Custom Error Msg for Firebase Error ----------------- */}
        {customErrorMsg !== "" && (
          <label className="customErrorMsg">{customErrorMsg}</label>
        )}

        <form className="registration__form">
          {/*------------------ First Name Field ----------------- */}
          <div className="input__field">
            <label for="fname">First Name</label>
            <div className="input__container">
              <input
                value={firstName}
                onChange={(e) => handleFirstName(e.target.value)}
                onFocus={() => {
                  setFNameFocus(true);
                  setLNameFocus(false);
                  setEmailFocus(false);
                  setPasswordFocus(false);
                  setCPasswordFocus(false);
                  setShowPassword(false);
                  setShowCPassword(false);
                }}
                type="text"
                placeholder="First Name"
                id="firstName"
                name="firstName"
              />
            </div>
            {/*------------------ First Name Validation Msg ----------------- */}
            {checkFirstName ? (
              <label className="registration__errorMsg">
                It should only contain alphabet
              </label>
            ) : (
              ""
            )}
          </div>

          {/*------------------ Last Name Field ----------------- */}
          <div className="input__field">
            <label for="lastName">Last Name</label>
            <div className="input__container">
              <input
                value={lastName}
                onChange={(e) => handleLastName(e.target.value)}
                onFocus={() => {
                  setFNameFocus(false);
                  setLNameFocus(true);
                  setEmailFocus(false);
                  setPasswordFocus(false);
                  setCPasswordFocus(false);
                  setShowPassword(false);
                  setShowCPassword(false);
                }}
                type="text"
                placeholder="Last Name"
                id="lastName"
                name="lastName"
              />
            </div>
            {/*------------------ Last Name Validation Msg ----------------- */}
            {checkLastName ? (
              <label className="registration__errorMsg">
                It should only contain alphabet
              </label>
            ) : (
              ""
            )}
          </div>

          {/*------------------ Email Field ----------------- */}
          <div className="input__field">
            <label for="email">Email</label>
            <div className="input__container">
              <input
                value={email}
                onChange={(e) => handleCheckEmail(e.target.value)}
                onFocus={() => {
                  setFNameFocus(false);
                  setLNameFocus(false);
                  setEmailFocus(true);
                  setPasswordFocus(false);
                  setCPasswordFocus(false);
                  setShowPassword(false);
                  setShowCPassword(false);
                }}
                type="email"
                placeholder="youremail@gmail.com"
                id="email"
                name="email"
              />
            </div>
            {/*------------------ Email Validation Msg ----------------- */}
            {checkValidEmail ? (
              <label className="registration__errorMsg">
                Invalid email format
              </label>
            ) : (
              ""
            )}
          </div>

          {/*------------------ Password Field ----------------- */}
          <div className="input__field">
            <label for="password">Password</label>
            <div className="input__container">
              <input
                value={password}
                onChange={(e) => handleCheckPassword(e.target.value)}
                onFocus={() => {
                  setFNameFocus(false);
                  setLNameFocus(false);
                  setEmailFocus(false);
                  setPasswordFocus(true);
                  setCPasswordFocus(false);
                  setShowPassword(false);
                  setShowCPassword(false);
                }}
                type={showPassword ? "text" : "password"}
                placeholder="**********"
                id="password"
                name="password"
              />
              {/* Toggle On and Off Eye Icon */}
              {showPassword ? (
                <VisibilityOffIcon
                  className="visibility-icon"
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                />
              ) : (
                <VisibilityIcon
                  className="visibility-icon"
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                />
              )}
            </div>
            {/*------------------ Password Validation Msg ----------------- */}
            {checkValidPassword ? (
              <label className="registration__errorMsg">
                At least 8 characters, 1 numeric character, 1 lowercase letter,
                1 uppercase letter, 1 special character
              </label>
            ) : (
              ""
            )}
          </div>

          {/*------------------ Confirm Password Field ----------------- */}
          <div className="input__field">
            <label for="password">Confirm Password</label>
            <div className="input__container">
              <input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => {
                  setFNameFocus(false);
                  setLNameFocus(false);
                  setEmailFocus(false);
                  setPasswordFocus(false);
                  setCPasswordFocus(true);
                  setShowPassword(false);
                  setShowCPassword(false);
                }}
                type={showCPassword ? "text" : "password"}
                placeholder="**********"
                id="confirmPassword"
                name="confirmPassword"
              />
              {/* Toggle On and Off Eye Icon */}
              {showCPassword ? (
                <VisibilityOffIcon
                  className="visibility-icon"
                  onClick={() => {
                    setShowCPassword(!showCPassword);
                  }}
                />
              ) : (
                <VisibilityIcon
                  className="visibility-icon"
                  onClick={() => {
                    setShowCPassword(!showCPassword);
                  }}
                />
              )}
            </div>
          </div>

          {/*------------------ Terms & Condition - Privacy Policy ----------------- */}
          <div className="youAgree__txt">
            <label className="d-flex justify-content-center mt-2">
              By registering, you confirm that you accept our&nbsp;
              <Link to="/termsCondition">
                <span className="termsConditionTxt">Terms & Conditions</span>
              </Link>
              &nbsp;and&nbsp;
              <Link to="/privacyPolicy">
                <span className="privacyPolicyTxt">Privacy Policy.</span>
              </Link>
            </label>
          </div>

          {/*------------------ Sign Up Button ----------------- */}
          <button
            className="signUp__btn mt-3"
            type="submit"
            onClick={handleSignUp}
          >
            Sign Up
          </button>

          {/*------------------ Already have an account? ----------------- */}
          <label className="d-flex justify-content-center mt-2">
            Already have an account?&nbsp;
            <Link to="/login">
              <span className="signInTxt">Sign In</span>
            </Link>
          </label>
        </form>
      </div>
    </div>
  );
};

export default Registration;
