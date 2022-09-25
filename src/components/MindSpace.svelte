<script lang="ts">
    // Overzicht van 1 onderwerp
    import Note from './Note.svelte';
    import type { Note as NoteType } from "../model/note";
    import { database, databasePath } from '../stores/backend';
    import { get, onValue, ref, update } from 'firebase/database';
    import AddNote from './AddNote.svelte';
    import type { Theme } from '../model/theme';
    import { get as getValue } from 'svelte/store';
    import AddButton from './AddButton.svelte';
    import { currentUser } from '../stores/user';
    import type { Organization } from '../model/user';
    import MindMap from './MindMap.svelte';

    // ophalen van organisaties
    // ophalen van themas
    // ophalen van notities
    // tonen van de verschillende views
    // togglen tussen de verschillende views
    // filteren van organisaties
    // filteren van themas
    // toevoegen van nieuwe notities
    // notities meegeven aan de getoonde view

    /**
     * 
     * VIEWS
     *  MINDMAP
     *  TO DO - DOING - DONE
     *  KALENDER
     *  JSON WITHOUT THE SPECIAL CHARACTERS ( BASICALLY JUST CASCADING TABLES WITH ALL LAYERS OF A NOTE SHOWN UNDERNEATH EACHOTHER )
     * 
     *  DASHBOARD (ABLE TO CUSTOMIZE?)
     *  DEFAULT DASHBOARD:
     *      TOP LEFT INTERACTIVE MINDMAP
     *      TOP RIGHT CALENDAR (WITH DOTS ON DATES THAT HAVE NOTES AND HOVER OVER TO SEE THE NOTES)
     *      BOTTOM FULL WIDTH TO DO - DOING - DONE)
    */

    let organizations: Organization[] = [];
    let notes: NoteType[] = [];
    let numberOfNotes: number = 0;
    let themes: Theme[] = [];
    let selectedTheme: Theme;
    const views = {
		'MindMap': MindMap,
	}
    let view: string = '';

    const db = getValue(database);

    onValue(ref(db, `${$databasePath}/users/${$currentUser.uid}/organizations`), (snapshot) => {
        const data = snapshot.val();
        updateOrganizations(data);
    });

    async function getOrganization(key: string) {
        const organization = await (await get(ref(db, `${$databasePath}/organizations/${key}`))).val();
        return organization;
    }

    async function updateOrganizations(data) {
        const newOrganizations: any[] = [];
        if (data) {
            for (const key of Object.keys(data)) {
                const newOrganization = await getOrganization(key);
                newOrganization.key = key;
                newOrganizations.push(newOrganization);
            }
            organizations = newOrganizations;
        }
        else {
            organizations = data;
        }
    }

    onValue(ref(db, `${$databasePath}/users/${$currentUser.uid}/themes`), (snapshot) => {
        const data = snapshot.val();
        themes = updateData(data);
    });

    onValue(ref(db, `${$databasePath}/users/${$currentUser.uid}/notes`), (snapshot) => {
        const data = snapshot.val();
        notes = updateData(data);
        numberOfNotes = notes ? notes.length : 0;
    });

    function updateData(data: any) {
        const newData: any[] = [];
        if (data) {
            for (const key of Object.keys(data)) {
                const newEntry = data[key];
                newEntry.key = key;
                newData.push(newEntry);
            }
            return newData;
        }
        else {
            return data;
        }
    }

</script>

<div class="select-style">
    <select id="mounth" bind:value={view}>
        {#each Object.keys(views) as view}
            <option value={view}>{view}</option>
        {/each}
    </select>
</div>

<AddButton>
    <AddNote organizations={organizations} themes={themes}></AddNote>
</AddButton>

<MindMap theme={selectedTheme} notes={notes} numberOfNotes={numberOfNotes}></MindMap>

<!-- <svelte:component this={views[view]}></svelte:component> -->

<style>

.select-style {
    border: 1px solid #ccc;
    width: 120px;
    border-radius: 3px;
    overflow: hidden;
    background: #fafafa no-repeat 90% 50%;
}

.select-style select {
    padding: 5px 8px;
    width: 130%;
    border: none;
    box-shadow: none;
    background: transparent;
    background-image: none;
    -webkit-appearance: none;
}

.select-style select:focus {
    outline: none;
}

option {
    background-color: white;
}

</style>