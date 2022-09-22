<script lang="ts">
    import { view } from '../stores/displayData';
    
    export let open;

    function toggleView(newView: string) {
        if ($view !== newView) {
            $view = newView;
        }
        open = false;
    }
</script>

<div id="side-menu" style="left: {open ? '0px' : '-300px'};">
    <div id="menu">
        <button on:click={() => toggleView('Organizations')}>
            <h1>Organizations</h1>
        </button>
        <button on:click={() => toggleView('Themes')}>
            <h1>Themes</h1>
        </button>
        <button on:click={() => toggleView('MindSpace')}>
            <h1>Mindspace</h1>
        </button>
    </div>
</div>

<style>
    
    #side-menu {
        position: absolute;
        height: 100vh;
        top: 100px;
        transition: left 0.4s ease-in-out;
        width: 300px;
        overflow-y: auto;
        background-color: black;
        color: white;
    }
    
    #menu {
        text-align: left;
        padding-top: 10px;
        padding-left: 25px;
    }

    button {
        background-color: black;
        color: white;
        border: none;
    }

    h1 {
        margin: 5px;
    }

</style>