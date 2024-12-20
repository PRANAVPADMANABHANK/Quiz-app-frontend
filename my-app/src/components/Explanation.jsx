import React from "react";

function Explanation({ explanation, isCorrect }) {
  return (
    <div className={`explanation ${isCorrect ? "correct" : "incorrect"}`}>
      <p>{isCorrect ? "Correct!" : "Incorrect!"}</p>
      <p>{explanation}</p>
    </div>
  );
}

export default Explanation;
