<script>
    import Header from './components/Header.svelte';
	import { initializeApp } from "firebase/app";
	import { firebaseConfig } from './hosting/firebaseConfig';
	// TODO: Add SDKs for Firebase products that you want to use
	// https://firebase.google.com/docs/web/setup#available-libraries

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