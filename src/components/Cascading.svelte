<script lang="ts">
    import type { Note as NoteType } from '../model/note';

    export let notes: NoteType[] = [];

</script>

<div class="cascade-view">


        {#if notes && notes.length > 0}
            {#each notes as topNote}
                {#if !topNote.parent || topNote.parent && topNote.parent.length === 0}
                    <!-- svelte-ignore a11y-invalid-attribute -->
                    <div class="top-note">
                        <a href='#' class="note-title">{topNote.title}</a>
                    </div>
                    {#if notes.filter(note => note.parent?.includes(topNote.key)) && notes.filter(note => note.parent?.includes(topNote.key)).length > 0}
                        {#each notes.filter(note => note.parent?.includes(topNote.key)) as firstChildNote}
                            <!-- svelte-ignore a11y-invalid-attribute -->
                            <div class="first-child-note">
                                <a href='#' class="note-title">{firstChildNote.title}</a>
                            </div>
                            {#if notes.filter(note => note.parent?.includes(firstChildNote.key)) && notes.filter(note => note.parent?.includes(firstChildNote.key)).length > 0}
                                {#each notes.filter(note => note.parent?.includes(firstChildNote.key)) as secondChildNote}
                                    <!-- svelte-ignore a11y-invalid-attribute -->
                                    <div class="second-child-note">
                                        <a href='#' class="note-title">{secondChildNote.title}</a>
                                    </div>
                                    {#if notes.filter(note => note.parent?.includes(secondChildNote.key)) && notes.filter(note => note.parent?.includes(secondChildNote.key)).length > 0}
                                        {#each notes.filter(note => note.parent?.includes(secondChildNote.key)) as thirdChildNote}
                                            <!-- svelte-ignore a11y-invalid-attribute -->
                                            <div class="third-child-note">
                                                <a href='#' class="note-title">{thirdChildNote.title}</a>
                                            </div>
                                            {#if notes.filter(note => note.parent?.includes(thirdChildNote.key)) && notes.filter(note => note.parent?.includes(thirdChildNote.key)).length > 0}
                                                {#each notes.filter(note => note.parent?.includes(thirdChildNote.key)) as fourthChildNote}
                                                    <!-- svelte-ignore a11y-invalid-attribute -->
                                                    <div class="fourth-child-note">
                                                        <a href='#' class="note-title">{fourthChildNote.title}</a>
                                                    </div>
                                                {/each}
                                            {/if}
                                        {/each}
                                    {/if}
                                {/each}
                            {/if}
                        {/each}
                    {/if}
                {/if}
            {/each}
        {/if}

</div>

<style>

    .cascade-view {
        margin-left: 300px;
    }

    .top-note {
        margin: 5px;
        font-size: larger;
        font-weight: bolder
    }

    .first-child-note {
        margin: 5px;
        margin-left: 15px;
        font-size: large;
        font-weight: bold;
    }

    .second-child-note {
        margin: 5px;
        margin-left: 30px;
        font-size: medium;
        font-weight: normal;
    }

    .third-child-note {
        margin: 5px;
        margin-left: 45px;
        font-size: small;
        font-weight: normal;
    }

    .fourth-child-note {
        margin: 5px;
        margin-left: 60px;
        font-size: smaller;
        font-weight: normal;
    }

    .note-title {
        color: black;
    }

</style>