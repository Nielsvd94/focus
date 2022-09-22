<script lang="ts">

    let open: boolean = false;

</script>


<div class="button-container">
    <button class:open on:click={() => open = !open}>
    	<svg width=32 height=32>
            <line id="top" x1=16 y1=0 x2=16 y2=32/>
            <line id="bot" x1=0 y1=16 x2=32 y2=16/>
        </svg>
    </button>
</div>

{#if open}
    <slot></slot>
{/if}

<style>

    .button-container {
        z-index: 10;
        position: relative;
        float: right;
        margin: 10px;
    }

    button {
        background-color: Transparent;
        background-repeat: no-repeat;
        border: none;
        cursor: pointer;
        overflow: hidden;
        outline: none;
    }

    svg line {
        stroke: black;
        stroke-width: 3;
        transition: transform 0.4s ease-in-out;
    }

    /* rotate the top line */
    .open #top {
        transform: translate(16px, -6px) rotate(45deg)
    }

    /* rotate the bottom line */
    .open #bot {
        transform: translate(16px, -6px) rotate(45deg)
    }

</style>