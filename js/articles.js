// Help center content. `cat` matches the cat_* i18n keys. `platforms` empty = all platforms.
export const ARTICLES = [
  {
    id: "servers", cat: "admin_panels", img: "servers.png", platforms: ["ios", "ipados", "android"],
    kw: "server servers create admin panel panel",
    tr: {
      en: { title: "Find and create Admin Panels", steps: ["Open CityCore Admin.", "Tap Servers in the bottom navigation.", "Your existing Admin Panels appear under YOUR ADMIN PANELS.", "To start a new panel, tap + Create Admin Panel."] },
      fr: { title: "Trouver et créer des panneaux d'administration", steps: ["Ouvrez CityCore Admin.", "Touchez Servers dans la navigation du bas.", "Vos panneaux existants apparaissent sous YOUR ADMIN PANELS.", "Pour en créer un, touchez + Create Admin Panel."] },
      ht: { title: "Jwenn ak kreye Panèl Admin", steps: ["Louvri CityCore Admin.", "Peze Servers nan navigasyon anba a.", "Panèl Admin ou yo parèt anba YOUR ADMIN PANELS.", "Pou kreye yon nouvo, peze + Create Admin Panel."] }
    }
  },
  {
    id: "panel-settings", cat: "admin_panels", img: "panel-settings.png", platforms: ["ios", "ipados", "android"],
    kw: "panel settings members staff moderation sanction audit logs invitations delete transfer ownership",
    tr: {
      en: { title: "Panel Settings overview", steps: ["Open the Admin Panel you want to manage.", "Open Panel Settings.", "Use Members & Staff to manage members and staff.", "Use Moderation for sanction and moderation settings.", "Use Server Management for permissions, audit logs, notifications and invitations."] },
      fr: { title: "Aperçu des paramètres du panneau", steps: ["Ouvrez le panneau à gérer.", "Ouvrez Panel Settings.", "Members & Staff : gérer membres et équipe.", "Moderation : sanctions et modération.", "Server Management : autorisations, journaux d'audit, notifications et invitations."] },
      ht: { title: "Apèsi paramèt panèl la", steps: ["Louvri Panèl Admin ou vle jere a.", "Louvri Panel Settings.", "Members & Staff : jere manm ak anplwaye.", "Moderation : sanksyon ak moderasyon.", "Server Management : pèmisyon, jounal odit, notifikasyon ak envitasyon."] }
    }
  },
  {
    id: "roles", cat: "roles", img: "roles-permissions.png", platforms: ["ios", "ipados", "android"],
    kw: "role roles permission permissions create assign hierarchy staff",
    tr: {
      en: { title: "Create and assign roles", steps: ["Open your Admin Panel.", "Go to Panel Settings.", "Tap Roles & Permissions.", "Use Create Role to make a new role.", "Use Assign Role to give a role to a member.", "Existing roles appear under ROLE HIERARCHY."] },
      fr: { title: "Créer et attribuer des rôles", steps: ["Ouvrez votre panneau.", "Allez dans Panel Settings.", "Touchez Roles & Permissions.", "Create Role pour créer un rôle.", "Assign Role pour l'attribuer à un membre.", "Les rôles existants figurent sous ROLE HIERARCHY."] },
      ht: { title: "Kreye ak bay wòl", steps: ["Louvri Panèl Admin ou.", "Ale nan Panel Settings.", "Peze Roles & Permissions.", "Itilize Create Role pou kreye yon wòl.", "Itilize Assign Role pou bay yon manm yon wòl.", "Wòl ki egziste yo parèt anba ROLE HIERARCHY."] }
    }
  },
  {
    id: "account-settings", cat: "account_login", img: "settings.png", platforms: ["ios", "ipados", "android"],
    kw: "settings account privacy security devices notifications language appearance logout log out",
    tr: {
      en: { title: "Account settings", steps: ["Tap Profile in the bottom navigation and open Settings.", "Available settings may vary by app version.", "Use Log Out to sign out of your account."] },
      fr: { title: "Paramètres du compte", steps: ["Touchez Profile dans la navigation du bas, puis ouvrez Settings.", "Les paramètres disponibles peuvent varier selon la version de l'application.", "Utilisez Log Out pour vous déconnecter."] },
      ht: { title: "Paramèt kont", steps: ["Peze Profile nan meni ki anba a, epi louvri Settings.", "Paramèt ki disponib yo ka chanje selon vèsyon aplikasyon an.", "Itilize Log Out pou dekonekte w."] }
    }
  },
  {
    id: "get-started", cat: "getting_started", img: "", platforms: [],
    kw: "start begin welcome install download first",
    tr: {
      en: { title: "Welcome to CityCore Admin", steps: ["Install CityCore Admin and create your account.", "Open the Servers tab to see or create an Admin Panel.", "Invite your staff and set up roles.", "Use Panel Settings to configure moderation."] },
      fr: { title: "Bienvenue sur CityCore Admin", steps: ["Installez CityCore Admin et créez votre compte.", "Ouvrez l'onglet Servers pour voir ou créer un panneau.", "Invitez votre équipe et configurez les rôles.", "Utilisez Panel Settings pour configurer la modération."] },
      ht: { title: "Byenveni nan CityCore Admin", steps: ["Enstale CityCore Admin epi kreye kont ou.", "Louvri onglè Servers pou wè oswa kreye yon panèl.", "Envite anplwaye ou yo epi mete wòl yo.", "Itilize Panel Settings pou konfigire moderasyon."] }
    }
  },
  {
    id: "login-problems", cat: "account_login", img: "", platforms: [],
    kw: "login sign in password reset locked email verify",
    tr: {
      en: { title: "I can't log in", steps: ["Check your email address and password for typos.", "Use the password reset option on the sign-in screen.", "Make sure the app is up to date.", "Support messaging is not currently available on this website."] },
      fr: { title: "Je n'arrive pas à me connecter", steps: ["Vérifiez votre e-mail et votre mot de passe.", "Utilisez la réinitialisation du mot de passe.", "Vérifiez que l'application est à jour.", "La messagerie d'assistance n'est pas disponible actuellement sur ce site."] },
      ht: { title: "Mwen pa ka konekte", steps: ["Verifye imèl ak modpas ou pou fòt.", "Itilize opsyon reyinisyalize modpas la.", "Asire w aplikasyon an ajou.", "Mesaj sipò pa disponib sou sit sa a kounye a."] }
    }
  },
  {
    id: "invite-members", cat: "invitations", img: "", platforms: ["ios", "ipados", "android"],
    kw: "invite invitation link join members code",
    tr: {
      en: { title: "Invite people to your panel", steps: ["Open your Admin Panel and go to Panel Settings.", "Open Server Management, then Invitations.", "Create an invitation and share it.", "Revoke an invitation at any time from the same screen."] },
      fr: { title: "Inviter des personnes dans votre panneau", steps: ["Ouvrez votre panneau puis Panel Settings.", "Ouvrez Server Management, puis Invitations.", "Créez une invitation et partagez-la.", "Révoquez-la à tout moment depuis le même écran."] },
      ht: { title: "Envite moun nan panèl ou", steps: ["Louvri panèl ou epi ale nan Panel Settings.", "Louvri Server Management, answit Invitations.", "Kreye yon envitasyon epi pataje l.", "Ou ka anile l nenpòt kilè sou menm ekran an."] }
    }
  },
  {
    id: "app-crash", cat: "troubleshooting", img: "", platforms: [],
    kw: "crash bug freeze slow error not loading update reinstall",
    tr: {
      en: { title: "The app crashes or won't load", steps: ["Force-close and reopen the app.", "Check your internet connection.", "Update to the latest version.", "Restart your device.", "This website cannot currently receive bug reports or attachments."] },
      fr: { title: "L'application plante ou ne charge pas", steps: ["Fermez et rouvrez l'application.", "Vérifiez votre connexion internet.", "Mettez à jour l'application.", "Redémarrez votre appareil.", "Ce site ne peut pas recevoir de signalements de bugs ni de pièces jointes pour le moment."] },
      ht: { title: "Aplikasyon an fèmen oswa pa chaje", steps: ["Fèmen aplikasyon an epi rouvri l.", "Verifye koneksyon entènèt ou.", "Mete aplikasyon an ajou.", "Rekòmanse aparèy ou a.", "Sit sa a pa ka resevwa rapò sou pwoblèm oswa fichye pou kounye a."] }
    }
  },
  {
    id: "privacy-security", cat: "privacy", img: "", platforms: [],
    kw: "privacy security data delete account two factor devices",
    tr: {
      en: { title: "Keeping your account secure", steps: ["Use a strong, unique password.", "Do not share your password with anyone.", "For privacy questions or account/data deletion requests, see the Privacy Policy link at the bottom of this page."] },
      fr: { title: "Sécuriser votre compte", steps: ["Utilisez un mot de passe fort et unique.", "Ne communiquez votre mot de passe à personne.", "Pour toute question sur la confidentialité ou toute demande de suppression de compte ou de données, consultez le lien Politique de confidentialité en bas de cette page."] },
      ht: { title: "Sekirize kont ou", steps: ["Itilize yon modpas solid ki diferan de lòt modpas ou yo.", "Pa bay pèsonn modpas ou.", "Pou kesyon sou vi prive oswa demann pou efase kont oswa done, gade lyen Politik konfidansyalite ki anba paj sa a."] }
    }
  },
  {
    id: "contact", cat: "contact", img: "", platforms: [],
    kw: "contact support ticket message help report",
    tr: {
      en: { title: "Support availability", steps: ["This website currently provides self-service Help Center articles only.", "Ticket messaging is being prepared and will be enabled after security and functional testing.", "Do not send account, password or payment details through this website."] },
      fr: { title: "Disponibilité de l'assistance", steps: ["Ce site propose actuellement uniquement des articles d'aide en libre-service.", "La messagerie par ticket est en préparation et sera activée après des tests de sécurité et de fonctionnement.", "N'envoyez pas d'informations de compte, de mot de passe ou de paiement sur ce site."] },
      ht: { title: "Disponibilite sipò", steps: ["Pou kounye a, sit sa a bay atik Sant Èd pou ede w jwenn repons poukont ou.", "Sèvis mesaj sipò a ap prepare; li p ap disponib anvan tès sekirite ak fonksyonalite yo fini.", "Pa voye enfòmasyon sou kont ou, modpas ou oswa peman sou sit sa a."] }
    }
  }
];

export const HELP_CATEGORIES = ["getting_started", "account_login", "admin_panels", "roles", "invitations", "troubleshooting", "privacy", "contact"];
