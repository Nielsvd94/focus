<script lang="ts">
    import { database, databasePath } from '../stores/backend'
    import { get as getValue } from 'svelte/store';
    import { get, ref, remove } from 'firebase/database';
    import { currentUser } from '../stores/user';
    import type { Organization } from '../model/user';

    const db = getValue(database);

    export let organization: Organization;

    async function deleteOrganization() {
        if (organization.members.length === 1 && organization.members[0] === $currentUser.uid) {
            console.log(organization)
            console.log($currentUser.uid)
            await remove((ref(db, `${$databasePath}/organizations/${organization.key}`)));
        }
        await remove((ref(db, `${$databasePath}/users/${$currentUser.uid}/organizations/${organization.key}`)));
    }

</script>

<div class="single-organization">
    <h3>{organization.name}</h3>
    {#if organization.admin.includes($currentUser.uid)}
    <button on:click={deleteOrganization}>
        <svg width=12 height=12>
            <line id="top" x1=0 y1=0 x2=12 y2=12/>
            <line id="bot" x1=0 y1=12 x2=12 y2=0/>
        </svg>
    </button>
    {/if}
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