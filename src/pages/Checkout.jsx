import React, { useEffect, useState } from "react";
import "../style/Checkout.css";
import { Container, Row, Col } from "reactstrap";

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
        <Row>
          <Col lg="8" md="6">
            {/* Recipient Details */}
            <div className="recipient__details">
              <h6>Recipient Details</h6>
              <form>
                <div className="form__group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    placeholder="Full Name:"
                    value={`${userData?.firstName} ${userData?.lastName}`}
                  />
                </div>

                <div className="form__group">
                  <label>Contact Number</label>
                  <input
                    type="number"
                    placeholder="Contact Number"
                    value={userData?.contactNumber}
                  />
                </div>

                <div className="form__group">
                  <label>Address: </label>
                  <input
                    type="text"
                    placeholder="Address Details"
                    value={userData?.address}
                  />
                </div>

                <div className="form__group">
                  <label>Note (optional):</label>
                  <input
                    type="text"
                    placeholder="Notes to the store/rider (optional)"
                  />
                </div>
              </form>
            </div>

            {/* Payment Methods */}
            <div className="payment__methods mt-5">
              <h6>Choose Payment Methods</h6>
              <form>
                <div className="form__group">
                  <input
                    type="radio"
                    id="cashOnPickup"
                    value="Cash On PickUp"
                    name="type"
                    onChange={handlePaymentMethodChange}
                    checked={paymentMethod === "Cash On PickUp"}
                  />
                  <label htmlFor="cashOnPickup">Cash On PickUp</label>
                </div>
                <div className="form__group">
                  <input
                    type="radio"
                    id="cashOnDelivery"
                    value="Cash On Delivery"
                    name="type"
                    onChange={handlePaymentMethodChange}
                    checked={paymentMethod === "Cash On Delivery"}
                  />
                  <label htmlFor="cashOnDelivery">Cash On Delivery</label>
                </div>
                <div className="form__group">
                  <input
                    type="radio"
                    id="gcash"
                    value="GCash"
                    name="type"
                    onChange={handlePaymentMethodChange}
                    checked={paymentMethod === "GCash"}
                  />
                  <label htmlFor="gcash">GCash</label>
                </div>
              </form>
              <p>Selected payment method: {paymentMethod}</p>
            </div>
          </Col>

          <Col lg="4" md="6">
            <div className="order__summary">
              <h6 style={{ textAlign: "center" }}>Order Summary</h6>
              <hr></hr>
              {bagItems.length === 0 ? (
                <h5 className="text-center">Your Bag is empty</h5>
              ) : (
                <table className="table">
                  <tbody>
                    {bagItems.map((item) => (
                      <Tr item={item} key={item.id} />
                    ))}
                  </tbody>
                </table>
              )}
              <hr></hr>
              <div className="orderSummary__footer">
                <h6>
                  Subtotal: ₱{" "}
                  <span>{parseFloat(bagSubTotalAmount).toFixed(2)}</span>
                </h6>
                <h6>
                  Delivery Fee: <span>₱ 50.00</span>
                </h6>
                <h6>
                  Total: ₱ <span>{parseFloat(bagTotalAmount).toFixed(2)}</span>
                </h6>
              </div>

              <button className="place__order" onClick={handlePlaceOrder}>
                Place Order
              </button>
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
      <td className="text-center">₱ {totalPrice}</td>
    </tr>
  );
};

export default Checkout;
