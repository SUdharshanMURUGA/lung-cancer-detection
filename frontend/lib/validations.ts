import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name.").max(100),
  email: z.string().trim().email("Enter a valid email address."),
  message: z
    .string()
    .trim()
    .min(10, "Message should be at least 10 characters.")
    .max(2000, "Message is too long (max 2000 characters)."),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg"];

export const predictImageSchema = z
  .instanceof(File)
  .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
    message: "Only PNG or JPEG images are supported.",
  })
  .refine((file) => file.size <= MAX_UPLOAD_BYTES, {
    message: "Image must be 10MB or smaller.",
  });
