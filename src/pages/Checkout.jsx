import React, { useEffect, useState } from "react";
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
  doc,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { userLogInState, userLogOutState } from "../store/UserSlice/userSlice";

// Toast
import { showSuccessToast } from "../components/Toast/Toast";

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
    // You can update the user's data using an API call or any other method here
  };

  // Place order button function
  const handlePlaceOrder = async () => {
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

      showSuccessToast("Order placed", 1000);
      navigate("/home");

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
          {/* Left Side */}
          <Col lg="8" md="6">
            {/* Recipient Details */}

            <div
              className={`recipient__details ${isEditing ? "is-flipped" : ""}`}
            >
              <div className="recipient__details-front">
                <div className="recipient__details-header">
                  <h6>Recipient Details</h6>

                  <button
                    className="recipient__details-edit-btn"
                    onClick={handleEdit}
                  >
                    {isEditing ? "Cancel" : "Edit"}
                  </button>
                </div>
                <form>
                  <div className="form__group">
                    <label>Full Name:</label>
                    <span>{`${userData?.firstName} ${userData?.lastName}`}</span>
                  </div>

                  <div className="form__group">
                    <label>Contact Number:</label>
                    <span>{userData?.contactNumber}</span>
                  </div>

                  <div className="form__group">
                    <label>Address:</label>
                    <span>{userData?.address}</span>
                  </div>
                </form>
              </div>
              <div className="recipient__details-back">
                <div className="recipient__details-header">
                  <h6>Recipient Details</h6>
                  <button
                    className="recipient__details-edit-btn"
                    onClick={handleEdit}
                  >
                    {isEditing ? "Cancel" : "Edit"}
                  </button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="form__group">
                    <label>Full Name:</label>
                    <div>
                      <input
                        type="text"
                        value={userData?.firstName}
                        onChange={(e) => setNewFirstName(e.target.value)}
                      />
                      <input
                        type="text"
                        value={userData?.lastName}
                        onChange={(e) => setNewLastName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form__group">
                    <label>Contact Number:</label>
                    <input
                      type="text"
                      value={userData?.contactNumber}
                      onChange={(e) => setNewContactNumber(e.target.value)}
                    />
                  </div>

                  <div className="form__group">
                    <label>Address:</label>
                    <input
                      type="text"
                      value={userData?.address}
                      onChange={(e) => setNewAddress(e.target.value)}
                    />
                  </div>
                  <button type="submit">Save</button>
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
                <div className="form__group">
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
                <div className="form__group">
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
                <div className="form__group">
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
              <p className="box__text">
                Selected payment method: <span>{paymentMethod}</span>
              </p>

              <div className="form__group">
                <label>Note (optional):</label>
                <textarea placeholder="Notes to the store/rider (optional)" />
              </div>
            </div>
          </Col>

          {/* Right Side */}
          <Col lg="4" md="6">
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
                  Subtotal: ₱{" "}
                  <span>
                    {parseFloat(bagSubTotalAmount)
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </span>
                </h6>
                <h6>
                  Delivery Fee: <span>₱ 50.00</span>
                </h6>
                <h6>
                  Total: ₱{" "}
                  <span>
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
      <td className="text-center">{productQty}x</td>
      <td className="text-center">{productName}</td>
      <td className="text-center">
        ₱{" "}
        {parseFloat(totalPrice)
          .toFixed(2)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
      </td>
    </tr>
  );
};

export default Checkout;
