import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  userQuestion: text("user_question").notNull(),
  botResponse: text("bot_response").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const feedback = pgTable("feedback", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull(),
  isPositive: boolean("is_positive").notNull(),
  additionalComment: text("additional_comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertConversationSchema = createInsertSchema(conversations).pick({
  userQuestion: true,
  botResponse: true,
});

export const insertFeedbackSchema = createInsertSchema(feedback).pick({
  conversationId: true,
  isPositive: true,
  additionalComment: true,
});

// Combined schema for creating feedback with conversation
export const createFeedbackWithConversationSchema = z.object({
  userQuestion: z.string(),
  botResponse: z.string(),
  isPositive: z.boolean(),
  additionalComment: z.string().optional(),
});

// Select types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;

export type Feedback = typeof feedback.$inferSelect;
export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;

export type FeedbackWithConversation = Feedback & {
  conversation: Conversation;
};

export type CreateFeedbackWithConversation = z.infer<typeof createFeedbackWithConversationSchema>;

// Statistics types
export type FeedbackStats = {
  totalConversations: number;
  positiveCount: number;
  negativeCount: number;
  positivePercentage: number;
  negativePercentage: number;
  feedbackRate: number;
};

export type FeedbackTrend = {
  date: string;
  positive: number;
  negative: number;
};

export type TopicData = {
  name: string;
  value: number;
};
