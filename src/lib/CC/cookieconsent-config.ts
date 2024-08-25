import * as CookieConsent from 'vanilla-cookieconsent';

const config: CookieConsent.CookieConsentConfig = {
	categories: {
		necessary: {
			enabled: true,
			readOnly: true
		}
	},

	guiOptions: {
		consentModal: {
			layout: 'box inline',
			position: 'bottom left',
			equalWeightButtons: true,
			flipButtons: false
		},
		preferencesModal: {
			layout: 'box',
			equalWeightButtons: true,
			flipButtons: false
		}
	},

	language: {
		default: 'en',
		translations: {
			en: {
				consentModal: {
					title: 'Diese Seite benutzt Cookies.',
					description:
						'Durch die weitere Nutzung dieser Webseite stimmen Sie der Verwendung von funktionalen Cookies zu. Cookies werden ausschließlich zum Speichern der Anmeldung verwendet und werden nie verarbeitet oder an Dritte weitergegeben.',
					acceptAllBtn: 'Alle akzeptieren',
					showPreferencesBtn: 'Details einblenden',
					footer: `
							<a href="/impressum" target="_blank">Impressum</a>
							<a href="/datenschutz" target="_blank">Datenschutzerklärung</a>
					`
				},
				preferencesModal: {
					title: 'Zwecke',
					acceptAllBtn: 'Alle akzeptieren',
					closeIconLabel: 'Schließen',
					serviceCounterLabel: 'Service|Services',
					sections: [
						{
							title: 'Ihre Privatsphäre ist uns wichtig',
							description: `In diesem Panel können Sie einige Präferenzen im Zusammenhang mit der Verarbeitung Ihrer persönlichen Informationen ausdrücken. Um Ihre Zustimmung zu den unten beschriebenen spezifischen Verarbeitungsaktivitäten zu verweigern, schalten Sie die Kippschalter auf “Aus” oder verwenden Sie die Schaltfläche “Alle ablehnen” und bestätigen Sie, dass Sie Ihre Auswahl speichern möchten.`
						},
						{
							title: 'Funktional notwendig',
							description:
								'Diese Cookies sind für die ordnungsgemäße Funktion der Website unerlässlich und können nicht deaktiviert werden.',

							linkedCategory: 'necessary'
						},
						{
							title: 'Weitere Informationen',
							description:
								'Für weitere Informationen über die Verarbeitung Ihrer persönlichen Daten und Ihre Rechte, lesen Sie bitte unsere <a href="/datenschutz" target="_blank">Datenschutzerklärung</a>.'
						},
						{
							title: 'Kontakt',
							description: '<a href="/impressum" target="_blank">Impressum</a>'
						}
					]
				}
			}
		}
	}
};

export default config;
