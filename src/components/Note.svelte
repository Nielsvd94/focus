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
    <h3 class="note-title">{note.title}</h3>
    <p class="note-description">{note.description}</p>
    <button class="delete-note" on:click={deleteNote}>
        <svg width=12 height=12>
            <line id="top" x1=0 y1=0 x2=12 y2=12/>
            <line id="bot" x1=0 y1=12 x2=12 y2=0/>
        </svg>
    </button>
</div>

<style>

    .delete-note {
        z-index: 10;
        background-color: Transparent;
        background-repeat: no-repeat;
        border: none;
        cursor: pointer;
        overflow: hidden;
        outline: none;
        position: absolute;
        top: 0;
        right: 0;
        margin-right: -20px;
    }

    svg line {
        stroke: grey;
        opacity: 40%;
        stroke-width: 3;
    }

    .note-title {
        width: 150px;
        margin-left: 3px;
        margin-top: 0px;
        margin-bottom: 0px;
        overflow-wrap: break-word;
        word-break: break-word;
        white-space: pre-line;
        hyphens: auto;
    }

    .note-description {
        margin: 3px;
    }



</style>