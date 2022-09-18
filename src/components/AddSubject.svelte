<script lang="ts">
    import { Database, ref, push } from "firebase/database";
    import type { Subject } from "../model/subject";
    import type { Theme } from "../model/theme";
    import { database, databasePath } from "../stores/backend";

    let db: Database;
    const unsubsribeFromDatabase = database.subscribe(value => {
        db = value;
    });

    export let theme: Theme;

    let open: boolean = false;

    let subject: Subject = {
        title: '',
        description: ''
    }

    async function addSubject() {
        await push(ref(db, `${$databasePath}/organization/user1/${theme.title}`), subject);
    };

</script>


<div class="button-container">
    <button class:open on:click={() => open = !open}>
    	<svg width=32 height=32>
            <line id="top" x1=16 y1=0 x2=16 y2=32/>
            <line id="bot" x1=0 y1=16 x2=32 y2=16/>
        </svg>
    </button>
</div>

{#if open}
    <div class="overlay">
        <div>
            <input type="text" bind:value={subject.title} placeholder="Title">    
        </div>
        <div>
            <textarea type="text" bind:value={subject.description} placeholder="Description" />
        </div>
        <div>
            <button on:click={addSubject}>Add</button>
        </div>
    </div>
{/if}

<style>

    .button-container {
        float: right;
        margin: 10px;
    }

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
        transition: transform 0.4s ease-in-out;
    }

    /* rotate the top line */
    .open #top {
        transform: translate(16px, -6px) rotate(45deg)
    }

    /* rotate the bottom line */
    .open #bot {
        transform: translate(16px, -6px) rotate(45deg)
    }

    .overlay {
        padding: 10px;
        float: right;
    }

    input {
        width: 200px;
    }

    textarea {
        width: 200px;
        height: 200px;
    }

</style>