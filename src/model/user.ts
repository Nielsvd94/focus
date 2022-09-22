import { Infer, string, object, array } from 'superstruct'

export const User = object({
    uid: string(),
    firstName: string(),
    lastName: string(),
});
export type User = Infer<typeof User>;

export const Organization = object({
    name: string(),
    members: array(string()),
    admin: array(string())
});
export type Organization = Infer<typeof Organization>;