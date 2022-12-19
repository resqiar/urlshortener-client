<script lang="ts">
	export let authStatus: boolean = false;
</script>

<header>
	<div class="navbar bg-base-100 px-8 py-2">
		<div class="navbar-start">
			<div class="flex-1">
				<a href="/" class="normal-case flex flex-col font-bold text-3xl">
					Amerta
					<p class="text-sm pl-[2px]">URL Shortener</p>
				</a>
			</div>
		</div>

		{#if authStatus}
			<div class="navbar-end flex items-center gap-6">
				<a href="/create" class="btn btn-primary btn-sm px-4 gap-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-5 h-5"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
					</svg>

					Create
				</a>

				<div class="dropdown dropdown-end">
					<button class="btn btn-ghost btn-circle avatar">
						<div class="w-10 rounded-full">
							<img src="https://placeimg.com/80/80/people" alt="profile-avatar" />
						</div>
					</button>

					<ul
						class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-300 rounded-box w-52"
					>
						<li>
							<a href="/profile" class="justify-between"> Profile </a>
						</li>
						<li>
							<a href="/inventory" class="justify-between"> Inventory </a>
						</li>
						<li><a href="/auth" on:click={() => localStorage.removeItem('token')}>Logout</a></li>
					</ul>
				</div>
			</div>
		{:else}
			<div class="navbar-end flex items-center gap-6">
				<a href="/auth" class="font-bold text-lg">Login</a>
			</div>
		{/if}
	</div>
</header>
