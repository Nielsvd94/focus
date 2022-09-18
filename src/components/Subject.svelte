<script lang="ts">
    import type { Subject } from '../model/Subject';
    export let subject: Subject;

</script>

<div>
    <h3>{subject.title}</h3>
    <p>{subject.description}</p>
</div>