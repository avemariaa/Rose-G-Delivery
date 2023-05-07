import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment/moment";

// Firebase
import { auth, db } from "../../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

const ActivityHistory = () => {
  const [orderData, setOrderData] = useState([]);

  const clearOrderData = () => {
    setOrderData([]);
  };

  const getOrdersData = async () => {
    if (auth.currentUser) {
      const ordersRef = query(
        collection(db, "UserOrders"),
        where("orderUserId", "==", auth.currentUser.uid),
        where("orderStatus", "in", ["Delivered", "Cancelled"]) // Only retrieve orders with Delivered or Cancelled status
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
    <div>
      <h5>On Going Orders</h5>
      <div className="orderCards__container">
        {orderData.map((order, index) => {
          return (
            <Link
              to={`/activityHistoryDetails/${order.orderId}`}
              className="orderCard no-underline"
              key={index}
            >
              <div className="orderCard__body ">
                <h6
                  className={`${
                    order.orderStatus === "Delivered"
                      ? "delivered"
                      : order.orderStatus === "Cancelled"
                      ? "cancelled"
                      : ""
                  }`}
                >
                  {order.orderStatus}
                </h6>
                <p>Order ID: {order.orderId}</p>
                <p>
                  Order Date:&nbsp;
                  {order.orderDate
                    ? moment(order.orderDate.toDate()).format(
                        "MMM D, YYYY h:mm A"
                      )
                    : null}
                </p>
                <p>Total: ₱{parseFloat(order.orderTotalCost).toFixed(2)}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityHistory;
