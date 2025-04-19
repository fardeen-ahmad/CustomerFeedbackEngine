import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { FeedbackTrend } from "@shared/schema";

export default function FeedbackChart() {
  const [days, setDays] = useState(30);
  
  const { data, isLoading } = useQuery<FeedbackTrend[]>({
    queryKey: ['/api/trend', days],
  });
  
  // Format the data for better display
  const chartData = data?.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  })) || [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Feedback Trend (Last {days} days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72 bg-gray-50 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="animate-pulse flex flex-col items-center">
                <div className="rounded-full bg-slate-200 h-10 w-10 mb-4"></div>
                <div className="h-2 bg-slate-200 rounded w-48 mb-4"></div>
                <div className="h-2 bg-slate-200 rounded w-64"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feedback Trend (Last {days} days)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="positive" 
                name="Positive" 
                stroke="#10B981" 
                activeDot={{ r: 8 }} 
              />
              <Line 
                type="monotone" 
                dataKey="negative" 
                name="Negative" 
                stroke="#EF4444" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
