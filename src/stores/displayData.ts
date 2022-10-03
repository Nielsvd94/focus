import { writable, Writable } from "svelte/store";
import type { Note } from "../model/note";
import type { Notification } from "../model/notifications";

export const subjects: Writable<Array<Note>> = writable([]);

export const view: Writable<string> = writable('Notifications');

export const notifications: Writable<Array<Notification>> = writable([]);