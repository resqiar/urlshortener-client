<script lang="ts">
	import { page } from '$app/stores';
	import CreateHeader from '../../components/CreateHeader.svelte';
	import { nanoid } from 'nanoid';
	import Toast from '../../components/Toast.svelte';

	let originalUrl: string | null;
	let customName: string | null;
	let description: string | null;
	let expiration: number = 1;

	let error: string | null;
	let success: {
		id: string;
		short: string;
		original: string;
	} | null;

	function generateRandomName() {
		const randomUniqueName = nanoid(8); // 8 chars
		customName = randomUniqueName;
	}

	async function create() {
		if (!originalUrl || !customName) return;

		// reset error and success state
		error = null;
		success = null;

		const req = await fetch(`${import.meta.env.VITE_PUBLIC_SERVER_ORIGIN}/v1/url/create`, {
			method: 'POST',
			body: JSON.stringify({
				originalUrl: originalUrl,
				shortUrl: customName,
				authorId: $page.data.id,
				description: description,
				expireDay: expiration
			}),
			headers: {
				Authorization: `Bearer ${$page.data.token}`,
				'Content-Type': 'application/json'
			}
		});

		const response = await req.json();
		if (response.error) return (error = response.message);
		success = {
			id: response.id,
			short: response.short_url,
			original: response.original_url
		};

		// We have to delay the the scrolling,
		// If not the scroll movement wont work.
		setTimeout(() => {
			window.scrollTo(0, document.body.scrollHeight);
		}, 100); // 100ms
	}

	function copyToClipboard(text: string) {
		navigator.clipboard.writeText(text);
		triggerToast();
	}

	// Trigger toast to show information for 2 seconds
	let toast: boolean = false;
	function triggerToast() {
		toast = true;
		setTimeout(() => {
			toast = false;
		}, 2000); // 2 seconds
	}
</script>

<svelte:head>
	<title>Create URL - Amerta URL Shortener</title>
</svelte:head>

<CreateHeader />

<main class="flex flex-col items-center w-full">
	<div id="create" class="card mt-8 mb-12 w-126 bg-base-300 shadow-xl">
		<figure>
			<img
				class="max-h-[100px] w-full object-cover"
				src="https://placeimg.com/400/225/arch"
				alt="Ambient"
			/>
		</figure>
		<div class="card-body">
			<h2 class="card-title">Create Short URL</h2>

			<p>Here you can shorten your URL and customize everything by your need.</p>

			<div class="form-control w-full">
				<label for="originalUrl" class="label">
					<span class="label-text">Original URL*</span>
				</label>
				<input
					bind:value={originalUrl}
					id="originalUrl"
					type="text"
					class="input input-bordered w-full"
				/>
			</div>

			<div class="form-control w-full">
				<label for="customName" class="label">
					<span class="label-text">Custom URL name*</span>
				</label>
				<div class="flex gap-2">
					<input
						bind:value={customName}
						id="customName"
						type="text"
						class="input input-bordered w-full"
					/>

					<!-- AUTO GENERATE RANDOM NAME -->
					<button on:click={generateRandomName} title="Auto Generate Name" class="btn btn-square">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-6 h-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z"
							/>
						</svg>
					</button>
				</div>
				<label for="customName" class="label">
					<span class="label-text"
						>You can provide custom short url e.g short.com/<strong>custom-name</strong></span
					>
				</label>
			</div>

			<div class="form-control">
				<label for="description" class="label">
					<span class="label-text">Description</span>
				</label>
				<textarea
					bind:value={description}
					id="description"
					class="textarea textarea-bordered h-24"
				/>
			</div>

			<div class="form-control w-full">
				<label for="expiration" class="label">
					<span class="label-text">Link Expiration</span>
				</label>
				<select bind:value={expiration} class="select select-bordered">
					<option value={1} selected>1 Day</option>
					<option value={3}>3 Days</option>
					<option value={7}>7 Days</option>
					<option value={30}>30 Days</option>
				</select>
				<label for="expiration" class="label">
					<span class="label-text-alt">The link will expire after the time you specified</span>
				</label>
			</div>

			{#if error}
				<div class="alert alert-error shadow-lg my-4">
					<span>{error}</span>
				</div>
			{/if}

			<div class="card-actions justify-end">
				<button on:click={create} class="btn btn-primary">shorten</button>
			</div>
		</div>
	</div>

	{#if success}
		<div id="success" class="card mt-8 w-126 bg-base-300 shadow-xl mb-[300px]">
			<div class="mx-8 mt-12">
				<h1 class="font-bold text-3xl">Success shorten your URL! 🎉</h1>
				<p class="mt-4">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Id, iste?</p>
			</div>

			<div class="flex gap-2 mt-8 mx-8">
				<input
					type="text"
					value={`${import.meta.env.VITE_PUBLIC_CLIENT_ORIGIN}/${success.short}`}
					disabled
					class="font-bold input disabled w-full hover:cursor-default"
				/>

				<button
					on:click={() =>
						copyToClipboard(
							`${import.meta.env.VITE_PUBLIC_CLIENT_ORIGIN}/${success ? success.short : ''}`
						)}
					title="Copy"
					class="btn btn-square"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
						/>
					</svg>
				</button>
			</div>

			<div class="mx-8 mb-12">
				<p class="mt-4 text-sm">
					You can also check and track your URLs in your
					<a class="link" href="/inventory">inventory</a>
					or go back to
					<a class="link" href="#create">create</a>
				</p>
			</div>
		</div>
	{/if}
</main>

{#if toast}
	<Toast />
{/if}
