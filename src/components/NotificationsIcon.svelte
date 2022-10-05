<script lang="ts">
    import Bell from "./icons/Bell.svelte";
    import Tooltip from './Tooltip.svelte';
    import type { Notification } from '../model/notifications';
    import { onMount } from "svelte";
    import { notifications } from '../stores/user';
    import { view } from '../stores/displayData';

    let message = '';

    notifications.subscribe(async(notifications) => {
        if (notifications && notifications.length > 0)
        for (const notification of notifications) {
            let notificationText = '';
            if (notification.details.organization) {
                notificationText = `${notification.sender} invites you to join organization ${notification.details.organizationName}`;
            }
            message = message.concat(notificationText + '\n');
        }
    });

</script>


<button on:click={() => $view = 'Notifications'}>
    <Tooltip title={message}>
        <Bell></Bell>
    </Tooltip>
</button>

<style>
    button {
        background-color: black;
        border: none;
    }

    button:hover {
        opacity: 50%;
    }
</style>