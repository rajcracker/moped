"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Menu, Plus, Sun, Moon, X, MessageCircle, Mic } from "lucide-react";
import Image from "next/image";

export default function ChatGPT() {


  const startListening = async () => {
    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // Stop immediately after getting permission
  
      // Start speech recognition
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = "en-US";
      recognition.start();
  
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript); // Set recognized text as input
      };
  
      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
      };
    } catch (error) {
      console.error("Microphone permission denied or error:", error);
      alert("Please allow microphone access to use voice input.");
    }
  };

  

  const [chats, setChats] = useState([
    [{ text: "Hello! How can I assist you today?", sender: "bot" }]
  ]);
  const [currentChatIndex, setCurrentChatIndex] = useState(0);
  const [input, setInput] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats[currentChatIndex]]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const updatedChats = [...chats];
    updatedChats[currentChatIndex] = [
      ...updatedChats[currentChatIndex],
      { text: input, sender: "user" }
    ];
    setChats(updatedChats);
    setInput("");

    setTimeout(() => {
      updatedChats[currentChatIndex] = [
        ...updatedChats[currentChatIndex],
        { text: "This is a bot response.", sender: "bot" }
      ];
      setChats([...updatedChats]);
    }, 1000);
  };

  const addNewChat = () => {
    setChats([...chats, []]); // Add an empty chat
    setCurrentChatIndex(chats.length); // Switch to new chat
  };

  return (
    <div className={`flex h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      <div>
        {/* Button to toggle sidebar */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={` top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-full shadow-md fixed`}
        >
          {isOpen ? <X size={16} /> : <Menu size={16} />}
        </button>

        {/* Add New Chat Button */}
        <button
          onClick={addNewChat}
          className={`top-4 z-50 p-2 bg-gray-100 text-gray-800 rounded-full shadow-md fixed transition-all duration-300 ${
            isOpen ? "left-40" : "left-14"
          }`}
        >
          <MessageCircle size={16} />
        </button>

        {/* Sidebar */}
        <div
          className={`top-0 left-0 h-full text-black p-5 shadow-lg transition-transform duration-300 ${
            isOpen ? "w-64 translate-x-0" : "-translate-x-full left-0 fixed"
          }`}
        >
          <h3 className="mb-4 font-semibold mt-12">Chats</h3>
          {chats.map((chat, index) => (
            <button
              key={index}
              onClick={() => setCurrentChatIndex(index)}
              className={`block w-full text-left px-3 py-2 rounded-lg ${
                index === currentChatIndex ? `${darkMode ? "bg-gray-700" : "bg-gray-100"}` : `${darkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"}`
              } ${darkMode ? "text-white" : "text-black"}`}
            >
              Chat {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Section */}
      <div className={`flex flex-col flex-1`}>
        {/* Header */}
        <div className={`p-4 ${darkMode ? "bg-gray-800" : "bg-white"} flex items-center justify-between shadow-sm`}>
          <h2>
            <Image
              src="/logo.png"
              alt="Moped"
              width={132}
              height={32}
              className={`${isOpen ? "ml-0" : "ml-20"}`}
            />
          </h2>
          <button className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-12 space-y-4">
          {chats[currentChatIndex].map((msg, index) => (
            <div
              key={index}
              className={`max-w-xs px-4 py-2 rounded-lg shadow-md ${
                msg.sender === "user"
                  ? "bg-blue-500 self-end ml-auto"
                  : darkMode
                  ? "bg-gray-700 self-start"
                  : "bg-white self-start"
              }`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Box */}
        <div className={`p-4 ${darkMode ? "bg-gray-800" : "bg-gray-300"} flex items-center shadow-lg`}>
  <input
    type="text"
    value={input}
    onChange={(e) => setInput(e.target.value)}
    placeholder="Type a message..."
    className={`flex-1 p-3 rounded-full shadow-inner ${
      darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
    } outline-none`}
    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
  />
  
  {/* Microphone Button */}
  <button
    onClick={startListening}
    className="ml-2 p-3 bg-gray-500 text-white rounded-full hover:bg-red-600 shadow-md"
  >
   <Mic size={20} />
  </button>

  <button
    onClick={sendMessage}
    className="ml-2 p-3 bg-black text-white rounded-full hover:bg-gray-900 shadow-md"
  >
    <Send size={20} />
  </button>
</div>

      </div>
    </div>
  );
}
