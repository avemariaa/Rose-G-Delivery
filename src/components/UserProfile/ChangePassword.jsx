import React from "react";

const ChangePassword = ({ userData, onSave }) => {
  const handleSave = () => {
    onSave();
  };
  return (
    <div>
      <h5>Change Password</h5>
      <div className="form__group">
        <p>Old Password:</p>
        <input type="password" placeholder="Enter Old Password" />
      </div>
      <div className="form__group">
        <p>New Password:</p>
        <input type="password" placeholder="Enter New Password" />
      </div>
      <div className="form__group">
        <p>Confirm New Password;</p>
        <input type="password" placeholder="Enter New Password" />
      </div>

      <div className="userProfile_btns">
        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  );
};

export default ChangePassword;
