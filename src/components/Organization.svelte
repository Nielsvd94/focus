<script lang="ts">
    import { database, databasePath } from '../stores/backend'
    import { get as getValue } from 'svelte/store';
    import { get, ref, remove, set, update } from 'firebase/database';
    import { currentUser } from '../stores/user';
    import type { Organization, User } from '../model/user';
    import { onMount } from 'svelte';
    import AddMember from './AddMember.svelte';
    import AddButton from './AddButton.svelte';

    const db = getValue(database);

    export let organization: Organization;
    let members: User[] = [];
    let admin: User[] = [];
    let showMembers: boolean = false;
    let isAdmin: boolean = false;

    onMount(async () => {
        await updateMembers();
        isAdmin = organization.admin[$currentUser.uid] === true;
    });

    async function getUserData(userKey: string) {
        const firstName = await (await get(ref(db, `${$databasePath}/users/${userKey}/firstName`))).val();
        const lastName = await (await get(ref(db, `${$databasePath}/users/${userKey}/lastName`))).val();
        const email = await (await get(ref(db, `${$databasePath}/users/${userKey}/email`))).val();
        const user = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            uid:userKey
        }
        return user;
    }

    async function deleteOrganization() {
        await remove((ref(db, `${$databasePath}/organizations/${organization.key}`)));
        await remove((ref(db, `${$databasePath}/users/${$currentUser.uid}/organizations/${organization.key}`)));
    }

    async function deleteMemberFromOrganization(memberKey: any) {
        if (Object.keys(organization.members).length > 1) {
            if (organization.admin[memberKey] === true) {
                await remove((ref(db, `${$databasePath}/organizations/${organization.key}/admin/${memberKey}`)));
            }
            await remove((ref(db, `${$databasePath}/organizations/${organization.key}/members/${memberKey}`)));
            await updateMembers();
        }
        else {
            await deleteOrganization();
        }
    }

    async function updateMembers() {
        let newMemberData: User[] = [];
        const newMembers = await (await get(ref(db, `${$databasePath}/organizations/${organization.key}/members`))).val();
        if (newMembers) {
            for (const member of Object.keys(newMembers)) {
                const userData = await getUserData(member);
                newMemberData.push(userData);
            }
            members = newMemberData;
        }
        else {
            members = [];
        }
    }

    async function makeAdmin(memberKey: string) {
        console.log('ga je nog')
        await set(ref(db, `${$databasePath}/organizations/${organization.key}/admin/${memberKey}`), true);
        // await updateOrganizations();
    }

</script>

<div class="single-organization">
    <h3>{organization.name}</h3>
    {#if isAdmin}
        <button class="delete-organization" on:click={deleteOrganization}>
            <svg width=12 height=12>
                <line id="top" x1=0 y1=0 x2=12 y2=12/>
                <line id="bot" x1=0 y1=12 x2=12 y2=0/>
            </svg>
        </button>
        <AddButton>
            <AddMember organization={organization}></AddMember>
        </AddButton>
    {/if}
    <div>
        <label>
            <input type="checkbox" bind:checked={showMembers} />
            Show members
        </label>
        {#if showMembers}
            {#each members as member}
                <p>{member.firstName} {member.lastName}</p>
                {#if isAdmin}
                    <button class="delete-member" on:click={async () => { await deleteMemberFromOrganization(member.uid) }}>
                        Delete member
                    </button>
                    {#if !(organization.admin[member.uid] === true)}
                        <button class="delete-member" on:click={async () => { await makeAdmin(member.uid) }}>
                            Make admin
                        </button>
                    {/if}
                {/if}
            {/each}
        {/if}
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

    svg line {
        stroke: black;
        stroke-width: 3;
    }

</style>