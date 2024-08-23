<script lang="ts">
	let audio: HTMLAudioElement;
	let isRunning = false;

	export function runOsterEi() {
		if (isRunning || !audio.paused) {
			return;
		}
		isRunning = true;
		timingPatternOne();

		setTimeout(() => {
			timingPatternOne();
			audio.play();
			shakeScreen();
		}, 400);

		setTimeout(() => {
			timingPatternTwo();
			isRunning = false;
		}, 3200);

		setTimeout(() => {
			timingPatternTwo();
			shakeScreen();
		}, 2500);
	}

	function timingPatternOne() {
		toggleTheme();
		setTimeout(() => {
			toggleTheme();

			setTimeout(() => {
				toggleTheme();

				setTimeout(() => {
					toggleTheme();
				}, 200);
			}, 50);
		}, 50);
	}

	function timingPatternTwo() {
		toggleTheme();
		setTimeout(() => {
			toggleTheme();
		}, 150);
	}

	function toggleTheme() {
		const rootElement = document.documentElement;
		if (rootElement.classList.contains('dark')) {
			rootElement.classList.remove('dark');
		} else {
			rootElement.classList.add('dark');
		}
	}

	function shakeScreen() {
		const rootElement = document.body;
		performRandomTransform(rootElement);
		performRandomTransform(rootElement);

		setTimeout(() => {
			performRandomTransform(rootElement);
			performRandomTransform(rootElement);
		}, 300);
	}

	function performRandomTransform(el: HTMLElement) {
		const effectClass = getRandomTransform();

		el.classList.add(effectClass);
		setTimeout(() => {
			el.classList.remove(effectClass);
		}, 100);
	}

	function getRandomTransform(): string {
		const options = ['translate-x-', 'translate-y-', 'rotate-'];
		const random = Math.floor(Math.random() * options.length);

		let effectClass = options[random];
		if (random == 2) {
			const intensity = ['6', '12', '45'];
			const rInty = Math.floor(Math.random() * intensity.length);
			effectClass += intensity[rInty];
		} else {
			const intensity = ['6', '8', '12', '20'];
			const rInty = Math.floor(Math.random() * intensity.length);
			effectClass += intensity[rInty];
		}

		return effectClass;
	}
</script>

<audio bind:this={audio} src="/thunder.mp3" preload="auto"></audio>
