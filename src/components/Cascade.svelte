<script lang="ts">
    import type { Note as NoteType } from '../model/note';

    export let notes: NoteType[] = [];

</script>

<div class="cascade-view">

    <div class="swimlanes">
        {#if notes && notes.length > 0}
            {#each notes as note}
                <!-- svelte-ignore a11y-invalid-attribute -->
                <div class="note">
                    <a href='#' class="note-title">{note.title}</a>
                </div>
            {/each}
        {/if}
    </div>
</div>

<style>

    .cascade-view {
        margin-left: 300px;
    }

    .swimlanes {
        display: grid;
        grid-auto-columns: 25vw;
        column-gap: 1px;
        grid-auto-flow: column;
        overflow-x: scroll;
        max-width: 75w;
    }

    .note {
        margin: 7px;
    }

    .note-title {
        color: black;
    }

</style>