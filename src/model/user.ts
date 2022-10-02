import { Infer, string, object, array } from 'superstruct'
import { Note } from './note';

export const User = object({
    uid: string(),
    firstName: string(),
    lastName: string(),
});
export type User = Infer<typeof User>;

export const Organization = object({
    key: string(),
    name: string(),
    members: array(string()),
    admin: array(string()),
    notes: array(Note)
});
export type Organization = Infer<typeof Organization>;