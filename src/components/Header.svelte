<script lang="ts">
    import BurgerMenu from './Menu.svelte';
    import UserMenu from './UserMenu.svelte';
</script>

<div id="header">
    <div class="menu-button">
        <BurgerMenu>
            <h2>Home</h2>
            <h2>About</h2>
        </BurgerMenu>
    </div>

    <div class="title-container">
        <h1 class="title">Focus.</h1>
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
        grid-template-columns: 10% 60% 30%;
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
    }

    .user-menu-container {
        grid-column: 3;
    }

    .user-menu {
        margin: 10px;
        float: right;
    }

</style>