import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { X, Send } from "lucide-react";
import ChatMessage from "./chat-message";
import FeedbackButtons from "./feedback-buttons";

// Message type
interface Message {
  id: string;
  type: "user" | "bot";
  text: string;
  timestamp: Date;
  hasFeedback?: boolean;
  feedbackGiven?: boolean;
  feedbackIsPositive?: boolean;
}

interface ChatbotWidgetProps {
  messages: Message[];
  onSendMessage: () => void;
  onFeedback: (messageId: string, isPositive: boolean) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export default function ChatbotWidget({
  messages,
  onSendMessage,
  onFeedback,
  inputValue,
  setInputValue,
  onKeyPress
}: ChatbotWidgetProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  
  return (
    <Card className="w-full rounded-lg shadow-lg overflow-hidden flex flex-col" style={{ height: "600px", maxHeight: "80vh" }}>
      <CardHeader className="bg-primary px-4 py-3 flex justify-between items-center">
        <h3 className="text-white font-medium">Customer Support</h3>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" className="text-white opacity-75 hover:opacity-100">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-4 overflow-y-auto bg-gray-50">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id}>
              <ChatMessage message={message} />
              
              {message.hasFeedback && !message.feedbackGiven && (
                <div className="ml-10 mt-2">
                  <FeedbackButtons 
                    messageId={message.id}
                    onFeedback={onFeedback}
                  />
                </div>
              )}
              
              {message.feedbackGiven && (
                <div className="ml-10 mt-2 text-sm text-gray-500">
                  Thank you for your feedback!
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      
      <CardFooter className="border-t p-4 bg-white">
        <div className="flex items-center w-full">
          <Input
            type="text"
            placeholder="Type your message..."
            className="flex-1 border rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={onKeyPress}
          />
          <Button 
            className="bg-primary text-white rounded-r-md"
            onClick={onSendMessage}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
