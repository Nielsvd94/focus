import { writable, Writable } from "svelte/store";
import type { User } from "../model/user";

export const currentUser: Writable<User> = writable();

export const loggedIn: Writable<boolean> = writable();