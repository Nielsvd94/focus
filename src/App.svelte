<script lang="ts">
    import Header from './components/Header.svelte';
	import { initializeApp } from "firebase/app";
	import { firebaseConfig } from './hosting/firebaseConfig';
	import { firebaseApp, database, databasePath } from "./stores/backend";
    import { Database, get, getDatabase, ref } from 'firebase/database';
    import { onMount } from 'svelte';
    import { getAuth, onAuthStateChanged } from 'firebase/auth';
	import { currentUser, loggedIn, notifications } from './stores/user';
    import Login from './pages/Login.svelte';
    import Inside from './pages/Inside.svelte';

	let db: Database;

	onMount(async () => {
		const app = initializeApp(firebaseConfig);
		firebaseApp.set(app);
		db = getDatabase(app);
		database.set(db);
		const auth = getAuth();
		console.log(auth);
    });



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

	async function waitForCurrenUser() {
		while(!$currentUser.email) {
			console.log($currentUser);
            await new Promise(r => setTimeout(r, 100));
        }
		return 'done';
	}

	
</script>

{#if ($loggedIn === undefined)}

	<p>Logging in...</p>

{:else if ($loggedIn !== true)}

	<Header showMenuButton={false} showAlert={false}></Header>

	<Login on:login={() => $loggedIn = true}/>

{:else if ($loggedIn && $currentUser.uid && $database)}

		{#await waitForCurrenUser()}

			<p>waiting for user...</p>

		{:then}

			<Header showMenuButton={true} showAlert={$notifications !== null && $notifications.length > 0}></Header>

			<Inside></Inside>

		{/await}

{/if}

<style>

	:global(body) {
		margin: 0px;
		padding: 0px;
	}

</style>