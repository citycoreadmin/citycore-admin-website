# Haitian Creole and French localization approval worksheet

**Status:** Prepared for review; no linguistic or operator approval is recorded.  
**Copy reviewed:** Current public strings in `js/locales/ht.js` and `js/locales/fr.js`, compared with `js/locales/en.js`.  
**Scope:** Public Help Center UI, accessibility and mobile-navigation labels, all ten public articles, and the complete localized Privacy Policy. Login, account creation, Supabase, ticketing, support staff, and dashboard copy are excluded.

## Approval rules

- Complete one linguistic worksheet and one operator-policy worksheet per language. They are separate approvals and require separate reviewers where appropriate.
- The fluent reviewer must inspect every source and localized string below, including punctuation, register, terminology, context, the exact quoted app-control names, placeholders if encountered, accessibility labels, and policy equivalence. Add every correction to the correction log and update the locale module before signing.
- The operator must make and evidence the factual decisions in the policy checklist. A translation review does not verify or approve facts about the operator, production infrastructure, App Store, or iOS app.
- Check an approval box only after the named reviewer has completed that review. The current status for both locales is **not approved**; both remain disabled.
- For the app controls quoted in the articles (for example `Servers`, `Panel Settings`, and `Log Out`), confirm the shipped app uses those exact labels. Preserve them if they are the actual product-control names.

## Public website UI and accessibility copy

| Key / context | English source | Haitian Creole (`ht`) | French (`fr`) |
| --- | --- | --- | --- |
| `skip_content` (skip link) | Skip to content | Ale dirèkteman nan kontni prensipal la | Aller au contenu |
| `close` (dialog controls) | Close | Fèmen | Fermer |
| `nav_open_menu` (mobile menu button accessible name) | Open navigation menu | Louvri meni navigasyon an | Ouvrir le menu de navigation |
| `nav_menu` (mobile menu accessible name) | Navigation menu | Meni navigasyon | Menu de navigation |
| `nav_download_app_store` (mobile App Store button) | Download on the App Store | Telechaje sou App Store la | Télécharger sur l’App Store |
| `page_home_title` | CityCore Admin \| Help Center | CityCore Admin \| Sant Èd | CityCore Admin \| Centre d'aide |
| `page_privacy_title` | Privacy Policy - CityCore Admin | Politik konfidansyalite - CityCore Admin | Politique de confidentialité - CityCore Admin |
| `language_available` | Available languages | Lang ki disponib yo | Langues disponibles |
| `language_complete` | Complete | Konplè | Complète |
| `language_review` | Review needed | Bezwen revizyon | Révision nécessaire |
| `language_unavailable` | Coming soon | Ap disponib talè | Bientôt disponible |
| `language_choose` | Choose a language | Chwazi yon lang | Choisir une langue |
| `language_search` | Search languages | Chèche lang yo | Rechercher une langue |
| `language_no_results` | No languages match your search. | Nou pa jwenn okenn lang pou rechèch sa a. | Aucune langue ne correspond à votre recherche. |
| `nav_home` | Home | Akèy | Accueil |
| `nav_help` | Help Center | Sant Èd | Centre d'aide |
| `nav_support` | Support | Sipò | Assistance |
| `hero_title` | Hi, how can we help you? | Bonjou, ki jan nou ka ede w? | Bonjour, comment pouvons-nous vous aider ? |
| `search_ph` (search field and accessible name) | Search for articles | Chèche atik yo | Rechercher des articles |
| `search_btn` | Search | Chèche | Rechercher |
| `platform` | Platform | Platfòm | Plateforme |
| `p_all` | All platforms | Tout platfòm | Toutes les plateformes |
| `p_ios` | iOS | iOS | iOS |
| `p_ipados` | iPadOS | iPadOS | iPadOS |
| `p_android` | Android | Android | Android |
| `p_web` | Web | Web | Web |
| `language` | Language | Lang | Langue |
| `theme` (theme button accessible name) | Toggle theme | Chanje tèm | Changer de thème |
| `help_cats` | Browse by category | Eksplore kategori yo | Parcourir par catégorie |
| `articles` | Articles | Atik | Articles |
| `results` | Search results | Rezilta rechèch | Résultats de recherche |
| `no_results` | No articles found. Try different words. | Nou pa jwenn okenn atik. Eseye lòt mo. | Aucun article trouvé. Essayez d'autres mots. |
| `back` | Back | Retounen | Retour |
| `all_cats` | All categories | Tout kategori | Toutes les catégories |
| `article_count` | articles | atik | articles |
| `cat_getting_started` | Getting Started | Kòmanse | Premiers pas |
| `cat_account_login` | Account & Login | Kont ak koneksyon | Compte et connexion |
| `cat_admin_panels` | Admin Panels | Panèl administrasyon | Panneaux d'administration |
| `cat_roles` | Roles & Permissions | Wòl ak pèmisyon | Rôles et autorisations |
| `cat_invitations` | Invitations | Envitasyon | Invitations |
| `cat_troubleshooting` | Troubleshooting | Rezoud pwoblèm | Dépannage |
| `cat_privacy` | Privacy & Security | Konfidansyalite ak sekirite | Confidentialité et sécurité |
| `cat_contact` | Support availability | Kilè sipò disponib | Disponibilité de l'assistance |
| `contact_status_title` | Support messaging is not available on this website yet. | Mesaj sipò yo poko disponib sou sit entènèt sa a. | La messagerie d'assistance n'est pas encore disponible sur ce site. |
| `contact_status_body` | The Help Center is available for self-service guidance. Ticket messaging will be enabled after security and functional testing is complete. Do not send account or payment details through this website. | Sant Èd la bay konsèy pou ede w jwenn repons poukont ou. Sèvis mesaj sipò a ap prepare epi li ap disponib apre tès sekirite ak fonksyònman yo fin fèt. Pa voye enfòmasyon sou kont ou oswa peman atravè sit entènèt sa a. | Le centre d'aide propose des conseils en libre-service. La messagerie d'assistance par ticket sera activée après la réussite des tests de sécurité et de fonctionnement. N'envoyez pas d'informations de compte ou de paiement sur ce site. |
| `footer` | © 2026 CityCore Admin. All rights reserved. | © 2026 CityCore Admin. Tout dwa rezève. | © 2026 CityCore Admin. Tous droits réservés. |
| `privacy` (policy link/title) | Privacy Policy | Politik konfidansyalite | Politique de confidentialité |

## All ten Help Center articles

The English control names embedded in the translated instructions are intentionally retained. Confirm they match the current app interface; do not translate those names if users need to locate controls labeled in English.

### 1. `servers` — Find and create Admin Panels

**HT title:** Jwenn epi kreye yon panèl administrasyon  
**FR title:** Trouver et créer des panneaux d'administration

| # | English source | Haitian Creole | French |
| --- | --- | --- | --- |
| 1 | Open CityCore Admin. | Louvri CityCore Admin. | Ouvrez CityCore Admin. |
| 2 | Tap Servers in the bottom navigation. | Peze «Servers» nan ba navigasyon ki anba ekran an. | Touchez « Servers » dans la barre de navigation inférieure. |
| 3 | Your existing Admin Panels appear under YOUR ADMIN PANELS. | Panèl administrasyon ou yo parèt anba «YOUR ADMIN PANELS». | Vos panneaux d'administration existants apparaissent sous « YOUR ADMIN PANELS ». |
| 4 | To start a new panel, tap + Create Admin Panel. | Pou kreye yon nouvo panèl, peze «+ Create Admin Panel». | Pour créer un nouveau panneau, touchez « + Create Admin Panel ». |

### 2. `panel-settings` — Panel Settings overview

**HT title:** Apèsi sou paramèt panèl la  
**FR title:** Aperçu des paramètres du panneau

| # | English source | Haitian Creole | French |
| --- | --- | --- | --- |
| 1 | Open the Admin Panel you want to manage. | Louvri panèl administrasyon ou vle jere a. | Ouvrez le panneau d'administration que vous souhaitez gérer. |
| 2 | Open Panel Settings. | Louvri «Panel Settings». | Ouvrez « Panel Settings ». |
| 3 | Use Members & Staff to manage members and staff. | Itilize «Members & Staff» pou jere manm ak anplwaye. | Utilisez « Members & Staff » pour gérer les membres et le personnel. |
| 4 | Use Moderation for sanction and moderation settings. | Itilize «Moderation» pou mete sanksyon ak moderasyon an plas. | Utilisez « Moderation » pour configurer les sanctions et la modération. |
| 5 | Use Server Management for permissions, audit logs, notifications and invitations. | Itilize «Server Management» pou jere pèmisyon, jounal odit, notifikasyon ak envitasyon. | Utilisez « Server Management » pour gérer les autorisations, les journaux d'audit, les notifications et les invitations. |

### 3. `roles` — Create and assign roles

**HT title:** Kreye epi bay wòl  
**FR title:** Créer et attribuer des rôles

| # | English source | Haitian Creole | French |
| --- | --- | --- | --- |
| 1 | Open your Admin Panel. | Louvri panèl administrasyon ou. | Ouvrez votre panneau d'administration. |
| 2 | Go to Panel Settings. | Ale nan «Panel Settings». | Allez dans « Panel Settings ». |
| 3 | Tap Roles & Permissions. | Peze «Roles & Permissions». | Touchez « Roles & Permissions ». |
| 4 | Use Create Role to make a new role. | Itilize «Create Role» pou kreye yon wòl. | Utilisez « Create Role » pour créer un rôle. |
| 5 | Use Assign Role to give a role to a member. | Itilize «Assign Role» pou bay yon manm yon wòl. | Utilisez « Assign Role » pour attribuer un rôle à un membre. |
| 6 | Existing roles appear under ROLE HIERARCHY. | Wòl ki deja egziste yo parèt anba «ROLE HIERARCHY». | Les rôles existants figurent sous « ROLE HIERARCHY ». |

### 4. `account-settings` — Account settings

**HT title:** Paramèt kont ou  
**FR title:** Paramètres du compte

| # | English source | Haitian Creole | French |
| --- | --- | --- | --- |
| 1 | Tap Profile in the bottom navigation and open Settings. | Peze «Profile» nan ba navigasyon ki anba ekran an, epi louvri «Settings». | Touchez « Profile » dans la barre de navigation inférieure, puis ouvrez « Settings ». |
| 2 | Available settings may vary by app version. | Paramèt ki disponib yo ka chanje selon vèsyon aplikasyon an. | Les paramètres disponibles peuvent varier selon la version de l'application. |
| 3 | Use Log Out to sign out of your account. | Itilize «Log Out» pou dekonekte w. | Utilisez « Log Out » pour vous déconnecter. |

### 5. `get-started` — Welcome to CityCore Admin

**HT title:** Byenveni sou CityCore Admin  
**FR title:** Bienvenue sur CityCore Admin

| # | English source | Haitian Creole | French |
| --- | --- | --- | --- |
| 1 | Install CityCore Admin and create your account. | Enstale CityCore Admin epi kreye kont ou. | Installez CityCore Admin et créez votre compte. |
| 2 | Open the Servers tab to see or create an Admin Panel. | Ale nan seksyon «Servers» pou wè oswa kreye yon panèl administrasyon. | Ouvrez l'onglet « Servers » pour afficher ou créer un panneau d'administration. |
| 3 | Invite your staff and set up roles. | Envite anplwaye ou yo epi mete wòl yo. | Invitez votre équipe et configurez les rôles. |
| 4 | Use Panel Settings to configure moderation. | Itilize «Panel Settings» pou konfigire moderasyon. | Utilisez « Panel Settings » pour configurer la modération. |

### 6. `login-problems` — I can't log in

**HT title:** Mwen pa ka konekte  
**FR title:** Je n'arrive pas à me connecter

| # | English source | Haitian Creole | French |
| --- | --- | --- | --- |
| 1 | Check your email address and password for typos. | Verifye si adrès imèl ou ak modpas ou gen erè. | Vérifiez votre adresse e-mail et votre mot de passe pour repérer les fautes de frappe. |
| 2 | Use the password reset option on the sign-in screen. | Sou ekran koneksyon an, itilize opsyon pou reyinisyalize modpas la. | Sur l'écran de connexion, utilisez l'option de réinitialisation du mot de passe. |
| 3 | Make sure the app is up to date. | Asire w aplikasyon an ajou. | Vérifiez que l'application est à jour. |
| 4 | Support messaging is not currently available on this website. | Mesaj sipò pa disponib sou sit sa a kounye a. | La messagerie d'assistance n'est pas disponible actuellement sur ce site. |

### 7. `invite-members` — Invite people to your panel

**HT title:** Envite moun nan panèl administrasyon ou  
**FR title:** Inviter des personnes dans votre panneau

| # | English source | Haitian Creole | French |
| --- | --- | --- | --- |
| 1 | Open your Admin Panel and go to Panel Settings. | Louvri panèl administrasyon ou epi ale nan «Panel Settings». | Ouvrez votre panneau d'administration, puis « Panel Settings ». |
| 2 | Open Server Management, then Invitations. | Louvri «Server Management», answit «Invitations». | Ouvrez « Server Management », puis « Invitations ». |
| 3 | Create an invitation and share it. | Kreye yon envitasyon epi pataje l. | Créez une invitation et partagez-la. |
| 4 | Revoke an invitation at any time from the same screen. | Ou ka anile envitasyon an nenpòt ki lè sou menm ekran an. | Révoquez-la à tout moment depuis le même écran. |

### 8. `app-crash` — The app crashes or won't load

**HT title:** Aplikasyon an sispann fonksyone sanzatann oswa li pa chaje  
**FR title:** L'application plante ou ne charge pas

| # | English source | Haitian Creole | French |
| --- | --- | --- | --- |
| 1 | Force-close and reopen the app. | Fèmen aplikasyon an nèt, epi louvri l ankò. | Fermez et rouvrez l'application. |
| 2 | Check your internet connection. | Verifye koneksyon entènèt ou. | Vérifiez votre connexion internet. |
| 3 | Update to the latest version. | Mete aplikasyon an ajou ak dènye vèsyon an. | Mettez à jour l'application. |
| 4 | Restart your device. | Rekòmanse aparèy ou a. | Redémarrez votre appareil. |
| 5 | This website cannot currently receive bug reports or attachments. | Sit sa a pa ka resevwa rapò sou pwoblèm oswa fichye pou kounye a. | Ce site ne peut pas recevoir de signalements de bogues ni de pièces jointes pour le moment. |

### 9. `privacy-security` — Keeping your account secure

**HT title:** Sekirize kont ou  
**FR title:** Sécuriser votre compte

| # | English source | Haitian Creole | French |
| --- | --- | --- | --- |
| 1 | Use a strong, unique password. | Itilize yon modpas solid ki diferan de lòt modpas ou yo. | Utilisez un mot de passe fort et unique. |
| 2 | Do not share your password with anyone. | Pa bay pèsonn modpas ou. | Ne communiquez votre mot de passe à personne. |
| 3 | For privacy questions or account/data deletion requests, see the Privacy Policy link at the bottom of this page. | Pou kesyon sou konfidansyalite oswa demann pou efase kont ou oswa done ou, gade lyen Politik konfidansyalite ki anba paj sa a. | Pour toute question sur la confidentialité ou toute demande de suppression de compte ou de données, consultez le lien Politique de confidentialité en bas de cette page. |

### 10. `contact` — Support availability

**HT title:** Kilè sipò disponib  
**FR title:** Disponibilité de l'assistance

| # | English source | Haitian Creole | French |
| --- | --- | --- | --- |
| 1 | This website currently provides self-service Help Center articles only. | Pou kounye a, sit entènèt sa a bay sèlman atik Sant Èd pou ede w jwenn repons poukont ou. | Ce site propose actuellement uniquement des articles d'aide en libre-service. |
| 2 | Ticket messaging is being prepared and will be enabled after security and functional testing. | Sèvis mesaj sipò a ap prepare epi li ap disponib apre tès sekirite ak fonksyònman yo fin fèt. | La messagerie d'assistance par ticket est en préparation et sera activée après la réussite des tests de sécurité et de fonctionnement. |
| 3 | Do not send account, password or payment details through this website. | Pa voye enfòmasyon sou kont ou, modpas ou oswa peman atravè sit entènèt sa a. | N'envoyez pas d'informations de compte, de mot de passe ou de paiement sur ce site. |

## Complete localized Privacy Policy

The policy text below follows the live policy structure. The App Store privacy-information phrase is a link to the current URL in `privacy.html`; the contact address is `citycoreadmin@gmail.com`. Operator factual decisions and evidence are listed separately below; displaying or translating a statement here does not verify its truth.

### Haitian Creole (`ht`)

**Dènye mizajou: 12 novanm 2026**

**WOOBENS STUDIO ap jere CityCore Admin. Paj sa a fè diferans ant sit entènèt piblik CityCore Admin ki estatik la ak aplikasyon CityCore Admin pou iOS la.**

Sit entènèt sa a bay aksè ak paj Sant Èd la; li pa mande enfòmasyon sou kont oswa peman. Li pa gen fòm kontak ni sèvis mesaj sipò.

#### Sit entènèt sa a

Sit entènèt la anrejistre lang, tèm ak platfòm ou chwazi yo nan depo lokal navigatè sa a. Ou ka retire preferans sa yo lè w efase done sit entènèt la nan navigatè w la. Operatè a poko konfime kijan founisè ebèjman an trete enfòmasyon teknik ki gen rapò ak demann yo.

#### Aplikasyon iOS la

[enfòmasyon sou konfidansyalite nan App Store la] pou CityCore Admin endike yo ka kolekte non, adrès imèl, foto oswa videyo, asosye yo ak itilizatè yo, epi sèvi ak yo pou fonksyonalite aplikasyon an.

WOOBENS STUDIO poko konfime tout detay sou fason aplikasyon ki pibliye a kolekte epi itilize done yo, pataje yo, pwoteje yo, konsève yo oswa efase yo, ni sou pratik ki konsène timoun. Enfòmasyon ki nan App Store la pa bay tout detay sou pratik sa yo.

#### Kontakte nou

Pou kesyon sou konfidansyalite oswa pou mande pou yo efase kont ou oswa done ou, kontakte WOOBENS STUDIO nan citycoreadmin@gmail.com. Yon demann pa vle di done yo ap efase otomatikman, epi pa gen okenn delè tretman ki pwomèt.

© 2026 Woobens Studio. Tout dwa rezève.

### French (`fr`)

**Dernière mise à jour : 12 novembre 2026**

**CityCore Admin est exploité par WOOBENS STUDIO. Cette page distingue le site web statique CityCore Admin de l'application iOS CityCore Admin.**

Le site propose des pages du centre d'aide et ne demande pas d'informations de compte ou de paiement. Il ne dispose ni de formulaire de contact ni de messagerie d'assistance.

#### Ce site web

Le site enregistre la langue, le thème et la plateforme que vous avez choisis dans le stockage local de ce navigateur. Vous pouvez supprimer ces préférences en effaçant les données de ce site dans votre navigateur. L'opérateur n'a pas confirmé la façon dont l'hébergeur traite les informations techniques des requêtes.

#### Application iOS

Les [informations de confidentialité de l'App Store] pour CityCore Admin indiquent que le nom, l'adresse e-mail et les photos ou vidéos peuvent être collectés, liés aux utilisateurs et utilisés pour le fonctionnement de l'application.

WOOBENS STUDIO n'a pas encore confirmé de manière exhaustive comment l'application publiée collecte et utilise les données, les partage, les protège, les conserve ou les supprime, ni les pratiques qu'elle applique concernant les enfants. Les informations de l'App Store ne permettent pas d'établir toutes ces pratiques.

#### Nous contacter

Pour toute question sur la confidentialité ou pour demander la suppression de votre compte ou de vos données, contactez WOOBENS STUDIO à citycoreadmin@gmail.com. Une demande n'entraîne pas de suppression automatique et aucun délai de traitement n'est garanti.

© 2026 Woobens Studio. Tous droits réservés.

## WOOBENS STUDIO factual policy decisions

Complete this operator review independently for each language policy. Record supporting evidence or the named accountable person; do not approve based only on repository text or the App Store privacy label.

- [ ] **Operator identity and role:** Is WOOBENS STUDIO the correct legal entity/operator/controller? Record legal name, address/contact, relevant jurisdictions, and any required representative.
- [ ] **Website request behavior:** Does the production website request or collect account, payment, contact, or other personal information beyond the visible help/search experience? Confirm whether any embedded third-party services change this.
- [ ] **Local storage:** Confirm `cc_lang`, `cc_theme`, and `cc_platform` are the only site preferences stored; explain purpose, expiration/lifetime, clearing behavior, and whether cookies, session storage, or other browser storage are used.
- [ ] **Analytics and third parties:** Confirm whether analytics, advertising, fonts, scripts, embeds, or other third parties run in production, and whether they collect identifiers or transmit data.
- [ ] **Hosting and request data:** Obtain current Cloudflare/hosting documentation and operator configuration for IP addresses, request logs, security telemetry, cookies, subprocessors, retention/deletion periods, and international transfers. State what is collected and for how long; repository inspection cannot establish provider practices.
- [ ] **App Store disclosure:** Open the current listing at the policy URL. Confirm whether Name, Email Address, and Photos or Videos are currently listed, and whether each is collected, linked to users, and used for App Functionality. Preserve listing URL, date, and evidence. This environment has not independently verified the live listing.
- [ ] **iOS app practices:** Confirm actual data collected, purposes, user linkage, sharing/sale, tracking, permissions, SDKs/processors, security, retention, deletion (including backups and processors), and practices involving children. The current policy expressly says these have not been comprehensively confirmed.
- [ ] **Deletion requests:** Confirm request intake, identity verification, eligibility/exceptions, actual processing time, what is deleted, what remains in backups/legal records, and when deletion is complete. Do not promise automatic deletion or a timeframe unless operationally guaranteed.
- [ ] **Legal content and date:** Qualified reviewer to confirm required disclosures, rights, lawful bases/consent where applicable, age/children language, effective/updated date, and any jurisdiction-specific wording.
- [ ] **Final English source approval:** Record the operator/legal reviewer’s approval of the source policy version. Then confirm that both HT and FR convey the same approved factual and legal meaning.

### Operator policy approval record — Haitian Creole

- Reviewer name / role: ______________________________________________
- Evidence reviewed (links, documents, dates): _________________________
- Decisions/corrections required: ____________________________________
- Policy version / date reviewed: ____________________________________
- [ ] **APPROVED** — I confirm the facts and legal/policy content for the Haitian Creole Privacy Policy, based on the evidence recorded above.
- Signature or recorded approval reference: ___________________________
- Date: __________________

### Operator policy approval record — French

- Reviewer name / role: ______________________________________________
- Evidence reviewed (links, documents, dates): _________________________
- Decisions/corrections required: ____________________________________
- Policy version / date reviewed: ____________________________________
- [ ] **APPROVED** — I confirm the facts and legal/policy content for the French Privacy Policy, based on the evidence recorded above.
- Signature or recorded approval reference: ___________________________
- Date: __________________

## Linguistic approval records

### Haitian Creole fluent-speaker review

- Reviewer name and language/region expertise: ________________________
- Date and locale variety reviewed: ___________________________________
- Corrections made (file/key/article/step and before → after): __________
- Remaining issues or notes: _________________________________________
- [ ] Reviewed all public UI and accessibility/mobile-menu labels above.
- [ ] Reviewed all ten Help Center article titles and steps above.
- [ ] Reviewed the complete Privacy Policy above for complete, natural, equivalent meaning.
- [ ] Confirmed retained English app-control names match the shipped app labels, or recorded corrections.
- [ ] Confirm `Chanje tèm` names the theme control naturally, and `Kilè sipò disponib` is suitable as both a category label and the contact-article title.
- [ ] **LINGUISTIC APPROVAL** — I approve this Haitian Creole public website copy for the stated locale/variety.
- Reviewer signature or recorded approval reference: __________________

### French fluent-speaker review

- Reviewer name and language/region expertise: ________________________
- Date and locale variety reviewed: ___________________________________
- Corrections made (file/key/article/step and before → after): __________
- Remaining issues or notes: _________________________________________
- [ ] Reviewed all public UI and accessibility/mobile-menu labels above.
- [ ] Reviewed all ten Help Center article titles and steps above.
- [ ] Reviewed the complete Privacy Policy above for complete, natural, equivalent meaning.
- [ ] Confirmed retained English app-control names match the shipped app labels, or recorded corrections.
- [ ] **LINGUISTIC APPROVAL** — I approve this French public website copy for the stated locale/variety.
- Reviewer signature or recorded approval reference: __________________

## Activation gate

Current registry status is unchanged: only English (`en`) is complete/enabled. Haitian Creole and French remain review-needed and disabled. This worksheet records no approval by itself.

Before enabling either locale:

1. Apply and commit all reviewer corrections to the locale module.
2. Obtain and record both that locale's linguistic approval and its separate WOOBENS STUDIO policy approval above.
3. Rerun localization coverage, placeholder, mobile/RTL, and Cloudflare Workers asset/routing checks against the final copy.
4. Verify the locale's module is included in the public asset allowlist and that tests still enforce approval gating.
5. Only after those records and checks pass, deliberately update the locale status and verify selector/runtime behavior.

Do not treat an unchecked box, a draft translation, code inspection, or a passing test as an approval. Keep the locale disabled until both approvals are actually recorded.
