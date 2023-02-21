import React, { useState, useEffect } from "react";
import "../style/Login.css";
import { Link } from "react-router-dom";

// Firebase
import { auth } from "../firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

// Redux
import { useDispatch, useSelector } from "react-redux";
import {
  setActiveUser,
  setUserLogOutState,
  selectUserEmail,
  selectUserPassword,
} from "../store/UserSlice/userSlice";

const Login = () => {
  // const [email, setEmail] = useState(null);
  // const [pass, setPass] = useState(null);

  const [state, setState] = useState({
    email: "",
    password: "",
  });

  const { email, password } = state;

  //Redux
  const dispatch = useDispatch();
  const userEmail = useSelector((state) => state.selectUserEmail);
  const userPassword = useSelector((state) => state.selectUserPassword);

  const handleChange = (e) => {
    let { name, value } = e.target;
    setState({ ...setState, [name]: value });
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        dispatch(
          setActiveUser({
            userEmail: userCredential.user.email,
            userPasswrod: userCredential.user.password,
          })
        );

        console.log(userEmail);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("sign out successfully");
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="login__body">
      <div className="authForm__container">
        <h3 className="mb-5">Sign in to your account</h3>
        {/*------------------ Login Content ----------------- */}
        <form className="login__form" onSubmit={handleSignIn}>
          <label for="email">Email</label>
          <input
            value={email}
            // onChange={(e) => setEmail(e.target.value)}
            onChange={handleChange}
            type="email"
            placeholder="youremail@gmail.com"
            id="email"
            name="email"
          />
          <label for="password">Password</label>
          <input
            value={password}
            // onChange={(e) => setPass(e.target.value)}
            onChange={handleChange}
            type="password"
            placeholder="**********"
            id="password"
            name="password"
          />
          <label className="forgotPassTxt d-flex justify-content-end mt-2">
            Forgot Password?
          </label>

          <button className="mt-4" type="submit">
            Sign In
          </button>
        </form>

        {/* REDUX LOGIN */}
        {userEmail ? (
          <button onClick={handleSignIn}>Sign Out</button>
        ) : (
          <button onClick={handleSignOut}>Sign In</button>
        )}

        <label className="d-flex justify-content-center mt-2">
          Don't have an account?
        </label>
        <button className="createAcc__btn">Create An Account</button>
        <button className="connectGoogle__btn">Connect With Google</button>
        <label>
          By continuing, you agree to our updated{" "}
          <Link to="/termsCondition">
            <span className="termsConditionTxt">Terms & Conditions</span>
          </Link>
          &nbsp;and&nbsp;
          <Link to="/privacyPolicy">
            <span className="privacyPolicyTxt">Privacy Policy.</span>
          </Link>
        </label>
        <label className="d-flex justify-content-center">OR</label>
        <button className="guest__btn">Order as Guest</button>
      </div>
    </div>
  );
};

export default Login;
