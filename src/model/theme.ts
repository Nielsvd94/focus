import { Infer, string, object, optional, date, array } from 'superstruct'

export type Theme = {
    title: string,
    description?: string
}

export const Themes = array(object({
    name: string(),
    subject: object({
        title: string(),
        description: optional(string())
    })
}));
export type Themes = Infer<typeof Themes>;