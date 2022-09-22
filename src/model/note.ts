import { Infer, string, object, optional, date, array } from 'superstruct'

export const Note = object({
    key: string(),
    title: string(),
    description: optional(string()),
    themes: optional(array(string())),
    organizations: optional(array(string())),
    date: optional(string())
})
export type Note = Infer<typeof Note>;

export const Notes = array(object({
    name: string(),
    Note: object({
        title: string(),
        description: optional(string()),
        themes: optional(array(string())),
        organizations: optional(array(string())),
        date: optional(date())
    })
}));
export type Notes = Infer<typeof Notes>;
