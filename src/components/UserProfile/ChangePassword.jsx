import React, { useState } from "react";
import "../../style/ChangePassword.css";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

// Firebase
import {
  getAuth,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";

import { db, auth } from "../../firebase";

// Toast
import {
  showSuccessToast,
  showErrorToast,
  showInfoToast,
} from "../Toast/Toast";

const ChangePassword = ({ userData, onSave }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [cNewPassword, setCNewPassword] = useState("");
  // Visibility (eye icon)
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showCNewPassword, setShowCNewPassword] = useState(false);

  const [oldPasswordFocus, setOldPasswordFocus] = useState(false);
  const [newPasswordFocus, setNewPasswordFocus] = useState(false);
  const [cNewPasswordFocus, setCNewPasswordFocus] = useState(false);

  const [customErrorMsg, setCustomErrorMsg] = useState("");

  const handleSave = async () => {
    if (newPassword !== cNewPassword) {
      showErrorToast("New passwords do not match!");
      return;
    }
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,}$/;

    if (!regex.test(newPassword)) {
      setCustomErrorMsg(
        "The new password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one number, and one special character (# $ @ ! % & * ?)."
      );
      return;
    }

    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, oldPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      showSuccessToast("Password updated successfully!");
      onSave();
    } catch (error) {
      switch (error.code) {
        case "auth/wrong-password":
          showErrorToast("Incorrect old password. Please try again.");
          break;
        case "auth/too-many-requests":
          showErrorToast("Too many attempts. Please try again later.");
          break;
        default:
          showErrorToast("An error occurred. Please try again later.");
          break;
      }
      onSave();
    }
  };

  return (
    <div className="changePass__container">
      <h5>Change Password</h5>

      <form className="changePass__form">
        {/*------------------ Old Password ----------------- */}
        <div className="changePassForm__group">
          {customErrorMsg !== "" && (
            <label className="changePass__ErrorMsg">{customErrorMsg}</label>
          )}
          <label htmlFor="oldPass__input">Old Password:</label>
          <div className="changePass__input-container">
            <input
              type={showOldPassword ? "text" : "password"}
              id="oldPass__input"
              className="changePassForm__input"
              placeholder="Enter Old Password"
              onChange={(e) => setOldPassword(e.target.value)}
              onFocus={() => {
                setOldPasswordFocus(true);
                setNewPasswordFocus(false);
                setCNewPasswordFocus(false);

                setShowOldPassword(false);
                setShowNewPassword(false);
                setShowCNewPassword(false);
              }}
            />

            {/* Toggle On and Off Eye Icon */}
            <div
              className="changePass__input-icon"
              onClick={() => setShowOldPassword(!showOldPassword)}
            >
              {showOldPassword ? (
                <VisibilityOffIcon className="changePass__visibility-icon" />
              ) : (
                <VisibilityIcon className="changePass__visibility-icon" />
              )}
            </div>
          </div>
        </div>

        {/*------------------ New Password ----------------- */}
        <div className="changePassForm__group">
          <label htmlFor="newPass__input">New Password:</label>
          <div className="changePass__input-container">
            <input
              type={showNewPassword ? "text" : "password"}
              id="newPass__input"
              className="changePassForm__input"
              placeholder="Enter New Password"
              onChange={(e) => setNewPassword(e.target.value)}
              onFocus={() => {
                setOldPasswordFocus(false);
                setNewPasswordFocus(true);
                setCNewPasswordFocus(false);

                setShowOldPassword(false);
                setShowNewPassword(false);
                setShowCNewPassword(false);
              }}
            />

            {/* Toggle On and Off Eye Icon */}
            <div
              className="changePass__input-icon"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? (
                <VisibilityOffIcon className="changePass__visibility-icon" />
              ) : (
                <VisibilityIcon className="changePass__visibility-icon" />
              )}
            </div>
          </div>
        </div>

        {/*------------------ Confirm New Password ----------------- */}
        <div className="changePassForm__group">
          <label htmlFor="confirmNewPass__input">Confirm New Password;</label>
          <div className="changePass__input-container">
            <input
              type={showCNewPassword ? "text" : "password"}
              id="confirmNewPass__input"
              className="changePassForm__input"
              placeholder="Enter New Password"
              onChange={(e) => setCNewPassword(e.target.value)}
              onFocus={() => {
                setOldPasswordFocus(false);
                setNewPasswordFocus(false);
                setCNewPasswordFocus(true);

                setShowOldPassword(false);
                setShowNewPassword(false);
                setShowCNewPassword(false);
              }}
            />
            {/* Toggle On and Off Eye Icon */}
            <div
              className="changePass__input-icon"
              onClick={() => setShowCNewPassword(!showCNewPassword)}
            >
              {showCNewPassword ? (
                <VisibilityOffIcon className="changePass__visibility-icon" />
              ) : (
                <VisibilityIcon className="changePass__visibility-icon" />
              )}
            </div>
          </div>
        </div>
      </form>

      <div className="changePass__btns">
        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  );
};

export default ChangePassword;
