import React, { useEffect, useState } from "react";
import { FaSyncAlt } from "react-icons/fa"; // Import refresh icon
import Question from "./Question";
import config from "../utils/config"; // Import the config file

function Quiz() {
  const [currentCategory, setCurrentCategory] = useState("Mathematics");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(false); // Use loading state for fetch
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false); // Track if we are refreshing

  // Fetch quiz data from the backend
  const fetchQuizData = () => {
    setRefreshing(true); // Set refreshing to true when fetching
    fetch(`${config.API_URL}/questions`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch quiz data");
        }
        return res.json();
      })
      .then((data) => {
        setQuizData(data);
        setLoading(false);
        setRefreshing(false); // Reset refreshing when done
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    fetchQuizData();
  }, []); // Initial data fetch

  // Get unique categories from the fetched data
  const categories = [...new Set(quizData.map((q) => q.category))];

  // Filter questions based on the current category
  const filteredQuestions = quizData.filter(
    (q) => q.category === currentCategory
  );

  // Get the current question based on the index
  const currentQuestion =
    filteredQuestions.length > 0
      ? filteredQuestions[currentQuestionIndex - 1]
      : null;

  const goToNext = () => {
    if (currentQuestionIndex < filteredQuestions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setShowExplanation(false);
      setSelectedAnswer(null);
      setLoading(true); // Set loading true when navigating
      fetchQuizData(); // Fetch data in background
    }
  };

  const goToPrev = () => {
    if (currentQuestionIndex > 1) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setShowExplanation(false);
      setSelectedAnswer(null);
      setLoading(true); // Set loading true when navigating
      fetchQuizData(); // Fetch data in background
    }
  };

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index + 1);
    setShowExplanation(false);
    setSelectedAnswer(null);
    setLoading(true); // Set loading true when navigating
    fetchQuizData(); // Fetch data in background
  };

  const changeCategory = (category) => {
    setCurrentCategory(category);
    setCurrentQuestionIndex(1); // Reset to the first question in the new category
    setShowExplanation(false);
    setSelectedAnswer(null);
    setLoading(true); // Set loading true when changing category
    fetchQuizData(); // Fetch data in background
  };

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const toggleExplanation = () => {
    setShowExplanation((prev) => !prev);
  };

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="quiz-container">
      {/* Refresh Button */}
      {/* <button className="refresh-button" onClick={fetchQuizData}>
        <FaSyncAlt /> Refresh Quiz
      </button> */}

      <div className="header">
        <h2>{currentCategory}</h2>
        <div className="progress">
          Question {currentQuestionIndex}/{filteredQuestions.length}
          <a href="https://www.aifer.in" className="need-help">
            Need Help?
          </a>
        </div>
      </div>

      <div className="categories">
        {categories.map((category) => (
          <div
            key={category}
            className={`category ${currentCategory === category ? "active" : ""}`}
            onClick={() => changeCategory(category)}
          >
            <h4>{category}</h4>
            <div className="numbers">
              {quizData
                .filter((q) => q.category === category)
                .map((q, index) => (
                  <span
                    key={index}
                    className={`number ${
                      q.selectedOption !== null ? "marked" : ""
                    } ${
                      currentCategory === category &&
                      currentQuestionIndex === index + 1
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      currentCategory === category && goToQuestion(index)
                    }
                  >
                    {index + 1}
                  </span>
                ))}
            </div>
          </div>
        ))}
      </div>

      {currentQuestion ? (
        <>
          <Question
            question={currentQuestion}
            onAnswerSelect={handleAnswerSelect}
            selectedAnswer={selectedAnswer}
          />
          {selectedAnswer !== null && (
            <button onClick={toggleExplanation}>
              {showExplanation ? "Hide Explanation" : "Show Explanation"}
            </button>
          )}
          {showExplanation && (
            <div className="explanation">
              <p>{currentQuestion.explanation}</p>
            </div>
          )}
        </>
      ) : (
        <p>No questions available in this category.</p>
      )}

      <div className="navigation">
        <button onClick={goToPrev} disabled={currentQuestionIndex === 1}>
          Prev
        </button>
        <button
          onClick={goToNext}
          disabled={currentQuestionIndex === filteredQuestions.length}
        >
          Next
        </button>
      </div>

      {/* Loading spinner */}
      {refreshing && <div className="loading-spinner"></div>}
    </div>
  );
}

export default Quiz;
