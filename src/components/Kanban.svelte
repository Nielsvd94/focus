<script lang="ts">
    import type { Note as NoteType } from '../model/note';

    export let notes: NoteType[] = [];
    let swimlanes: {status: string, header: string}[] = [{ status: 'todo', header: 'To do' }, { status: 'doing', header: 'Doing' }, { status: 'done', header: 'Done' }];
    let showAddSwimlaneView: boolean = false;
    let newSwimlaneHeader: string = '';
    let newSwimlaneFilter: string = '';

    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    function uniqueStatuses() {
        const statuses = notes.map(note => { return note.status });
        const uniqueStatuses = statuses.filter(onlyUnique);
        return uniqueStatuses;
    }

    function toggleAddSwimlane() {
        showAddSwimlaneView = !showAddSwimlaneView;
    }

    function addSwimlane() {
        const newSwimlanes: {status: string, header: string}[] = swimlanes;
        newSwimlanes.push({ header: newSwimlaneHeader, status: newSwimlaneFilter });
        swimlanes = newSwimlanes;
    }

</script>

<div class="kanban-view">

    <div class="swimlanes">
        {#each swimlanes as swimlane}
            <div class="swimlane-{swimlane.status}">
                <h3 class="column-header">
                    {swimlane.header}
                </h3>
                {#each notes.filter(note => note.status === swimlane.status) as note}
                    <!-- svelte-ignore a11y-invalid-attribute -->
                    <div class="note">
                        <a href='#' class="note-title">{note.title}</a>
                    </div>
                {/each}
            </div>
        {/each}
    </div>

    <div class="add-swimlane">
        <div>
            <!-- svelte-ignore a11y-invalid-attribute -->
            <a href='#' on:click={toggleAddSwimlane}>Add a new column {showAddSwimlaneView ? '(hide)' : '(show)'}</a>
        </div>
        {#if showAddSwimlaneView}
            <label>
                Column header:  
                <input placeholder="Header" bind:value={newSwimlaneHeader} />
            </label>
            <label>
                Show notes with status:  
                <select placeholder="Show notes with status" bind:value={newSwimlaneFilter}>
                    {#each uniqueStatuses() as status}
                        <option value={status}>{status}</option>
                    {/each}
                </select>
            </label>
            <button on:click={addSwimlane}>Add</button>
        {/if}
    </div>
</div>

<style>

    .kanban-view {
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

    h3 {
        margin-left: 7px;
        margin-right: 7px;
        border-bottom: 1px solid lightgrey;
    }

    [class^=swimlane-] {
        border-left: 1px solid lightgrey;
    }

    .note {
        margin: 7px;
    }

    .note-title {
        color: black;
    }

    .add-swimlane {
        margin: 7px;
    }

    .add-swimlane a {
        color: grey;
        margin: 5px;
        padding: 3px;
    }

    .add-swimlane > label {
        margin: 10px;
    }

</style>