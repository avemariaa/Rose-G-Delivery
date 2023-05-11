import React, { useRef } from "react";
import Slider from "react-slick";
import HomeSliderImg1 from "../../assets/images/homeSliderImg1.jpg";
import HomeSliderImg2 from "../../assets/images/homeSliderImg2.png";
import HomeSliderImg3 from "../../assets/images/homeSliderImg3.jpg";
import "../../style/HomeSlider.css";
import { CustomPrevArrow, CustomNextArrow } from "../../globals/Slider";

const HomeSlider = () => {
  const ArrowLeft = (props) => (
    <button {...props} className={"prev__btn ri-arrow-left-circle-fill"} />
  );
  const ArrowRight = (props) => (
    <button {...props} className={"next__btn ri-arrow-right-circle-fill"} />
  );
  const settings = {
    autoplay: true,
    infinite: true,
    speed: 2500,
    autoplaySpeed: 3000,
    swipeToSlide: true,
    slideToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <CustomPrevArrow arrowSize={40} />,
    nextArrow: <CustomNextArrow arrowSize={40} />,
    className: "home__slides",
    responsive: [
      {
        breakpoint: 600,
        settings: {
          arrows: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          arrows: false,
        },
      },
    ],
  };
  return (
    <Slider centerMode={true} {...settings}>
      <div className="homeSlider__img">
        <img src={HomeSliderImg1} />
      </div>
      <div className="homeSlider__img">
        <img src={HomeSliderImg2} />
      </div>
      <div className="homeSlider__img">
        <img src={HomeSliderImg3} />
      </div>
    </Slider>
  );
};

export default HomeSlider;
