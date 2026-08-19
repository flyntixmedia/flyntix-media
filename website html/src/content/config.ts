import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    cardTag: z.string().default('Review'),
    disclosure: z
      .string()
      .default(
        "Flyntix Media may earn a commission if you sign up for a tool through links in this article, at no extra cost to you. We only recommend tools we've personally tested and believe in."
      ),
    ctaText: z.string().optional(),
    ctaLink: z.string().optional(),
    ctaNote: z
      .string()
      .default('Affiliate link — we may earn a commission at no extra cost to you.'),
    faq: z
      .array(
        z.object({
          question: z.string(),
          answer: z.string(),
        })
      )
      .default([]),
    relatedSlug: z.string().optional(),
    relatedLabel: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
