import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { FeedbackWithConversation } from "@shared/schema";

// Helper to format dates
const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Truncate text that's too long
const truncateText = (text: string, maxLength: number = 80) => {
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

export default function FeedbackTable() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<string>("all");
  const { toast } = useToast();
  
  // Get paginated feedback
  const { data, isLoading } = useQuery<{ data: FeedbackWithConversation[], page: number, limit: number }>({
    queryKey: ['/api/feedback', page, filter],
  });

  // Handle export button click
  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your feedback data is being exported. This feature would download a CSV in a real implementation.",
    });
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="px-4 py-5 sm:px-6 flex justify-between flex-wrap sm:flex-nowrap">
        <CardTitle>Recent Feedback</CardTitle>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <div className="relative">
            <Select
              value={filter}
              onValueChange={(value) => {
                setFilter(value);
                setPage(1); // Reset to first page on filter change
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter Feedback" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Feedback</SelectItem>
                <SelectItem value="positive">Positive Only</SelectItem>
                <SelectItem value="negative">Negative Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleExport}>
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Question
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chatbot Response
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Feedback
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading state
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Skeleton className="h-4 w-48" />
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <Skeleton className="h-4 w-10" />
                    </TableCell>
                  </TableRow>
                ))
              ) : data?.data.length ? (
                data.data.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(item.createdAt)}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {truncateText(item.conversation.userQuestion)}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">
                      {truncateText(item.conversation.botResponse)}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      {item.isPositive ? (
                        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                          Positive
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
                          Negative
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Link href={`/feedback/${item.id}`}>
                        <a className="text-primary hover:text-primary-600 font-medium">View</a>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    No feedback data found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{data?.data.length ? (page - 1) * 10 + 1 : 0}</span> to <span className="font-medium">{data?.data.length ? (page - 1) * 10 + data.data.length : 0}</span> of <span className="font-medium">125</span> results
              </p>
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (page > 1) setPage(page - 1);
                    }}
                  />
                </PaginationItem>
                {[1, 2, 3, '...', 8, 9, 10].map((pageNum, i) => (
                  <PaginationItem key={i}>
                    {pageNum === '...' ? (
                      <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700">
                        ...
                      </span>
                    ) : (
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (typeof pageNum === 'number') {
                            setPage(pageNum);
                          }
                        }}
                        isActive={page === pageNum}
                      >
                        {pageNum}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(page + 1);
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
