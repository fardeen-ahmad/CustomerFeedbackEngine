import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ChatbotWidget from "@/components/chat/chatbot-widget";
import Sidebar from "@/components/navigation/sidebar";
import { Send } from "lucide-react";
import type { CreateFeedbackWithConversation } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

// Chatbot message types
type MessageType = "user" | "bot";

interface Message {
  id: string;
  type: MessageType;
  text: string;
  timestamp: Date;
  hasFeedback?: boolean;
  feedbackGiven?: boolean;
  feedbackIsPositive?: boolean;
}

export default function ChatDemo() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "bot",
      text: "Hello! How can I help you today?",
      timestamp: new Date(),
    }
  ]);
  
  const [inputValue, setInputValue] = useState("");

  // Create feedback mutation
  const feedbackMutation = useMutation({
    mutationFn: async (data: CreateFeedbackWithConversation) => {
      const response = await apiRequest("POST", "/api/feedback", data);
      return response.json();
    }
  });

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: "user",
      text: inputValue,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Create bot response (in a real app, this would call an API)
    const botResponses: Record<string, string> = {
      "password": "To reset your password, please follow these steps:\n1. Go to the login page\n2. Click on 'Forgot Password'\n3. Enter your email address\n4. Follow the instructions in the email you'll receive",
      "invoice": "Your invoices can be found in the Billing section under your account settings. They are also sent to your email.",
      "cancel": "You can cancel your subscription from your account settings page under 'Subscriptions'.",
      "payment": "We accept all major credit cards including Visa, Mastercard, American Express, and Discover. We also support PayPal.",
      "order": "To check your order status, please go to the Orders section in your account or use the tracking number that was emailed to you."
    };

    // Find a relevant response or use default
    let botResponseText = "I'm not sure I understand. Could you please rephrase your question?";
    for (const [keyword, response] of Object.entries(botResponses)) {
      if (inputValue.toLowerCase().includes(keyword)) {
        botResponseText = response;
        break;
      }
    }

    // Add bot message with delay to simulate thinking
    setTimeout(() => {
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        type: "bot",
        text: botResponseText,
        timestamp: new Date(),
        hasFeedback: true,
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleFeedback = async (messageId: string, isPositive: boolean) => {
    // Find the message and its context
    const botMessage = messages.find(m => m.id === messageId);
    if (!botMessage) return;
    
    // Find the user message that preceded this bot message
    const botMessageIndex = messages.findIndex(m => m.id === messageId);
    const userMessage = messages
      .slice(0, botMessageIndex)
      .reverse()
      .find(m => m.type === "user");
    
    if (!userMessage) return;
    
    // Update the message to show feedback was given
    setMessages(messages.map(m => 
      m.id === messageId 
        ? { ...m, feedbackGiven: true, feedbackIsPositive: isPositive }
        : m
    ));
    
    // Submit feedback to the API
    await feedbackMutation.mutateAsync({
      userQuestion: userMessage.text,
      botResponse: botMessage.text,
      isPositive,
    });
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto focus:outline-none">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">Chatbot Demo</h1>
            <p className="mt-2 text-gray-600">
              This is a demo of the chatbot with feedback collection. 
              Try asking about passwords, invoices, cancellation, payments, or orders.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto mt-8">
            <ChatbotWidget 
              messages={messages}
              onSendMessage={handleSendMessage}
              onFeedback={handleFeedback}
              inputValue={inputValue}
              setInputValue={setInputValue}
              onKeyPress={handleKeyPress}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
