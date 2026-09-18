'use strict';

const { Plugin, PluginSettingTab, Setting } = require('obsidian');

const DEFAULT_SETTINGS = {
	emojis: '🎈,🎈,🎉,✨',
	count: 7,
	duration: 1800,
	spread: 90,
	rise: 260,
	debug: false,
};

class TaskBalloonsPlugin extends Plugin {
	async onload() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());

		this.layer = document.body.createDiv({ cls: 'task-balloons-layer' });
		this.addSettingTab(new TaskBalloonsSettingTab(this.app, this));

		this.lastBurst = { x: -1e6, y: -1e6, time: -1e6 };

		// A task can be completed through several routes (reading view, live
		// preview, the Tasks plugin, the checklist sidebar, the keyboard
		// toggle command) and they don't all produce the same events, so we
		// watch both and de-duplicate in fire().
		//
		// Both handlers decide with isDone(), never with the input's `checked`
		// property: in live preview Obsidian intercepts the click and rewrites
		// the markdown itself, so that property doesn't reliably track the task
		// and an uncheck looks exactly like a check. isDone() reads the state
		// Obsidian renders from the source, which is still the pre-click state
		// in both handlers — so "was not done" means this toggle completes it.
		this.registerDomEvent(
			document,
			'click',
			(evt) => {
				const el = this.taskCheckbox(evt.target);
				if (!el || this.isDone(el)) return;
				this.fire(el, evt);
			},
			true
		);

		// Catches completions that never produced a usable click (keyboard,
		// programmatic toggles).
		this.registerDomEvent(document, 'change', (evt) => {
			const el = this.taskCheckbox(evt.target);
			if (!el || this.isDone(el)) return;
			this.fire(el, evt);
		});

		this.addCommand({
			id: 'test-balloons',
			name: 'Test balloons',
			callback: () => {
				this.burst(window.innerWidth / 2, window.innerHeight * 0.65);
			},
		});
	}

	onunload() {
		this.layer?.remove();
	}

	/** The clicked element, if it is a task checkbox. */
	taskCheckbox(target) {
		if (!(target instanceof HTMLInputElement)) return null;
		if (target.type !== 'checkbox') return null;
		const isTask =
			target.classList.contains('task-list-item-checkbox') ||
			target.closest('.task-list-item, .HyperMD-task-line, .checklist-item');
		return isTask ? target : null;
	}

	/**
	 * Is this task already done, per the state Obsidian rendered from the
	 * markdown? Deliberately avoids the `checked` property, which the user's
	 * click flips (or which live preview never sets); the `data-task` attribute
	 * and `is-checked` class only change after the source is rewritten.
	 */
	isDone(el) {
		const line = el.closest('.task-list-item, .HyperMD-task-line, .checklist-item');
		if (line) {
			const task = line.getAttribute('data-task');
			if (task !== null) return task.trim() !== '';
			if (line.classList.contains('is-checked')) return true;
		}
		const task = el.getAttribute('data-task');
		if (task !== null) return task.trim() !== '';
		return el.hasAttribute('checked');
	}

	/** Fire a burst at the checkbox, ignoring a duplicate from the other listener. */
	fire(el, evt) {
		if (this.settings.debug) {
			console.log('[Task Balloons] firing', {
				done: this.isDone(el),
				dataTask: JSON.stringify(el.getAttribute('data-task')),
				checkedProp: el.checked,
				checkedAttr: el.hasAttribute('checked'),
				line: el.closest('.task-list-item, .HyperMD-task-line, .checklist-item')?.className,
			});
		}

		let x = evt.clientX;
		let y = evt.clientY;
		// Keyboard and programmatic toggles report 0,0 — use the box instead.
		if (!x && !y) {
			const rect = el.getBoundingClientRect();
			x = rect.left + rect.width / 2;
			y = rect.top + rect.height / 2;
		}

		const now = performance.now();
		const last = this.lastBurst;
		const isEcho =
			now - last.time < 400 &&
			Math.abs(x - last.x) < 30 &&
			Math.abs(y - last.y) < 30;
		if (isEcho) return;

		this.lastBurst = { x, y, time: now };
		this.burst(x, y);
	}

	burst(x, y) {
		const emojis = this.settings.emojis
			.split(',')
			.map((s) => s.trim())
			.filter(Boolean);
		if (!emojis.length) return;

		const count = Math.max(1, Math.min(40, this.settings.count));

		for (let i = 0; i < count; i++) {
			const emoji = emojis[Math.floor(Math.random() * emojis.length)];
			const balloon = this.layer.createSpan({ cls: 'task-balloon', text: emoji });

			balloon.style.left = `${x}px`;
			balloon.style.top = `${y}px`;
			balloon.style.fontSize = `${16 + Math.random() * 12}px`;

			const drift = (Math.random() - 0.5) * this.settings.spread * 2;
			const rise = this.settings.rise * (0.7 + Math.random() * 0.6);
			const sway = 10 + Math.random() * 14;
			const duration = this.settings.duration * (0.8 + Math.random() * 0.5);
			const delay = Math.random() * 180;

			const anim = balloon.animate(
				[
					{
						transform: 'translate(-50%, -50%) scale(0.2) rotate(0deg)',
						opacity: 0,
					},
					{
						transform: `translate(calc(-50% + ${drift * 0.25}px), calc(-50% - ${rise * 0.2}px)) scale(1) rotate(${sway}deg)`,
						opacity: 1,
						offset: 0.2,
					},
					{
						transform: `translate(calc(-50% + ${drift * 0.7}px), calc(-50% - ${rise * 0.65}px)) scale(1) rotate(${-sway}deg)`,
						opacity: 1,
						offset: 0.7,
					},
					{
						transform: `translate(calc(-50% + ${drift}px), calc(-50% - ${rise}px)) scale(0.85) rotate(${sway * 0.4}deg)`,
						opacity: 0,
					},
				],
				{
					duration,
					delay,
					easing: 'cubic-bezier(0.2, 0.6, 0.3, 1)',
					fill: 'forwards',
				}
			);

			anim.onfinish = () => balloon.remove();
			anim.oncancel = () => balloon.remove();
		}
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class TaskBalloonsSettingTab extends PluginSettingTab {
	constructor(app, plugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display() {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName('Balloons')
			.setDesc('Comma-separated emoji. Repeat one to make it more likely.')
			.addText((text) =>
				text
					.setPlaceholder(DEFAULT_SETTINGS.emojis)
					.setValue(this.plugin.settings.emojis)
					.onChange(async (value) => {
						this.plugin.settings.emojis = value;
						await this.plugin.saveSettings();
					})
			);

		const num = (name, desc, key, min, max, step) =>
			new Setting(containerEl)
				.setName(name)
				.setDesc(desc)
				.addSlider((slider) =>
					slider
						.setLimits(min, max, step)
						.setValue(this.plugin.settings[key])
						.setDynamicTooltip()
						.onChange(async (value) => {
							this.plugin.settings[key] = value;
							await this.plugin.saveSettings();
						})
				);

		num('How many', 'Balloons released per completed task.', 'count', 1, 30, 1);
		num('Float time', 'Milliseconds before they fade out.', 'duration', 600, 4000, 100);
		num('Spread', 'How far they drift sideways, in pixels.', 'spread', 10, 300, 10);
		num('Rise', 'How far they float upward, in pixels.', 'rise', 60, 700, 20);

		new Setting(containerEl)
			.setName('Debug logging')
			.setDesc('Log every burst to the developer console (Cmd+Opt+I).')
			.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.debug).onChange(async (value) => {
					this.plugin.settings.debug = value;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl).addButton((btn) =>
			btn.setButtonText('Preview').onClick(() => {
				const rect = containerEl.getBoundingClientRect();
				this.plugin.burst(rect.left + rect.width / 2, rect.bottom - 40);
			})
		);
	}
}

module.exports = TaskBalloonsPlugin;
