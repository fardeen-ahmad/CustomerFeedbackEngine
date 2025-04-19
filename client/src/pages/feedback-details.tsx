import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ThumbsUp, ThumbsDown, Calendar, User, Bot } from "lucide-react";
import { Link } from "wouter";
import Sidebar from "@/components/navigation/sidebar";
import type { FeedbackWithConversation } from "@shared/schema";

export default function FeedbackDetails() {
  const [match, params] = useRoute("/feedback/:id");
  const { toast } = useToast();
  
  const { data: feedback, isLoading } = useQuery<FeedbackWithConversation>({
    queryKey: ['/api/feedback', params?.id],
    enabled: !!params?.id,
  });
  
  if (!match) {
    return null;
  }
  
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto focus:outline-none">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="flex items-center mb-6">
              <Link href="/">
                <Button variant="outline" size="sm" className="mr-4">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-2xl font-semibold text-gray-900">Feedback Details</h1>
            </div>
            
            {isLoading ? (
              <div className="animate-pulse space-y-6">
                <div className="h-12 bg-slate-200 rounded w-1/4"></div>
                <div className="h-40 bg-slate-200 rounded"></div>
                <div className="h-40 bg-slate-200 rounded"></div>
              </div>
            ) : feedback ? (
              <div className="space-y-6">
                {/* Feedback Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      {feedback.isPositive ? (
                        <ThumbsUp className="h-5 w-5 text-green-600 mr-2" />
                      ) : (
                        <ThumbsDown className="h-5 w-5 text-red-600 mr-2" />
                      )}
                      {feedback.isPositive ? 'Positive' : 'Negative'} Feedback
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      Submitted on {formatDate(feedback.createdAt)}
                    </div>
                    
                    {feedback.additionalComment && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Additional Comment:</h3>
                        <p className="text-gray-900 bg-gray-50 p-4 rounded-md border">
                          {feedback.additionalComment}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Conversation */}
                <Card>
                  <CardHeader>
                    <CardTitle>Conversation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center mb-2">
                        <User className="h-4 w-4 mr-2 text-gray-600" />
                        <h3 className="text-sm font-medium text-gray-900">User Question</h3>
                      </div>
                      <p className="bg-gray-50 p-4 rounded-md border text-gray-900">
                        {feedback.conversation.userQuestion}
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <div className="flex items-center mb-2">
                        <Bot className="h-4 w-4 mr-2 text-gray-600" />
                        <h3 className="text-sm font-medium text-gray-900">Chatbot Response</h3>
                      </div>
                      <p className="bg-gray-50 p-4 rounded-md border text-gray-900">
                        {feedback.conversation.botResponse}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Actions */}
                <div className="flex space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      toast({
                        title: "Feature not implemented",
                        description: "This feature would allow categorizing this feedback",
                      });
                    }}
                  >
                    Categorize
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      toast({
                        title: "Feature not implemented",
                        description: "This feature would allow adding this Q&A to the FAQ",
                      });
                    }}
                  >
                    Add to FAQ
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      toast({
                        title: "Feature not implemented",
                        description: "This feature would allow flagging this feedback for review",
                      });
                    }}
                  >
                    Flag for Review
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center p-8 bg-white rounded-lg shadow">
                <p className="text-gray-500">Feedback not found</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
