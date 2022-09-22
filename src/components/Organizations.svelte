<script lang="ts">
    import { onValue, ref } from "firebase/database";
    import { get as getValue } from 'svelte/store';
    import type { Organization as OrganizationType } from "../model/user";
    import { database, databasePath } from "../stores/backend";
    import { currentUser } from "../stores/user";
    import AddButton from "./AddButton.svelte";
    import AddOrganization from "./AddOrganization.svelte";
    import Organization from "./Organization.svelte";

    let organizations: OrganizationType[];
    const db = getValue(database);

    onValue(ref(db, `${$databasePath}/users/${$currentUser.uid}/organizations`), (snapshot) => {
        const data = snapshot.val();
        updateOrganizations(data);
    });

    async function updateOrganizations(data) {
        const newOrganizations: any[] = [];
        if (data) {
            for (const key of Object.keys(data)) {
                const newOrganization = data[key];
                newOrganization.key = key;
                newOrganizations.push(newOrganization);
            }
            organizations = newOrganizations;
        }
        else {
            organizations = data;
        }
    }

</script>

<AddButton>
    <AddOrganization></AddOrganization>
</AddButton>


<div class="organization-container">
    {#if organizations && organizations.length > 0}
        {#each organizations as organization}
            <div class="organization">
                <Organization {organization} />
            </div>
        {/each}
    {:else}
        <h2>You aren't part of any organization yet</h2>
    {/if}
</div>

<style>

    .organization, h2 {
        margin-left: 350px;
    }

</style>
