<script lang="ts">
    import type { Note } from '../model/note';
    import { database, databasePath } from '../stores/backend'
    import { get as getValue } from 'svelte/store';
    import { ref, remove } from 'firebase/database';
    import { currentUser } from '../stores/user';
    import type { Theme } from '../model/theme';

    const db = getValue(database);

    export let theme: Theme;

    async function deleteTheme() {
        await remove((ref(db, `${$databasePath}/users/${$currentUser.uid}/themes/${theme.key}`)));
    }

</script>

<div class="single-theme">
    <h3>{theme.name}</h3>
    <p>{theme.description}</p>
    <button on:click={deleteTheme}>
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