import { useEffect, useState, useRef } from "react";
import router, { useRouter } from "next/router";
import { Configuration, OpenAIApi } from "openai";
import qs from "qs";
import { ChatBar } from "~/components/ChatBar";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import Link from "next/link";

interface Message {
  sender: string;
  text: string;
  timestamp: string;
}
interface ChatResponse {
  message?: string; // Assuming that the response has a message property
}

export default function Chat() {
  const [isMobile, setIsMobile] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasMounted, setHasMounted] = useState(false);

  // Welcome message
  useEffect(() => {
    if (hasMounted) {
      if (typeof window !== "undefined") {
        const storedMessage = localStorage.getItem("description") || ""; // provide a default value
        const sender = "VulnerabilityGPT";
        const text =
          "**Welcome to VulnerabilityGPT! I'll use the information below as context for our conversation. Ask me anything about vulnerabilities!!**\n\n" +
          storedMessage;
        const timestamp = new Date().toLocaleString();
        const message = { sender, text, timestamp };
        setMessages((oldMessages) => [...oldMessages, message]);
      }
    }
  }, [hasMounted]);

  const messagesEndRef = useRef(null);

  // Scroll to the last message every time messages are updated
  useEffect(() => {
    /*
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }*/
  }, [messages]);

  useEffect(() => {
    // Check if window is defined (it won't be in server-side rendering)
    if (typeof window !== "undefined") {
      setHasMounted(true);
      // Initial value, is it mobile or not?
      setIsMobile(window.innerWidth < 768);

      // Add resize listener
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
      };

      window.addEventListener("resize", handleResize);

      // Clean up the event listener on component unmount
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  const handleSend = async (text: string) => {
    const sender = "You";
    const timestamp = new Date().toLocaleString();
    const message = { sender, text, timestamp };
    setMessages((oldMessages) => [...oldMessages, message]);

    // Format messages for OpenAI API
    const openaiMessages = messages.map((msg) => ({
      role: msg.sender.toLowerCase() === "you" ? "user" : "assistant",
      content: msg.text,
    }));

    // Append new user message
    openaiMessages.push({ role: "user", content: text });

    // Send message to OpenAI API
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages: openaiMessages }),
    });

    if (!response.ok) {
      console.error("Chat API response was not ok");
      return;
    }

    const data = (await response.json()) as ChatResponse; // Assuming ChatResponse is defined

    const senderAI = "VulnerabilityGPT";
    const timestampAI = new Date().toLocaleString();

    const messageAI: Message = {
      sender: senderAI,
      text: data?.message ?? "",
      timestamp: timestampAI,
    };

    setMessages((oldMessages) => [...oldMessages, messageAI]);
  };

  return (
    <div className="mb-20 w-full">
      <nav className="ml-auto mr-auto flex max-w-[600px] justify-between bg-violet-800/10 p-6 pl-10 pr-10 text-white ">
        <Link href="#" onClick={() => router.back()} className="mr-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-8 w-8 transition-colors duration-200 ease-in-out hover:text-slate-100/80"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
        </Link>
        <Link href="/" className="mr-6 ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="14.1 2.59721 71.8 94.8"
            className="h-8 w-8 fill-current transition-colors duration-200 ease-in-out hover:text-slate-100/80"
          >
            <path d="M14.1,81.3V39.5c0-1.9,1.5-3.4,3.4-3.4h14.8c0.7,0,1.2,0.5,1.2,1.2s-0.5,1.2-1.2,1.2H17.5c-0.5,0-1,0.4-1,1v41.8  c0,0.5,0.4,1,1,1h64.9c0.5,0,1-0.4,1-1V39.5c0-0.5-0.4-1-1-1H67.7c-0.7,0-1.2-0.5-1.2-1.2s0.5-1.2,1.2-1.2h14.8  c1.9,0,3.4,1.5,3.4,3.4v41.8c0,1.9-1.5,3.4-3.4,3.4H51.2V95h13.6c0.7,0,1.2,0.5,1.2,1.2c0,0.7-0.5,1.2-1.2,1.2H35.2  c-0.7,0-1.2-0.5-1.2-1.2c0-0.7,0.5-1.2,1.2-1.2h13.6V84.7H17.5C15.7,84.7,14.1,83.2,14.1,81.3z M49.1,68.4c-0.2,0.2-0.4,0.5-0.4,0.9  c0,0.3,0.1,0.6,0.4,0.9c0.2,0.2,0.5,0.4,0.9,0.4c0.3,0,0.6-0.1,0.9-0.4c0.2-0.2,0.4-0.5,0.4-0.9c0-0.3-0.1-0.6-0.4-0.9  C50.4,67.9,49.6,67.9,49.1,68.4z M50,59.9c-0.7,0-1.2,0.5-1.2,1.2c0,0.7,0.5,1.2,1.2,1.2c0.7,0,1.2-0.5,1.2-1.2  C51.2,60.4,50.7,59.9,50,59.9z M50,19.4c-0.7,0-1.2,0.5-1.2,1.2c0,0.7,0.5,1.2,1.2,1.2c0.7,0,1.2-0.5,1.2-1.2  C51.2,20,50.7,19.4,50,19.4z M50,27.5c-0.7,0-1.2,0.5-1.2,1.2c0,0.7,0.5,1.2,1.2,1.2c0.7,0,1.2-0.5,1.2-1.2  C51.2,28.1,50.7,27.5,50,27.5z M50,51.8c-0.7,0-1.2,0.5-1.2,1.2c0,0.7,0.5,1.2,1.2,1.2c0.7,0,1.2-0.5,1.2-1.2  C51.2,52.4,50.7,51.8,50,51.8z M50,35.6c-0.7,0-1.2,0.5-1.2,1.2s0.5,1.2,1.2,1.2c0.7,0,1.2-0.5,1.2-1.2S50.7,35.6,50,35.6z M50,43.7  c-0.7,0-1.2,0.5-1.2,1.2c0,0.7,0.5,1.2,1.2,1.2c0.7,0,1.2-0.5,1.2-1.2C51.2,44.3,50.7,43.7,50,43.7z M75.8,14.5  c3.1,0,5.6,2.5,5.6,5.6c0,3.1-2.5,5.6-5.6,5.6c-2.7,0-4.9-1.9-5.5-4.4h-5.7c-2,0-3.7,1.7-3.7,3.7V59c0,0.7-0.5,1.2-1.2,1.2  c-0.7,0-1.2-0.5-1.2-1.2V25c0-3.4,2.8-6.2,6.2-6.2h5.7C70.9,16.3,73.2,14.5,75.8,14.5z M75.8,16.9c-1.7,0-3.2,1.4-3.2,3.2  c0,1.7,1.4,3.2,3.2,3.2c1.7,0,3.2-1.4,3.2-3.2C79,18.3,77.6,16.9,75.8,16.9z M18.6,20.1c0-3.1,2.5-5.6,5.6-5.6  c2.7,0,4.9,1.9,5.5,4.4h5.7c3.4,0,6.2,2.8,6.2,6.2V59c0,0.7-0.5,1.2-1.2,1.2s-1.2-0.5-1.2-1.2V25c0-2-1.7-3.7-3.7-3.7h-5.7  c-0.6,2.5-2.8,4.4-5.5,4.4C21.1,25.7,18.6,23.2,18.6,20.1z M21,20.1c0,1.7,1.4,3.2,3.2,3.2c1.7,0,3.2-1.4,3.2-3.2  c0-1.7-1.4-3.2-3.2-3.2C22.4,16.9,21,18.3,21,20.1z M55.6,8.2c0,3.1-2.5,5.6-5.6,5.6c-3.1,0-5.6-2.5-5.6-5.6s2.5-5.6,5.6-5.6  C53.1,2.5,55.6,5.1,55.6,8.2z M53.2,8.2C53.2,6.4,51.7,5,50,5c-1.7,0-3.2,1.4-3.2,3.2s1.4,3.2,3.2,3.2C51.7,11.3,53.2,9.9,53.2,8.2z" />
          </svg>
        </Link>
        <Link href="#" onClick={() => router.back()} className="mr-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-8 w-8 transition-colors duration-200 ease-in-out hover:text-slate-100/80"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>
        </Link>
      </nav>
      {messages.map((message, index) => (
        <div
          key={index}
          className={`mb-2 ${
            message.sender === "You" ? "bg-violet-800/10" : "bg-slate-300/10"
          } ml-auto mr-auto flex max-w-[600px] flex-col`}
        >
          <div className="ml-6 text-sm text-gray-400">
            {`${message.sender} - ${message.timestamp}`}
          </div>
          <div className="ml-6 rounded-lg p-2 text-white">
            <ReactMarkdown>{message.text}</ReactMarkdown>
          </div>
        </div>
      ))}

      <div ref={messagesEndRef} />
      <ChatBar
        onSend={(text) => {
          void handleSend(text);
        }}
      />
    </div>
  );
}
