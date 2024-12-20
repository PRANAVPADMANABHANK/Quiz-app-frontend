import React, { useState, useEffect } from "react";
import Options from "./Options";
import Explanation from "./Explanation";
import config from "../utils/config"; // Import the config file


function Question({ question }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [saving, setSaving] = useState(false); // To handle API call state

  const handleOptionClick = (index) => {
    setSelectedOption(index);
    setShowExplanation(false); // Reset explanation when a new option is selected
  };

  const toggleExplanation = async () => {
    if (!showExplanation) {
      // Log to check questionId
      // console.log("Sending questionId:", question._id);
  
      // Make API call to save the explanation view
      setSaving(true);
      try {
        const response = await fetch(`${config.API_URL}/saveExplanation`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            questionId: question._id,
            selectedOption,
            isCorrect: selectedOption === question.correctAnswer,
          }),
        });
  
        if (!response.ok) {
          throw new Error("Failed to save explanation data.");
        }
      } catch (error) {
        console.error("Error saving explanation data:", error);
      } finally {
        setSaving(false);
        setShowExplanation(true);
      }
    } else {
      setShowExplanation(false);
    }
  };
  

  // Reset state when the question changes
  useEffect(() => {
    setSelectedOption(null);
    setShowExplanation(false);
  }, [question]);

  return (
    <div className="question-container">
      <h3>{question.title}</h3>
      <Options
        options={question.options}
        selectedOption={selectedOption}
        onOptionClick={handleOptionClick}
        correctAnswer={question.correctAnswer}
        showExplanation={showExplanation}
      />
      {selectedOption !== null && (
        <button onClick={toggleExplanation} disabled={saving}>
          {showExplanation ? "Hide Explanation" : saving ? "Saving..." : "Show Explanation"}
        </button>
      )}
      {showExplanation && (
        <Explanation
          explanation={question.explanation}
          isCorrect={selectedOption === question.correctAnswer}
        />
      )}
      {selectedOption === question.correctAnswer && showExplanation && (
        <div className="correct-indicator" style={{ color: "green", marginTop: "10px" }}>
          Correct!
        </div>
      )}
    </div>
  );
}

export default Question;
