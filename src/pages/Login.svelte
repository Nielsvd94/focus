<script lang="ts">

   import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
   import { currentUser } from "../stores/user";

   import { createEventDispatcher } from "svelte";
   import { get, ref, set } from "firebase/database";
   import { databasePath, database } from "../stores/backend";
   import { get as getValue } from 'svelte/store';
   import { assert } from "superstruct";
   import { User } from "../model/user";
   
   const dispatch = createEventDispatcher();

   let nieuwAccount = false;

   let loginEmail = "";
   let loginPassword = "";
   
   let registreerEmail = "";
   let registreerPassword = "";
   let firstName = "";
   let lastName = "";
   let username = "";

   let message = "";
   let loading = null;

   const db = getValue(database);

   async function getUserDetails(uid: string) {
      const firstName = (await get(ref(db, `${$databasePath}/users/${uid}/firstName`))).val();
      const lastName = (await get(ref(db, `${$databasePath}/users/${uid}/lastName`))).val();
      const email = (await get(ref(db, `${$databasePath}/users/${uid}/email`))).val();
      const user = {
         firstName: firstName,
         lastName: lastName,
         email: email,
         uid: uid
      }
      return user;
   }
 
   // Login function
   async function login(loginEmail: string, loginPassword: string): Promise<void> {

      try {
         validateLoginForm(loginEmail, loginPassword); // Controleer of alle input goed is
         const userCred = await signInWithEmailAndPassword(getAuth(), loginEmail, loginPassword);

         const uid = getAuth().currentUser?.uid;
         console.log(uid);
         const user = await getUserDetails(uid as string);
         currentUser.set(user);
         console.log(user);
         dispatch("login");
      }
      catch (error) {
         handleError(error);
      }
   }
 
 
    // Registreer een nieuwe gebruiker
    async function registreren(email: string, password: string, firstName: string, lastName: string): Promise<void> {
       
      try {
         validateRegisterForm(email, password, firstName, lastName); // Controleer of alle input goed is
         await createUserWithEmailAndPassword(getAuth(), email, password);
   
         const uid = getAuth().currentUser?.uid;
         while (!getAuth().currentUser?.uid) {
            await new Promise(r => setTimeout(r, 100));
         }
         if (uid) {
            if (!(await get(ref(db, `${$databasePath}/users/${uid}/email`))).exists()) {
               await set(ref(db, `${$databasePath}/users/${uid}/firstName`), firstName);
               await set(ref(db, `${$databasePath}/users/${uid}/lastName`), lastName);
               await set(ref(db, `${$databasePath}/users/${uid}/email`), email);
            }
            else {
                  console.log(`A user with this name already exists`);
            };
         }
         else {
            console.log('No uid for this user', getAuth());
         }

         // Automatisch terug naar inlog scherm
         loginEmail = email;
         loginPassword = password;
         registreerEmail = "";
         registreerPassword = "";
         firstName = "";
         lastName = "";
         nieuwAccount = false;
         message = `Welcome ${firstName}, your account has been successfully created. You can now login!`;
      }
   
      catch (error) {
         handleError(error);
      }
   };
 
 
   // Form validation
   function validateLoginForm(loginEmail: string, loginPassword: string): void {

      message = "";

      if (!loginEmail) { 
         let err = new Error();
         err.code = "form/no-email";
         throw err;
      }

      if (!loginPassword) { 
         let err = new Error();
         err.code = "form/no-password";
         throw err;
      }
   }
 
   function validateRegisterForm(email: string, password: string, firstName: string, lastName: string): void {

      message = "";

      if (!email) {
         let err = new Error();
         err.code = "form/no-email";
         throw err;
      }

      if (!password) {
         let err = new Error();
         err.code = "form/no-password";
         throw err;
      }

      if (!firstName) {
         let err = new Error();
         err.code = "form/no-surname";
         throw err;
      }

      if (!lastName) {
         let err = new Error();
         err.code = "form/no-surname";
         throw err;
      }
   }
 
 
   // Error handling
   function handleError(err: Error) {

      message = "⚠ ";

      switch(err.code) {

         case "form/no-email": 
            message += "Vul een e-mail adres in.";
         break;

         case "form/no-password": 
            message += "Vul een password in.";
         break;

         case "form/no-surname": 
            message += "Vul een firstName in.";
         break;

         case "form/no-lastname": 
            message += "Vul een lastName in.";
         break;

         case "form/no-username": 
            message += "Vul een gebruikersnaam in.";
         break;

         case "form/email-not-allowed":
            message += 'Dit email adres mag niet meedoen aan deze poule.';
         break;

         case "auth/too-many-requests":
            message += "Teveel verkeerde inlogpogingen. Probeer het later opnieuw.";
         break;

         case "auth/user-not-found":
            message += "Gebruiker niet gevonden.";
         break;

         case "auth/invalid-email":
            message += "Vul een geldig email adres in.";
         break;

         case "auth/wrong-password":
            message += "Verkeerd password."
         break;

         case "auth/weak-password":
            message += "password moet minimaal 6 tekens zijn."
         break;

         case "auth/email-already-in-use":
            message += "Er is al een gebruiker met dit e-mail adres."
         break;

         default: 
            message += "Onverwachte foutmelding.";
            console.log(err);
      }
   }

   function keyDown(event) {
      if(event.code === 'Enter') {
         loading = login(loginEmail, loginPassword)
      }
   }
 
</script>
 
{#if nieuwAccount}
   <section>
      <h1>Create a new account</h1>
      <div class="form">
         <input bind:value={firstName} placeholder="First name" />
         <input bind:value={lastName} placeholder="Last name" />
         <div class="whitespace" />
         <input bind:value={registreerEmail} placeholder="Email address" />
         <input bind:value={registreerPassword} type="password" placeholder="Password" />
         <div class="whitespace" />
      </div>

      <button
         on:click={() => loading = registreren(
               registreerEmail,
               registreerPassword,
               firstName,
               lastName,
            )}>Account aanmaken</button>
      <button on:click={() => {nieuwAccount = false; message = "";}}>Terug naar inloggen</button>

      <div>
         <!-- {#await loading}

         {/await} -->

         {#if message}
            <p>{message}</p>
         {/if}
      </div>
   </section>

{:else}
   <section>
      <h1>Login</h1>

      <div class="form">
         <input on:keydown={keyDown} bind:value={loginEmail} placeholder="Email address" />
         <input on:keydown={keyDown} bind:value={loginPassword} type="password" placeholder="Password" />
      </div>

      <button on:click={() => loading = login(loginEmail, loginPassword)}>Login</button>
      <button on:click={() => nieuwAccount = true}>Register</button>

      <div>
         <!-- {#await loading}

         {/await} -->

         {#if message}
            <p>{message}</p>
         {/if}
      </div>
   </section>
{/if}

<style>

   section {
      max-width: 25rem;
      margin: auto;
   }

   div {
      display: flex;
      flex-direction: column;
   }

   .form {
      display: block;
   }

   .form input {
      width: 100%
   }

   p {
      color: white;
   }

   .whitespace {
      margin-bottom: 1.5rem;
   }

   @media (max-width: 640px) {

      .form {
         max-width: 85vw;
         margin: auto;
      }
   }

   @keyframes load-wheel {
      0% {
         transform: rotate(0);
         animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
      }
      50% {
         transform: rotate(180deg);
         animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
      }
      100% {
         transform: rotate(360deg);
      }
   }


   /* .lds-ring {
      margin: 1rem auto;
      position: relative;
      width: 3rem;
      height: 3rem;
   }

   .lds-ring div {
      box-sizing: border-box;
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      border: 0.5rem solid #fff;
      border-radius: 50%;
      animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
      border-color: #fff transparent transparent transparent;
   }

   .lds-ring div:nth-child(1) {
      animation-delay: -0.45s;
   }

   .lds-ring div:nth-child(2) {
      animation-delay: -0.3s;
   }

   .lds-ring div:nth-child(3) {
      animation-delay: -0.15s;
   }

   @keyframes lds-ring {
      0% {
         transform: rotate(0deg);
      }
      100% {
         transform: rotate(360deg);
      }
   } */
</style>
