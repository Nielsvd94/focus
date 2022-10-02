<script lang="ts">
    import Note from "./Note.svelte";
    import type { Note as NoteType } from '../model/note';
    import { afterUpdate, createEventDispatcher } from "svelte";
    import type { Theme } from "../model/theme";

    export let theme: Theme | null;
    export let notes: NoteType[] = [];
    export let numberOfNotes;
    let has_mid = 0; /* 0 if there's no item in the middle, 1 otherwise */
    let m = numberOfNotes - has_mid; /* how many are ON the circle */
    let tan = Math.tan(Math.PI/m); /* tangent of half the base angle */

    afterUpdate(() => {
        numberOfNotes = notes ? notes.length : 0;
        has_mid = 0; /* 0 if there's no item in the middle, 1 otherwise */
        m = numberOfNotes - has_mid; /* how many are ON the circle */
        tan = Math.tan(Math.PI/m); /* tangent of half the base angle */
    });

    const dispatch = createEventDispatcher();

    function forward(event) {
        dispatch('deletedNoteFromOrganization', event.detail)
    }


    // mindmap view: klikken op onderwerp = uitvouwen van de onderliggende onderwerpen (bovenliggende onderwerp wordt titel van de pagina, of breadcrumb?)
    // thema als titel bovenin de pagina? of als middelste van de mindmap?
</script>

<div class="container" style="--m: {m}; --tan: {+tan.toFixed(2)}">
    <!-- svelte-ignore a11y-invalid-attribute -->
    <a class="theme" href='#'>{theme ? theme.name : ''}</a>
    {#if notes}
        {#each notes as note, i}
            <!-- svelte-ignore a11y-invalid-attribute -->
            <a style={i - has_mid >= 0 ? `--i: ${i}` : null} href='#'>
                <Note on:deletedNoteFromOrganization={forward} showNoteData={['title', 'description']} note={note}></Note>
            </a>
        {/each}
    {:else}
        <h2>There are no notes for this theme yet</h2>
    {/if}
  </div>

<style>
    /* https://stackoverflow.com/questions/12813573/position-icons-into-circle */
    .container {
        z-index: 5;
        --d: 8em; /* note size */
        --rel: 1; /* how much extra space we want between images, 1 = one image size */
        --r: calc(20vw); /* circle radius */
        position: absolute;
        justify-content: center;
        top: 200px;
        left: 30vw;
    }

    .container a {
        position: absolute;
        color: black;
        top: 350px; left: 350px;
        margin: calc(-.5*var(--d));
        width: var(--d); height: var(--d);
        --az: calc(var(--i)*1turn/var(--m));
        transform: 
            rotate(var(--az)) 
            translate(var(--r))
            rotate(calc(-1*var(--az)));
    }

    .theme {
        font-weight: bold;
        font-size: 3rem;
    }
    

</style>