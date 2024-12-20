import React from "react";

function Options({
  options,
  selectedOption,
  onOptionClick,
  correctAnswer,
  showExplanation,
}) {
  return (
    <div className="options-container">
      {options.map((option, index) => {
        let className = "option";
        if (selectedOption === index) {
          className += showExplanation
            ? index === correctAnswer
              ? " correct"
              : " incorrect"
            : " selected";
        }
        return (
          <div
            key={index}
            className={className}
            onClick={() => onOptionClick(index)}
          >
            {option}
          </div>
        );
      })}
    </div>
  );
}

export default Options;
