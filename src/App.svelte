<script lang="ts">
    import Header from './components/Header.svelte';
	import { initializeApp } from "firebase/app";
	import { firebaseConfig } from './hosting/firebaseConfig';

	const app = initializeApp(firebaseConfig);
	
</script>

<Header></Header>

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