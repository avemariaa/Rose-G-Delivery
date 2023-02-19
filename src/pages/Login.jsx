import React, { useState } from "react";
import "../style/Login.css";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email);
  };

  return (
    <div className="login__body">
      <div className="authForm__container">
        <h3 className="mb-5">Sign in to your account</h3>
        {/*------------------ Login Content ----------------- */}
        <form className="login__form" onSubmit={handleSubmit}>
          <label for="email">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="youremail@gmail.com"
            id="email"
            name="email"
          />
          <label for="password">Password</label>
          <input
            value={pass}
            onChange={(e) => setPass(e.target.value)}
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
