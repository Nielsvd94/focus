<script lang="ts">
    // Overzicht van 1 onderwerp
    import Subject from './Subject.svelte';
    import type { Subjects } from "../model/subject";
    import { database, databasePath } from '../stores/backend';
    import { onValue, ref } from 'firebase/database';
    import AddSubject from './AddSubject.svelte';
    import type { Theme } from '../model/theme';
    import { get as getValue } from 'svelte/store';

    // Een onderwerp bestaat uit het hoofd onderwerp plus subonderwerpen
    // Onderwerp is een object en wordt meegegeven aan deze mindspace component

    // klikken op onderwerp = uitvouwen van de onderliggende onderwerpen (bovenliggende onderwerp wordt titel van de pagina, of breadcrumb?)

    export let theme: Theme = {title: 'theme1'};

    const db = getValue(database);

    let subjects: Subjects;
    let subjectKeys: string[] = [];

    onValue(ref(db, `${$databasePath}/organization/user1/theme1`), (snapshot) => {
        const data = snapshot.val();
        updateSubjects(data);
    });

    async function updateSubjects(data) {
        subjectKeys = data ? Object.keys(data) : [];
        subjects = data;
    }

</script>

<AddSubject theme={theme}/>

<div class="subject-container">
    {#if subjectKeys.length > 0}
        {#each Object.keys(subjects) as key}
            <div class="subject">
                <Subject key={key} subject={subjects[key]}></Subject>
            </div>
        {/each}
    {:else}
        <h2>There are no notes for this theme yet</h2>
    {/if}

</div>

<style>

    .subject, h2 {
        margin-left: 350px;
    }

</style>