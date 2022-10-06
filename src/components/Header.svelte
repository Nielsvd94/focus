<script lang="ts">
    import UserMenu from './UserMenu.svelte';
    import MenuButton from './MenuButton.svelte'
    import SideMenu from './SideMenu.svelte'
    import Notifications from './NotificationsIcon.svelte';

    export let showAlert: boolean = false;
    export let showMenuButton: boolean = false;

    let open: boolean = false;
    
</script>

<div id="header">
    <div class="menu-button">
        {#if showMenuButton}
            <MenuButton bind:open={open}/>

            <SideMenu bind:open={open}></SideMenu>
        {/if}
    </div>

    <div class="title-container">
        <h1 class="title">Focus.</h1>
    </div>

    <div class="alert-container">
        {#if showAlert}
            <Notifications></Notifications>
        {/if}
    </div>

    <div class="user-menu-container">
        <div class="user-menu">
            <UserMenu />
        </div>
    </div>
</div>

<style>

    #header {
        display: grid;
        grid-template-columns: 10% 75% 5% 10%;
        background-color: black;
        color: white;
        margin: 0;
        padding: 0;
        height: 100px;
    }

    .menu-button {
        grid-column: 1;
    }

    .title-container {
        grid-column: 2;
        position: relative;
    }

    .title {
        top: 0px;
        margin: 10px;
        font-size: 4rem;
    }

    .user-menu-container {
        grid-column: 4;
    }

    .user-menu {
        margin: 10px;
        float: right;
    }

    .alert-container {
        grid-column: 3;
        margin: 10px;
        float: right;
    }

</style>