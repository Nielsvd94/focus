<script>
    export let open;
</script>

<div id="side-menu" style="left: {open ? '0px' : '-300px'};">
    <div id="menu">
        <slot></slot>
    </div>
</div>

<style>
    
    #side-menu {
        position: absolute;
        height: 100vh;
        top: 0px;
        transition: left 0.4s ease-in-out;
        width: 300px;
        overflow-y: auto;
        background-color: black;
        color: white;
    }
    
    #menu {
        text-align: left;
        padding-top: 50px;
        padding-left: 25px;
    }

</style>