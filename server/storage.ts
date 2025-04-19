import { 
  users, conversations, feedback, 
  type User, type InsertUser,
  type Conversation, type InsertConversation,
  type Feedback, type InsertFeedback,
  type FeedbackWithConversation,
  type FeedbackStats,
  type FeedbackTrend,
  type TopicData,
  type CreateFeedbackWithConversation,
} from "@shared/schema";

// Storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Conversation methods
  getConversation(id: number): Promise<Conversation | undefined>;
  getAllConversations(): Promise<Conversation[]>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;

  // Feedback methods
  getFeedback(id: number): Promise<Feedback | undefined>;
  getAllFeedback(): Promise<Feedback[]>;
  createFeedback(feedback: InsertFeedback): Promise<Feedback>;
  
  // Combined operations
  createFeedbackWithConversation(data: CreateFeedbackWithConversation): Promise<FeedbackWithConversation>;
  
  // Feedback with conversation
  getFeedbackWithConversations(page?: number, limit?: number, filterPositive?: boolean): Promise<FeedbackWithConversation[]>;
  getFeedbackStats(): Promise<FeedbackStats>;
  getFeedbackTrend(days: number): Promise<FeedbackTrend[]>;
  getNegativeTopics(): Promise<TopicData[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private conversations: Map<number, Conversation>;
  private feedbacks: Map<number, Feedback>;
  private userCurrentId: number;
  private conversationCurrentId: number;
  private feedbackCurrentId: number;

  constructor() {
    this.users = new Map();
    this.conversations = new Map();
    this.feedbacks = new Map();
    this.userCurrentId = 1;
    this.conversationCurrentId = 1;
    this.feedbackCurrentId = 1;
    
    // Add some sample data for testing
    this.seedData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Conversation methods
  async getConversation(id: number): Promise<Conversation | undefined> {
    return this.conversations.get(id);
  }

  async getAllConversations(): Promise<Conversation[]> {
    return Array.from(this.conversations.values());
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const id = this.conversationCurrentId++;
    const conversation: Conversation = { 
      ...insertConversation, 
      id, 
      createdAt: new Date() 
    };
    
    this.conversations.set(id, conversation);
    return conversation;
  }

  // Feedback methods
  async getFeedback(id: number): Promise<Feedback | undefined> {
    return this.feedbacks.get(id);
  }

  async getAllFeedback(): Promise<Feedback[]> {
    return Array.from(this.feedbacks.values());
  }

  async createFeedback(insertFeedback: InsertFeedback): Promise<Feedback> {
    const id = this.feedbackCurrentId++;
    const feedback: Feedback = { 
      ...insertFeedback, 
      id,
      createdAt: new Date() 
    };
    
    this.feedbacks.set(id, feedback);
    return feedback;
  }

  // Combined operations
  async createFeedbackWithConversation(data: CreateFeedbackWithConversation): Promise<FeedbackWithConversation> {
    const conversation = await this.createConversation({
      userQuestion: data.userQuestion,
      botResponse: data.botResponse
    });

    const feedbackEntity = await this.createFeedback({
      conversationId: conversation.id,
      isPositive: data.isPositive,
      additionalComment: data.additionalComment
    });

    return {
      ...feedbackEntity,
      conversation
    };
  }

  // Feedback with conversation
  async getFeedbackWithConversations(page: number = 1, limit: number = 10, filterPositive?: boolean): Promise<FeedbackWithConversation[]> {
    const allFeedback = Array.from(this.feedbacks.values());
    
    let filteredFeedback = allFeedback;
    if (filterPositive !== undefined) {
      filteredFeedback = allFeedback.filter(f => f.isPositive === filterPositive);
    }
    
    // Sort by date (newest first)
    filteredFeedback = filteredFeedback.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    // Paginate
    const startIndex = (page - 1) * limit;
    const paginatedFeedback = filteredFeedback.slice(startIndex, startIndex + limit);
    
    // Join with conversations
    return paginatedFeedback.map(f => {
      const conversation = this.conversations.get(f.conversationId);
      if (!conversation) {
        throw new Error(`Conversation with id ${f.conversationId} not found`);
      }
      
      return {
        ...f,
        conversation
      };
    });
  }

  async getFeedbackStats(): Promise<FeedbackStats> {
    const allFeedback = Array.from(this.feedbacks.values());
    const totalConversations = this.conversations.size;
    const totalFeedbacks = allFeedback.length;
    
    const positiveCount = allFeedback.filter(f => f.isPositive).length;
    const negativeCount = totalFeedbacks - positiveCount;
    
    const positivePercentage = totalFeedbacks > 0 
      ? Math.round((positiveCount / totalFeedbacks) * 100) 
      : 0;
      
    const negativePercentage = totalFeedbacks > 0 
      ? Math.round((negativeCount / totalFeedbacks) * 100) 
      : 0;
      
    const feedbackRate = totalConversations > 0 
      ? Math.round((totalFeedbacks / totalConversations) * 100) 
      : 0;
    
    return {
      totalConversations,
      positiveCount,
      negativeCount,
      positivePercentage,
      negativePercentage,
      feedbackRate
    };
  }

  async getFeedbackTrend(days: number = 30): Promise<FeedbackTrend[]> {
    const allFeedback = Array.from(this.feedbacks.values());
    const result: Map<string, { positive: number, negative: number }> = new Map();
    
    // Initialize dates for the last n days
    const today = new Date();
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      result.set(dateString, { positive: 0, negative: 0 });
    }
    
    // Fill in the feedback data
    allFeedback.forEach(f => {
      const dateString = new Date(f.createdAt).toISOString().split('T')[0];
      
      // Skip if date is older than our range
      const dateObj = new Date(dateString);
      const daysDiff = Math.floor((today.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff > days) return;
      
      const existingData = result.get(dateString) || { positive: 0, negative: 0 };
      
      if (f.isPositive) {
        existingData.positive += 1;
      } else {
        existingData.negative += 1;
      }
      
      result.set(dateString, existingData);
    });
    
    // Convert to array and sort by date
    return Array.from(result.entries())
      .map(([date, data]) => ({
        date,
        positive: data.positive,
        negative: data.negative
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  async getNegativeTopics(): Promise<TopicData[]> {
    // Mock topics for negative feedback
    // In a real implementation, this would use NLP or categorization
    return [
      { name: "Incomplete Information", value: 35 },
      { name: "Wrong Information", value: 25 },
      { name: "Confusing Response", value: 20 },
      { name: "Technical Issue", value: 15 },
      { name: "Other", value: 5 }
    ];
  }

  // Seed with some demonstration data
  private seedData() {
    // Sample questions and responses
    const sampleData = [
      {
        question: "How do I reset my password?",
        response: "To reset your password, go to the login page and click on 'Forgot Password'. You will receive an email with instructions.",
        isPositive: true
      },
      {
        question: "Where can I find my invoice?",
        response: "Your invoices can be found in the Billing section under your account settings. They are also sent to your email.",
        isPositive: true
      },
      {
        question: "How do I cancel my subscription?",
        response: "You can cancel your subscription from your account settings page under 'Subscriptions'.",
        isPositive: false
      },
      {
        question: "What payment methods do you accept?",
        response: "We accept all major credit cards including Visa, Mastercard, American Express, and Discover. We also support PayPal.",
        isPositive: true
      },
      {
        question: "Where is my order?",
        response: "To check your order status, please go to the Orders section in your account or use the tracking number that was emailed to you.",
        isPositive: false
      }
    ];

    // Create some data from the past 30 days
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      // Create more entries for recent days, fewer for older days
      const entriesForDay = Math.max(1, Math.floor(10 * Math.exp(-i / 15)));
      
      for (let j = 0; j < entriesForDay; j++) {
        const randomIndex = Math.floor(Math.random() * sampleData.length);
        const { question, response, isPositive } = sampleData[randomIndex];
        
        // Create entries with timestamps on this day
        const hours = Math.floor(Math.random() * 24);
        const minutes = Math.floor(Math.random() * 60);
        date.setHours(hours, minutes, 0, 0);
        
        // Create conversation
        const conversationId = this.conversationCurrentId++;
        const conversation: Conversation = {
          id: conversationId,
          userQuestion: question,
          botResponse: response,
          createdAt: new Date(date)
        };
        this.conversations.set(conversationId, conversation);
        
        // Create feedback
        // Not all conversations will have feedback (about 80% do)
        if (Math.random() < 0.8) {
          const feedbackId = this.feedbackCurrentId++;
          const feedback: Feedback = {
            id: feedbackId,
            conversationId,
            isPositive,
            additionalComment: undefined,
            createdAt: new Date(date)
          };
          this.feedbacks.set(feedbackId, feedback);
        }
      }
    }
  }
}

export const storage = new MemStorage();
