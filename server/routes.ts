import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertFeedbackSchema, 
  createFeedbackWithConversationSchema,
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  const apiRouter = express.Router();
  
  // --------- Feedback Routes ---------
  
  // Get feedback with pagination and filtering
  apiRouter.get("/feedback", async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      let filterPositive: boolean | undefined = undefined;
      if (req.query.filter === "positive") {
        filterPositive = true;
      } else if (req.query.filter === "negative") {
        filterPositive = false;
      }
      
      const feedbackItems = await storage.getFeedbackWithConversations(page, limit, filterPositive);
      
      res.json({
        data: feedbackItems,
        page,
        limit,
        filter: req.query.filter || "all"
      });
    } catch (error) {
      console.error("Error fetching feedback:", error);
      res.status(500).json({ message: "Failed to fetch feedback" });
    }
  });
  
  // Get a single feedback with its conversation
  apiRouter.get("/feedback/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const feedbackItem = await storage.getFeedback(id);
      
      if (!feedbackItem) {
        return res.status(404).json({ message: "Feedback not found" });
      }
      
      const conversation = await storage.getConversation(feedbackItem.conversationId);
      
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      
      res.json({
        ...feedbackItem,
        conversation
      });
    } catch (error) {
      console.error("Error fetching feedback details:", error);
      res.status(500).json({ message: "Failed to fetch feedback details" });
    }
  });
  
  // Submit feedback for a conversation
  apiRouter.post("/feedback", async (req: Request, res: Response) => {
    try {
      const validatedData = createFeedbackWithConversationSchema.parse(req.body);
      
      const result = await storage.createFeedbackWithConversation(validatedData);
      
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid input data",
          errors: error.errors 
        });
      }
      
      console.error("Error creating feedback:", error);
      res.status(500).json({ message: "Failed to create feedback" });
    }
  });
  
  // --------- Dashboard Routes ---------
  
  // Get feedback stats for dashboard
  apiRouter.get("/stats", async (_req: Request, res: Response) => {
    try {
      const stats = await storage.getFeedbackStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });
  
  // Get feedback trend data for charts
  apiRouter.get("/trend", async (req: Request, res: Response) => {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const trend = await storage.getFeedbackTrend(days);
      res.json(trend);
    } catch (error) {
      console.error("Error fetching trend data:", error);
      res.status(500).json({ message: "Failed to fetch trend data" });
    }
  });
  
  // Get negative topics data for charts
  apiRouter.get("/topics", async (_req: Request, res: Response) => {
    try {
      const topics = await storage.getNegativeTopics();
      res.json(topics);
    } catch (error) {
      console.error("Error fetching topics data:", error);
      res.status(500).json({ message: "Failed to fetch topics data" });
    }
  });

  // Add api prefix to all routes
  app.use("/api", apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}
