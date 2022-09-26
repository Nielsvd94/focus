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
    import Kanban from './Kanban.svelte';

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
        'Kanban': Kanban
	}
    let view: string = 'Kanban';

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

    function logView() {
        console.log(view);
    }

</script>

<div>

    <div id="header">
        <div class="viewpicker">
            <button class="dropbtn">Switch view</button>
            <div class="dropdown-content">
                {#each Object.keys(views) as viewOption}
                    <!-- svelte-ignore a11y-invalid-attribute -->
                    <a href="#" on:click={() => view = viewOption}>{viewOption}</a>
                {/each}
            </div>
        </div>
    </div>

    <AddButton>
        <AddNote organizations={organizations} themes={themes}></AddNote>
    </AddButton>

    <div class="note-view">
        {#if view === 'MindMap'}
            <MindMap theme={selectedTheme} notes={notes} numberOfNotes={numberOfNotes}></MindMap>
        {:else if view === 'Kanban'}
            <Kanban notes={notes}></Kanban>
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

    .viewpicker {
        position: relative;
        display: inline-block;
        margin-left: 300px;
    }

    .dropdown-content {
        display: none;
        position: absolute;
        background-color: lightgrey;
        min-width: 160px;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
        z-index: 1;
    }

    .dropdown-content a {
        color: black;
        padding: 12px 10px;
        text-decoration: none;
        display: block;
    }

    .dropdown-content a:hover {background-color: lightgrey;}

    .viewpicker:hover .dropdown-content {display: block;}

    .viewpicker:hover .dropbtn {background-color: lightgrey;}

    .note-view {
        margin-top: 20px;
    }

    #header {
        grid-template-columns: 10% 60% 30%;
        background-color: white;
        color: black;
        margin: 0;
        padding: 0;
        height: 30px;
        border-bottom: 1px solid grey;
    }

</style>