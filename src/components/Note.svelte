<script lang="ts">
    import type { Note } from '../model/note';
    import { database, databasePath } from '../stores/backend'
    import { get as getValue } from 'svelte/store';
    import { ref, remove } from 'firebase/database';
    import { currentUser } from '../stores/user';

    const db = getValue(database);

    export let note: Note;

    async function deleteNote() {
        await remove((ref(db, `${$databasePath}/users/${$currentUser.uid}/notes/${note.key}`)));
    }

</script>

<div class="single-note">
    <h3>{note.title}</h3>
    <p>{note.description}</p>
    <button on:click={deleteNote}>
        <svg width=12 height=12>
            <line id="top" x1=0 y1=0 x2=12 y2=12/>
            <line id="bot" x1=0 y1=12 x2=12 y2=0/>
        </svg>
    </button>
</div>

<style>

    button {
        z-index: 10;
        background-color: Transparent;
        background-repeat: no-repeat;
        border: none;
        cursor: pointer;
        overflow: hidden;
        outline: none;
    }

    svg line {
        stroke: black;
        stroke-width: 3;
    }

</style>