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

		<div class="navbar-end flex items-center gap-6">
			<div class="dropdown dropdown-end">
				<button class="btn btn-ghost btn-circle avatar">
					<div class="w-10 rounded-full">
						<img src="https://placeimg.com/80/80/people" alt="profile-avatar" />
					</div>
				</button>

				<ul class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-300 rounded-box w-52">
					<li>
						<a href="/inventory" class="justify-between"> Inventory </a>
					</li>
					<li><a href="/auth" on:click={() => localStorage.removeItem('token')}>Logout</a></li>
				</ul>
			</div>
		</div>
	</div>
</header>
