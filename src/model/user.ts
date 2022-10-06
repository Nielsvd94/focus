import { Infer, string, object, array, optional, boolean, never } from 'superstruct'
import { Note } from './note';

export const User = object({
    uid: string(),
    firstName: string(),
    lastName: string(),
    email: string(),
});
export type User = Infer<typeof User>;

export const Organization = object({
    key: string(),
    name: string(),
    members: object({}),
    admin: object({}),
    notes: optional(array(Note))
});
export type Organization = Infer<typeof Organization>;