import { useState } from "react";
import { useRouter } from "next/router";
import qs from "qs";

interface ChatBarProps {
  onSend: (message: string) => void;
}

export const ChatBar = ({ onSend }: ChatBarProps) => {
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSend = () => {
    onSend(message);
    setMessage("");
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setMessage(value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  const enterChat = () => {
    const query = router.query as Record<string, string>;
    const queryString: string = qs.stringify(query);
    void router.push(`/chat#?${queryString}`);
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 transform bg-white/10">
      <div className="flex">
        <input
          type="text"
          placeholder="Vulnerability Chat"
          className="flex-grow rounded-md border border-slate-100/60 bg-white/10 p-2 pr-10 text-slate-100 backdrop-blur-md md:w-[600px]"
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onClick={enterChat}
        />
        <button
          type="button"
          className="absolute right-6 top-1/2 -translate-y-1/2 transform"
          title="Send message"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-6 w-6 text-slate-100"
            onClick={handleSend}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
