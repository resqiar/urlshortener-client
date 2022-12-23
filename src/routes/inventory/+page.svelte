<script lang="ts">
	import Cookies from 'js-cookie';
	import Toast from '../../components/Toast.svelte';
	import { onMount } from 'svelte';
	import MainHeader from '../../components/MainHeader.svelte';
	import type { Inventory } from '../../types/inventory.interface';

	let data: Inventory[] = [];

	async function getInventory() {
		const token = Cookies.get('token');
		if (!token) return (window.location.href = '/auth');

		const request = await fetch(`${import.meta.env.VITE_PUBLIC_SERVER_ORIGIN}/v1/url/inventory`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});

		const result = await request.json();
		if (result.error) return;

		// Update the data array
		data = result;
	}

	let URLDeleteID: string | null;
	let URLDeleteName: string | null;

	async function deleteURL(urlId: string) {
		const token = Cookies.get('token');
		if (!token) return (window.location.href = '/auth');

		const request = await fetch(`${import.meta.env.VITE_PUBLIC_SERVER_ORIGIN}/v1/url/delete`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id: urlId
			})
		});

		const result = await request.json();
		if (result.status === 200) {
			// exclude the deleted data from the filter.
			// Of course the data is also deleted in the database.
			data = data.filter((value) => value.id !== urlId);
		}

		// Reset delete data
		URLDeleteID = null;
		URLDeleteName = null;
	}

	onMount(() => {
		getInventory();
	});

	function copyToClipboard(text: string) {
		navigator.clipboard.writeText(text);
		triggerToast();
	}

	function formatTimestamp(timestamp: string) {
		// Convert the timestamp to a Date object
		const expirationDate = new Date(timestamp);
		return expirationDate.toLocaleString('id');
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
	<title>Inventory - Amerta URL Shortener</title>
</svelte:head>

<MainHeader authStatus={true} />

<main>
	<div class="px-12 py-12 bg-base-300 min-h-screen">
		<div class="my-4 mb-8">
			<h1 class="font-bold text-4xl">Inventory</h1>
			<p class="text-lg mt-2">
				Here you can find all the short urls that you already created. It shows only non-expired
				URL.
			</p>
		</div>

		<div class="overflow-x-auto">
			<table class="table shadow-2xl table-zebra w-full">
				<thead>
					<tr>
						<th />
						<th>URL Name</th>
						<th>Original</th>
						<th>Description</th>
						<th>Total Visit</th>
						<th>Expire In</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{#each data as item, index}
						<tr class="hover">
							<th>{++index}</th>
							<td>
								<a
									href={`${import.meta.env.VITE_PUBLIC_CLIENT_ORIGIN}/${item.short_url}`}
									class="link"
									target="_blank"
									rel="noreferrer"
								>
									{item.short_url}
								</a></td
							>
							<td class="max-w-[200px] truncate" title={item.original_url}>{item.original_url}</td>
							<td>{item.description}</td>
							<td>{item.visits}</td>
							<td>{formatTimestamp(item.expire_at)}</td>
							<td class="flex gap-2">
								<button
									on:click={() =>
										copyToClipboard(
											`${import.meta.env.VITE_PUBLIC_CLIENT_ORIGIN}/${item.short_url}`
										)}
									title="Copy URL"
									class="btn btn-sm btn-square"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="currentColor"
										class="w-4 h-4"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
										/>
									</svg>
								</button>

								<button
									on:click={() => {
										URLDeleteID = item.id;
										URLDeleteName = `${import.meta.env.VITE_PUBLIC_CLIENT_ORIGIN}/${
											item.short_url
										}`;
									}}
									for="my-modal-6"
									title="Delete"
									class="btn btn-error btn-sm btn-square"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="currentColor"
										class="w-4 h-4"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
										/>
									</svg>
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</main>

<input type="checkbox" id="my-modal-6" class="modal-toggle" />
<div class="modal modal-bottom sm:modal-middle {URLDeleteID ? 'modal-open' : ''}">
	<div class="modal-box">
		<h3 class="font-bold text-lg">You are about to delete the URL</h3>
		<p class="py-4">
			Are you sure you want to delete <strong>{URLDeleteName ?? ''}</strong>? This action cannot be
			undone.
		</p>
		<div class="modal-action">
			<label
				on:keydown
				on:keyup
				on:keypress
				on:click={() => {
					URLDeleteID = null;
					URLDeleteName = null;
				}}
				for="modal"
				class="btn">Cancel</label
			>
			<label
				on:keydown
				on:keyup
				on:keypress
				on:click={async () => {
					if (URLDeleteID) await deleteURL(URLDeleteID);
				}}
				for="modal"
				class="btn btn-ghost">Delete</label
			>
		</div>
	</div>
</div>

{#if toast}
	<Toast />
{/if}
