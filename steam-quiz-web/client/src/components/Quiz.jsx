import { useContext } from "react";
import Question from "./Question";
import { QuizContext } from "../contexts/quiz";

const Quiz = () => {
  const [quizState, dispatch] = useContext(QuizContext);

  return (
    <div className="quiz bg-gray-100 text-white text-sm font-bold py-1 px-1 md:py-2 md:px-4 rounded w-full">
      {quizState.showResults && (
        <div className="results">
          <div className="congratulations">Congratulations!</div>
          <div className="results-info">
            <div>You have completed the quiz.</div>
            <div>
              You've got {quizState.correctAnswersCount} of &nbsp;
              {quizState.questions.length} right.
            </div>
          </div>
          <div
            onClick={() => dispatch({ type: "RESTART" })}
            className="next-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Restart
          </div>
        </div>
      )}
        {!quizState.showResults && (
          <div>
            <div className="score text-black">
              Question {quizState.currentQuestionIndex + 1}/
              {quizState.questions.length}
            </div>
            <Question />
            {quizState.currentAnswer && (
              <div
                onClick={() => dispatch({ type: "NEXT_QUESTION" })}
                className="next-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Next question
              </div>
            )}
          </div>
        )}
      </div>
  );
};

export default Quiz;