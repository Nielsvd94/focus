<script lang="ts">
    import { currentUser, notifications } from '../stores/user';
    import { database, databasePath } from '../stores/backend';
    import type { Notification } from '../model/notifications';
    import { get, ref, remove, set } from 'firebase/database';
    import { onMount } from 'svelte';

    let openNotifications: Notification[] = [];

    onMount(async () => {
        while(!$currentUser) {
            await new Promise(r => setTimeout(r, 100));
        }
    });

    notifications.subscribe(value => {
        const notifications: Notification[] = [];
        if (value) {
            for (const notification of value) {
                notifications.push(notification);
            };
        } 
        openNotifications = notifications;
    });

    async function joinOrganization(organizationKey: string) {
        const members = (await get(ref($database, `${$databasePath}/organizations/${organizationKey}/members`))).val();
        if (!members[$currentUser.uid] === true) {
            await set(ref($database, `${$databasePath}/organizations/${organizationKey}/members/${$currentUser.uid}`), true);
            await set(ref($database, `${$databasePath}/users/${$currentUser.uid}/organizations/${organizationKey}`), true);
        }
    }

    async function deleteNotification(notificationKey: string) {
        await remove(ref($database, `${$databasePath}/notifications/${$currentUser.email.replaceAll('.',',')}/${notificationKey}`));
    }

</script>

<div>
    {#each openNotifications.filter(notification => notification.request === 'join organization') as organizationRequest, i}
        <label>
            {organizationRequest.sender} invites you to join this organization: {organizationRequest.details.organizationName}
            <button on:click={() => { joinOrganization(organizationRequest.details.organization); deleteNotification(organizationRequest.key); }}>Join</button>
        </label>
    {/each}

</div>

<style>

</style>