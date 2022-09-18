<script lang="ts">
    import Header from './components/Header.svelte';
	import { initializeApp } from "firebase/app";
	import { firebaseConfig } from './hosting/firebaseConfig';
	import { firebaseApp, database } from "./stores/backend";
    import { getDatabase } from 'firebase/database';
    import MindSpace from './components/MindSpace.svelte';
    import { onMount } from 'svelte';

	onMount(async () => {
        while(db === undefined) {
            await new Promise(r => setTimeout(r, 50));
        }
    });

	const app = initializeApp(firebaseConfig);
	firebaseApp.set(app);
	const db = getDatabase(app);
	database.set(db);
	
</script>

<Header></Header>

<MindSpace></MindSpace>

<main>
	
</main>

<style>

	main {
		margin: 0px;
		padding: 0px;
	}

	:global(body) {
		margin: 0px;
		padding: 0px;
	}

</style>