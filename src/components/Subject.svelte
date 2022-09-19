<script lang="ts">
    import type { Subject } from '../model/subject';
    import type { Theme } from '../model/theme';
    import { database, databasePath } from '../stores/backend'
    import { get as getValue } from 'svelte/store';
    import { ref, remove } from 'firebase/database';

    const db = getValue(database);

    export let theme: Theme = {title: 'theme1'};
    export let key: string;
    export let subject: Subject;

    console.log(subject);

    // Need the user, organization, and theme as a state

    async function deleteSubject() {
        await remove((ref(db, `${$databasePath}/organization/user1/${theme.title}/${key}`)));
    }


</script>

<div class="single-subject">
    <h3>{subject.title}</h3>
    <p>{subject.description}</p>
    <button on:click={deleteSubject}>
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