import { Infer, string, object, optional, date } from 'superstruct'

export const Subject = object({
    title: string(),
    description: optional(string())
})
export type Subject = Infer<typeof Subject>;

export const Event = object({
    title: string(),
    date: date(),
    description: optional(string())
})
export type Event = Infer<typeof Event>;

