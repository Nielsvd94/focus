import { ref, set, Database, get, onValue } from 'firebase/database';
import { database } from '../stores/backend';
import { get as getValue } from 'svelte/store';


let databasePath: string;

// export async function kopieerDataNaarTestDatabase() {
//     const prodData = (await get(ref(db, 'prod'))).val();
//     console.log(prodData);
//     await set(ref(db, 'test'), prodData);
// };
