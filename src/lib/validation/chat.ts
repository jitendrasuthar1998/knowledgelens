import { z } from "zod";

export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"], {
    message: "Role must be 'user' or 'assistant'",
  }),
  content: z
    .string()
    .trim()
    .min(1, "Message cannot be empty")
    .max(4000, "Message exceeds 4000 character limit"),
});

export const chatRequestSchema = z.object({
  messages: z
    .array(chatMessageSchema)
    .min(1, "At least one message is required")
    .max(20, "Conversation history limit exceeded (max 20 messages)"),
}).refine(
  (data) => {
    const lastMsg = data.messages[data.messages.length - 1];
    return lastMsg.role === "user";
  },
  {
    message: "The last message in the conversation must be from the user",
    path: ["messages"],
  }
);

export type ValidatedChatRequest = z.infer<typeof chatRequestSchema>;
