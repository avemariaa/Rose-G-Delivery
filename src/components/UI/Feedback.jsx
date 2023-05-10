import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import TestimonialsImg1 from "../../assets/images/sungJinwoo.jpg";
import "../../style/Feedback.css";
import { Row, Col } from "reactstrap";
import Rating from "@mui/material/Rating";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";

// Firebase
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
const Feedback = () => {
  // Retrieve Feedback Data
  const [feedbackData, setFeedbackData] = useState([]);
  useEffect(() => {
    const fetchFeedbackData = async () => {
      const feedbackRef = collection(db, "FeedbackData");
      const snapshot = await getDocs(feedbackRef);
      const feedbackDataList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFeedbackData(feedbackDataList);
    };

    fetchFeedbackData();
  }, []);

  console.log(feedbackData);

  // Slider Settings
  const ArrowLeft = (props) => (
    <button
      {...props}
      className={"feedbackPrev__btn ri-arrow-left-circle-fill"}
    />
  );
  const ArrowRight = (props) => (
    <button
      {...props}
      className={"feedbackNext__btn ri-arrow-right-circle-fill"}
    />
  );
  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    arrows: true,
    prevArrow: <ArrowLeft />,
    nextArrow: <ArrowRight />,
    className: "feedback__slides",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="feedback__container">
      <h4>Testimonials</h4>
      <Slider {...settings}>
        {feedbackData.map((feedback) => {
          return (
            <div className="feedback__slides-item" key={feedback.uid}>
              <div className="feedback__content">
                <img src={TestimonialsImg1} alt="testimonials-img" />
                <div className="feedback__group">
                  <label>{`${feedback?.firstName} ${feedback?.lastName}`}</label>
                  <Rating
                    className="feedback__rating"
                    emptyIcon={<StarBorderIcon />}
                    icon={
                      <StarIcon style={{ color: "var(--background-color2)" }} />
                    }
                    value={parseInt(feedback?.rating)}
                    readOnly={true}
                    style={{
                      fontSize: "1.5rem",
                    }}
                  />
                </div>
                <p>{feedback?.message}</p>
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default Feedback;
