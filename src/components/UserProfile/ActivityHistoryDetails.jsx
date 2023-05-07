import React, { useState, useEffect } from "react";
import "../../style/ActivityHistoryDetails.css";
import { Container, Row, Col } from "reactstrap";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import moment from "moment";
import TitlePageBanner from "../UI/TitlePageBanner";
// Firebase
import { db } from "../../firebase";
import { doc, getDoc, collection } from "firebase/firestore";

const ActivityHistoryDetails = () => {
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

  return (
    <section>
      <Container>
        <Row>
          <TitlePageBanner title="Activity History Details" />
          <Col lg="6" md="6">
            <div>
              <h5>Order Details</h5>
              <div className="orderCards__container">
                <div className="orderCard__body">
                  <p>Order ID: {orderData?.orderId}</p>
                  <p>
                    Order Date:&nbsp;
                    {orderData?.orderDate
                      ? moment(orderData?.orderDate.toDate()).format(
                          "MMM D, YYYY h:mm A"
                        )
                      : null}
                  </p>

                  <p className={`orderStatus${orderData?.orderStatus}`}>
                    Order Status:&nbsp;
                    <span>{orderData?.orderStatus}</span>
                  </p>

                  <p>Delivery Address:&nbsp;{orderData?.orderAddress}</p>
                </div>
              </div>
            </div>
          </Col>

          <Col lg="6" md="6">
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

              <button className="footer__msg">
                Thank you for ordering with us
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

export default ActivityHistoryDetails;
