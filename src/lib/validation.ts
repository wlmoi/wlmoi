import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Please enter at least 2 characters.').max(120, 'Name is too long.'),
  email: z.string().trim().email('Enter a valid email address.').max(254, 'Email is too long.'),
  subject: z.string().trim().min(3, 'Please add a subject.').max(160, 'Subject is too long.'),
  category: z.enum(['Internship', 'Research collaboration', 'Engineering opportunity', 'General', 'Other']),
  message: z.string().trim().min(10, 'Please add a little more context.').max(4000, 'Message is too long.'),
  website: z.string().max(0).optional(),
})

export type ContactInput = z.infer<typeof contactSchema>

export function sanitizeText(value: string) {
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function buildMailto(input: Pick<ContactInput, 'name' | 'email' | 'subject' | 'category' | 'message'>) {
  const body = [
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Category: ${input.category}`,
    '',
    input.message,
  ].join('\n')

  return `mailto:willomooi@gmail.com?subject=${encodeURIComponent(input.subject)}&body=${encodeURIComponent(body)}`
}
