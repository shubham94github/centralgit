import { P14 } from "@components/_shared/text";
import React from "react";
import { array, func } from "prop-types";
import "./StartupWarningModal.scss";
const StartupWarningModal = ({ toggleContactUsModal }) => (
  <div className="home-notification welcome">
    <h1>
      Welcome to <span>RetailHub</span> !
    </h1>
    <P14>
      Your Startup is now published and is visible to all Users. Soon you will
      receive messages and contact from Retailers that are looking for solutions
      / products / services that you offer.
      <br />
      <br />
      We trust that this will help you grow your business faster. For any
      questions, feel free to&nbsp;
      <span onClick={toggleContactUsModal} className="blue-link">
        Contact Us.
      </span>
    </P14>
  </div>
);

StartupWarningModal.propTypes = {
  toggleContactUsModal: func,
  feedbacks: array,
};

export default StartupWarningModal;
