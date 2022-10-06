<script lang="ts">
    import Header from './components/Header.svelte';
	import { initializeApp } from "firebase/app";
	import { firebaseConfig } from './hosting/firebaseConfig';
	import { firebaseApp, database, databasePath } from "./stores/backend";
    import { get, getDatabase, ref } from 'firebase/database';
    import { getAuth, onAuthStateChanged } from 'firebase/auth';
	import { currentUser, loggedIn, notifications } from './stores/user';
    import Login from './pages/Login.svelte';
    import Inside from './pages/Inside.svelte';

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

	<Header showMenuButton={false} showAlert={false}></Header>

	<Login on:login={() => $loggedIn = true}/>

{:else if ($loggedIn && $currentUser.uid && $database)}

	<Header showMenuButton={true} showAlert={$notifications !== null && $notifications.length > 0}></Header>

	<Inside></Inside>

{/if}

<style>

	:global(body) {
		margin: 0px;
		padding: 0px;
	}

</style>