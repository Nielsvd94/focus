<script>
    import BurgerButton from './MenuButton.svelte'
    import SideMenu from './SideMenu.svelte'

    export let open = false;

</script>

<BurgerButton bind:open={open}/>

<SideMenu bind:open={open}></SideMenu>

<style>

</style>