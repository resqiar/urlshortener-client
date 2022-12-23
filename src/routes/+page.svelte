<script lang="ts">
	import MainHeader from '../components/MainHeader.svelte';
	import { onMount } from 'svelte';
	import Cookies from 'js-cookie';

	// State to define the status of the authentication.
	// This state will set later when calling the login endpoint.
	let authStatus: boolean = false;

	async function isLogin() {
		const token = Cookies.get('token');
		if (!token) return;

		// Get user profile from the server
		// Also pass the token to get Authorization.
		const req = await fetch(`${import.meta.env.VITE_PUBLIC_SERVER_ORIGIN}/v1/user/profile`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});

		// Get JSON response
		const response = await req.json();
		if (response.id) return (authStatus = true);
	}

	onMount(() => {
		isLogin();
	});
</script>

<svelte:head>
	<title>Amerta URL Shortener</title>
</svelte:head>

<main>
	<!-- HEADER -->
	<MainHeader {authStatus} />

	<!-- HERO SECTION -->
	<section>
		<div class="hero min-h-screen bg-base-200">
			<div class="hero-content text-center">
				<div class="max-w-[800px]">
					<h1 class="text-6xl font-bold">Short. Remember. Better.</h1>
					<p class="py-6">
						With our easy-to-use interface and powerful features, you can quickly and efficiently
						shorten your long and unwieldy URLs into clean, concise links that are easy to share and
						manage.
					</p>
					<div class="flex items-center justify-center gap-4">
						<a href="/create" class="btn btn-primary">Get Started</a>
						<a href="/inventory" class="btn btn-ghost">See More</a>
					</div>
				</div>
			</div>
		</div>
	</section>
</main>
