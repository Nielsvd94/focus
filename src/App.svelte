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
	import { view } from './stores/displayData';
    import Organizations from './components/Organizations.svelte';
    import Themes from './components/Themes.svelte';

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

	const app = initializeApp(firebaseConfig);
	firebaseApp.set(app);
	const db = getDatabase(app);
	database.set(db);

	let auth = getAuth();
	onAuthStateChanged(auth, async (user) =>  {
		if (user) {
			const uid = getAuth().currentUser?.uid;
			console.log(uid);
			if (uid) {
				const userDetails = await (await get(ref(db, `${$databasePath}/users/` + uid))).val();
				console.log('hier?')
				const userT = {
					uid: uid,
					firstName: userDetails.firstName,
					lastName: userDetails.lastName
				}
				assert(userT, User);
				currentUser.set(userT);
				$loggedIn = true;
			}
			else {
				console.log('No uid found for current user');
			}
		}
		else {
			$loggedIn = false;
		}
	});
	
</script>

<Header></Header>

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