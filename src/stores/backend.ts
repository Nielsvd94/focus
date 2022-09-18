import { Writable, writable } from "svelte/store";
import type { Database } from "firebase/database";
import type { FirebaseApp } from "firebase/app";

export const firebaseApp: Writable<FirebaseApp> = writable();

export const database: Writable<Database> = writable();

export const loggedIn: Writable<boolean> = writable();

export const databasePath: Writable<string> = writable(location.hostname === 'localhost' ? 'test' : 'prod');