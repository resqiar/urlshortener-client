<script lang="ts">
	import MainHeader from '../components/MainHeader.svelte';
	import { onMount } from 'svelte';
	import Cookies from 'js-cookie';

	let authStatus: boolean = false;

	async function isLogin() {
		const token = Cookies.get('token');
		if (!token) return;

		const req = await fetch(`${import.meta.env.VITE_PUBLIC_SERVER_ORIGIN}/v1/user/profile`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});

		const response = await req.json();
		if (response.id) return (authStatus = true);
	}

	onMount(() => {
		isLogin();
	});
</script>

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
						<button class="btn btn-primary">Get Started</button>
						<button class="btn btn-ghost">See More</button>
					</div>
				</div>
			</div>
		</div>
	</section>
</main>
