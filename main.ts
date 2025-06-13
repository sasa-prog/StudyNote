import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

enum Subject {
	Math = 'Math',
	English = 'English',
	Art = 'Art',
	Music = 'Music',
	PhysicalEducation = 'Physical Education',
	History = 'History',
	Geography = 'Geography',
	Chemistry = 'Chemistry',
	Physics = 'Physics',
	Other = 'Other',
	Biology = 'Biology',
	Science = 'Science',
	LanguageArts = 'Language Arts'
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('This is a notice!');
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				new StudyStartModal(this.app).open();
			}
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection('Sample Editor Command');
			}
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-sample-modal-complex',
			name: 'Open sample modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new StudyStartModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class StudyStartModal extends Modal {
	constructor(app: App) {
		super(app);
		this.setTitle('Study Start');
		this.contentEl.appendChild(document.createElement('p')).setText('Select a subject to start your study session:');
		new Setting(this.contentEl).addDropdown(dropdown => {
			dropdown
				.addOption(Subject.Math, 'Math')
				.addOption(Subject.English, 'English')
				.addOption(Subject.Art, 'Art')
				.addOption(Subject.Music, 'Music')
				.addOption(Subject.PhysicalEducation, 'Physical Education')
				.addOption(Subject.History, 'History')
				.addOption(Subject.Geography, 'Geography')
				.addOption(Subject.Chemistry, 'Chemistry')
				.addOption(Subject.Physics, 'Physics')
				.addOption(Subject.Other, 'Other')
				.addOption(Subject.Biology, 'Biology')
				.addOption(Subject.Science, 'Science')
				.addOption(Subject.LanguageArts, 'Language Arts');
			dropdown.setValue(Subject.Math);
			dropdown.onChange((value) => {
				console.log('Selected subject:', value);
			});
		});
		new Setting(this.contentEl).addButton(button => {
			button
				.setButtonText('Start')
				.setCta()
				.onClick(() => {
					new Notice('Study session started!');
					this.close();
				});
		});
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}

