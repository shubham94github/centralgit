import React from "react";
import "./RegistrationProgressBar.scss";
const RegistrationProgressBar = () => {
  return (
    <div className="d-flex justify-content-center p-4">
      <div className="progress-item rounded-circle">1</div>
      <div className="progress-line progress-line--active"></div>
      <div className="progress-item rounded-circle">2</div>
      <div className="progress-line"></div>
      <div className="progress-item rounded-circle">3</div>
    </div>
  );
};

export default RegistrationProgressBar;
