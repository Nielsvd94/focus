<script lang="ts">
    // Overzicht van 1 onderwerp
    import Note from './Note.svelte';
    import type { Note as NoteType } from "../model/note";
    import { database, databasePath } from '../stores/backend';
    import { get, onValue, ref } from 'firebase/database';
    import AddNote from './AddNote.svelte';
    import type { Theme } from '../model/theme';
    import { get as getValue } from 'svelte/store';
    import AddButton from './AddButton.svelte';
    import { currentUser } from '../stores/user';
    import { Organization } from '../model/user';
    import { assert } from 'superstruct';

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
    let themes: Theme[] = [];

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
                assert(newOrganization, Organization);
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
        updateThemes(data);
    });

    async function updateThemes(data) {
        const newThemes: any[] = [];
        if (data) {
            for (const key of Object.keys(data)) {
                const newTheme = data[key];
                newTheme.key = key;
                newThemes.push(newTheme);
            }
            themes = newThemes;
        }
        else {
            themes = data;
        }
    }

    onValue(ref(db, `${$databasePath}/users/${$currentUser.uid}/notes`), (snapshot) => {
        const data = snapshot.val();
        updateNotes(data);
    });

    async function updateNotes(data: any) {
        const newNotes: any[] = [];
        if (data) {
            for (const key of Object.keys(data)) {
                const newNote = data[key];
                newNote.key = key;
                newNotes.push(newNote);
            }
            notes = newNotes;
        }
        else {
            notes = data;
        }
    }

</script>

<AddButton>
    <AddNote organizations={organizations} themes={themes}></AddNote>
</AddButton>

<div class="note-container">
    {#if notes}
        {#each notes as note}
            <div class="note">
                <Note note={note}></Note>
            </div>
        {/each}
    {:else}
        <h2>There are no notes for this theme yet</h2>
    {/if}
</div>

<style>

    .note, h2 {
        margin-left: 350px;
    }

</style>