<script lang="ts">
    import Header from '../components/Header.svelte';
	import { databasePath, database } from "../stores/backend";
    import { get, onValue, ref, remove } from 'firebase/database';
    import MindSpace from '../components/MindSpace.svelte';
	import { currentUser, organizations, notifications } from '../stores/user';
    import { assert } from 'superstruct';
	import { Organization as OrganizationType } from "../model/user";
	import { view } from '../stores/displayData';
    import Organizations from '../components/Organizations.svelte';
    import Themes from '../components/Themes.svelte';
    import Notification from '../components/Notifications.svelte';
    import { onMount } from 'svelte';

    // INSIDE SHOULD REFER TO EVERYTHING UNDER THE HEADER AND NEXT TO THE SIDEMENU
    // IF SIDE MENU OPEN, SHIFT THE ENTIRE INSIDE TO THE RIGHT WITH THE SAME DURATION AND PIXELS AS THE SIDE MENU
    // SO THAT IF SIDE MENU IS CLOSED, WE CAN STILL USE THE SPACE TO THE LEFT OF THE SCREEN
    // SIDEMENU HAS: id="side-menu" style="left: {open ? '0px' : '-300px'
    // ALL COMPONENTS THAT ARE MOUNTED BY THE INSIDE COMPONENT SHOULD LOSE THEIR OVERALL LEFT MARGIN, THAT SHOULD ALL BE CONTROLLED BY THE INSIDE COMPONENT

	const views = {
		'MindSpace': MindSpace,
		'Organizations': Organizations,
		'Themes': Themes,
		'Notifications': Notification
	}

    onMount(async () => {
        while(!$currentUser) {
            await new Promise(r => setTimeout(r, 100));
        }
    });

	onValue(ref($database, `${$databasePath}/notifications/${$currentUser.email.replaceAll('.',',')}`), (snapshot) => {
		const data = snapshot.val();
        updateNotifications(data);
    });

	function updateNotifications(data: any) {
        const newData: any[] = [];
        if (data) {
            for (const key of Object.keys(data)) {
                const newEntry = data[key];
                newEntry.key = key;
                newData.push(newEntry);
            }
        }
        $notifications = newData;
    }

	onValue(ref($database, `${$databasePath}/users/${$currentUser.uid}/organizations`), (snapshot) => {
        const data = snapshot.val();
        updateOrganizations(data);
    });

    async function updateOrganizations(data) {
        const newOrganizations: any[] = [];
        if (data) {
            for (const key of Object.keys(data)) {
                const newOrganization = await getOrganization(key);
                console.log(newOrganization);
                if (newOrganization) {
                    newOrganization.key = key;
                    console.log(newOrganization)
                    newOrganizations.push(newOrganization);
                }
                else {
                    console.log(`You are not a member of the organization with key ${key}, removing it from your organizations`);
                    await remove(ref($database, `${$databasePath}/users/${$currentUser.uid}/organizations/${key}`));
                }
            }
            $organizations = newOrganizations;
            console.log($organizations)
        }
        else {
            $organizations = data;
        }
    }

    async function getOrganization(key: string) {
        const organization = await (await get(ref($database, `${$databasePath}/organizations/${key}`))).val();
        return organization;
    }
	
</script>

	<svelte:component this={views[$view]}></svelte:component>

<style>

	:global(body) {
		margin: 0px;
		padding: 0px;
	}

</style>