# CityCore Admin — First 10 Localization Review Package

**Purpose:** human review of the nine non-English priority locale drafts. English (`en`) is the complete source language and is not included below.

**Approval state:** all nine drafts remain Review needed and disabled. A narrow operator confirmation of the contact email is recorded below; no fluent-speaker review or full Privacy Policy approval is recorded. Do not mark any locale Complete or enable it until both approvals and corrections are explicitly recorded.

## Reviewer instructions

- For each language, review every public string below, including headings, search, buttons, status text, screen-reader labels, and all ten article titles and steps. Check that quoted English app control names match the shipped app.
- Review the complete policy text as a translation of the English source, then record operator fact-checking separately. Do not resolve factual uncertainty by making the localized text sound more certain.
- Record reviewer name, fluency/language variant, date, findings/corrections, and operator policy decision in the PR. Keep the locale disabled until corrections pass the technical checks.
- Arabic additionally needs a fluent copy review in RTL context. Automated mobile RTL checks are not linguistic approval.
- The public contact section identifies `citycoreadmin@gmail.com` for customer support, privacy questions, account deletion requests, bug reports, and feedback. Confirm the translated wording while preserving that ticket messaging is not available on the website.

## Operator confirmation required for the Privacy Policy

Confirm these source facts before approving any localized policy; a translation cannot validate them:

1. **Operator identity:** WOOBENS STUDIO is the correct operator/controller name and attribution for this website and the iOS app.
2. **Website behavior:** the site requests no account/payment information, has no contact form or support messaging, and stores only the stated language/theme/platform preferences in browser local storage. Confirm whether cookies, analytics, or other client-side storage are used.
3. **Hosting and request data:** confirm Cloudflare/hosting logs and technical request information are described accurately. The text explicitly says the operator has not confirmed the provider handling; verify this is still true and whether that disclosure is sufficient.
4. **App Store disclosure:** verify the linked App Store listing is the current CityCore Admin listing and that its named categories (name, email, photos/videos) and purposes/linkage match the live App Privacy disclosures.
5. **Unconfirmed app practices:** confirm that collection/use, sharing, security, retention, deletion, and child-related practices have not been fully confirmed. Do not infer that a practice does not occur merely because it is unconfirmed.
6. **Contact and deletion:** the official address and its approved uses are confirmed below. Still verify the email is monitored, the described deletion-request path is available, a request does not automatically delete data, and no processing timeframe is promised.
7. **Date and legal scope:** verify the “last updated” date and that no unsupported jurisdictional rights, guarantees, or legal conclusions have been added by translation.

## Limited operator confirmation

On 2026-11-14, WOOBENS STUDIO confirmed: “WOOBENS STUDIO confirms that citycoreadmin@gmail.com is the official contact email for CityCore Admin.” This address is confirmed for customer support, Privacy Policy inquiries, account deletion requests, bug reports, and feedback. This confirms only the contact address and its approved uses. It is not approval of the full Privacy Policy and does not verify monitoring, response times, deletion handling, or any other privacy practice.

## Corrections and language-specific review flags

- **Haitian Creole (`ht`):** previous wording edits are recorded in `LOCALIZATION_QA.md`. Have a fluent reviewer confirm the regional naturalness of “Panèl administrasyon,” “Chanje aparans,” and the privacy/legal register. Separate support-dashboard-only terms are outside this public package.
- **French (`fr`):** previous policy and support terminology edits are recorded in `LOCALIZATION_QA.md`. Verify the “messagerie d’assistance par ticket” wording, quoted English UI labels, and that policy uncertainty/absence of a guaranteed processing time is preserved.
- **Spanish (`es`):** confirm the intended neutral/regional register and consistent “soporte” terminology; verify the App Store sentence preserves “may be collected” rather than asserting collection as fact.
- **Portuguese (`pt`):** confirm the locale is European Portuguese (not Brazilian Portuguese), including “contacto,” “palavra-passe,” and second-person/formality consistency; verify the App Store and deletion wording.
- **German (`de`):** the audit-log term in the panel-settings article was changed to “Audit-Protokolle”; confirm this is idiomatic for the app’s audit-log feature and consistent with product terminology.
- **Italian (`it`):** self-service phrasing in the contact notice/article was revised; confirm the revisions are natural and the support-unavailable statement does not imply a launch date.
- **Arabic (`ar`):** confirm Modern Standard Arabic register, correct policy meaning, punctuation, and reading order in RTL; inspect mixed-direction product names, email address, and App Store link.
- **Simplified Chinese (`zh-Hans`):** confirm Simplified Chinese locale conventions and that policy wording distinguishes the website from the iOS app without strengthening unverified claims.
- **Japanese (`ja`):** confirm policy/legal register and the “無断複製・転載を禁じます” footer wording; ensure the App Store, retention, deletion, and children-related caveats remain accurate.

## Locale drafts

### Kreyòl Ayisyen (`ht`) — Review needed / disabled

Source: [js/locales/ht.js](../js/locales/ht.js)

#### Public website and interface strings

**skip_content**
> Ale dirèkteman nan kontni prensipal la

**close**
> Fèmen

**page_home_title**
> CityCore Admin | Sant Èd

**page_privacy_title**
> Politik konfidansyalite - CityCore Admin

**language_available**
> Lang ki disponib yo

**language_complete**
> Konplè

**language_review**
> Bezwen revizyon

**language_unavailable**
> Ap disponib talè

**language_choose**
> Chwazi yon lang

**language_search**
> Chèche lang yo

**language_no_results**
> Nou pa jwenn okenn lang pou rechèch sa a.

**nav_home**
> Akèy

**nav_help**
> Sant Èd

**nav_support**
> Sipò

**hero_title**
> Bonjou, ki jan nou ka ede w?

**search_ph**
> Chèche atik yo

**search_btn**
> Chèche

**platform**
> Platfòm

**p_all**
> Tout platfòm

**p_ios**
> iOS

**p_ipados**
> iPadOS

**p_android**
> Android

**p_web**
> Sit entènèt

**language**
> Lang

**theme**
> Chanje aparans

**help_cats**
> Eksplore kategori yo

**articles**
> Atik

**results**
> Rezilta rechèch

**no_results**
> Nou pa jwenn okenn atik. Eseye lòt mo.

**back**
> Retounen

**article_count**
> atik

**cat_getting_started**
> Kòmanse

**cat_account_login**
> Kont ak koneksyon

**cat_admin_panels**
> Panèl administrasyon

**cat_roles**
> Wòl ak pèmisyon

**cat_invitations**
> Envitasyon

**cat_troubleshooting**
> Rezoud pwoblèm

**cat_privacy**
> Konfidansyalite ak sekirite

**cat_contact**
> Kilè sipò disponib

**contact_status_title**
> Mesaj sipò yo poko disponib sou sit entènèt sa a.

**contact_status_body**
> Sant Èd la bay konsèy pou ede w jwenn repons poukont ou. Pou sipò kliyan, kesyon sou konfidansyalite, demann pou efase kont, rapò ensèk oswa kòmantè, voye yon imèl nan citycoreadmin@gmail.com. Mesaj sipò pa disponib sou sit entènèt sa a. Pa voye enfòmasyon sou kont oswa peman atravè sit entènèt sa a.

**footer**
> © 2026 CityCore Admin. Tout dwa rezève.

**privacy**
> Politik konfidansyalite

#### Complete Privacy Policy text

**Dènye mizajou: 12 novanm 2026**

> WOOBENS STUDIO ap jere CityCore Admin. Paj sa a fè diferans ant sit entènèt piblik CityCore Admin ki estatik la ak aplikasyon CityCore Admin pou iOS la.

**Sit entènèt sa a**

> Sit entènèt sa a bay aksè ak paj Sant Èd la; li pa mande enfòmasyon sou kont oswa peman. Li pa gen fòm kontak ni sèvis mesaj sipò.

> Sit entènèt la anrejistre lang, tèm ak platfòm ou chwazi yo nan depo lokal navigatè sa a. Ou ka retire preferans sa yo lè w efase done sit entènèt la nan navigatè w la. Operatè a poko konfime kijan founisè ebèjman an trete enfòmasyon teknik ki gen rapò ak demann yo.

**Aplikasyon iOS la**

> [enfòmasyon sou konfidansyalite nan App Store la](https://apps.apple.com/us/app/citycore-admin/id6816577256) pou CityCore Admin endike yo ka kolekte non, adrès imèl, foto oswa videyo, asosye yo ak itilizatè yo, epi sèvi ak yo pou fonksyonalite aplikasyon an.

> WOOBENS STUDIO poko konfime tout detay sou fason aplikasyon ki pibliye a kolekte epi itilize done yo, pataje yo, pwoteje yo, konsève yo oswa efase yo, ni sou pratik ki konsène timoun. Enfòmasyon ki nan App Store la pa bay tout detay sou pratik sa yo.

**Kontakte nou**

> Pou sipò kliyan, kesyon sou konfidansyalite, demann pou efase kont ou oswa done ou, rapò ensèk oswa kòmantè, kontakte WOOBENS STUDIO nan [citycoreadmin@gmail.com](mailto:citycoreadmin@gmail.com) Yon demann efasman pa efase done yo otomatikman, epi pa gen okenn delè tretman ki pwomèt.

> © 2026 Woobens Studio. Tout dwa rezève.

#### Help Center articles

**servers — Jwenn epi kreye yon panèl administrasyon**

1. Louvri CityCore Admin.
2. Peze «Servers» nan ba navigasyon ki anba ekran an.
3. Panèl administrasyon ou yo parèt anba «YOUR ADMIN PANELS».
4. Pou kreye yon nouvo panèl, peze «+ Create Admin Panel».

**panel-settings — Apèsi sou paramèt panèl la**

1. Louvri panèl administrasyon ou vle jere a.
2. Louvri «Panel Settings».
3. Itilize «Members & Staff» pou jere manm ak anplwaye.
4. Itilize «Moderation» pou mete sanksyon ak moderasyon an plas.
5. Itilize «Server Management» pou jere pèmisyon, jounal odit, notifikasyon ak envitasyon.

**roles — Kreye epi bay wòl**

1. Louvri panèl administrasyon ou.
2. Ale nan «Panel Settings».
3. Peze «Roles & Permissions».
4. Itilize «Create Role» pou kreye yon wòl.
5. Itilize «Assign Role» pou bay yon manm yon wòl.
6. Wòl ki deja egziste yo parèt anba «ROLE HIERARCHY».

**account-settings — Paramèt kont ou**

1. Peze «Profile» nan ba navigasyon ki anba ekran an, epi louvri «Settings».
2. Paramèt ki disponib yo ka chanje selon vèsyon aplikasyon an.
3. Itilize «Log Out» pou dekonekte w.

**get-started — Byenveni sou CityCore Admin**

1. Enstale CityCore Admin epi kreye kont ou.
2. Ale nan seksyon «Servers» pou wè oswa kreye yon panèl administrasyon.
3. Envite anplwaye ou yo epi mete wòl yo.
4. Itilize «Panel Settings» pou konfigire moderasyon.

**login-problems — Mwen pa ka konekte**

1. Verifye si adrès imèl ou ak modpas ou gen erè.
2. Sou ekran koneksyon an, itilize opsyon pou reyinisyalize modpas la.
3. Asire w aplikasyon an ajou.
4. Mesaj sipò pa disponib sou sit sa a kounye a.

**invite-members — Envite moun nan panèl administrasyon ou**

1. Louvri panèl administrasyon ou epi ale nan «Panel Settings».
2. Louvri «Server Management», answit «Invitations».
3. Kreye yon envitasyon epi pataje l.
4. Ou ka anile l nenpòt kilè sou menm ekran an.

**app-crash — Aplikasyon an fèmen oswa li pa chaje**

1. Fèmen aplikasyon an nèt, epi louvri l ankò.
2. Verifye koneksyon entènèt ou.
3. Mete aplikasyon an ajou ak dènye vèsyon an.
4. Rekòmanse aparèy ou a.
5. Sit sa a pa ka resevwa rapò sou pwoblèm oswa fichye pou kounye a.

**privacy-security — Sekirize kont ou**

1. Itilize yon modpas solid ki diferan de lòt modpas ou yo.
2. Pa bay pèsonn modpas ou.
3. Pou kesyon sou konfidansyalite oswa demann pou efase kont ou oswa done ou, gade lyen Politik konfidansyalite ki anba paj sa a.

**contact — Kilè sipò disponib**

1. Pou kounye a, sit entènèt sa a bay sèlman atik Sant Èd pou ede w jwenn repons poukont ou.
2. Sèvis mesaj sipò a ap prepare epi li ap disponib apre tès sekirite ak fonksyònman yo fin fèt.
3. Pa voye enfòmasyon sou kont ou, modpas ou oswa peman atravè sit entènèt sa a.

### Français (`fr`) — Review needed / disabled

Source: [js/locales/fr.js](../js/locales/fr.js)

#### Public website and interface strings

**skip_content**
> Aller au contenu

**close**
> Fermer

**page_home_title**
> CityCore Admin | Centre d'aide

**page_privacy_title**
> Politique de confidentialité - CityCore Admin

**language_available**
> Langues disponibles

**language_complete**
> Complète

**language_review**
> Révision nécessaire

**language_unavailable**
> Bientôt disponible

**language_choose**
> Choisir une langue

**language_search**
> Rechercher une langue

**language_no_results**
> Aucune langue ne correspond à votre recherche.

**nav_home**
> Accueil

**nav_help**
> Centre d'aide

**nav_support**
> Assistance

**hero_title**
> Bonjour, comment pouvons-nous vous aider ?

**search_ph**
> Rechercher des articles

**search_btn**
> Rechercher

**platform**
> Plateforme

**p_all**
> Toutes les plateformes

**p_ios**
> iOS

**p_ipados**
> iPadOS

**p_android**
> Android

**p_web**
> Web

**language**
> Langue

**theme**
> Changer de thème

**help_cats**
> Parcourir par catégorie

**articles**
> Articles

**results**
> Résultats de recherche

**no_results**
> Aucun article trouvé. Essayez d'autres mots.

**back**
> Retour

**article_count**
> articles

**cat_getting_started**
> Premiers pas

**cat_account_login**
> Compte et connexion

**cat_admin_panels**
> Panneaux d'administration

**cat_roles**
> Rôles et autorisations

**cat_invitations**
> Invitations

**cat_troubleshooting**
> Dépannage

**cat_privacy**
> Confidentialité et sécurité

**cat_contact**
> Disponibilité de l'assistance

**contact_status_title**
> La messagerie d'assistance n'est pas encore disponible sur ce site.

**contact_status_body**
> Le centre d'aide propose des conseils en libre-service. Pour l'assistance, les questions de confidentialité, les demandes de suppression de compte, les signalements de bogues ou les commentaires, écrivez à citycoreadmin@gmail.com. La messagerie par ticket n'est pas disponible sur ce site. N'envoyez pas d'informations de compte ou de paiement sur ce site.

**footer**
> © 2026 CityCore Admin. Tous droits réservés.

**privacy**
> Politique de confidentialité

#### Complete Privacy Policy text

**Dernière mise à jour : 12 novembre 2026**

> CityCore Admin est exploité par WOOBENS STUDIO. Cette page distingue le site web statique CityCore Admin de l'application iOS CityCore Admin.

**Ce site web**

> Le site propose des pages du centre d'aide et ne demande pas d'informations de compte ou de paiement. Il ne dispose ni de formulaire de contact ni de messagerie d'assistance.

> Le site enregistre la langue, le thème et la plateforme que vous avez choisis dans le stockage local de ce navigateur. Vous pouvez supprimer ces préférences en effaçant les données de ce site dans votre navigateur. L'opérateur n'a pas confirmé la façon dont l'hébergeur traite les informations techniques des requêtes.

**Application iOS**

> Les [informations de confidentialité de l'App Store](https://apps.apple.com/us/app/citycore-admin/id6816577256) pour CityCore Admin indiquent que le nom, l'adresse e-mail et les photos ou vidéos peuvent être collectés, liés aux utilisateurs et utilisés pour le fonctionnement de l'application.

> WOOBENS STUDIO n'a pas encore confirmé de manière exhaustive comment l'application publiée collecte et utilise les données, les partage, les protège, les conserve ou les supprime, ni les pratiques qu'elle applique concernant les enfants. Les informations de l'App Store ne permettent pas d'établir toutes ces pratiques.

**Nous contacter**

> Pour l'assistance, les questions de confidentialité, les demandes de suppression de compte ou de données, les signalements de bogues ou les commentaires, contactez WOOBENS STUDIO à [citycoreadmin@gmail.com](mailto:citycoreadmin@gmail.com) Une demande de suppression n'entraîne pas la suppression automatique des données et aucun délai de traitement n'est garanti.

> © 2026 Woobens Studio. Tous droits réservés.

#### Help Center articles

**servers — Trouver et créer des panneaux d'administration**

1. Ouvrez CityCore Admin.
2. Touchez « Servers » dans la barre de navigation inférieure.
3. Vos panneaux d'administration existants apparaissent sous « YOUR ADMIN PANELS ».
4. Pour créer un nouveau panneau, touchez « + Create Admin Panel ».

**panel-settings — Aperçu des paramètres du panneau**

1. Ouvrez le panneau d'administration que vous souhaitez gérer.
2. Ouvrez « Panel Settings ».
3. Utilisez « Members & Staff » pour gérer les membres et le personnel.
4. Utilisez « Moderation » pour configurer les sanctions et la modération.
5. Utilisez « Server Management » pour gérer les autorisations, les journaux d'audit, les notifications et les invitations.

**roles — Créer et attribuer des rôles**

1. Ouvrez votre panneau d'administration.
2. Allez dans « Panel Settings ».
3. Touchez « Roles & Permissions ».
4. Utilisez « Create Role » pour créer un rôle.
5. Utilisez « Assign Role » pour attribuer un rôle à un membre.
6. Les rôles existants figurent sous « ROLE HIERARCHY ».

**account-settings — Paramètres du compte**

1. Touchez « Profile » dans la barre de navigation inférieure, puis ouvrez « Settings ».
2. Les paramètres disponibles peuvent varier selon la version de l'application.
3. Utilisez « Log Out » pour vous déconnecter.

**get-started — Bienvenue sur CityCore Admin**

1. Installez CityCore Admin et créez votre compte.
2. Ouvrez l'onglet « Servers » pour afficher ou créer un panneau d'administration.
3. Invitez votre équipe et configurez les rôles.
4. Utilisez « Panel Settings » pour configurer la modération.

**login-problems — Je n'arrive pas à me connecter**

1. Vérifiez votre e-mail et votre mot de passe.
2. Sur l'écran de connexion, utilisez l'option de réinitialisation du mot de passe.
3. Vérifiez que l'application est à jour.
4. La messagerie d'assistance n'est pas disponible actuellement sur ce site.

**invite-members — Inviter des personnes dans votre panneau**

1. Ouvrez votre panneau d'administration, puis « Panel Settings ».
2. Ouvrez « Server Management », puis « Invitations ».
3. Créez une invitation et partagez-la.
4. Révoquez-la à tout moment depuis le même écran.

**app-crash — L'application plante ou ne charge pas**

1. Fermez et rouvrez l'application.
2. Vérifiez votre connexion internet.
3. Mettez à jour l'application.
4. Redémarrez votre appareil.
5. Ce site ne peut pas recevoir de signalements de bogues ni de pièces jointes pour le moment.

**privacy-security — Sécuriser votre compte**

1. Utilisez un mot de passe fort et unique.
2. Ne communiquez votre mot de passe à personne.
3. Pour toute question sur la confidentialité ou toute demande de suppression de compte ou de données, consultez le lien Politique de confidentialité en bas de cette page.

**contact — Disponibilité de l'assistance**

1. Ce site propose actuellement uniquement des articles d'aide en libre-service.
2. La messagerie d'assistance par ticket est en préparation et sera activée après la réussite des tests de sécurité et de fonctionnement.
3. N'envoyez pas d'informations de compte, de mot de passe ou de paiement sur ce site.

### Español (`es`) — Review needed / disabled

Source: [js/locales/es.js](../js/locales/es.js)

#### Public website and interface strings

**skip_content**
> Saltar al contenido

**close**
> Cerrar

**page_home_title**
> CityCore Admin | Centro de ayuda

**page_privacy_title**
> Política de privacidad - CityCore Admin

**language_available**
> Idiomas disponibles

**language_complete**
> Completo

**language_review**
> Requiere revisión

**language_unavailable**
> Próximamente

**language_choose**
> Elegir idioma

**language_search**
> Buscar idiomas

**language_no_results**
> No hay idiomas que coincidan con la búsqueda.

**nav_home**
> Inicio

**nav_help**
> Centro de ayuda

**nav_support**
> Soporte

**hero_title**
> Hola, ¿cómo podemos ayudarte?

**search_ph**
> Buscar artículos

**search_btn**
> Buscar

**platform**
> Plataforma

**p_all**
> Todas las plataformas

**p_ios**
> iOS

**p_ipados**
> iPadOS

**p_android**
> Android

**p_web**
> Web

**language**
> Idioma

**theme**
> Cambiar tema

**help_cats**
> Explorar por categoría

**articles**
> Artículos

**results**
> Resultados de búsqueda

**no_results**
> No se encontraron artículos. Prueba con otras palabras.

**back**
> Volver

**article_count**
> artículos

**cat_getting_started**
> Primeros pasos

**cat_account_login**
> Cuenta e inicio de sesión

**cat_admin_panels**
> Paneles de administración

**cat_roles**
> Roles y permisos

**cat_invitations**
> Invitaciones

**cat_troubleshooting**
> Solución de problemas

**cat_privacy**
> Privacidad y seguridad

**cat_contact**
> Disponibilidad del soporte

**contact_status_title**
> La mensajería de soporte aún no está disponible en este sitio web.

**contact_status_body**
> El Centro de ayuda ofrece orientación de autoservicio. Para obtener asistencia, hacer consultas sobre privacidad, solicitar la eliminación de tu cuenta, informar de errores o enviar comentarios, escribe a citycoreadmin@gmail.com. La mensajería mediante tickets no está disponible en este sitio web. No envíes información de tu cuenta ni de pago a través de este sitio web.

**footer**
> © 2026 CityCore Admin. Todos los derechos reservados.

**privacy**
> Política de privacidad

#### Complete Privacy Policy text

**Última actualización: 12 de noviembre de 2026**

> CityCore Admin está operado por WOOBENS STUDIO. Esta página distingue el sitio web estático de CityCore Admin de la aplicación CityCore Admin para iOS.

**Este sitio web**

> El sitio web ofrece páginas del Centro de ayuda y no solicita información de cuenta ni de pago. No tiene formulario de contacto ni mensajería de soporte.

> El sitio web guarda el idioma, el tema y la plataforma que seleccionas en el almacenamiento local de este navegador. Puedes eliminar estas preferencias borrando los datos de este sitio en tu navegador. El operador no ha confirmado cómo gestiona el proveedor de alojamiento la información técnica de las solicitudes.

**Aplicación para iOS**

> La [información de privacidad de la App Store](https://apps.apple.com/us/app/citycore-admin/id6816577256) de CityCore Admin indica que es posible que se recopilen el nombre, la dirección de correo electrónico y las fotos o los vídeos, que se vinculen a los usuarios y que se utilicen para el funcionamiento de la aplicación.

> WOOBENS STUDIO aún no ha confirmado una descripción completa de la recopilación y el uso de datos, el intercambio, la seguridad, la conservación, la eliminación ni las prácticas relativas a menores de la aplicación publicada. La información de la App Store no establece todas estas prácticas.

**Contacto**

> Para solicitar asistencia, hacer consultas sobre privacidad, pedir la eliminación de tu cuenta o tus datos, informar de errores o enviar comentarios, ponte en contacto con WOOBENS STUDIO en [citycoreadmin@gmail.com](mailto:citycoreadmin@gmail.com) Una solicitud de eliminación no borra los datos automáticamente y no se garantiza ningún plazo de tramitación.

> © 2026 Woobens Studio. Todos los derechos reservados.

#### Help Center articles

**servers — Cómo encontrar y crear paneles de administración**

1. Abre CityCore Admin.
2. Pulsa «Servers» en la navegación inferior.
3. Tus paneles existentes aparecen en «YOUR ADMIN PANELS».
4. Para crear uno, pulsa «+ Create Admin Panel».

**panel-settings — Descripción general de la configuración del panel**

1. Abre el panel de administración que quieras gestionar.
2. Abre «Panel Settings».
3. Usa «Members & Staff» para gestionar a los miembros y al personal.
4. Usa «Moderation» para configurar las sanciones y la moderación.
5. Usa «Server Management» para gestionar permisos, registros de auditoría, notificaciones e invitaciones.

**roles — Crear y asignar roles**

1. Abre tu panel de administración.
2. Ve a «Panel Settings».
3. Pulsa «Roles & Permissions».
4. Usa «Create Role» para crear un rol.
5. Usa «Assign Role» para asignárselo a un miembro.
6. Los roles existentes aparecen en «ROLE HIERARCHY».

**account-settings — Configuración de la cuenta**

1. Pulsa «Profile» en la navegación inferior y abre «Settings».
2. La configuración disponible puede variar según la versión de la aplicación.
3. Usa «Log Out» para cerrar sesión.

**get-started — Te damos la bienvenida a CityCore Admin**

1. Instala CityCore Admin y crea tu cuenta.
2. Abre la pestaña «Servers» para ver o crear un panel de administración.
3. Invita a tu personal y configura los roles.
4. Usa «Panel Settings» para configurar la moderación.

**login-problems — No puedo iniciar sesión**

1. Comprueba que no haya errores tipográficos en tu correo electrónico y contraseña.
2. Usa la opción para restablecer la contraseña en la pantalla de inicio de sesión.
3. Asegúrate de que la aplicación esté actualizada.
4. La mensajería de soporte no está disponible actualmente en este sitio web.

**invite-members — Invitar a personas a tu panel**

1. Abre tu panel de administración y ve a «Panel Settings».
2. Abre «Server Management» y, después, «Invitations».
3. Crea una invitación y compártela.
4. Puedes revocar una invitación en cualquier momento desde la misma pantalla.

**app-crash — La aplicación se cierra o no carga**

1. Fuerza el cierre de la aplicación y vuelve a abrirla.
2. Comprueba tu conexión a Internet.
3. Actualiza la aplicación a la versión más reciente.
4. Reinicia tu dispositivo.
5. Este sitio web no puede recibir informes de errores ni archivos adjuntos por el momento.

**privacy-security — Cómo proteger tu cuenta**

1. Usa una contraseña segura y exclusiva.
2. No compartas tu contraseña con nadie.
3. Si tienes preguntas sobre privacidad o quieres solicitar la eliminación de tu cuenta o tus datos, consulta el enlace a la Política de privacidad al final de esta página.

**contact — Disponibilidad del soporte**

1. Actualmente, este sitio web solo ofrece artículos de autoservicio en el Centro de ayuda.
2. La mensajería mediante tickets está en preparación y se habilitará cuando finalicen las pruebas de seguridad y funcionamiento.
3. No envíes información de tu cuenta, contraseña ni datos de pago a través de este sitio web.

### Português (`pt`) — Review needed / disabled

Source: [js/locales/pt.js](../js/locales/pt.js)

#### Public website and interface strings

**skip_content**
> Saltar para o conteúdo

**close**
> Fechar

**page_home_title**
> CityCore Admin | Centro de Ajuda

**page_privacy_title**
> Política de Privacidade - CityCore Admin

**language_available**
> Idiomas disponíveis

**language_complete**
> Concluído

**language_review**
> Requer revisão

**language_unavailable**
> Em breve

**language_choose**
> Escolher um idioma

**language_search**
> Pesquisar idiomas

**language_no_results**
> Nenhum idioma corresponde à pesquisa.

**nav_home**
> Início

**nav_help**
> Centro de Ajuda

**nav_support**
> Suporte

**hero_title**
> Olá, como podemos ajudar?

**search_ph**
> Pesquisar artigos

**search_btn**
> Pesquisar

**platform**
> Plataforma

**p_all**
> Todas as plataformas

**p_ios**
> iOS

**p_ipados**
> iPadOS

**p_android**
> Android

**p_web**
> Web

**language**
> Idioma

**theme**
> Alterar tema

**help_cats**
> Explorar por categoria

**articles**
> Artigos

**results**
> Resultados da pesquisa

**no_results**
> Não foram encontrados artigos. Experimente outras palavras.

**back**
> Voltar

**article_count**
> artigos

**cat_getting_started**
> Primeiros passos

**cat_account_login**
> Conta e início de sessão

**cat_admin_panels**
> Painéis de administração

**cat_roles**
> Funções e permissões

**cat_invitations**
> Convites

**cat_troubleshooting**
> Resolução de problemas

**cat_privacy**
> Privacidade e segurança

**cat_contact**
> Disponibilidade do suporte

**contact_status_title**
> As mensagens de suporte ainda não estão disponíveis neste site.

**contact_status_body**
> O Centro de Ajuda disponibiliza orientações de autoajuda. Para obter apoio ao cliente, colocar questões sobre privacidade, pedir a eliminação da conta, comunicar erros ou enviar comentários, escreva para citycoreadmin@gmail.com. As mensagens por ticket não estão disponíveis neste site. Não envie informações da conta nem de pagamento através deste site.

**footer**
> © 2026 CityCore Admin. Todos os direitos reservados.

**privacy**
> Política de Privacidade

#### Complete Privacy Policy text

**Última atualização: 12 de novembro de 2026**

> O CityCore Admin é operado pela WOOBENS STUDIO. Esta página distingue o site estático do CityCore Admin da aplicação CityCore Admin para iOS.

**Este site**

> O site disponibiliza páginas do Centro de Ajuda e não solicita informações de conta nem de pagamento. Não tem formulário de contacto nem mensagens de suporte.

> O site guarda o idioma, o tema e a plataforma que seleciona no armazenamento local deste navegador. Pode remover estas preferências ao limpar os dados deste site no navegador. O operador ainda não confirmou como o fornecedor de alojamento trata as informações técnicas dos pedidos.

**Aplicação para iOS**

> As [informações de privacidade da App Store](https://apps.apple.com/us/app/citycore-admin/id6816577256) da CityCore Admin indicam que o nome, o endereço de e-mail e as fotografias ou os vídeos podem ser recolhidos, associados aos utilizadores e utilizados para o funcionamento da aplicação.

> A WOOBENS STUDIO ainda não confirmou uma descrição completa da recolha e utilização de dados, partilha, segurança, conservação, eliminação ou práticas relativas a crianças na aplicação publicada. As declarações da App Store não estabelecem todas estas práticas.

**Contacte-nos**

> Para obter apoio ao cliente, colocar questões sobre privacidade, solicitar a eliminação da sua conta ou dos seus dados, comunicar erros ou enviar comentários, contacte a WOOBENS STUDIO através de [citycoreadmin@gmail.com](mailto:citycoreadmin@gmail.com) Um pedido de eliminação não elimina os dados automaticamente e não é prometido qualquer prazo de processamento.

> © 2026 Woobens Studio. Todos os direitos reservados.

#### Help Center articles

**servers — Encontrar e criar painéis de administração**

1. Abra o CityCore Admin.
2. Toque em «Servers» na navegação inferior.
3. Os seus painéis existentes aparecem em «YOUR ADMIN PANELS».
4. Para criar um painel, toque em «+ Create Admin Panel».

**panel-settings — Descrição geral das definições do painel**

1. Abra o painel de administração que pretende gerir.
2. Abra «Panel Settings».
3. Use «Members & Staff» para gerir membros e equipa.
4. Use «Moderation» para configurar sanções e moderação.
5. Use «Server Management» para gerir permissões, registos de auditoria, notificações e convites.

**roles — Criar e atribuir funções**

1. Abra o seu painel de administração.
2. Aceda a «Panel Settings».
3. Toque em «Roles & Permissions».
4. Use «Create Role» para criar uma função.
5. Use «Assign Role» para atribuir uma função a um membro.
6. As funções existentes aparecem em «ROLE HIERARCHY».

**account-settings — Definições da conta**

1. Toque em «Profile» na navegação inferior e abra «Settings».
2. As definições disponíveis podem variar consoante a versão da aplicação.
3. Use «Log Out» para terminar sessão.

**get-started — Bem-vindo ao CityCore Admin**

1. Instale o CityCore Admin e crie a sua conta.
2. Abra o separador «Servers» para ver ou criar um painel de administração.
3. Convide a sua equipa e configure as funções.
4. Use «Panel Settings» para configurar a moderação.

**login-problems — Não consigo iniciar sessão**

1. Verifique se existem erros de escrita no endereço de e-mail e na palavra-passe.
2. Use a opção de reposição da palavra-passe no ecrã de início de sessão.
3. Certifique-se de que a aplicação está atualizada.
4. As mensagens de suporte não estão atualmente disponíveis neste site.

**invite-members — Convidar pessoas para o seu painel**

1. Abra o seu painel de administração e aceda a «Panel Settings».
2. Abra «Server Management» e, em seguida, «Invitations».
3. Crie um convite e partilhe-o.
4. Pode revogar um convite a qualquer momento no mesmo ecrã.

**app-crash — A aplicação bloqueia ou não carrega**

1. Force o fecho da aplicação e volte a abri-la.
2. Verifique a ligação à Internet.
3. Atualize a aplicação para a versão mais recente.
4. Reinicie o dispositivo.
5. Atualmente, este site não pode receber relatórios de erros nem anexos.

**privacy-security — Manter a conta segura**

1. Use uma palavra-passe forte e exclusiva.
2. Não partilhe a sua palavra-passe com ninguém.
3. Para questões de privacidade ou pedidos de eliminação da conta ou dos dados, consulte a ligação para a Política de Privacidade no final desta página.

**contact — Disponibilidade do suporte**

1. Atualmente, este site disponibiliza apenas artigos de autoajuda no Centro de Ajuda.
2. As mensagens por ticket estão a ser preparadas e serão ativadas após a conclusão dos testes de segurança e funcionamento.
3. Não envie informações da conta, palavras-passe nem dados de pagamento através deste site.

### Deutsch (`de`) — Review needed / disabled

Source: [js/locales/de.js](../js/locales/de.js)

#### Public website and interface strings

**skip_content**
> Zum Inhalt springen

**close**
> Schließen

**page_home_title**
> CityCore Admin | Hilfe-Center

**page_privacy_title**
> Datenschutzerklärung - CityCore Admin

**language_available**
> Verfügbare Sprachen

**language_complete**
> Vollständig

**language_review**
> Überprüfung erforderlich

**language_unavailable**
> Demnächst verfügbar

**language_choose**
> Sprache auswählen

**language_search**
> Sprachen suchen

**language_no_results**
> Keine Sprache entspricht deiner Suche.

**nav_home**
> Startseite

**nav_help**
> Hilfe-Center

**nav_support**
> Support

**hero_title**
> Hallo, wie können wir dir helfen?

**search_ph**
> Artikel suchen

**search_btn**
> Suchen

**platform**
> Plattform

**p_all**
> Alle Plattformen

**p_ios**
> iOS

**p_ipados**
> iPadOS

**p_android**
> Android

**p_web**
> Web

**language**
> Sprache

**theme**
> Design wechseln

**help_cats**
> Nach Kategorie stöbern

**articles**
> Artikel

**results**
> Suchergebnisse

**no_results**
> Keine Artikel gefunden. Versuche es mit anderen Begriffen.

**back**
> Zurück

**article_count**
> Artikel

**cat_getting_started**
> Erste Schritte

**cat_account_login**
> Konto und Anmeldung

**cat_admin_panels**
> Admin-Panels

**cat_roles**
> Rollen und Berechtigungen

**cat_invitations**
> Einladungen

**cat_troubleshooting**
> Fehlerbehebung

**cat_privacy**
> Datenschutz und Sicherheit

**cat_contact**
> Support-Verfügbarkeit

**contact_status_title**
> Der Support-Nachrichtendienst ist auf dieser Website noch nicht verfügbar.

**contact_status_body**
> Das Hilfe-Center bietet Anleitungen zur Selbsthilfe. Für Kundensupport, Datenschutzfragen, Anfragen zur Kontolöschung, Fehlermeldungen oder Feedback schreibe an citycoreadmin@gmail.com. Ticket-Nachrichten sind auf dieser Website nicht verfügbar. Sende über diese Website keine Konto- oder Zahlungsinformationen.

**footer**
> © 2026 CityCore Admin. Alle Rechte vorbehalten.

**privacy**
> Datenschutzerklärung

#### Complete Privacy Policy text

**Zuletzt aktualisiert: 12. November 2026**

> CityCore Admin wird von WOOBENS STUDIO betrieben. Diese Seite unterscheidet zwischen der statischen CityCore-Admin-Website und der CityCore-Admin-iOS-App.

**Diese Website**

> Die Website bietet Seiten des Hilfe-Centers und fragt keine Konto- oder Zahlungsinformationen ab. Sie verfügt weder über ein Kontaktformular noch über einen Support-Nachrichtendienst.

> Die Website speichert die von dir ausgewählte Sprache, das Design und die Plattform im lokalen Speicher dieses Browsers. Du kannst diese Einstellungen entfernen, indem du die gespeicherten Daten dieser Website in deinem Browser löschst. Der Betreiber hat nicht bestätigt, wie der Hosting-Anbieter technische Informationen zu Anfragen verarbeitet.

**iOS-App**

> Die [Datenschutzangaben im App Store](https://apps.apple.com/us/app/citycore-admin/id6816577256) zu CityCore Admin weisen darauf hin, dass Name, E-Mail-Adresse sowie Fotos oder Videos möglicherweise erfasst, mit Nutzern verknüpft und für die App-Funktionalität verwendet werden.

> WOOBENS STUDIO hat noch keine vollständige Auskunft zur Datenerfassung und -nutzung, Weitergabe, Sicherheit, Aufbewahrung, Löschung oder zum Umgang mit Kindern in der veröffentlichten App bestätigt. Die Angaben im App Store belegen nicht alle diese Praktiken.

**Kontakt**

> Bei Fragen zum Kundensupport oder Datenschutz sowie für Anträge auf Löschung deines Kontos oder deiner Daten, Fehlermeldungen oder Feedback erreichst du WOOBENS STUDIO unter [citycoreadmin@gmail.com](mailto:citycoreadmin@gmail.com) Ein Löschantrag führt nicht automatisch zur Löschung der Daten; eine Bearbeitungszeit wird nicht zugesagt.

> © 2026 Woobens Studio. Alle Rechte vorbehalten.

#### Help Center articles

**servers — Admin-Panels finden und erstellen**

1. Öffne CityCore Admin.
2. Tippe in der unteren Navigation auf „Servers“.
3. Deine vorhandenen Admin-Panels werden unter „YOUR ADMIN PANELS“ angezeigt.
4. Tippe auf „+ Create Admin Panel“, um ein neues Panel zu erstellen.

**panel-settings — Übersicht über die Panel-Einstellungen**

1. Öffne das Admin-Panel, das du verwalten möchtest.
2. Öffne „Panel Settings“.
3. Verwalte Mitglieder und Mitarbeitende unter „Members & Staff“.
4. Konfiguriere Sanktionen und Moderation unter „Moderation“.
5. Verwalte Berechtigungen, Audit-Protokolle, Benachrichtigungen und Einladungen unter „Server Management“.

**roles — Rollen erstellen und zuweisen**

1. Öffne dein Admin-Panel.
2. Gehe zu „Panel Settings“.
3. Tippe auf „Roles & Permissions“.
4. Erstelle mit „Create Role“ eine neue Rolle.
5. Weise einem Mitglied mit „Assign Role“ eine Rolle zu.
6. Vorhandene Rollen findest du unter „ROLE HIERARCHY“.

**account-settings — Kontoeinstellungen**

1. Tippe in der unteren Navigation auf „Profile“ und öffne „Settings“.
2. Die verfügbaren Einstellungen können je nach App-Version variieren.
3. Melde dich mit „Log Out“ von deinem Konto ab.

**get-started — Willkommen bei CityCore Admin**

1. Installiere CityCore Admin und erstelle dein Konto.
2. Öffne den Tab „Servers“, um ein Admin-Panel anzusehen oder zu erstellen.
3. Lade deine Mitarbeitenden ein und richte Rollen ein.
4. Konfiguriere die Moderation unter „Panel Settings“.

**login-problems — Ich kann mich nicht anmelden**

1. Prüfe deine E-Mail-Adresse und dein Passwort auf Tippfehler.
2. Verwende die Option zum Zurücksetzen des Passworts auf dem Anmeldebildschirm.
3. Vergewissere dich, dass die App auf dem neuesten Stand ist.
4. Der Support-Nachrichtendienst ist auf dieser Website derzeit nicht verfügbar.

**invite-members — Personen zu deinem Panel einladen**

1. Öffne dein Admin-Panel und gehe zu „Panel Settings“.
2. Öffne „Server Management“ und anschließend „Invitations“.
3. Erstelle eine Einladung und teile sie.
4. Du kannst eine Einladung jederzeit auf demselben Bildschirm widerrufen.

**app-crash — Die App stürzt ab oder lädt nicht**

1. Beende die App vollständig und öffne sie erneut.
2. Prüfe deine Internetverbindung.
3. Aktualisiere die App auf die neueste Version.
4. Starte dein Gerät neu.
5. Diese Website kann derzeit keine Fehlerberichte oder Anhänge entgegennehmen.

**privacy-security — Dein Konto schützen**

1. Verwende ein starkes, nur hier genutztes Passwort.
2. Gib dein Passwort an niemanden weiter.
3. Bei Fragen zum Datenschutz oder Anträgen auf Löschung deines Kontos oder deiner Daten findest du den Link zur Datenschutzerklärung unten auf dieser Seite.

**contact — Support-Verfügbarkeit**

1. Diese Website bietet derzeit nur Artikel zur Selbsthilfe im Hilfe-Center.
2. Der Ticket-Nachrichtendienst wird vorbereitet und nach Abschluss der Sicherheits- und Funktionstests aktiviert.
3. Sende über diese Website keine Konto-, Passwort- oder Zahlungsinformationen.

### Italiano (`it`) — Review needed / disabled

Source: [js/locales/it.js](../js/locales/it.js)

#### Public website and interface strings

**skip_content**
> Vai al contenuto

**close**
> Chiudi

**page_home_title**
> CityCore Admin | Centro assistenza

**page_privacy_title**
> Informativa sulla privacy - CityCore Admin

**language_available**
> Lingue disponibili

**language_complete**
> Completa

**language_review**
> Revisione necessaria

**language_unavailable**
> Prossimamente

**language_choose**
> Scegli una lingua

**language_search**
> Cerca lingue

**language_no_results**
> Nessuna lingua corrisponde alla ricerca.

**nav_home**
> Home

**nav_help**
> Centro assistenza

**nav_support**
> Supporto

**hero_title**
> Ciao, come possiamo aiutarti?

**search_ph**
> Cerca articoli

**search_btn**
> Cerca

**platform**
> Piattaforma

**p_all**
> Tutte le piattaforme

**p_ios**
> iOS

**p_ipados**
> iPadOS

**p_android**
> Android

**p_web**
> Web

**language**
> Lingua

**theme**
> Cambia tema

**help_cats**
> Esplora per categoria

**articles**
> Articoli

**results**
> Risultati della ricerca

**no_results**
> Nessun articolo trovato. Prova con altre parole.

**back**
> Indietro

**article_count**
> articoli

**cat_getting_started**
> Per iniziare

**cat_account_login**
> Account e accesso

**cat_admin_panels**
> Pannelli di amministrazione

**cat_roles**
> Ruoli e autorizzazioni

**cat_invitations**
> Inviti

**cat_troubleshooting**
> Risoluzione dei problemi

**cat_privacy**
> Privacy e sicurezza

**cat_contact**
> Disponibilità del supporto

**contact_status_title**
> La messaggistica di supporto non è ancora disponibile su questo sito.

**contact_status_body**
> Il Centro assistenza offre indicazioni per aiutarti a trovare autonomamente una soluzione. Per assistenza clienti, domande sulla privacy, richieste di eliminazione dell'account, segnalazioni di bug o commenti, scrivi a citycoreadmin@gmail.com. La messaggistica tramite ticket non è disponibile su questo sito. Non inviare informazioni dell'account o di pagamento tramite questo sito.

**footer**
> © 2026 CityCore Admin. Tutti i diritti riservati.

**privacy**
> Informativa sulla privacy

#### Complete Privacy Policy text

**Ultimo aggiornamento: 12 novembre 2026**

> CityCore Admin è gestito da WOOBENS STUDIO. Questa pagina distingue il sito web statico di CityCore Admin dall'app CityCore Admin per iOS.

**Questo sito web**

> Il sito offre pagine del Centro assistenza e non richiede informazioni sull'account o sui pagamenti. Non dispone di un modulo di contatto né di messaggistica di supporto.

> Il sito memorizza la lingua, il tema e la piattaforma selezionati nell'archiviazione locale di questo browser. Puoi rimuovere queste preferenze cancellando i dati di questo sito nel browser. Il gestore non ha confermato come il provider di hosting tratta le informazioni tecniche delle richieste.

**App per iOS**

> Le [informazioni sulla privacy dell'App Store](https://apps.apple.com/us/app/citycore-admin/id6816577256) di CityCore Admin indicano che nome, indirizzo e-mail e foto o video potrebbero essere raccolti, collegati agli utenti e utilizzati per il funzionamento dell'app.

> WOOBENS STUDIO non ha ancora confermato un resoconto completo della raccolta e dell'uso dei dati, della condivisione, della sicurezza, della conservazione, dell'eliminazione o delle pratiche relative ai minori nell'app pubblicata. Le informazioni dell'App Store non attestano tutte queste pratiche.

**Contatti**

> Per assistenza clienti, domande sulla privacy, richieste di eliminazione del tuo account o dei tuoi dati, segnalazioni di bug o commenti, contatta WOOBENS STUDIO all'indirizzo [citycoreadmin@gmail.com](mailto:citycoreadmin@gmail.com) Una richiesta di eliminazione non comporta l'eliminazione automatica dei dati e non viene garantito alcun tempo di elaborazione.

> © 2026 Woobens Studio. Tutti i diritti riservati.

#### Help Center articles

**servers — Trovare e creare pannelli di amministrazione**

1. Apri CityCore Admin.
2. Tocca «Servers» nella barra di navigazione in basso.
3. I pannelli esistenti sono elencati in «YOUR ADMIN PANELS».
4. Per crearne uno, tocca «+ Create Admin Panel».

**panel-settings — Panoramica delle impostazioni del pannello**

1. Apri il pannello di amministrazione che vuoi gestire.
2. Apri «Panel Settings».
3. Usa «Members & Staff» per gestire membri e personale.
4. Usa «Moderation» per configurare sanzioni e moderazione.
5. Usa «Server Management» per gestire autorizzazioni, registri di controllo, notifiche e inviti.

**roles — Creare e assegnare ruoli**

1. Apri il tuo pannello di amministrazione.
2. Vai a «Panel Settings».
3. Tocca «Roles & Permissions».
4. Usa «Create Role» per creare un ruolo.
5. Usa «Assign Role» per assegnare un ruolo a un membro.
6. I ruoli esistenti sono elencati in «ROLE HIERARCHY».

**account-settings — Impostazioni dell'account**

1. Tocca «Profile» nella barra di navigazione in basso e apri «Settings».
2. Le impostazioni disponibili possono variare in base alla versione dell'app.
3. Usa «Log Out» per uscire dall'account.

**get-started — Benvenuto in CityCore Admin**

1. Installa CityCore Admin e crea il tuo account.
2. Apri la scheda «Servers» per visualizzare o creare un pannello di amministrazione.
3. Invita il personale e configura i ruoli.
4. Usa «Panel Settings» per configurare la moderazione.

**login-problems — Non riesco ad accedere**

1. Controlla che l'indirizzo e-mail e la password non contengano errori di digitazione.
2. Usa l'opzione di reimpostazione della password nella schermata di accesso.
3. Assicurati che l'app sia aggiornata.
4. La messaggistica di supporto non è attualmente disponibile su questo sito.

**invite-members — Invitare persone nel tuo pannello**

1. Apri il pannello di amministrazione e vai a «Panel Settings».
2. Apri «Server Management», quindi «Invitations».
3. Crea un invito e condividilo.
4. Puoi revocare un invito in qualsiasi momento dalla stessa schermata.

**app-crash — L'app si blocca o non si carica**

1. Forza la chiusura dell'app e riaprila.
2. Controlla la connessione a Internet.
3. Aggiorna l'app all'ultima versione.
4. Riavvia il dispositivo.
5. Al momento questo sito non può ricevere segnalazioni di bug o allegati.

**privacy-security — Proteggere il tuo account**

1. Usa una password robusta e diversa da quelle che usi altrove.
2. Non condividere la password con nessuno.
3. Per domande sulla privacy o richieste di eliminazione dell'account o dei dati, consulta il link all'Informativa sulla privacy in fondo a questa pagina.

**contact — Disponibilità del supporto**

1. Al momento questo sito offre solo articoli del Centro assistenza da consultare in autonomia.
2. La messaggistica tramite ticket è in preparazione e sarà attivata al termine dei test di sicurezza e funzionalità.
3. Non inviare informazioni dell'account, password o dati di pagamento tramite questo sito.

### العربية (`ar`) — Review needed / disabled

Source: [js/locales/ar.js](../js/locales/ar.js)

#### Public website and interface strings

**skip_content**
> انتقل إلى المحتوى

**close**
> إغلاق

**page_home_title**
> CityCore Admin | مركز المساعدة

**page_privacy_title**
> سياسة الخصوصية - CityCore Admin

**language_available**
> اللغات المتاحة

**language_complete**
> مكتملة

**language_review**
> تحتاج إلى مراجعة

**language_unavailable**
> قريبًا

**language_choose**
> اختر لغة

**language_search**
> ابحث عن لغة

**language_no_results**
> لا توجد لغات تطابق البحث.

**nav_home**
> الرئيسية

**nav_help**
> مركز المساعدة

**nav_support**
> الدعم

**hero_title**
> مرحبًا، كيف يمكننا مساعدتك؟

**search_ph**
> ابحث عن مقالات

**search_btn**
> بحث

**platform**
> المنصة

**p_all**
> كل المنصات

**p_ios**
> iOS

**p_ipados**
> iPadOS

**p_android**
> Android

**p_web**
> الويب

**language**
> اللغة

**theme**
> تغيير المظهر

**help_cats**
> تصفّح حسب الفئة

**articles**
> المقالات

**results**
> نتائج البحث

**no_results**
> لم نعثر على مقالات. جرّب كلمات أخرى.

**back**
> رجوع

**article_count**
> مقالات

**cat_getting_started**
> البدء

**cat_account_login**
> الحساب وتسجيل الدخول

**cat_admin_panels**
> لوحات الإدارة

**cat_roles**
> الأدوار والأذونات

**cat_invitations**
> الدعوات

**cat_troubleshooting**
> استكشاف الأخطاء وإصلاحها

**cat_privacy**
> الخصوصية والأمان

**cat_contact**
> توفر الدعم

**contact_status_title**
> مراسلة الدعم غير متاحة على هذا الموقع بعد.

**contact_status_body**
> يوفر مركز المساعدة إرشادات للخدمة الذاتية. للحصول على دعم العملاء أو للاستفسار عن الخصوصية أو طلب حذف الحساب أو الإبلاغ عن الأخطاء أو إرسال الملاحظات، راسلنا عبر citycoreadmin@gmail.com. المراسلة عبر التذاكر غير متاحة على هذا الموقع. لا ترسل معلومات الحساب أو الدفع عبر هذا الموقع.

**footer**
> © 2026 CityCore Admin. جميع الحقوق محفوظة.

**privacy**
> سياسة الخصوصية

#### Complete Privacy Policy text

**آخر تحديث: 12 نوفمبر 2026**

> تدير WOOBENS STUDIO خدمة CityCore Admin. تميّز هذه الصفحة بين موقع CityCore Admin الثابت وتطبيق CityCore Admin لنظام iOS.

**هذا الموقع**

> يوفر الموقع صفحات مركز المساعدة ولا يطلب معلومات الحساب أو الدفع. ولا يتضمن نموذجًا للتواصل أو خدمة مراسلة للدعم.

> يحفظ الموقع اللغة والمظهر والمنصة التي اخترتها في التخزين المحلي لهذا المتصفح. يمكنك إزالة هذه التفضيلات بمسح بيانات هذا الموقع في المتصفح. لم يؤكد المشغّل كيفية تعامل مزوّد الاستضافة مع المعلومات التقنية للطلبات.

**تطبيق iOS**

> [معلومات الخصوصية في App Store](https://apps.apple.com/us/app/citycore-admin/id6816577256) لتطبيق CityCore Admin تشير إلى احتمال جمع الاسم وعنوان البريد الإلكتروني والصور أو مقاطع الفيديو وربطها بالمستخدمين واستخدامها لتشغيل التطبيق.

> لم تؤكد WOOBENS STUDIO بعد وصفًا كاملًا لجمع البيانات واستخدامها ومشاركتها وأمانها والاحتفاظ بها وحذفها أو الممارسات المتعلقة بالأطفال في التطبيق المنشور. ولا تثبت إفصاحات App Store جميع هذه الممارسات.

**تواصل معنا**

> للحصول على دعم العملاء أو للاستفسار عن الخصوصية أو طلب حذف حسابك أو بياناتك أو الإبلاغ عن الأخطاء أو إرسال الملاحظات، تواصل مع WOOBENS STUDIO عبر [citycoreadmin@gmail.com](mailto:citycoreadmin@gmail.com) لا يؤدي طلب الحذف إلى حذف البيانات تلقائيًا، ولا نَعِد بمدة محددة للمعالجة.

> © 2026 Woobens Studio. جميع الحقوق محفوظة.

#### Help Center articles

**servers — العثور على لوحات الإدارة وإنشاؤها**

1. افتح CityCore Admin.
2. اضغط على «Servers» في شريط التنقل السفلي.
3. تظهر لوحات الإدارة الحالية ضمن «YOUR ADMIN PANELS».
4. لإنشاء لوحة جديدة، اضغط على «+ Create Admin Panel».

**panel-settings — نظرة عامة على إعدادات اللوحة**

1. افتح لوحة الإدارة التي تريد إدارتها.
2. افتح «Panel Settings».
3. استخدم «Members & Staff» لإدارة الأعضاء والموظفين.
4. استخدم «Moderation» لإعداد العقوبات والإشراف.
5. استخدم «Server Management» لإدارة الأذونات وسجلات التدقيق والإشعارات والدعوات.

**roles — إنشاء الأدوار وتعيينها**

1. افتح لوحة الإدارة.
2. انتقل إلى «Panel Settings».
3. اضغط على «Roles & Permissions».
4. استخدم «Create Role» لإنشاء دور.
5. استخدم «Assign Role» لتعيين دور لعضو.
6. تظهر الأدوار الحالية ضمن «ROLE HIERARCHY».

**account-settings — إعدادات الحساب**

1. اضغط على «Profile» في شريط التنقل السفلي، ثم افتح «Settings».
2. قد تختلف الإعدادات المتاحة حسب إصدار التطبيق.
3. استخدم «Log Out» لتسجيل الخروج من حسابك.

**get-started — مرحبًا بك في CityCore Admin**

1. ثبّت CityCore Admin وأنشئ حسابك.
2. افتح علامة التبويب «Servers» لعرض لوحة إدارة أو إنشائها.
3. ادعُ الموظفين وأعدّ الأدوار.
4. استخدم «Panel Settings» لإعداد الإشراف.

**login-problems — لا أستطيع تسجيل الدخول**

1. تحقق من خلو عنوان بريدك الإلكتروني وكلمة المرور من الأخطاء الإملائية.
2. استخدم خيار إعادة تعيين كلمة المرور في شاشة تسجيل الدخول.
3. تأكد من تحديث التطبيق.
4. مراسلة الدعم غير متاحة حاليًا على هذا الموقع.

**invite-members — دعوة أشخاص إلى لوحتك**

1. افتح لوحة الإدارة وانتقل إلى «Panel Settings».
2. افتح «Server Management»، ثم «Invitations».
3. أنشئ دعوة وشاركها.
4. يمكنك إلغاء الدعوة في أي وقت من الشاشة نفسها.

**app-crash — يتوقف التطبيق أو لا يتم تحميله**

1. أغلق التطبيق إجباريًا ثم افتحه مجددًا.
2. تحقق من اتصالك بالإنترنت.
3. حدّث التطبيق إلى أحدث إصدار.
4. أعد تشغيل جهازك.
5. لا يمكن لهذا الموقع حاليًا استقبال بلاغات الأخطاء أو المرفقات.

**privacy-security — الحفاظ على أمان حسابك**

1. استخدم كلمة مرور قوية وفريدة.
2. لا تشارك كلمة مرورك مع أي شخص.
3. للاستفسار عن الخصوصية أو طلب حذف الحساب أو البيانات، راجع رابط سياسة الخصوصية أسفل هذه الصفحة.

**contact — توفر الدعم**

1. يقتصر هذا الموقع حاليًا على مقالات مركز المساعدة للخدمة الذاتية.
2. يجري إعداد المراسلة عبر التذاكر وستُتاح بعد اكتمال اختبارات الأمان والوظائف.
3. لا ترسل معلومات حسابك أو كلمة مرورك أو بيانات الدفع عبر هذا الموقع.

### 简体中文 (`zh-Hans`) — Review needed / disabled

Source: [js/locales/zh-Hans.js](../js/locales/zh-Hans.js)

#### Public website and interface strings

**skip_content**
> 跳转到正文

**close**
> 关闭

**page_home_title**
> CityCore Admin | 帮助中心

**page_privacy_title**
> 隐私政策 - CityCore Admin

**language_available**
> 可用语言

**language_complete**
> 已完成

**language_review**
> 需要审核

**language_unavailable**
> 即将推出

**language_choose**
> 选择语言

**language_search**
> 搜索语言

**language_no_results**
> 没有匹配的语言。

**nav_home**
> 首页

**nav_help**
> 帮助中心

**nav_support**
> 支持

**hero_title**
> 你好，需要我们帮你做什么？

**search_ph**
> 搜索文章

**search_btn**
> 搜索

**platform**
> 平台

**p_all**
> 所有平台

**p_ios**
> iOS

**p_ipados**
> iPadOS

**p_android**
> Android

**p_web**
> 网页

**language**
> 语言

**theme**
> 切换主题

**help_cats**
> 按类别浏览

**articles**
> 文章

**results**
> 搜索结果

**no_results**
> 未找到文章。请尝试其他关键词。

**back**
> 返回

**article_count**
> 篇文章

**cat_getting_started**
> 入门指南

**cat_account_login**
> 账户与登录

**cat_admin_panels**
> 管理面板

**cat_roles**
> 角色与权限

**cat_invitations**
> 邀请

**cat_troubleshooting**
> 故障排除

**cat_privacy**
> 隐私与安全

**cat_contact**
> 支持服务状态

**contact_status_title**
> 此网站暂未提供支持消息功能。

**contact_status_body**
> 帮助中心提供自助指南。如需客户支持、咨询隐私问题、申请删除账户、报告错误或提供反馈，请发送邮件至 citycoreadmin@gmail.com。本网站暂不提供工单消息功能。请勿通过此网站发送账户或付款信息。

**footer**
> © 2026 CityCore Admin。保留所有权利。

**privacy**
> 隐私政策

#### Complete Privacy Policy text

**最后更新：2026年11月12日**

> CityCore Admin 由 WOOBENS STUDIO 运营。本页面区分 CityCore Admin 静态网站与 CityCore Admin iOS 应用。

**本网站**

> 本网站提供帮助中心页面，不会索取账户或付款信息，也没有联系表单或支持消息功能。

> 本网站会将你选择的语言、主题和平台存储在此浏览器的本地存储中。你可以在浏览器中清除此网站的数据，以删除这些偏好设置。运营方尚未确认托管服务提供商如何处理技术请求信息。

**iOS 应用**

> CityCore Admin 的[App Store 隐私信息](https://apps.apple.com/us/app/citycore-admin/id6816577256)表明，姓名、电子邮件地址以及照片或视频可能会被收集、关联到用户，并用于应用功能。

> WOOBENS STUDIO 尚未确认已发布应用在数据收集与使用、共享、安全、保留、删除或儿童相关做法方面的完整说明。App Store 披露的信息并不能确定上述所有做法。

**联系我们**

> 如需客户支持、咨询隐私问题、申请删除账户或数据、报告错误或提供反馈，请通过以下地址联系 WOOBENS STUDIO：[citycoreadmin@gmail.com](mailto:citycoreadmin@gmail.com)。删除申请不会自动删除数据，也不承诺处理时限。

> © 2026 Woobens Studio。保留所有权利。

#### Help Center articles

**servers — 查找和创建管理面板**

1. 打开 CityCore Admin。
2. 点击底部导航栏中的“Servers”。
3. 现有管理面板会显示在“YOUR ADMIN PANELS”下。
4. 点击“+ Create Admin Panel”即可创建新面板。

**panel-settings — 面板设置概览**

1. 打开要管理的管理面板。
2. 打开“Panel Settings”。
3. 使用“Members & Staff”管理成员和工作人员。
4. 使用“Moderation”配置处罚和内容管理。
5. 使用“Server Management”管理权限、审计日志、通知和邀请。

**roles — 创建和分配角色**

1. 打开你的管理面板。
2. 进入“Panel Settings”。
3. 点击“Roles & Permissions”。
4. 使用“Create Role”创建角色。
5. 使用“Assign Role”为成员分配角色。
6. 现有角色显示在“ROLE HIERARCHY”下。

**account-settings — 账户设置**

1. 点击底部导航栏中的“Profile”，然后打开“Settings”。
2. 可用设置可能因应用版本而异。
3. 使用“Log Out”退出账户。

**get-started — 欢迎使用 CityCore Admin**

1. 安装 CityCore Admin 并创建账户。
2. 打开“Servers”标签页以查看或创建管理面板。
3. 邀请工作人员并设置角色。
4. 使用“Panel Settings”配置内容管理。

**login-problems — 无法登录**

1. 检查电子邮件地址和密码是否有拼写错误。
2. 在登录界面使用密码重置选项。
3. 确认应用已更新至最新版本。
4. 此网站目前不提供支持消息功能。

**invite-members — 邀请他人加入你的面板**

1. 打开管理面板并进入“Panel Settings”。
2. 打开“Server Management”，然后选择“Invitations”。
3. 创建邀请并分享。
4. 你可以随时在同一界面撤销邀请。

**app-crash — 应用崩溃或无法加载**

1. 强制关闭应用，然后重新打开。
2. 检查网络连接。
3. 将应用更新至最新版本。
4. 重新启动设备。
5. 此网站目前无法接收错误报告或附件。

**privacy-security — 保护账户安全**

1. 使用强度高且不重复的密码。
2. 不要向任何人透露密码。
3. 如有隐私问题，或要申请删除账户或数据，请查看本页底部的隐私政策链接。

**contact — 支持服务状态**

1. 目前，本网站仅提供帮助中心自助文章。
2. 工单消息功能正在准备中，待安全和功能测试完成后才会启用。
3. 请勿通过此网站发送账户、密码或付款信息。

### 日本語 (`ja`) — Review needed / disabled

Source: [js/locales/ja.js](../js/locales/ja.js)

#### Public website and interface strings

**skip_content**
> 本文へ移動

**close**
> 閉じる

**page_home_title**
> CityCore Admin | ヘルプセンター

**page_privacy_title**
> プライバシーポリシー - CityCore Admin

**language_available**
> 利用可能な言語

**language_complete**
> 完了

**language_review**
> 要確認

**language_unavailable**
> 近日公開

**language_choose**
> 言語を選択

**language_search**
> 言語を検索

**language_no_results**
> 条件に一致する言語がありません。

**nav_home**
> ホーム

**nav_help**
> ヘルプセンター

**nav_support**
> サポート

**hero_title**
> こんにちは。どのようなことでお困りですか？

**search_ph**
> 記事を検索

**search_btn**
> 検索

**platform**
> プラットフォーム

**p_all**
> すべてのプラットフォーム

**p_ios**
> iOS

**p_ipados**
> iPadOS

**p_android**
> Android

**p_web**
> ウェブ

**language**
> 言語

**theme**
> テーマを切り替え

**help_cats**
> カテゴリから探す

**articles**
> 記事

**results**
> 検索結果

**no_results**
> 記事が見つかりません。別の語句をお試しください。

**back**
> 戻る

**article_count**
> 件の記事

**cat_getting_started**
> はじめに

**cat_account_login**
> アカウントとログイン

**cat_admin_panels**
> 管理パネル

**cat_roles**
> ロールと権限

**cat_invitations**
> 招待

**cat_troubleshooting**
> トラブルシューティング

**cat_privacy**
> プライバシーとセキュリティ

**cat_contact**
> サポートの利用状況

**contact_status_title**
> このウェブサイトでは、サポートメッセージ機能はまだ利用できません。

**contact_status_body**
> ヘルプセンターではセルフサービスの案内を提供しています。カスタマーサポート、プライバシーに関するお問い合わせ、アカウント削除の依頼、不具合の報告、フィードバックは、citycoreadmin@gmail.com までメールでご連絡ください。このウェブサイトではチケットでのメッセージ機能は利用できません。このウェブサイトからアカウント情報や支払い情報を送信しないでください。

**footer**
> © 2026 CityCore Admin. 無断複製・転載を禁じます。

**privacy**
> プライバシーポリシー

#### Complete Privacy Policy text

**最終更新日：2026年11月12日**

> CityCore Admin は WOOBENS STUDIO が運営しています。このページでは、静的な CityCore Admin ウェブサイトと CityCore Admin iOS アプリを区別して説明します。

**このウェブサイト**

> このウェブサイトではヘルプセンターの記事を提供しています。アカウント情報や支払い情報を求めることはなく、お問い合わせフォームやサポートメッセージ機能もありません。

> このウェブサイトは、選択した言語、テーマ、プラットフォームをこのブラウザーのローカルストレージに保存します。ブラウザーでこのサイトの保存データを消去すると、これらの設定を削除できます。ホスティング事業者による技術的なリクエスト情報の取り扱いについて、運営者は確認していません。

**iOS アプリ**

> CityCore Admin の[App Store のプライバシー情報](https://apps.apple.com/us/app/citycore-admin/id6816577256)には、氏名、メールアドレス、写真または動画が収集され、ユーザーに関連付けられ、アプリの機能に使用される可能性があると記載されています。

> 公開中のアプリにおけるデータの収集と利用、共有、安全性、保存、削除、または子どもに関する取り扱いについて、WOOBENS STUDIO はまだ完全な説明を確認していません。App Store の開示情報だけでは、これらすべての取り扱いは確認できません。

**お問い合わせ**

> カスタマーサポート、プライバシーに関するお問い合わせ、アカウントまたはデータの削除依頼、不具合の報告、フィードバックについては、次の宛先から WOOBENS STUDIO にご連絡ください：[citycoreadmin@gmail.com](mailto:citycoreadmin@gmail.com)。削除依頼によってデータが自動的に削除されることはなく、処理期間も約束されていません。

> © 2026 Woobens Studio. 無断複製・転載を禁じます。

#### Help Center articles

**servers — 管理パネルの確認と作成**

1. CityCore Admin を開きます。
2. 下部のナビゲーションにある「Servers」をタップします。
3. 既存の管理パネルは「YOUR ADMIN PANELS」の下に表示されます。
4. 新しいパネルを作成するには、「+ Create Admin Panel」をタップします。

**panel-settings — パネル設定の概要**

1. 管理する管理パネルを開きます。
2. 「Panel Settings」を開きます。
3. 「Members & Staff」でメンバーとスタッフを管理します。
4. 「Moderation」で制裁とモデレーションを設定します。
5. 「Server Management」で権限、監査ログ、通知、招待を管理します。

**roles — ロールの作成と割り当て**

1. 管理パネルを開きます。
2. 「Panel Settings」に移動します。
3. 「Roles & Permissions」をタップします。
4. 「Create Role」でロールを作成します。
5. 「Assign Role」でメンバーにロールを割り当てます。
6. 既存のロールは「ROLE HIERARCHY」の下に表示されます。

**account-settings — アカウント設定**

1. 下部のナビゲーションにある「Profile」をタップし、「Settings」を開きます。
2. 利用できる設定はアプリのバージョンによって異なる場合があります。
3. 「Log Out」を使ってアカウントからログアウトします。

**get-started — CityCore Admin へようこそ**

1. CityCore Admin をインストールし、アカウントを作成します。
2. 「Servers」タブを開いて、管理パネルを確認または作成します。
3. スタッフを招待し、ロールを設定します。
4. 「Panel Settings」でモデレーションを設定します。

**login-problems — ログインできない場合**

1. メールアドレスとパスワードに入力ミスがないか確認します。
2. ログイン画面でパスワードのリセットを行います。
3. アプリが最新バージョンであることを確認します。
4. このウェブサイトでは現在、サポートメッセージ機能を利用できません。

**invite-members — パネルにメンバーを招待する**

1. 管理パネルを開き、「Panel Settings」に移動します。
2. 「Server Management」を開き、「Invitations」を選択します。
3. 招待を作成して共有します。
4. 同じ画面からいつでも招待を取り消せます。

**app-crash — アプリがクラッシュする、または読み込まれない**

1. アプリを強制終了して、もう一度開きます。
2. インターネット接続を確認します。
3. アプリを最新バージョンに更新します。
4. デバイスを再起動します。
5. このウェブサイトでは現在、バグ報告や添付ファイルを受け付けていません。

**privacy-security — アカウントを安全に保つ**

1. 推測されにくく、他では使っていないパスワードを使用します。
2. パスワードを他人と共有しないでください。
3. プライバシーに関する質問やアカウントまたはデータの削除依頼については、このページ下部のプライバシーポリシーをご確認ください。

**contact — サポートの利用状況**

1. 現在、このウェブサイトではヘルプセンターの記事のみを提供しています。
2. チケットでのメッセージ機能は準備中です。安全性と機能のテストが完了してから有効になります。
3. このウェブサイトからアカウント情報、パスワード、支払い情報を送信しないでください。

