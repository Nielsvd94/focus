import { Infer, string, object, optional, array } from 'superstruct'

export const Theme = object({
    key: string(),
    name: string(),
    description: string(),
    members: array(string()),
    admin: array(string())
});
export type Theme = Infer<typeof Theme>;

export const Themes = array(object({
    key: string(),
    name: string(),
    subject: object({
        title: string(),
        description: optional(string()),
        members: optional(array(string())),
        admin: array(string())
    })
}));
export type Themes = Infer<typeof Themes>;