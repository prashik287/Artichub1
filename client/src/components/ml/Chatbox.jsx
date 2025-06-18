import React, { useState, useEffect, useRef } from "react";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: `👋 Welcome to Artichub!
Artichub is a platform that connects artists, creators, and art lovers. 🎨
Here’s what you can do:
✅ Showcase your artwork.
✅ Collaborate with other creators.
✅ Monetize your work.
✅ Sell digital or physical art.
💡 Ask about platform features, FAQs, or any specific page!`,
    },
  ]);

  const [input, setInput] = useState("");
  const API_KEY = "AIzaSyB602Nh4rRX9R_g-is2-gHY2pSbnCvUdnA"; // 🔥 Add your API key here - REMEMBER TO REPLACE
  const chatBoxRef = useRef(null);
  const [history, setHistory] = useState([]);

  // Artichub Detailed Overview for Gemini API
  const artichubDetails = `
Artichub is an innovative platform designed to empower artists and creators by offering a marketplace and a collaborative ecosystem. 
✅ Features:
1. Showcase Artwork: Artists can upload and showcase their digital and physical art to a global audience.
2. Monetization: Users can monetize their content through direct sales, subscriptions, and NFT integration.
3. Collaboration: Creators can collaborate with other artists and engage with art enthusiasts.
4. Custom Pages: Artists can create personalized pages to exhibit their portfolios.
5. Educational Hub: Artichub also offers resources and workshops to help artists enhance their skills.
💡 FAQs:
- How do I sell artwork?
- Can I collaborate with other creators?
- How does the NFT integration work?
- How to withdraw funds from Artichub?
- What are the platform fees?

Provide detailed responses to these queries or direct users to the relevant pages if needed.
`;

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage = { sender: "user", text: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

    // Create the updated history *including* the current user message
    const updatedHistory = [
      ...history,
      { role: "user", parts: [{ text: input }] },
    ];

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are an AI assistant for Artichub.
                    Provide detailed responses to any questions related to Artichub.
                    Here is the platform's complete overview: ${artichubDetails}

                    Previous conversation:
                    ${updatedHistory
                      .map((msg) =>
                        msg.role === "user"
                          ? `User: ${msg.parts[0].text}`
                          : `Bot: ${msg.parts[0].text}`
                      )
                      .join("\n")}

                    User: ${input}`, // <<-- IMPORTANT: Include current user input here
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
                const errorData = await response.json();
                console.error("❌ Gemini API Error:", errorData);
                setMessages((prev) => [
                    ...prev,
                    { sender: "bot", text: `⚠️ Gemini API Error: ${errorData?.error?.message || "Unknown error"}` },
                ]);
                setInput(""); // Clear input
                return; // Exit to prevent further processing
            }

      const data = await response.json();
      const reply =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "⚠️ Oops! No response from Gemini API.";

      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);

      // Update history to maintain context *after* receiving the bot's reply
      const newBotHistory = { role: "model", parts: [{ text: reply }] };
      setHistory([...updatedHistory, newBotHistory]); // Update with *updatedHistory*

    } catch (error) {
      console.error("❌ Error fetching Gemini API:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Failed to connect to Gemini API." },
      ]);
    }

    setInput("");
  };

  return (
    <div className="w-[400px] h-[500px] mx-auto border border-gray-300 rounded-lg shadow-lg bg-white overflow-hidden">
      {/* Header */}
      <div className="bg-green-600 text-white text-center py-3 font-bold text-lg">
        🎨 Artichub Chatbot
      </div>

      {/* Chat Area */}
      <div
        ref={chatBoxRef}
        className="h-[370px] overflow-y-auto w-[90%] mx-auto p-4 bg-gray-100"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`my-2 p-2 max-w-[70%] rounded-lg ${
              msg.sender === "user"
                ? "ml-auto bg-green-500 text-white text-right"
                : "mr-auto bg-gray-200 text-black text-left"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="flex flex-wrap text-black mt-[-10%] ">
      <div className="flex text-black p-3 border-t border-gray-300">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about Artichub, features, or FAQs..."
          className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />
 
      </div>
      <div className=" ml-2 p-4 bg-green-500 text-center rounded-lg">
      <button
          onClick={sendMessage}
          className="bg-green-500 text-white px-4 py-2 rounded-r-lg hover:bg-green-600 transition"
        >
          Send
        </button>
      </div>
      </div>
    </div>
  );
};

export default Chatbot;