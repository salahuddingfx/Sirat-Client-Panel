import { z } from "zod";

export const idSchema = z.string().min(1);

export const productVariantSchema = z.object({
  id: idSchema,
  label: z.string().min(1),
  priceDelta: z.number().default(0),
  stock: z.number().default(0)
});

export const productSchema = z.object({
  id: idSchema,
  name: z.string().min(1),
  slug: z.string().optional().nullable().default(""),
  description: z.string().default(""),
  price: z.number().default(0),
  oldPrice: z.number().optional().nullable(),
  costPrice: z.number().default(0),
  currency: z.string().default("BDT"),
  category: z.string().default("Uncategorized"),
  images: z.array(z.string()).default([]),
  image: z.string().optional().nullable(),
  rating: z.number().default(0),
  featured: z.boolean().default(false),
  variants: z.array(productVariantSchema).default([])
});

export const trackOrderSchema = z.object({
  orderId: idSchema,
  email: z.string().email().optional(),
  phone: z.string().optional()
});

export const contactFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10)
});

export const adminStatSchema = z.object({
  label: z.string(),
  value: z.string(),
  delta: z.string()
});

export const settingsSchema = z.object({
  phone: z.string().min(1),
  email: z.string().email(),
  address: z.string().min(1),
  facebook: z.string().url().or(z.literal("")),
  instagram: z.string().url().or(z.literal("")),
  whatsapp: z.string().url().or(z.literal("")),
  tagline: z.string().min(1),
  description: z.string().min(1),
  logo: z.string().optional().nullable().or(z.literal("")),
  bkashNumber: z.string().optional().nullable().or(z.literal("")),
  nagadNumber: z.string().optional().nullable().or(z.literal("")),
  rocketNumber: z.string().optional().nullable().or(z.literal("")),
  pinterest: z.string().optional().nullable().or(z.literal("")),
  youtube: z.string().optional().nullable().or(z.literal("")),
  tiktok: z.string().optional().nullable().or(z.literal("")),
  twitter: z.string().optional().nullable().or(z.literal(""))
});

export const categorySchema = z.object({
  id: idSchema,
  name: z.string().min(1),
  image: z.string().url(),
  featured: z.boolean().default(false)
});
