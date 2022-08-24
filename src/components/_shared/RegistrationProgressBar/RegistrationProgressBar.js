import React from "react";
import "./RegistrationProgressBar.scss";
const RegistrationProgressBar = ({ stepCount = 0 }) => {
  return (
    <div className="d-flex justify-content-center p-4">
      <div
        className={`progress-item rounded-circle ${
          stepCount >= 1 ? "progress-item--filled" : ""
        }`}
      >
        1
      </div>
      <div
        className={`progress-line ${
          stepCount >= 2 ? "progress-line--active" : ""
        }`}
      ></div>
      <div
        className={`progress-item rounded-circle ${
          stepCount >= 2 ? "progress-item--filled" : ""
        }`}
      >
        2
      </div>
      <div
        className={`progress-line ${
          stepCount >= 3 ? "progress-line--active" : ""
        }`}
      ></div>
      <div
        className={`progress-item rounded-circle ${
          stepCount >= 3 ? "progress-item--filled" : ""
        }`}
      >
        3
      </div>
    </div>
  );
};

export default RegistrationProgressBar;
