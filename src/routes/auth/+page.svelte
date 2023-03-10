<script lang="ts">
	import { goto } from '$app/navigation';
	import Cookies from 'js-cookie';

	let status: 'login' | 'register' = 'login';

	// State to save the input from login card
	let usernameLogin: string = '';
	let passwordLogin: string = '';

	// State to save the input from register card
	let usernameRegister: string = '';
	let emailRegister: string = '';
	let passwordRegister: string = '';

	// Error message state
	let loginErr: string = '';
	let registerErr: string = '';

	async function doLogin() {
		if (!usernameLogin || !passwordLogin) return;

		// Call the server to do the login process
		const req = await fetch(`${import.meta.env.VITE_PUBLIC_SERVER_ORIGIN}/v1/user/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				username: usernameLogin,
				password: passwordLogin
			})
		});

		// Get JSON response.
		const response = await req.json();

		if (response.error) {
			return (loginErr = response.message);
		}

		// Call function to issue the token that coming from
		// the server and save them to the cookie.
		issueTokenCookie(response.token);
		goto('/');
	}

	async function doRegister() {
		if (!usernameRegister || !emailRegister || !passwordRegister) return;

		// Call the server to do the registration process
		// while also provide the input from register card.
		const req = await fetch(`${import.meta.env.VITE_PUBLIC_SERVER_ORIGIN}/v1/user/register`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				username: usernameRegister,
				email: emailRegister,
				password: passwordRegister
			})
		});

		// Get JSON response
		const response = await req.json();

		if (response.error) {
			return (registerErr = response.token);
		}

		// Issue a cookie
		issueTokenCookie(response.token);
		goto('/');
	}

	function issueTokenCookie(token: string) {
		// Issue a cookie with the value of token
		// coming from the server.
		// NOTE: THIS COOKIE CONFIG IS ONLY USED FOR
		// TEST ONLY. IN THE PRODUCTION, THE COOKIE MUST BE
		// SET TO HTTP ONLY TO PREVENT XSS ATTACK.
		Cookies.set('token', token, {
			expires: 7
		});
	}
</script>

<svelte:head>
	<title>Login - Amerta URL Shortener</title>
</svelte:head>

<main class="flex items-center justify-center min-h-screen w-full">
	{#if status === 'login'}
		<div class="card shadow-2xl min-w-[400px] bg-base-300 px-4 py-8">
			<div class="flex flex-col gap-4 items-center">
				<!-- USERNAME INPUT -->
				<div class="form-control w-full max-w-xs">
					<label for="username" class="label">
						<span class="label-text">Username</span>
					</label>
					<input
						bind:value={usernameLogin}
						id="username"
						type="text"
						class="input input-bordered w-full max-w-xs"
					/>
				</div>

				<!-- PASSWORD INPUT -->
				<div class="form-control w-full max-w-xs">
					<label for="password" class="label">
						<span class="label-text">Password</span>
					</label>
					<input
						bind:value={passwordLogin}
						id="password"
						type="password"
						class="input input-bordered w-full max-w-xs"
					/>
				</div>

				{#if loginErr}
					<div class="alert alert-error shadow-lg mt-4 max-w-xs">
						<span>{loginErr}</span>
					</div>
				{/if}

				<div class="my-4 w-full max-w-xs">
					<button on:click={doLogin} class="btn btn-block">Login</button>
				</div>

				<div class="my-2 flex gap-2">
					<p>Dont have an account yet?</p>
					<button on:click={() => (status = 'register')} class="hover:underline font-bold"
						>register</button
					>
				</div>
			</div>
		</div>
	{:else}
		<div class="card shadow-2xl min-w-[400px] bg-base-300 px-4 py-8">
			<div class="flex flex-col gap-4 items-center">
				<!-- USERNAME INPUT -->
				<div class="form-control w-full max-w-xs">
					<label for="username" class="label">
						<span class="label-text">Username*</span>
					</label>
					<input
						bind:value={usernameRegister}
						id="username"
						type="text"
						class="input input-bordered w-full max-w-xs"
					/>
				</div>

				<!-- EMAIL INPUT -->
				<div class="form-control w-full max-w-xs">
					<label for="email" class="label">
						<span class="label-text">Email*</span>
					</label>
					<input
						bind:value={emailRegister}
						id="email"
						type="email"
						class="input input-bordered w-full max-w-xs"
					/>
				</div>

				<!-- PASSWORD INPUT -->
				<div class="form-control w-full max-w-xs">
					<label for="password" class="label">
						<span class="label-text">Password*</span>
					</label>
					<input
						bind:value={passwordRegister}
						id="password"
						type="password"
						class="input input-bordered w-full max-w-xs"
					/>
				</div>

				{#if registerErr}
					<div class="alert alert-error shadow-lg mt-4 max-w-xs">
						<span>{registerErr}</span>
					</div>
				{/if}

				<div class="my-4 w-full max-w-xs">
					<button on:click={doRegister} class="btn btn-block">Register</button>
				</div>

				<div class="my-2 flex gap-2">
					<p>Already have an account?</p>
					<button on:click={() => (status = 'login')} class="hover:underline font-bold"
						>login</button
					>
				</div>
			</div>
		</div>
	{/if}
</main>
