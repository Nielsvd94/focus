import { Infer, string, object, optional, date, array } from 'superstruct'

export const User = object({
    uid: string(),
    firstName: string(),
    lastName: string(),
});
export type User = Infer<typeof User>;