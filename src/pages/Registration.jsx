import React, { useState } from "react";
import "../style/Registration.css";
import { Link } from "react-router-dom";

const Registration = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email);
  };

  return (
    <div className="registration__body">
      <div className="authForm__container">
        <h3 className="mb-5">Create An Account!</h3>
        {/*------------------ Registration Content ----------------- */}
        <form className="registration__form" onSubmit={handleSubmit}>
          <label for="fname">First Name</label>
          <input
            value={fname}
            onChange={(e) => setFname(e.target.value)}
            type="text"
            placeholder="First Name"
            id="fname"
            name="fname"
          />
          <label for="lname">Last Name</label>
          <input
            value={lname}
            onChange={(e) => setLname(e.target.value)}
            type="text"
            placeholder="Last Name"
            id="lname"
            name="lname"
          />
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
          <label for="password">Confirm Password</label>
          <input
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            type="password"
            placeholder="**********"
            id="password"
            name="password"
          />
          <label className="d-flex justify-content-center">
            By registering, you confirm that you accept our&nbsp;
            <Link to="/termsCondition">
              <span className="termsConditionTxt">Terms & Conditions</span>
            </Link>
            &nbsp;and&nbsp;
            <Link to="/privacyPolicy">
              <span className="privacyPolicyTxt">Privacy Policy.</span>
            </Link>
          </label>
          <button className="mt-3" type="submit">
            Sign Up
          </button>
          <label className="d-flex justify-content-center">
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
