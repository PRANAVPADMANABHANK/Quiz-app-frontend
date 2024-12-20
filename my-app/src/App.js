import React, { useEffect, useState } from "react";
import Quiz from "./components/Quiz";
import "./styles.css";
import config from "../src/utils/config"; // Import the config file

function App() {
  const [quizData, setQuizData] = useState([]);

  // Fetch quiz data from the backend
  useEffect(() => {
    fetch(`${config.API_URL}/questions`)
      .then((res) => res.json())
      .then((data) => setQuizData(data))
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  return (
    <div className="App">
      <h1>Quiz Application UI</h1>
      {quizData.length > 0 ? (
        <Quiz questions={quizData} />
      ) : (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
}

export default App;
