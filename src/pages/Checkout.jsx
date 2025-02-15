import React, { useEffect, useState, useRef } from "react";
import "../style/Checkout.css";
import { Container, Row, Col } from "reactstrap";
import CheckingDetails from "../assets/images/profile-details.svg";
import DeliveryIcon from "../assets/images/delivery.png";
import PurseIcon from "../assets/images/purse.png";
import GCashIcon from "../assets/images/GCash.png";
import TitlePageBanner from "../components/UI/TitlePageBanner";
// Navigation
import { useNavigate } from "react-router-dom";
// Firebase
import { db, auth } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { userLogInState, userLogOutState } from "../store/UserSlice/userSlice";

// Toast
import {
  showSuccessToast,
  showErrorToast,
  showInfoToast,
} from "../components/Toast/Toast";

const Checkout = () => {
  const bagItems = useSelector((state) => state.bag.bagItems);
  const bagSubTotalAmount = useSelector((state) => state.bag.subTotalAmount);
  const bagTotalAmount = useSelector((state) => state.bag.totalAmount);

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
        //navigation.navigate("Login");
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

  // Radio button for pay method
  const [paymentMethod, setPaymentMethod] = useState("");
  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  // Handle Changes
  const [isEditing, setIsEditing] = useState(false);
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newContactNumber, setNewContactNumber] = useState("");
  const [newAddress, setNewAddress] = useState("");

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const [checkNewContactNumber, setCheckNewContactNumber] = useState(false);
  const handleNewContactNumber = (text) => {
    let regex = /^0\d{10}$/;

    setNewContactNumber(text);
    if (regex.test(text)) {
      setCheckNewContactNumber(false);
    } else {
      setCheckNewContactNumber(true);
    }
  };

  // Save Button Function
  const handleSave = async (e) => {
    e.preventDefault();
    const userDataRef = doc(db, "UserData", auth.currentUser.uid);
    const updatedData = {};

    if (newFirstName !== userData?.firstName || newFirstName === undefined) {
      updatedData.firstName = newFirstName || userData?.firstName;
    }

    if (newLastName !== userData?.lastName || newLastName === undefined) {
      updatedData.lastName = newLastName || userData?.lastName;
    }

    if (
      newContactNumber !== userData?.contactNumber ||
      newContactNumber === undefined
    ) {
      updatedData.contactNumber = newContactNumber || userData?.contactNumber;
    }

    if (newAddress !== userData?.address || newAddress === undefined) {
      updatedData.address = newAddress || userData?.address;
    }

    if (Object.keys(updatedData).length > 0) {
      await updateDoc(userDataRef, updatedData);
      showSuccessToast("Recipient Details is updated", 1000);
      getUserData();
    }
    setIsEditing(false);
  };

  // Place order button function
  const handlePlaceOrder = async () => {
    // If bag is empty, they can't place order
    if (bagItems.length === 0) {
      showErrorToast(
        "Your bag is empty. Please add some items to place an order.",
        2000
      );
      return;
    }

    // Recipient details is required to place their order
    if (
      !userData?.address ||
      !userData?.contactNumber ||
      !userData?.firstName ||
      !userData?.lastName
    ) {
      showErrorToast("Please fill in all the recipient details.", 2000);
      return;
    }

    // If any payment method is not selected, they can't place their order
    if (!paymentMethod) {
      showErrorToast("Please select a payment method.", 2000);
      return;
    }

    const docRef = doc(
      collection(db, "UserOrders"),
      new Date().getTime().toString()
    );

    try {
      await setDoc(docRef, {
        orderId: docRef.id,
        orderData: bagItems,
        orderStatus: "Pending",
        orderTotalCost: bagTotalAmount,
        orderDate: serverTimestamp(),
        orderAddress: userData?.address,
        orderContactNumber: userData?.contactNumber,
        orderFirstName: userData?.firstName,
        orderLastName: userData?.lastName,
        orderUserId: auth.currentUser.uid,
        orderPayment: paymentMethod,
        // changeFor: changeFor,
      });

      showSuccessToast("Order placed", 2000);
      navigate("/orders");

      // Delete the document to reset the bag
      const docRef2 = doc(collection(db, "UserBag"), auth.currentUser.uid);
      await deleteDoc(docRef2);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section>
      <Container>
        <TitlePageBanner title="Check Out" />
        <Row>
          {/*------------------ Left Side ----------------- */}
          <Col lg="8" md="6">
            <div className="checkout__details">
              {/*------------------ Recipient Details ----------------- */}
              <div
                className={`recipient__details ${
                  isEditing ? "is-flipped" : ""
                }`}
              >
                {/* Recipient Details Front */}
                <div className="recipient__details-front">
                  <div className="recipient__details-header">
                    <h6>Recipient Details</h6>

                    <button
                      className="recipient__details-edit-btn"
                      onClick={handleEdit}
                    >
                      {isEditing ? <i class="ri-close-fill"></i> : "Edit"}
                    </button>
                  </div>
                  <form>
                    {/* Full Name */}
                    <div className="detailsForm__group">
                      {/* <label>Full Name:&nbsp;</label>
                      <span>{`${userData?.firstName} ${userData?.lastName}`}</span> */}
                      <label htmlFor="first__name-input">Full Name:</label>
                      <input
                        disabled
                        type="text"
                        id="first__name-input"
                        className="detailsForm__input"
                        required
                        value={`${userData?.firstName} ${userData?.lastName}`}
                        onChange={(e) => setNewFirstName(e.target.value)}
                      />
                    </div>

                    {/* Contact Number */}
                    <div className="detailsForm__group">
                      {/* <label>Contact Number:&nbsp;</label>
                      <span>{userData?.contactNumber}</span> */}
                      <label htmlFor="contact__number-input">
                        Contact Number:
                      </label>
                      <input
                        disabled
                        type="text"
                        maxLength={11}
                        pattern="[0-9]*"
                        id="contact__number-input"
                        className="detailsForm__input"
                        value={userData?.contactNumber}
                        onChange={(e) => handleNewContactNumber(e.target.value)}
                      />
                    </div>

                    {/* Address */}
                    <div className="detailsForm__group">
                      {/* <label>Address:&nbsp;</label>
                      <span>{userData?.address}</span> */}
                      <label htmlFor="address-input">Address:</label>
                      <input
                        type="text"
                        disabled
                        id="address-input"
                        className="detailsForm__input"
                        defaultValue={userData?.address}
                        onChange={(e) => setNewAddress(e.target.value)}
                      />
                    </div>
                  </form>
                </div>

                {/* Recipient Details Back */}
                <div className="recipient__details-back">
                  <div className="recipient__details-header">
                    <h6>Edit Recipient Details</h6>
                    <button
                      className="recipient__details-cancel-btn"
                      onClick={handleEdit}
                    >
                      {isEditing ? <i class="ri-close-fill"></i> : "Edit"}
                    </button>
                  </div>
                  <form>
                    {/* First Name */}
                    <div className="detailsForm__group">
                      <label htmlFor="first__name-input">First Name:</label>
                      <input
                        type="text"
                        id="first__name-input"
                        className="detailsForm__input"
                        required
                        defaultValue={userData?.firstName}
                        onChange={(e) => setNewFirstName(e.target.value)}
                      />
                    </div>

                    {/* Last Name */}
                    <div className="detailsForm__group">
                      <label>Last Name:</label>
                      <input
                        type="text"
                        id="last__name-input"
                        className="detailsForm__input"
                        defaultValue={userData?.lastName}
                        onChange={(e) => setNewLastName(e.target.value)}
                      />
                    </div>

                    {/* Contact Number */}
                    <div className="detailsForm__group">
                      <label htmlFor="contact__number-input">
                        Contact Number:
                      </label>
                      <input
                        type="text"
                        maxLength={11}
                        pattern="[0-9]*"
                        id="contact__number-input"
                        className="detailsForm__input"
                        defaultValue={userData?.contactNumber}
                        onChange={(e) => handleNewContactNumber(e.target.value)}
                      />
                    </div>

                    {/* Address */}
                    <div className="detailsForm__group">
                      <label htmlFor="address-input">Address:</label>
                      <input
                        type="text"
                        id="address-input"
                        className="detailsForm__input"
                        defaultValue={userData?.address}
                        onChange={(e) => setNewAddress(e.target.value)}
                      />
                    </div>

                    {/* Save Button */}
                    <button
                      className="recipient__details-save-btn"
                      onClick={handleSave}
                    >
                      Save
                    </button>
                  </form>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="payment__methods mt-5 ">
                <h6 className=".payment__methods-header">
                  Choose Payment Method
                </h6>
                <form>
                  {/* Cash on pickup */}
                  <div className="paymentMethod__group">
                    <input
                      type="radio"
                      id="cashOnPickup"
                      value="Cash On PickUp"
                      name="type"
                      onChange={handlePaymentMethodChange}
                      checked={paymentMethod === "Cash On PickUp"}
                    />
                    <label htmlFor="cashOnPickup">
                      <img
                        src={PurseIcon}
                        alt="Purse icon"
                        className="radio__icon"
                      />
                      Cash On PickUp
                    </label>
                  </div>

                  {/* Cash on delivery */}
                  <div className="paymentMethod__group">
                    <input
                      type="radio"
                      id="cashOnDelivery"
                      value="Cash On Delivery"
                      name="type"
                      onChange={handlePaymentMethodChange}
                      checked={paymentMethod === "Cash On Delivery"}
                    />
                    <label htmlFor="cashOnDelivery">
                      <img
                        src={DeliveryIcon}
                        alt="Delivery icon"
                        className="radio__icon"
                      />
                      Cash On Delivery
                    </label>
                  </div>

                  {/* GCash */}
                  <div className="paymentMethod__group">
                    <input
                      type="radio"
                      id="gcash"
                      value="GCash"
                      name="type"
                      onChange={handlePaymentMethodChange}
                      checked={paymentMethod === "GCash"}
                    />
                    <label htmlFor="gcash">
                      <img
                        src={GCashIcon}
                        alt="GCash icon"
                        className="radio__icon"
                      />
                      GCash
                    </label>
                  </div>
                </form>
                {/* <p className="box__text">
                  Selected payment method: <span>{paymentMethod}</span>
                </p> */}

                <div className="orderNoteForm__group">
                  <label htmlFor="order__note">Note (optional):</label>
                  <textarea
                    id="order__note"
                    className="orderNoteForm__input"
                    placeholder="Notes to the store/rider (optional)"
                  />
                </div>
              </div>
            </div>
          </Col>

          {/* Right Side */}
          <Col lg="4" md="6">
            {/* Order Summary */}
            <div className="order__summary">
              <h6
                style={{
                  textAlign: "center",
                  color: "var(--background-color2)",
                }}
              >
                Order Summary
              </h6>
              <hr
                style={{
                  border: "2px solid var(--background-color2)",
                }}
              ></hr>
              {bagItems.length === 0 ? (
                <h5
                  className="text-center"
                  style={{ color: "var(--background-color2)" }}
                >
                  Your Bag is empty
                </h5>
              ) : (
                <table className="table">
                  <tbody>
                    {bagItems.map((item) => (
                      <Tr item={item} key={item.id} />
                    ))}
                  </tbody>
                </table>
              )}
              <hr
                style={{
                  border: "2px solid var(--background-color2)",
                }}
              ></hr>
              <div className="orderSummary__footer">
                <h6>
                  Subtotal:
                  <span>
                    ₱
                    {parseFloat(bagSubTotalAmount)
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </span>
                </h6>
                <h6>
                  Delivery Fee: <span>₱50.00</span>
                </h6>
                <h6>
                  Total:
                  <span>
                    ₱
                    {parseFloat(bagTotalAmount)
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </span>
                </h6>
              </div>

              <button className="place__order" onClick={handlePlaceOrder}>
                Place Order
              </button>
            </div>
            <div className="svg__wrapper">
              <img
                src={CheckingDetails}
                alt="checking-detailsImg"
                className="svg__image"
              />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

const Tr = (props) => {
  const { productName, totalPrice, productQty } = props.item;

  return (
    <tr>
      <td style={{ width: "20%" }}>{productQty}x</td>
      <td style={{ width: "50%" }}>{productName}</td>
      <td className="text-end" style={{ width: "30%" }}>
        ₱{" "}
        {parseFloat(totalPrice)
          .toFixed(2)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
      </td>
    </tr>
  );
};

export default Checkout;
