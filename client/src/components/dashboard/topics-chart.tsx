import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import type { TopicData } from "@shared/schema";

// Custom colors for the pie chart
const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

export default function TopicsChart() {
  const { data, isLoading } = useQuery<TopicData[]>({
    queryKey: ['/api/topics'],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Common Topics in Negative Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72 bg-gray-50 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-32 w-32 bg-slate-200 rounded-full mb-4"></div>
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
        <CardTitle>Common Topics in Negative Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}`, 'Count']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
