import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, User } from "lucide-react";

interface Message {
  id: string;
  type: "user" | "bot";
  text: string;
  timestamp: Date;
  hasFeedback?: boolean;
  feedbackGiven?: boolean;
  feedbackIsPositive?: boolean;
}

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };
  
  // Process newlines in text
  const formatMessage = (text: string) => {
    if (text.includes('\n')) {
      return text.split('\n').map((line, i) => (
        <p key={i}>{line}</p>
      ));
    }
    return text;
  };
  
  if (message.type === "user") {
    return (
      <div className="flex justify-end">
        <div className="bg-primary rounded-lg p-3 shadow max-w-xs">
          <div className="text-sm text-white whitespace-pre-wrap">
            {formatMessage(message.text)}
          </div>
          <div className="mt-2 flex space-x-2 justify-end text-xs">
            <span className="text-primary-200">{formatTime(message.timestamp)}</span>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex">
      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white mr-2 flex-shrink-0">
        <MessageCircle className="h-5 w-5" />
      </div>
      <div className="bg-white rounded-lg p-3 shadow max-w-xs">
        <div className="text-sm text-gray-800 whitespace-pre-wrap">
          {formatMessage(message.text)}
        </div>
        <div className="mt-2 flex space-x-2 justify-end text-xs">
          <span className="text-gray-400">{formatTime(message.timestamp)}</span>
        </div>
      </div>
    </div>
  );
}
