import { ref, set, get } from 'firebase/database';
import { database, databasePath } from '../stores/backend';
import { get as getValue } from 'svelte/store';

export async function kopieerDataNaarTestDatabase() {
    const prodData = (await get(ref(getValue(database), `/prod`))).val();
    console.log(prodData);
    await set(ref(getValue(database), '/test'), prodData);
};