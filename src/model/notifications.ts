import { Infer, string, object } from 'superstruct'

export const Notification = object({
    key: string(),
    request: string(),
    sender: string(),
    details: object({
        organization: string(),
        organizationName: string()
    }),
});
export type Notification = Infer<typeof Notification>;