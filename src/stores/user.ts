import { writable, Writable } from "svelte/store";
import type { Organization, User } from "../model/user";
import type { Notification } from "../model/notifications";

export const currentUser: Writable<User> = writable();

export const loggedIn: Writable<boolean> = writable();

export const organizations: Writable<Array<Organization>> = writable([]);

export const notifications: Writable<Array<Notification>> = writable([]);