import Answer from "./Answer";
import { useContext } from "react";
import { QuizContext } from "../contexts/quiz";

import { Socket } from "../util/socket";

const Question = () => {
  const [quizState, dispatch] = useContext(QuizContext);
  const currentQuestion = quizState.questions[quizState.currentQuestionIndex];

  function sendAnswer(answer) {
    Socket.emit("new_game");
    dispatch({ type: "SELECT_ANSWER", payload: answerText })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      <div className="answers p-6">
        {quizState.answers.map((answer, index) => (
          <Answer
            answerText={answer}
            currentAnswer={quizState.currentAnswer}
            correctAnswer={currentQuestion.correctAnswer}
            key={index}
            index={index}
            onSelectAnswer={(answerText) =>
              sendAnswer(answerText)
            }
          />
        ))}
      </div>

      <div className="question p-6 text-black">{currentQuestion.question}</div>
    </div>
  );
};

export default Question;