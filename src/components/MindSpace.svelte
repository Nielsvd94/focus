<script lang="ts">
    // Overzicht van 1 onderwerp
    import type { Note as NoteType } from "../model/note";
    import { database, databasePath } from '../stores/backend';
    import { get, onValue, ref } from 'firebase/database';
    import AddNote from './AddNote.svelte';
    import type { Theme } from '../model/theme';
    import { get as getValue } from 'svelte/store';
    import AddButton from './AddButton.svelte';
    import { currentUser } from '../stores/user';
    import type { Organization } from '../model/user';
    import MindMap from './MindMap.svelte';
    import Kanban from './Kanban.svelte';
    import SubHeader from './SubHeader.svelte';

    // WAT MOET DE MINDSPACE DOEN:
        // V ophalen van organisaties
        // V ophalen van themas
        // V ophalen van notities
        // V tonen van de verschillende views
        // V togglen tussen de verschillende views
        // filteren van organisaties
        // V filteren van themas
        // V toevoegen van nieuwe notities
        // V notities meegeven aan de getoonde view

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

    /**
     * Notities krijgen een optioneel veld 'Parent'
     * De kinderen van notitie A zijn automatisch de notities die als parent notitie A hebben (veld 'children' is overbodig
     * 
     * filteren om themas
     */

     /**
      * SUB-HEADER component maken en toevoegen aan iedere view waarbij de elementen worden meegegeven die erin moeten worden getoond
      * kanban: swimlane toevoegen
      * mindmap: breadcrumb van hoever je bent doorgeklikt? clickable maken
      */

    let organizations: Organization[] = [];
    let personalNotes: NoteType[] = [];
    let organizationNotes: {organization: string, notes: NoteType[]}[] = [];
    let displayNotes: NoteType[] = [];
    let numberOfNotes: number = 0;
    let themes: Theme[] = [];
    let selectedTheme: Theme | null;
    const views = {
		'MindMap': MindMap,
        'Kanban': Kanban
	}
    let view: string = 'MindMap';

    let showPersonalNotes: boolean = true;
    let showNotesForOrganizations: Organization[] = [];

    const db = getValue(database);

    async function handleAddedOrDeletedNoteFromOrganization(event) {
        const organizationKey = event.detail.organizationKey;
        await getOrganizationNotes(organizationKey);
        await updateDisplayNotes();
    }

    async function getOrganizationNotes(organizationKey: string) {
        const data = await (await get(ref(db, `${$databasePath}/organizations/${organizationKey}/notes`))).val();
        const notes = updateData(data);
        updateOrganizationNotes(organizationKey, notes);
    }

    function updateOrganizationNotes(organizationKey: string, notes: any) {
        let allOrganizationNotes = [...organizationNotes];
        const indexOfOrganization = allOrganizationNotes.findIndex(notesForOrganization => notesForOrganization.organization === organizationKey);
        allOrganizationNotes[indexOfOrganization !== -1 ? indexOfOrganization : 0] = {organization: organizationKey, notes: notes};
        organizationNotes = allOrganizationNotes;
    } 

    onValue(ref(db, `${$databasePath}/users/${$currentUser.uid}/themes`), (snapshot) => {
        const data = snapshot.val();
        themes = updateData(data);
    });

    onValue(ref(db, `${$databasePath}/users/${$currentUser.uid}/notes`), (snapshot) => {
        const data = snapshot.val();
        personalNotes = updateData(data);
        if (displayNotes.length === 0) {
            displayNotes = updateData(data);
        }
        filterNotes(selectedTheme);
        numberOfNotes = displayNotes ? displayNotes.length : 0;
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

    function filterNotes(theme: Theme | null) {
        if (theme && displayNotes.length > 0) {
            displayNotes = displayNotes.filter(note => note.themes?.includes(theme.name));
        }
        else {
            updateDisplayNotes();
        }
    }

    async function updateDisplayNotes() {
        let totalNotes: any[] = [];
        if (showPersonalNotes && personalNotes && personalNotes.length > 0) {
            totalNotes.push(...personalNotes);
        }
        if (showNotesForOrganizations && showNotesForOrganizations.length > 0) {
            const notesForOrganization = await getNotesForOrganization();
            if (notesForOrganization && notesForOrganization.length > 0)
            totalNotes.push(...notesForOrganization);
        }
        displayNotes = totalNotes;
    }

    async function getNotesForOrganization() {
        for (const showNotesForOrganization of showNotesForOrganizations) {
            let notesForOrganization;
            notesForOrganization = organizationNotes.find(organization => organization.organization === showNotesForOrganization.key)?.notes;
            if (!notesForOrganization) {
                await getOrganizationNotes(showNotesForOrganization.key);
                notesForOrganization = organizationNotes.find(organization => organization.organization === showNotesForOrganization.key)?.notes;
            }
            if (notesForOrganization) {
                return notesForOrganization;
            }
        }
    }

</script>

<div>

    <SubHeader>
        <div class="subheader-dropdown">
            <button class="dropbtn">Switch view</button>
            <div class="dropdown-content">
                {#each Object.keys(views) as viewOption}
                    <!-- svelte-ignore a11y-invalid-attribute -->
                    <a href="#" on:click={() => view = viewOption}>{viewOption}</a>
                {/each}
            </div>
        </div>
        <div class="subheader-dropdown">
            <button class="dropbtn">Select theme</button>
            <div class="dropdown-content">
                {#if themes && themes.length > 0}
                    <!-- svelte-ignore a11y-invalid-attribute -->
                    <a href="#" on:click={() => { selectedTheme = null; filterNotes(null); }}>Show all</a>
                    {#each themes as theme}
                        <!-- svelte-ignore a11y-invalid-attribute -->
                        <a href="#" on:click={() => { selectedTheme = theme; filterNotes(selectedTheme); }}>{theme.name}</a>
                    {/each}
                {/if}
            </div>
        </div>
        <div class="subheader-dropdown">
            <button class="dropbtn">Show notes from organizations</button>
            <div class="dropdown-content">
                <label>
                    <input type="checkbox" bind:checked={showPersonalNotes} on:change={updateDisplayNotes} />
                    Personal notes
                </label>
                {#if organizations && organizations.length > 0}
                    {#each organizations as organization}
                        <!-- svelte-ignore a11y-invalid-attribute -->
                        <label>
                            <input type="checkbox" bind:group={showNotesForOrganizations} value={organization} on:change={updateDisplayNotes}/>
                            {organization.name}
                        </label>
                    {/each}
                {/if}
            </div>
        </div>
    </SubHeader>

    <AddButton>
        <AddNote on:addedNoteToOrganization={handleAddedOrDeletedNoteFromOrganization} themes={themes}></AddNote>
    </AddButton>

    <div class="note-view">
        {#if view === 'MindMap'}
            <MindMap on:deletedNoteFromOrganization={handleAddedOrDeletedNoteFromOrganization} theme={selectedTheme} notes={displayNotes} numberOfNotes={numberOfNotes}></MindMap>
        {:else if view === 'Kanban'}
            <Kanban notes={displayNotes}></Kanban>
        {/if}
    </div>
</div>

<!-- <svelte:component this={views[view]}></svelte:component> -->

<style>

    .dropbtn {
        background-color: white;
        color: black;
        padding: 3px 10px 3px;
        font-size: 16px;
        height: 30px;
        margin: 0px;
        border: none;
        border-left: 1px solid grey;
        border-right: 1px solid grey;
    }

    .subheader-dropdown:first-of-type {
        margin-left: 300px;
    }

    .subheader-dropdown {
        position: relative;
        display: inline-block;
    }

    .dropdown-content {
        display: none;
        position: absolute;
        background-color: lightgrey;
        min-width: 160px;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
        z-index: 10;
    }

    .dropdown-content a,
    .dropdown-content label {
        color: black;
        padding: 12px 10px;
        text-decoration: none;
        display: block;
    }
    
    .dropdown-content a:hover {background-color: lightgrey;}

    .subheader-dropdown:hover .dropdown-content {display: block;}

    .subheader-dropdown:hover .dropbtn {background-color: lightgrey;}

    .note-view {
        margin-top: 20px;
    }


</style>