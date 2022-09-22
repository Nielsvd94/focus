<script lang="ts">
    // Overzicht van 1 onderwerp
    import Note from './Note.svelte';
    import type { Note as NoteType } from "../model/note";
    import { database, databasePath } from '../stores/backend';
    import { onValue, ref } from 'firebase/database';
    import AddNote from './AddNote.svelte';
    import type { Theme } from '../model/theme';
    import { get as getValue } from 'svelte/store';
    import AddButton from './AddButton.svelte';
    import { currentUser } from '../stores/user';
    import type { Organization } from '../model/user';

    // klikken op onderwerp = uitvouwen van de onderliggende onderwerpen (bovenliggende onderwerp wordt titel van de pagina, of breadcrumb?)

    let organizations: Organization[] = [];
    let notes: NoteType[] = [];
    let themes: Theme[] = [];

    const db = getValue(database);

    onValue(ref(db, `${$databasePath}/users/${$currentUser.uid}/organizations`), (snapshot) => {
        const data = snapshot.val();
        updateOrganizations(data);
    });

    async function updateOrganizations(data) {
        const newOrganizations: any[] = [];
        if (data) {
            for (const key of Object.keys(data)) {
                const newOrganization = data[key];
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