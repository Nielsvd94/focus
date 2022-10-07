<script lang="ts">
    import { Database, ref, push } from "firebase/database";
    import { createEventDispatcher } from "svelte";
    import type { Theme } from "../model/theme";
    import { database, databasePath } from "../stores/backend";
    import { currentUser, organizations } from '../stores/user';

    let db: Database;
    const unsubsribeFromDatabase = database.subscribe(value => {
        db = value;
    });

    export let themes: Theme[] = [];

    let note: { title: string, description: string, date?: string, organizations?: string[], themes?: string[], status?: 'todo' | 'doing' | 'done' | 'none' } = {
        title: '',
        description: ''
    }

    const dispatch = createEventDispatcher();

    let selectedOrganizations = [];
    let selectedThemes = [];
    let date: string;
    let status: 'todo' | 'doing' | 'done' | 'none';

    let showOrganizationPicker: boolean = false;
    let showThemePicker: boolean = false;
    let showDatePicker: boolean = false;
    let showStatusPicker: boolean = false;

    function constructNote() {
        delete note.date;
        delete note.organizations;
        delete note.themes;
        if (showOrganizationPicker && selectedOrganizations.length > 0 && showOrganizationPicker) {
            note.organizations = selectedOrganizations;
        }
        if (showThemePicker && selectedThemes.length > 0 && showThemePicker) {
            note.themes = selectedThemes;
        }
        if (date && showDatePicker) {
            note.date = date;
        }
        if (status && status !== 'none' && showStatusPicker) {
            note.status = status;
        }
        return note;
    }

    async function addNote() {
        const newNote = constructNote();
        if (newNote.organizations && newNote.organizations.length > 0) {
            for (const organization of newNote.organizations) {
                await push(ref(db, `${$databasePath}/organizations/${organization}/notes`), newNote);
                dispatch('addedNoteToOrganization', {
                    organizationKey: organization
                });
                console.log('added note to org');
            }
        }
        else {
            await push(ref(db, `${$databasePath}/users/${$currentUser.uid}/notes`), newNote);
        }
    };

    function addDateToNote() {
        note.date = date;
    }

    function addStatusToNote() {
        if (showStatusPicker) {
            if (status === 'none') {
            delete note.status;
            }
            else {
                note.status = status;
            }
        }
        else {
            delete note.status;
        }
    }

</script>

<div class="overlay">
    <h3>New note</h3>
    <div>
        <input type="text" bind:value={note.title} placeholder="Title">    
    </div>
    <div>
        <textarea type="text" bind:value={note.description} placeholder="Description" />
    </div>
    <div>
        <label>
            This note has a status
            <input class="checkbox" type="checkbox" bind:checked={showStatusPicker} on:change={addStatusToNote} />
        </label>
        {#if showStatusPicker}
            <select bind:value={status} on:change={addStatusToNote} placeholder="Status (optional)">
                <option value='todo'>To do</option>
                <option value='doing'>Doing</option>
                <option value='done'>Done</option>
                <option value='none'>None</option>
            </select>
        {/if}
    </div>
    <div>
        <label>
            This note has a date
            <input class="checkbox" type="checkbox" bind:checked={showDatePicker} />
        </label>
        {#if showDatePicker}
            <input type="date" bind:value={date} on:change={addDateToNote} placeholder="Date (optional)" /><br>
            <button class="clear-date" on:click={ () => { date=''; delete note.date; } }>Clear date</button>
        {/if}
    </div>
    <div>
        <label>
            Add note to organization
            <input class="checkbox" type="checkbox" bind:checked={showOrganizationPicker} />
        </label>
        {#if showOrganizationPicker}
            {#if $organizations && $organizations.length > 0}
                {#each $organizations as organization}
                    <label>
                        &nbsp;&nbsp;&nbsp;&nbsp;{organization.name}
                        <input class="checkbox" type="checkbox" bind:group={selectedOrganizations} value={organization.key} />
                    </label>
                {/each}
            {:else}
                <p class="no-data">You're not part of any organizations</p>
            {/if}
        {/if}
    </div>
    <div>
        <label>
            Add note to theme
            <input class="checkbox" type="checkbox" bind:checked={showThemePicker} />
        </label>
        {#if showThemePicker}
            {#if themes && themes.length > 0}
                {#each themes as theme}
                    <label>
                        &nbsp;&nbsp;&nbsp;&nbsp;{theme.name}
                        <input class="checkbox" type="checkbox" bind:group={selectedThemes} value={theme.name} />
                    </label>
                {/each}
            {:else}
                <p class="no-data">You don't have any themes</p>
            {/if}
        {/if}
    </div>
    <div>
        <button on:click={addNote}>Add</button>
    </div>
</div>

<style>


    button {
        z-index: 9;
        background-color: Transparent;
        background-repeat: no-repeat;
        border: none;
        cursor: pointer;
        overflow: hidden;
        outline: none;
    }

    .overlay {
        position: absolute;
        right: 0;
        padding: 10px;
        float: right;
        z-index: 9;
    }

    input {
        width: 200px;
    }

    textarea {
        width: 200px;
        height: 200px;
    }

    button {
        border: 1px;
        border-style: solid;
        border-color: black;
    }

    .checkbox {
        width: 15px;
    }

    .no-data {
        font-size: 8.5pt;
    }

</style>