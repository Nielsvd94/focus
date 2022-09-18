<script>
    export let open;
</script>

<button class:open on:click={() => open = !open}>
	<svg width=32 height=32>
        <line id="top" x1=0 y1=9    x2=32 y2=9/>
		<line id="mid" x1=0 y1=18.5 x2=32 y2=18.5/>
		<line id="bot" x1=0 y1=28    x2=32 y2=28/>
	</svg>
</button>

<style>

    button {
        position: relative;
        margin: 10px;
        z-index: 10;
        background-color: Transparent;
        background-repeat: no-repeat;
        border: none;
        cursor: pointer;
        overflow: hidden;
        outline: none;
        transition: color 0.4s ease-in-out;
    }

	svg line {
		stroke: white;
		stroke-width: 3;
        transition: transform 0.4s ease-in-out;
        opacity: 0.4s ease-in-out;
    }

    /* rotate the top line */
    .open #top {
        transform: translate(10px, 0px) rotate(45deg)
    }

    /* hide the middle */
    .open #mid {
        opacity: 0;
    }

    /* rotate the bottom line */
    .open #bot {
        transform: translate(-15px, 8px) rotate(-45deg)
    }
    
</style>