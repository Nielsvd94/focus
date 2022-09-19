<script>
    import { currentUser, loggedIn } from '../stores/user';
    import { database } from '../stores/backend';
    import { getAuth, signOut } from 'firebase/auth';
    import { createEventDispatcher } from "svelte";

    let dispatch = createEventDispatcher();

	let menuOpen = false;
	let inputValue = '';
	console.log(inputValue)
	
    function logout() {
        signOut(getAuth()).then(() => {
            dispatch('logout');
            console.log('logged out')
        });
   }
	
</script>

{#if $loggedIn}
    <section class="dropdown">
        <button on:click={() => menuOpen = !menuOpen} class="dropbtn">
            <h1>
                {$currentUser.firstName}.
            </h1>
        </button>
        
        <div id="dropdown" class:show={menuOpen} class="dropdown-content">
            <a href="/#">Profile</a>
            <a href="/#">Settings</a>
            <a on:click={logout} href="/#">Log out</a>
        </div>
    </section>
{/if}
	
<style>

    .dropbtn {
        background-color: black;
        color: white;
        border: none;
        cursor: pointer;
    }

    h1 {
        margin: 1px;
    }
        
    .dropbtn:hover, .dropbtn:focus {
        opacity: 0.4s 30%;;
    }
        
    .dropdown-content {
        top: 100px;
        background-color: white;
        display: none;
        position: absolute;
        z-index: 1;
    }

    .show {
        display: block;
    }

    a {
        color: black;
        padding: 10px 10px;
        text-decoration: none;
        display: block;
    }
	
    a:hover {
        background-color: #ddd
    }

</style>