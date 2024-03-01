import { useState } from "react";

const App = () => {
    const [question, setQuestion] = useState("");
    const [error, setError] = useState("");
    const [chatHistory, setChatHistory] = useState([]);

    const surpriseOptions = [
        "What is the weather in Norway?",
        "What is the capital of Australia?",
        "Who won the world cup in 2018?",
        "How tall is Mount Everest?",
        "Which planet is known as the 'Red Planet'?",
        "Who wrote the play 'Romeo and Juliet'?",
        "What is the largest mammal in the world?",
        "In what year did the Titanic sink?",
        "Which element has the chemical symbol 'H'?",
        "What is the currency of Japan?",
        "Who painted the 'Mona Lisa'?",
        "What is the longest river in Africa?",
        "Which famous scientist developed the theory of relativity?",
    ];

    const handleSurpriseClick = () =>
        setQuestion(
            surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)]
        );

    const getResponse = async () => {
        if (!question) {
            setError("Please ask a question!");
            return;
        }

        try {
            const options = {
                method: "POST",
                body: JSON.stringify({
                    history: chatHistory,
                    message: question,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            };

            const response = await fetch(
                "http://localhost:8000/gemini",
                options
            );
            const data = await response.text();
            console.log(data);
            setChatHistory((oldChatHistory) => [
                ...oldChatHistory,
                { role: "user", parts: question },
                { role: "model", parts: data },
            ]);
            setQuestion("");
        } catch (e) {
            console.error(e);
            setError(e.message);
        }
    };

    const clear = () => {
        setQuestion("");
        setError("");
        setChatHistory([]);
    };

    return (
        <div className="app">
            <p>
                What do you want to know?
                <button
                    className="surprise-btn"
                    onClick={handleSurpriseClick}
                    disabled={chatHistory.length > 0}
                >
                    Surprise Me
                </button>
            </p>
            <div className="input-container">
                <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="How many miles is 1km?"
                />
                {error ? (
                    <button onClick={clear}>Clear</button>
                ) : (
                    <button onClick={getResponse}>Ask me</button>
                )}
            </div>
            {error && <p>{error}</p>}
            {chatHistory.length > 0 && (
                <div className="search-result">
                    {chatHistory.map((item, index) => (
                        <div key={index}>
                            <p className="answer">
                                <strong>
                                    {item.role === "model" ? "Gemini" : "You"}
                                </strong>{" "}
                                : {item.parts}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default App;
