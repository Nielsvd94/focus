<script lang="ts">
    import Header from './components/Header.svelte';
	import { initializeApp } from "firebase/app";
	import { firebaseConfig } from './hosting/firebaseConfig';
	import { firebaseApp, database, databasePath } from "./stores/backend";
    import { get, getDatabase, ref, update } from 'firebase/database';
    import MindSpace from './components/MindSpace.svelte';
    import { onMount } from 'svelte';
    import { getAuth, onAuthStateChanged } from 'firebase/auth';
	import { currentUser, loggedIn } from './stores/user';
    import { array, assert } from 'superstruct';
    import { User } from './model/user';
    import Login from './pages/Login.svelte';
	import { view, notifications } from './stores/displayData';
    import Organizations from './components/Organizations.svelte';
    import Themes from './components/Themes.svelte';
    import { Notification } from './model/notifications';

	const views = {
		'MindSpace': MindSpace,
		'Organizations': Organizations,
		'Themes': Themes,
	}

	onMount(async () => {
        while(!db) {
            await new Promise(r => setTimeout(r, 50));
        }
    });

	let showAlert: boolean = false;

	const app = initializeApp(firebaseConfig);
	firebaseApp.set(app);
	const db = getDatabase(app);
	database.set(db);

	let auth = getAuth();
	onAuthStateChanged(auth, async (user) =>  {
		if (user) {
			const uid = getAuth().currentUser?.uid;
			if (uid) {
				const userDetails = await (await get(ref(db, `${$databasePath}/users/` + uid))).val();
				const userT = {
					uid: uid,
					firstName: userDetails.firstName,
					lastName: userDetails.lastName,
					email: userDetails.email
				}
				assert(userT, User);
				currentUser.set(userT);
				$loggedIn = true;
				await checkForNotifications();
			}
			else {
				console.log('No uid found for current user');
			}
		}
		else {
			$loggedIn = false;
		}
	});

	async function checkForNotifications() {
		const snapshot = await get(ref(db, `${$databasePath}/notifications/${$currentUser.email.replaceAll('.',',')}`));
		if (snapshot.exists()) {
			const data = snapshot.val();
			const formattedData = updateNotifications(data);
			$notifications = formattedData;
			showAlert = true;
		}
    };

	function updateNotifications(data: any) {
        const newData: any[] = [];
        if (data) {
            for (const key of Object.keys(data)) {
                const newEntry = data[key];
                newEntry.key = key;
                newData.push(newEntry);
            }
            return newData;
        }
		else {
			return data;
		}
    }

	
</script>

<Header showAlert={showAlert}></Header>

{#if ($loggedIn === undefined)}

	<p>Logging in...</p>

{:else if ($loggedIn !== true)}

	<Login on:login={() => $loggedIn = true}/>

{:else}

	<svelte:component this={views[$view]}></svelte:component>

{/if}

<style>

	:global(body) {
		margin: 0px;
		padding: 0px;
	}

</style>