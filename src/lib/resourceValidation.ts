import { z } from 'zod';

export const resourceUploadSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().min(10, 'Description is required'),
  course: z.string().min(2, 'Course is required'),
  topic: z.string().min(2, 'Topic is required'),
  institution: z.string().min(2, 'Institution is required'),
  level: z.string().min(1, 'Level is required'),
  type: z.enum(['lecture_notes', 'past_question', 'research_paper', 'project', 'slides', 'other']),
  tags: z.string().optional().default(''),
});

export type ResourceUploadValues = z.infer<typeof resourceUploadSchema>;
