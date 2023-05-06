import React, { useState, useEffect } from "react";
import "../style/OrderTracker.css";
import { Container, Row, Col } from "reactstrap";
import { useParams } from "react-router-dom";
import moment from "moment"; //date format

import CheckCircle from "../assets/images/check_circle.png";
import DottedLine from "../assets/images/dotted_line.png";

// Firebase
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const track_order_status = [
  {
    id: 1,
    title: "Order Pending",
    sub_title: "We are processing your order",
  },
  {
    id: 2,
    title: "Order Confirmed",
    sub_title: "Your order has been validated",
  },
  {
    id: 3,
    title: "Order Prepared",
    sub_title: "Your order has been prepared",
  },
  {
    id: 4,
    title: "Delivery on its way",
    sub_title: "Hang on! Your food is on the way",
  },
  {
    id: 5,
    title: "Delivered",
    sub_title: "Enjoy your meal!",
  },
];

const OrderTracker = (props) => {
  const { orderId } = useParams();

  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const getOrder = async () => {
      const orderRef = doc(collection(db, "UserOrders"), orderId);
      const orderDoc = await getDoc(orderRef);
      if (orderDoc.exists()) {
        setOrderData(orderDoc.data());
      }
    };
    getOrder();
  }, [orderId]);

  // console.log(getOrderData);

  const [currentStep, setCurrentStep] = useState("0");
  useEffect(() => {
    if (orderData != null) {
      const status = orderData.orderStatus;
      if (status === "Pending") {
        setCurrentStep(0);
      }
      if (status === "Confirmed") {
        setCurrentStep(1);
      }
      if (status === "Prepared") {
        setCurrentStep(2);
      }
      if (status === "Delivery") {
        setCurrentStep(3);
      }
      if (status === "Delivered") {
        setCurrentStep(4);
      }
    }
  }, [orderData]);

  return (
    <section>
      <Container>
        <Row>
          <Col lg="8" md="6">
            <div>
              <p>Order ID:&nbsp;{orderData?.orderId}</p>
              <p>
                Order Date:&nbsp;
                {orderData?.orderDate
                  ? moment(orderData?.orderDate.toDate()).format(
                      "MMM D, YYYY h:mm A"
                    )
                  : null}
              </p>
              <p>Delivery Address: {orderData?.orderAddress}</p>
              <p>
                Delivery Rider:&nbsp;
                {orderData?.deliveryRiderInfo
                  ? orderData?.deliveryRiderInfo
                  : null}
              </p>
            </div>

            {track_order_status.map((item, index) => {
              return (
                <div key={`StatusList-${index}`}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      marginVertical: -5,
                      marginHorizontal: 60,
                    }}
                  >
                    <img
                      src={CheckCircle}
                      alt="check circle"
                      style={{
                        width: 40,
                        height: 40,
                        filter:
                          index <= currentStep ? "none" : "grayscale(100%)",
                      }}
                    />
                    <div style={{ marginLeft: 10 }}>
                      <h3 style={{ fontWeight: "bold", color: "red" }}>
                        {item.title}
                      </h3>
                      <p>{item.sub_title}</p>
                    </div>
                  </div>

                  {index < track_order_status.length - 1 && (
                    <div style={{ marginHorizontal: 60 }}>
                      {index < currentStep && (
                        <div
                          style={{
                            height: 40,
                            width: 3,
                            marginLeft: 18,
                            backgroundColor: "red",
                            zIndex: -1,
                          }}
                        ></div>
                      )}
                      {index >= currentStep && (
                        <img
                          src={DottedLine}
                          alt="dotted line"
                          style={{
                            width: 4,
                            height: 40,
                            marginLeft: 17,
                            zIndex: -1,
                          }}
                        />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </Col>

          <Col lg="4" md="6">
            <div className="order__summary">
              <h6 style={{ textAlign: "center" }}>Order Summary</h6>
              <hr></hr>
              {orderData?.orderData.length === 0 ? (
                <h5 className="text-center">Your Bag is empty</h5>
              ) : (
                <table className="table">
                  <tbody>
                    {orderData?.orderData.map((item) => (
                      <Tr item={item} key={item.id} />
                    ))}
                  </tbody>
                </table>
              )}
              <hr></hr>
              <div className="orderSummary__footer">
                <h6>
                  Subtotal: ₱{" "}
                  <span>
                    {parseFloat(
                      orderData?.orderData.reduce(
                        (total, item) => total + item.price * item.productQty,
                        0
                      )
                    ).toFixed(2)}
                  </span>
                </h6>
                <h6>
                  Delivery Fee: <span>₱ 50.00</span>
                </h6>
                <h6>
                  Total: ₱{" "}
                  <span>
                    {parseFloat(orderData?.orderTotalCost).toFixed(2)}
                  </span>
                </h6>
              </div>

              <button className="place__order">Cancel Order</button>
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

export default OrderTracker;
