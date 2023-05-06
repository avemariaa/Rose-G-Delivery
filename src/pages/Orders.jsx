import React, { useState, useEffect } from "react";
import "../style/Orders.css";

import { Container, Row, Col } from "reactstrap";
import "../style/OrderPage.css";

import { Link } from "react-router-dom";
import moment from "moment/moment";

// Firebase
import { auth, db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

const Orders = () => {
  const [orderData, setOrderData] = useState([]);

  const clearOrderData = () => {
    setOrderData([]);
  };

  const getOrdersData = async () => {
    if (auth.currentUser) {
      const ordersRef = query(
        collection(db, "UserOrders"),
        where("orderUserId", "==", auth.currentUser.uid),
        where("orderStatus", "in", [
          "Pending",
          "Confirmed",
          "Prepared",
          "Delivery",
        ])
      );
      onSnapshot(ordersRef, (snapshot) => {
        setOrderData(snapshot.docs.map((doc) => doc.data()));
      });
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        getOrdersData();
      } else {
        clearOrderData();
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  console.log(orderData);

  return (
    <section>
      <Container>
        <Row>
          <Col lg="12">
            <h5>On Going Orders</h5>
            <div className="orderCards__container">
              {orderData.map((order, index) => {
                return (
                  <Link
                    to={`/orders/${order.orderId}`}
                    className="orderCard"
                    key={index}
                  >
                    <div className="orderCard__body">
                      <h6>{order.orderStatus}</h6>
                      <p>Order ID: {order.orderId}</p>
                      <p>
                        Order Date:&nbsp;
                        {order.orderDate
                          ? moment(order.orderDate.toDate()).format(
                              "MMM D, YYYY h:mm A"
                            )
                          : null}
                      </p>
                      <p>
                        Total: ₱{parseFloat(order.orderTotalCost).toFixed(2)}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Orders;
