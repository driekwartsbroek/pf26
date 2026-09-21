import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const month = z.string().regex(/^\d{4}-\d{2}$/, 'Use YYYY-MM');

// Pages CMS saves untouched fields as empty strings or nulls. Treat those as "not set".
const blank = <T extends z.ZodType>(schema: T) => z.preprocess((v) => (v === '' || v === null ? undefined : v), schema);

const companies = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/companies' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string(),
      start: month,
      end: blank(month.optional()),
      order: z.number(),
      accent: blank(z.string().default('#151515')),
      clients: blank(z.array(z.string()).default([])),
      // 'analysis' pages lead with a flow, sticky notes and methods instead of screens.
      kind: blank(z.enum(['design', 'analysis']).default('design')),
      // Current or confidential job: the page shows one large NDA panel instead of work.
      nda: blank(z.boolean().default(false)),
      flow: blank(
        z
          .object({
            title: blank(z.string().default('Where I sat')),
            steps: blank(z.array(z.object({ label: z.string(), you: blank(z.boolean().default(false)) })).default([])),
          })
          .optional(),
      ),
      did: blank(z.array(z.object({ title: z.string(), text: blank(z.string().optional()) })).default([])),
      methods: blank(z.array(z.string()).default([])),
      // Where the prototypes sit: above the tiles (default) or below them.
      prototypesPlacement: blank(z.enum(['top', 'bottom']).default('top')),
      // Live prototypes (Framer, Figma, ProtoPie...). Loaded on click, playable in place.
      prototypes: blank(
        z
        .array(
          z.object({
            title: z.string(),
            url: blank(z.url().optional()), // leave empty for a placeholder slot
            caption: blank(z.string().optional()),
            device: blank(z.enum(['desktop', 'mobile']).default('desktop')),
            poster: blank(image().optional()),
            embed: blank(z.boolean().default(true)),
            // Width the prototype was designed at. Desktop ones open in a large window at this width, scaled to fit.
            width: blank(z.number().default(1440)),
          }),
        )
        .default([]),
      ),
      shots: blank(
        z
        .array(
          z
            .object({
              // A tile is a screen (image), a link (link, optional image as cover), a pile of screens (stack) or a live Rive animation (rive).
              image: blank(image().optional()),
              link: blank(z.url().optional()),
              stack: blank(z.array(image()).optional()),
              rive: blank(z.string().optional()), // a Rive file in companies/rive, e.g. ./rive/penguin.riv
              stateMachine: blank(z.string().optional()), // optional; the file's first state machine runs by default
              caption: z.string(),
              title: blank(z.string().optional()), // link tiles: overrides the page's own title
              text: blank(z.string().optional()), // link tiles: overrides the page's own description
              span: blank(z.enum(['normal', 'wide', 'tall']).default('normal')),
              fit: blank(z.enum(['cover', 'contain']).default('cover')),
              redact: blank(z.boolean().default(false)),
            })
            .refine((s) => s.image || s.link || s.stack?.length || s.rive, 'Each shot needs an image, a link, a stack or a Rive file'),
        )
        .default([]),
      ),
    }),
});

export const collections = { companies };
