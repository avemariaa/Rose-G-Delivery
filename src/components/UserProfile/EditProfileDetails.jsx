import React from "react";

const EditProfileDetails = ({ userData, onSave }) => {
  const handleSave = () => {
    onSave();
  };

  return (
    <div>
      <h5>Edit Profile Details</h5>
      <div className="form__group">
        <p>
          First Name:&nbsp;
          {userData?.firstName}
        </p>
        <input type="text" placeholder="Enter New First Name" />
      </div>
      <div className="form__group">
        <p>
          Last Name:&nbsp;
          {userData?.lastName}
        </p>
        <input type="text" placeholder="Enter New Last Name" />
      </div>

      <div className="form__group">
        <p>
          Email:&nbsp;
          {userData?.email}
        </p>
        <input type="email" placeholder="Enter New Email" />
      </div>
      <div className="form__group">
        <p>
          Contact Number:&nbsp;
          {userData?.contactNumber}
        </p>
        <input type="number" placeholder="Enter New Contact Number" />
      </div>
      <div className="form__group">
        <p>
          Address:&nbsp;
          {userData?.address}
        </p>
        <input type="text" placeholder="Enter New Address" />
      </div>
      <div className="userProfile_btns">
        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  );
};

export default EditProfileDetails;
