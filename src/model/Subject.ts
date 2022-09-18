import { Infer, string, object, optional, date, array } from 'superstruct'

export const Subject = object({
    title: string(),
    description: optional(string())
})
export type Subject = Infer<typeof Subject>;

export const Subjects = array(object({
    name: string(),
    subject: object({
        title: string(),
        description: optional(string())
    })
}));
export type Subjects = Infer<typeof Subjects>;

export const Event = object({
    title: string(),
    date: date(),
    description: optional(string())
})
export type Event = Infer<typeof Event>;

