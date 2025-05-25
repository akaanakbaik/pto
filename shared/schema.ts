import { pgTable, text, serial, integer, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  profileImageUrl: text("profile_image_url").notNull(),
  profileName: text("profile_name").notNull(),
  profileAge: integer("profile_age").notNull(),
  whatsappUrl: text("whatsapp_url").notNull(),
  backgroundAudioUrl: text("background_audio_url"),
  statusTexts: json("status_texts").notNull().$type<{id: string[], en: string[]}>(),
});

export const friends = pgTable("friends", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  order: integer("order").notNull().default(0),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  projectUrl: text("project_url").notNull(),
  order: integer("order").notNull().default(0),
});

export const socialMedia = pgTable("social_media", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  username: text("username").notNull(),
  url: text("url").notNull(),
  iconClass: text("icon_class").notNull(),
  order: integer("order").notNull().default(0),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertSettingsSchema = createInsertSchema(settings).omit({
  id: true,
});

export const insertFriendSchema = createInsertSchema(friends).omit({
  id: true,
  order: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  order: true,
});

export const insertSocialMediaSchema = createInsertSchema(socialMedia).omit({
  id: true,
  order: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Settings = typeof settings.$inferSelect;
export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type Friend = typeof friends.$inferSelect;
export type InsertFriend = z.infer<typeof insertFriendSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type SocialMedia = typeof socialMedia.$inferSelect;
export type InsertSocialMedia = z.infer<typeof insertSocialMediaSchema>;
