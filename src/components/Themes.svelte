<script lang="ts">
    import { onValue, ref } from "firebase/database";
    import { get as getValue } from 'svelte/store';
    import type { Theme as ThemeType } from "../model/theme";
    import { database, databasePath } from "../stores/backend";
    import { currentUser } from "../stores/user";
    import AddButton from "./AddButton.svelte";
    import AddTheme from './AddTheme.svelte';
    import Theme from './Theme.svelte';

    let themes: ThemeType[] = [];
    const db = getValue(database);

    onValue(ref(db, `${$databasePath}/users/${$currentUser.uid}/themes`), (snapshot) => {
        const data = snapshot.val();
        updateThemes(data);
    });

    async function updateThemes(data) {
        const newThemes: any[] = [];
        if (data) {
            for (const key of Object.keys(data)) {
                const newTheme = data[key];
                newTheme.key = key;
                newThemes.push(newTheme);
            }
            themes = newThemes;
            console.log(themes);
        }
        else {
            themes = data;
        }
    }

</script>

<AddButton>
    <AddTheme></AddTheme>
</AddButton>


<div class="theme-container">
    {#if themes && themes.length > 0}
        {#each themes as theme}
            <div class="theme">
                <Theme {theme} />
            </div>
        {/each}
    {:else}
        <h2>You don't have any themes yet</h2>
    {/if}
</div>

<style>

    .theme, h2 {
        margin-left: 350px;
    }

</style>
