import { writable, Writable } from "svelte/store";
import type { Subject } from "../model/subject";

export const subjects: Writable<Array<Subject>> = writable([]);