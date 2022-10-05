<script lang="ts">
    import Header from './components/Header.svelte';
	import { initializeApp } from "firebase/app";
	import { firebaseConfig } from './hosting/firebaseConfig';
	import { firebaseApp, database, databasePath } from "./stores/backend";
    import { get, getDatabase, ref } from 'firebase/database';
    import MindSpace from './components/MindSpace.svelte';
    import { onMount } from 'svelte';
    import { getAuth, onAuthStateChanged } from 'firebase/auth';
	import { currentUser, loggedIn } from './stores/user';
    import { assert } from 'superstruct';
    import { User } from './model/user';
    import Login from './pages/Login.svelte';
    import Organizations from './components/Organizations.svelte';
    import Themes from './components/Themes.svelte';
    import Notification from './components/Notifications.svelte';
    import Inside from './pages/Inside.svelte';

	const views = {
		'MindSpace': MindSpace,
		'Organizations': Organizations,
		'Themes': Themes,
		'Notifications': Notification
	}

	onMount(async () => {
        while(!db) {
            await new Promise(r => setTimeout(r, 50));
        }
    });

	const app = initializeApp(firebaseConfig);
	firebaseApp.set(app);
	const db = getDatabase(app);
	database.set(db);

	let auth = getAuth();
	onAuthStateChanged(auth, async (user) =>  {
		if (user) {
			const uid = getAuth().currentUser?.uid;
			if (uid) {
				const firstName = await (await get(ref(db, `${$databasePath}/users/${uid}/firstName`))).val();
				const lastName = await (await get(ref(db, `${$databasePath}/users/${uid}/lastName`))).val();
				const email = await (await get(ref(db, `${$databasePath}/users/${uid}/email`))).val();
				const userT = {
					uid: uid,
					firstName: firstName,
					lastName: lastName,
					email: email
				}
				currentUser.set(userT);
				loggedIn.set(true);
			}
			else {
				console.log('No uid found for current user');
			}
		}
		else {
			loggedIn.set(false);
		}
	});

	
</script>

{#if ($loggedIn === undefined)}

	<p>Logging in...</p>

{:else if ($loggedIn !== true)}

	<Header showAlert={false}></Header>

	<Login on:login={() => $loggedIn = true}/>

{:else if ($loggedIn && $currentUser.uid && $database)}

	<Inside></Inside>

{/if}

<style>

	:global(body) {
		margin: 0px;
		padding: 0px;
	}

</style>