<script lang="ts">
    import { Database, ref, push } from "firebase/database";
    import type { Theme } from "../model/theme";
    import type { Organization } from "../model/user";
    import { database, databasePath } from "../stores/backend";
    import { currentUser } from '../stores/user';

    let db: Database;
    const unsubsribeFromDatabase = database.subscribe(value => {
        db = value;
    });

    export let organizations: Organization[] = [];
    export let themes: Theme[] = [];

    let note: {title: string, description: string, date?: string, organizations?: string[], themes?: string[]} = {
        title: '',
        description: ''
    }

    let selectedOrganizations = [];
    let selectedThemes = [];
    let date: string;

    let showOrganizationPicker: boolean = false;
    let showThemePicker: boolean = false;
    let showDatePicker: boolean = false;

    function constructNote() {
        if (selectedOrganizations.length > 0) {
            note.organizations = selectedOrganizations;
        }
        if (selectedThemes.length > 0) {
            note.themes = selectedThemes;
        }
        if (date) {
            note.date = date;
        }
        return note;
    }

    async function addNote() {
        const newNote = constructNote();
        await push(ref(db, `${$databasePath}/users/${$currentUser.uid}/notes`), newNote);
    };

    function addDateToNote() {
        note.date = date;
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
            {#if organizations.length > 0}
                {#each organizations as organization}
                    <label>
                        &nbsp;&nbsp;&nbsp;&nbsp;{organization.name}
                        <input class="checkbox" type="checkbox" bind:group={selectedOrganizations} value={organization.name} />
                    </label>
                {/each}
            {:else}
                <p>You're not part of any organizations</p>
            {/if}
        {/if}
    </div>
    <div>
        <label>
            Add note to theme
            <input class="checkbox" type="checkbox" bind:checked={showThemePicker} />
        </label>
        {#if showThemePicker}
            {#if themes.length > 0}
                {#each themes as theme}
                    <label>
                        &nbsp;&nbsp;&nbsp;&nbsp;{theme.name}
                        <input class="checkbox" type="checkbox" bind:group={selectedThemes} value={theme.name} />
                    </label>
                {/each}
            {:else}
                <p>You don't have any themes</p>
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
        /* width: min-content; */
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

</style>