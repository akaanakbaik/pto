import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSettingsSchema, insertFriendSchema, insertProjectSchema, insertSocialMediaSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Authentication endpoint
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }

      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // In a real app, you'd use proper session management here
      res.json({ 
        message: "Login successful", 
        user: { id: user.id, username: user.username } 
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Settings endpoints
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  app.put("/api/settings", async (req, res) => {
    try {
      const validatedData = insertSettingsSchema.parse(req.body);
      const settings = await storage.updateSettings(validatedData);
      res.json(settings);
    } catch (error) {
      res.status(400).json({ message: "Invalid settings data" });
    }
  });

  // Friends endpoints
  app.get("/api/friends", async (req, res) => {
    try {
      const friends = await storage.getFriends();
      res.json(friends);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch friends" });
    }
  });

  app.post("/api/friends", async (req, res) => {
    try {
      const validatedData = insertFriendSchema.parse(req.body);
      const friend = await storage.createFriend(validatedData);
      res.json(friend);
    } catch (error) {
      res.status(400).json({ message: "Invalid friend data" });
    }
  });

  app.put("/api/friends/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertFriendSchema.partial().parse(req.body);
      const friend = await storage.updateFriend(id, validatedData);
      
      if (!friend) {
        return res.status(404).json({ message: "Friend not found" });
      }
      
      res.json(friend);
    } catch (error) {
      res.status(400).json({ message: "Invalid friend data" });
    }
  });

  app.delete("/api/friends/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteFriend(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Friend not found" });
      }
      
      res.json({ message: "Friend deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete friend" });
    }
  });

  // Projects endpoints
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      res.json(project);
    } catch (error) {
      res.status(400).json({ message: "Invalid project data" });
    }
  });

  app.put("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(id, validatedData);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      res.status(400).json({ message: "Invalid project data" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteProject(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Social media endpoints
  app.get("/api/social-media", async (req, res) => {
    try {
      const socialMedia = await storage.getSocialMedia();
      res.json(socialMedia);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch social media" });
    }
  });

  app.post("/api/social-media", async (req, res) => {
    try {
      const validatedData = insertSocialMediaSchema.parse(req.body);
      const socialMedia = await storage.createSocialMedia(validatedData);
      res.json(socialMedia);
    } catch (error) {
      res.status(400).json({ message: "Invalid social media data" });
    }
  });

  app.put("/api/social-media/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertSocialMediaSchema.partial().parse(req.body);
      const socialMedia = await storage.updateSocialMedia(id, validatedData);
      
      if (!socialMedia) {
        return res.status(404).json({ message: "Social media not found" });
      }
      
      res.json(socialMedia);
    } catch (error) {
      res.status(400).json({ message: "Invalid social media data" });
    }
  });

  app.delete("/api/social-media/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteSocialMedia(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Social media not found" });
      }
      
      res.json({ message: "Social media deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete social media" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
