import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/navigation/sidebar";
import StatCard from "@/components/dashboard/stat-card";
import FeedbackChart from "@/components/dashboard/feedback-chart";
import TopicsChart from "@/components/dashboard/topics-chart";
import FeedbackTable from "@/components/dashboard/feedback-table";
import { MessageSquare, ThumbsUp, ThumbsDown, BarChart3 } from "lucide-react";
import type { FeedbackStats } from "@shared/schema";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery<FeedbackStats>({
    queryKey: ['/api/stats'],
  });

  return (
    <div className="flex-1 flex overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto focus:outline-none">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">Chatbot Feedback Dashboard</h1>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="py-4">
              {/* Dashboard Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statsLoading ? (
                  // Loading placeholders
                  <>
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="bg-white overflow-hidden shadow rounded-lg p-6">
                        <div className="animate-pulse flex space-x-4">
                          <div className="rounded-full bg-slate-200 h-10 w-10"></div>
                          <div className="flex-1 space-y-2 py-1">
                            <div className="h-2 bg-slate-200 rounded"></div>
                            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    <StatCard 
                      title="Total Conversations"
                      value={stats?.totalConversations.toString() ?? "0"}
                      icon={<MessageSquare className="h-6 w-6 text-primary" />}
                      bgColor="bg-primary-100"
                    />
                    
                    <StatCard 
                      title="Positive Feedback"
                      value={`${stats?.positiveCount ?? 0} (${stats?.positivePercentage ?? 0}%)`}
                      icon={<ThumbsUp className="h-6 w-6 text-green-600" />}
                      bgColor="bg-green-100"
                    />
                    
                    <StatCard 
                      title="Negative Feedback"
                      value={`${stats?.negativeCount ?? 0} (${stats?.negativePercentage ?? 0}%)`}
                      icon={<ThumbsDown className="h-6 w-6 text-red-600" />}
                      bgColor="bg-red-100"
                    />
                    
                    <StatCard 
                      title="Feedback Rate"
                      value={`${stats?.feedbackRate ?? 0}%`}
                      icon={<BarChart3 className="h-6 w-6 text-blue-600" />}
                      bgColor="bg-blue-100"
                    />
                  </>
                )}
              </div>

              {/* Chart Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
                <FeedbackChart />
                <TopicsChart />
              </div>

              {/* Recent Feedback Table */}
              <FeedbackTable />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
