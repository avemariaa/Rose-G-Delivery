import React, { useState } from "react";
import { Container, Row, Col } from "reactstrap";
import "../style/Home.css";
import HomeSlider from "../components/UI/HomeSlider";
import FoodCategorySlider from "../components/UI/FoodCategorySlider";
import Feedback from "../components/UI/Feedback";
import FeaturedProducts from "../components/UI/FeaturedProducts";
import CompanyBackground from "../components/UI/CompanyBackground";
import OurPartners from "../components/UI/OurPartners";

const Home = () => {
  return (
    <div>
      {/*Home Slider Section*/}
      <section>
        <Container className="section__container">
          <HomeSlider />
        </Container>
      </section>

      {/*Featured Product Slider Section*/}
      <section>
        <Container className="section__container">
          <FeaturedProducts />
        </Container>
      </section>

      {/*Food Category Slider Section*/}
      <section>
        <Container className="section__container">
          <FoodCategorySlider />
        </Container>
      </section>

      {/*Feedback Section*/}
      <section>
        <Container className="section__container">
          <Feedback />
        </Container>
      </section>

      {/*About Us Section*/}
      <section className="section__container">
        <Container>
          <CompanyBackground />
        </Container>
      </section>

      {/* Our Partner Section */}
      <section className="section__container">
        <Container>
          <OurPartners />
        </Container>
      </section>
    </div>
  );
};

export default Home;
