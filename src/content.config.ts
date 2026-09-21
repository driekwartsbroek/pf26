import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const month = z.string().regex(/^\d{4}-\d{2}$/, 'Use YYYY-MM');

const companies = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/companies' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string(),
      start: month,
      end: month.optional(),
      order: z.number(),
      accent: z.string().default('#151515'),
      clients: z.array(z.string()).default([]),
      // 'analysis' pages lead with a flow, sticky notes and methods instead of screens.
      kind: z.enum(['design', 'analysis']).default('design'),
      // Current or confidential job: the page shows one large NDA panel instead of work.
      nda: z.boolean().default(false),
      flow: z
        .object({
          title: z.string().default('Where I sat'),
          steps: z.array(z.object({ label: z.string(), you: z.boolean().default(false) })),
        })
        .optional(),
      did: z.array(z.object({ title: z.string(), text: z.string().optional() })).default([]),
      methods: z.array(z.string()).default([]),
      // Live prototypes (Framer, Figma, ProtoPie...). Loaded on click, playable in place.
      prototypes: z
        .array(
          z.object({
            title: z.string(),
            url: z.url().optional(), // leave empty for a placeholder slot
            caption: z.string().optional(),
            device: z.enum(['desktop', 'mobile']).default('desktop'),
            poster: image().optional(),
            embed: z.boolean().default(true),
            // Width the prototype was designed at. Desktop ones open in a large window at this width, scaled to fit.
            width: z.number().default(1440),
          }),
        )
        .default([]),
      shots: z
        .array(
          z
            .object({
              // A tile is a screen (image), a link (link, optional image as cover) or a pile of screens (stack).
              image: image().optional(),
              link: z.url().optional(),
              stack: z.array(image()).optional(),
              caption: z.string(),
              title: z.string().optional(), // link tiles: overrides the page's own title
              text: z.string().optional(), // link tiles: overrides the page's own description
              span: z.enum(['normal', 'wide', 'tall']).default('normal'),
              fit: z.enum(['cover', 'contain']).default('cover'),
              redact: z.boolean().default(false),
            })
            .refine((s) => s.image || s.link || s.stack?.length, 'Each shot needs an image, a link or a stack'),
        )
        .default([]),
    }),
});

export const collections = { companies };
