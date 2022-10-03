<script lang="ts">
    import { Database, ref, push } from "firebase/database";
    import type { Organization } from "../model/user";
    import { database, databasePath } from "../stores/backend";
    import { currentUser } from "../stores/user";
    import type { Notification } from '../model/notifications';

    let db: Database;
    const unsubsribeFromDatabase = database.subscribe(value => {
        db = value;
    });

    let newMemberMail: string = '';
    export let organization: Organization;

    const notification = {
        request: 'join organization',
        sender: $currentUser.firstName + ' ' + $currentUser.lastName,
        details: {
            organization: organization.key,
            organizationName: organization.name
        }
    }

    async function createNotification() {
        const email = newMemberMail.replaceAll('.',',');
        console.log(`${$databasePath}/notifications/${email}`);
        await push(ref(db, `${$databasePath}/notifications/${email}`), notification)
    }

</script>

<div class="overlay">
    <h3>Add a new member</h3>
    <div>
        <input type="text" bind:value={newMemberMail} placeholder="Email adres">    
    </div>
    <div>
        <button on:click={createNotification}>Send request</button>
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