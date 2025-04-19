import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FeedbackButtonsProps {
  messageId: string;
  onFeedback: (messageId: string, isPositive: boolean) => void;
}

export default function FeedbackButtons({ messageId, onFeedback }: FeedbackButtonsProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-500 mb-1">Was this response helpful?</p>
      <div className="flex space-x-2">
        <Button
          variant="default"
          size="sm"
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={() => onFeedback(messageId, true)}
        >
          <ThumbsUp className="h-4 w-4 mr-1" />
          Yes
        </Button>
        <Button
          variant="default"
          size="sm"
          className="bg-red-600 hover:bg-red-700 text-white"
          onClick={() => onFeedback(messageId, false)}
        >
          <ThumbsDown className="h-4 w-4 mr-1" />
          No
        </Button>
      </div>
    </div>
  );
}
