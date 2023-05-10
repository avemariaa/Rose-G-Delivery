import React, { useState } from "react";
import "./FeedbackModal.css";
import Rating from "@mui/material/Rating";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";

// Firebase
import {
  doc,
  addDoc,
  serverTimestamp,
  setDoc,
  collection,
} from "firebase/firestore";
import { db, auth } from "../../firebase";

// Toast
import {
  showSuccessToast,
  showErrorToast,
  showInfoToast,
} from "../Toast/Toast";

const FeedbackModal = ({ closeFeedbackModal, orderData }) => {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");

  const handleRatingChange = (e) => {
    setRating(e.target.value);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Save the review to the server here
      const feedbackId = new Date();
      const feedbackRef = collection(db, "FeedbackData");
      await addDoc(feedbackRef, {
        uid: auth.currentUser.uid,
        firstName: orderData?.orderFirstName,
        lastName: orderData?.orderLastName,
        rating: rating,
        message: message,
        submittedDate: feedbackId,
      });

      // Display a success message
      showSuccessToast("Feedback saved successfully!");

      // Close the feedback modal
      closeFeedbackModal();
    } catch (error) {
      // Display an error message
      console.error("Error saving feedback: ", error);
      showErrorToast(
        "An error occurred while saving your feedback. Please try again."
      );
    }
  };

  return (
    <div className="feedbackModal__wrapper">
      <div className="feedbackModal__container">
        <div className="feedbackModal__header">
          <h6>Leave a Review</h6>
          <button
            className="feedbackModal__close-btn"
            onClick={closeFeedbackModal}
          >
            <i className="ri-close-fill"></i>
          </button>
        </div>
        <div className="feedbackModal__content">
          <form>
            <div className="feedbackModalForm__group">
              <label htmlFor="rating">Rating:</label>
              <Rating
                className="feedback__rating"
                emptyIcon={<StarBorderIcon fontSize="inherit" />}
                icon={<StarIcon fontSize="inherit" />}
                value={parseInt(rating)}
                onChange={handleRatingChange}
                style={{ fontSize: "2rem" }}
              />
            </div>
            <div className="feedbackModalForm__group">
              <label htmlFor="message">Message:</label>
              <textarea
                id="message"
                rows="5"
                value={message}
                onChange={handleMessageChange}
              ></textarea>
            </div>
            <div className="feedbackModal__actions">
              <button onClick={handleSubmit}>Send</button>
              <button onClick={closeFeedbackModal}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
