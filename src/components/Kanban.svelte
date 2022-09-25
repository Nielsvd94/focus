<script lang="ts">
    import Note from "./Note.svelte";
    import type { Note as NoteType } from '../model/note';
    import { afterUpdate } from "svelte";
    import type { Theme } from "../model/theme";

    export let theme: Theme;
    export let notes: NoteType[] = [];
    export let numberOfNotes;
    export let notesToDo: NoteType[] = [];
    export let notesDoing: NoteType[] = [];
    export let notesDone: NoteType[] = [];

    afterUpdate(() => {
        numberOfNotes = notes ? notes.length : 0;
        notesToDo = notes.filter(note => note.status === 'todo');
        notesDoing = notes.filter(note => note.status === 'doing');
        notesDone = notes.filter(note => note.status === 'done');
    });

</script>

<div class="kanban-view">
    <div class="status-todo">
        <h3 class="column-header">
            To do
        </h3>
        {#each notesToDo as noteToDo}
            <!-- svelte-ignore a11y-invalid-attribute -->
            <a href='#' class="note-title">{noteToDo.title}</a><br>
        {/each}
    </div>
    <div class="status-doing">
        <h3 class="column-header">
            Doing
        </h3>
        {#each notesDoing as noteDoing}
        <!-- svelte-ignore a11y-invalid-attribute -->
            <a href='#' class="note-title">{noteDoing.title}</a><br>
        {/each}
    </div>
    <div class="status-done">
        <h3 class="column-header">
            Done
        </h3>
        {#each notesDone as noteDone}
        <!-- svelte-ignore a11y-invalid-attribute -->
            <a href='#' class="note-title">{noteDone.title}</a><br>
        {/each}
    </div>
</div>

<style>
    .kanban-view {
        display: grid;
        grid-template-columns: 30vw 30vw 30vw;
        column-gap: 1px;
        margin-left: 300px;
    }

    h3 {
        margin-left: 5px;
    }

    [class^=status] {
        border-left: 1px solid #dfdfdf;
    }

    .note-title {
        margin: 5px;
        color: black;
    }

</style>