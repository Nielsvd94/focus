import { writable, Writable } from "svelte/store";
import type { Note } from "../model/note";

export const subjects: Writable<Array<Note>> = writable([]);

export const view: Writable<string> = writable('MindSpace');