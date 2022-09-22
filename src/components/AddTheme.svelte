<script lang="ts">
    import { Database, ref, set, push } from "firebase/database";
    import type { Theme } from "../model/theme";
    import { database, databasePath } from "../stores/backend";
    import { currentUser } from "../stores/user";

    let db: Database;
    const unsubsribeFromDatabase = database.subscribe(value => {
        db = value;
    });

    let newTheme: Theme = {
        name: '',
        description: '',
        members: [$currentUser.uid],
        admin: [$currentUser.uid]
    }

    async function addTheme() {
        const newThemeKey = await push(ref(db, `${$databasePath}/themes/`), newTheme);
        await set(ref(db, `${$databasePath}/users/${$currentUser.uid}/themes/${newThemeKey.key}`), newTheme);
    };

</script>

<div class="overlay">
    <h3>New theme</h3>
    <div>
        <input type="text" bind:value={newTheme.name} placeholder="Name">    
    </div>
    <div>
        <button on:click={addTheme}>Add</button>
    </div>
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

    .overlay {
        padding: 10px;
        float: right;
    }

    input {
        width: 200px;
    }

</style>