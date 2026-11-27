import { z } from 'zod';

export const resourceUploadSchema = z.object({
  title: z.string().trim().min(2, 'Name / title is required'),
  description: z.string().trim().max(5000, 'Description must be 5,000 characters or fewer').optional().default(''),
  course: z.string().trim().min(2, 'Course or subject is required'),
  topic: z.string().trim().max(200, 'Topic must be 200 characters or fewer').optional().default(''),
  institution: z.string().trim().min(2, 'Institution is required'),
  level: z.string().trim().min(1, 'Level is required'),
  type: z.enum(['lecture_notes', 'past_question', 'research_paper', 'project', 'slides', 'other']),
  license: z.enum(['', 'CC-BY-4.0', 'CC-BY-SA-4.0', 'CC0-1.0', 'ALL-RIGHTS-RESERVED']).optional().default(''),
  attribution: z.string().trim().max(300, 'Original author must be 300 characters or fewer').optional().default(''),
  rightsConfirmed: z.boolean().refine(value => value === true, 'You must confirm you have permission to share this material.'),
  tags: z.string().trim().max(500, 'Keywords must be 500 characters or fewer').optional().default(''),
  coAuthorHandles: z.string().max(1000, 'Co-author handles are too long').optional().default(''),
});
export type ResourceUploadValues = z.infer<typeof resourceUploadSchema>;
