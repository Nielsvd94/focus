<script lang="ts">
    import type { Note } from '../model/note';
    import { database, databasePath } from '../stores/backend'
    import { get as getValue } from 'svelte/store';
    import { ref, remove } from 'firebase/database';
    import { currentUser } from '../stores/user';

    const db = getValue(database);

    export let note: Note;
    export let showNoteData: string[] = [];

    async function deleteNote() {
        await remove((ref(db, `${$databasePath}/users/${$currentUser.uid}/notes/${note.key}`)));
    }

</script>

<div class="single-note">
    {#if showNoteData.includes('title')}
        <h3 class="note-title">{note.title}</h3>
    {/if}
    {#if showNoteData.includes('description')}
        <p class="note-description">{note.description}</p>
    {/if}
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
        left: 0;
        margin-left: -20px;
        margin-top: -2px;
        opacity: 0%;
    }

    .single-note:hover .delete-note {
        opacity: 50%;
    }

    svg line {
        stroke: grey;
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