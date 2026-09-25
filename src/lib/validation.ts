import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(160).transform((v) => v.toLowerCase()),
  password: z.string().min(8).max(72)
});

export const loginSchema = z.object({
  email: z.string().trim().email().transform((v) => v.toLowerCase()),
  password: z.string().min(8).max(72)
});

export const opportunitySchema = z.object({
  company: z.string().trim().min(2).max(120),
  role: z.string().trim().min(2).max(120),
  location: z.string().trim().max(120).optional().default(""),
  stage: z.enum(["saved", "applied", "screening", "interview", "offer", "rejected"]),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  salary: z.string().trim().max(80).optional().default(""),
  nextAction: z.string().trim().max(240).optional().default(""),
  followUpDate: z.string().trim().max(30).optional().default(""),
  notes: z.string().trim().max(2000).optional().default(""),
  jobUrl: z.string().trim().url().max(500).optional().or(z.literal("")).default("")
});

export type OpportunityInput = z.infer<typeof opportunitySchema>;