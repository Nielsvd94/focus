<script lang="ts">
    import { Database, ref, set, push, update } from "firebase/database";
    import type { Organization } from "../model/user";
    import { database, databasePath } from "../stores/backend";
    import { currentUser } from "../stores/user";

    let db: Database;
    const unsubsribeFromDatabase = database.subscribe(value => {
        db = value;
    });

    let newOrganization = {
        name: '',
        members: [],
        admin: []
    }

    async function addOrganization() {
        const newOrganizationKey = await push(ref(db, `${$databasePath}/organizations`), newOrganization);
        await set(ref(db, `${$databasePath}/organizations/${newOrganizationKey.key}/members/${$currentUser.uid}`), true);
        await set(ref(db, `${$databasePath}/organizations/${newOrganizationKey.key}/admin/${$currentUser.uid}`), true);
        await set(ref(db, `${$databasePath}/users/${$currentUser.uid}/organizations/${newOrganizationKey.key}`), true);
    };

</script>

<div class="overlay">
    <h3>New organization</h3>
    <div>
        <input type="text" bind:value={newOrganization.name} placeholder="Name">    
    </div>
    <div>
        <button on:click={addOrganization}>Add</button>
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