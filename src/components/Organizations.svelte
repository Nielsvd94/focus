<script lang="ts">
    import { get, ref, remove } from "firebase/database";
    import { organizations, currentUser } from "../stores/user";
    import { database, databasePath } from "../stores/backend";
    import AddButton from "./AddButton.svelte";
    import AddOrganization from "./AddOrganization.svelte";
    import Organization from "./Organization.svelte";
    import { onMount } from 'svelte';

    onMount(async () => {
        if ($organizations && $organizations.length > 0) {
            for (const organization of $organizations) {
                const key = organization.key;
                if (!(await get(ref($database, `${$databasePath}/organizations/${key}`))).exists()) {
                    console.log(`The organization with key ${key} no longer exists, removing it from your organizations`);
                    await remove(ref($database, `${$databasePath}/users/${$currentUser.uid}/organizations/${key}`));
                }
                else if (!(await get(ref($database, `${$databasePath}/organizations/${key}/members/${$currentUser.uid}`))).val()) {
                    console.log(`You are not a member of the organization with key ${key}, removing it from your organizations`);
                    await remove(ref($database, `${$databasePath}/users/${$currentUser.uid}/organizations/${key}`));
                }
            }
        }
    });

</script>

<AddButton>
    <AddOrganization></AddOrganization>
</AddButton>


<div class="organization-container">
    {#if $organizations && $organizations.length > 0}
        {#each $organizations as organization}
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
