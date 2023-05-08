import React, { useState, useEffect } from "react";
import "../style/OrderTracker.css";
import { Container, Row, Col } from "reactstrap";
import { useParams } from "react-router-dom";
import moment from "moment"; //date format

import CheckCircle from "../assets/images/check_circle.png";
import Circle from "../assets/images/circle-gray.png";
import DottedLine from "../assets/images/dotted_line.png";
import TitlePageBanner from "../components/UI/TitlePageBanner";
import PendingIcon from "../assets/gif/order-pending.gif";
import PreparingIcon from "../assets/gif/preparing-food.gif";
import DeliveryIcon from "../assets/gif/order-delivery.gif";
import DeliveredIcon from "../assets/gif/order-delivered.gif";
import OrderConfirmed from "../assets/gif/order-confirmed.gif";

// Firebase
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const track_order_status = [
  {
    id: 1,
    title: "Order Pending",
    sub_title: "We are processing your order",
    image: PendingIcon,
  },
  {
    id: 2,
    title: "Order Confirmed",
    sub_title: "Your order has been validated",
    image: OrderConfirmed,
  },
  {
    id: 3,
    title: "Order Prepared",
    sub_title: "Your order has been prepared",
    image: PreparingIcon,
  },
  {
    id: 4,
    title: "Delivery on its way",
    sub_title: "Hang on! Your food is on the way",
    image: DeliveryIcon,
  },
  {
    id: 5,
    title: "Delivered",
    sub_title: "Enjoy your meal!",
    image: DeliveredIcon,
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
    <main>
      <Container>
        <Row>
          <TitlePageBanner title="Order Tracker" />
          <Col lg="8" md="6">
            <Row>
              <div className="order__details-container">
                <h4>Order Details</h4>
                <div className="order__details-item">
                  <p>Order ID:&nbsp;</p>
                  <span>{orderData?.orderId}</span>
                </div>

                <div className="order__details-item">
                  <p>Order Date:&nbsp;</p>
                  <span>
                    {orderData?.orderDate
                      ? moment(orderData?.orderDate.toDate()).format(
                          "MMM D, YYYY h:mm A"
                        )
                      : null}
                  </span>
                </div>

                <div className="order__details-item">
                  <p>Delivery Address:&nbsp; </p>
                  <span>{orderData?.orderAddress}</span>
                </div>

                <div className="order__details-item">
                  <p>Delivery Rider:&nbsp;</p>
                  <span>
                    {orderData?.deliveryRiderInfo
                      ? orderData?.deliveryRiderInfo
                      : null}
                  </span>
                </div>
              </div>
            </Row>

            <Row>
              {/* Left Side */}
              <Col>
                {track_order_status.map((item, index) => {
                  return (
                    <div
                      key={`StatusList-${index}`}
                      className="status__image-container"
                    >
                      {/* Display image only for the current step */}
                      {index === currentStep && item.image && (
                        <div className="status__image-wrapper">
                          <img
                            src={item.image}
                            alt={item.title}
                            // style={{ width: "300px", height: "auto" }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </Col>
              {/* Right Side */}
              <Col>
                {/* Order Status */}
                {track_order_status.map((item, index) => {
                  return (
                    <div key={`StatusList-${index}`}>
                      <div className="order__status-container">
                        <img
                          src={Circle}
                          alt="check circle"
                          className={`${
                            index <= currentStep ? "check-circle" : ""
                          }`}
                        />

                        <div className="order__status-text">
                          <h5>{item.title}</h5>
                          <p>{item.sub_title}</p>
                        </div>
                      </div>

                      {index < track_order_status.length - 1 && (
                        <div className="order__status-line">
                          {index < currentStep && <div className="line"></div>}
                          {index >= currentStep && (
                            <img
                              src={DottedLine}
                              alt="dotted line"
                              className="dotted-line"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </Col>
            </Row>
          </Col>

          {/* Order Summary */}
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
              <hr
                style={{
                  border: "2px solid var(--background-color2)",
                }}
              ></hr>
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
    </main>
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
