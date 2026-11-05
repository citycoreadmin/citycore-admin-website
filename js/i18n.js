export const LANGS = [
  { code: "en", flag: "🇺🇸", label: "English" },
  { code: "fr", flag: "🇫🇷", label: "Français" },
  { code: "ht", flag: "🇭🇹", label: "Kreyòl Ayisyen" }
];

export const CATEGORIES = ["account", "payment", "technical", "report_user", "feedback", "bug", "admin_panel", "other"];
export const STATUSES = ["open", "pending", "in_progress", "resolved", "closed"];
export const PRIORITIES = ["low", "normal", "high", "urgent"];
export const PLATFORMS = ["all", "ios", "ipados", "android", "web"];

const D = {
  en: {
    nav_home: "Home", nav_help: "Help Center", nav_support: "Support", nav_staff: "Staff",
    hero_title: "Hi, how can we help you?",
    search_ph: "Search for articles", search_btn: "Search",
    platform: "Platform", p_all: "All platforms", p_ios: "iOS", p_ipados: "iPadOS", p_android: "Android", p_web: "Web",
    language: "Language", theme: "Toggle theme",
    help_cats: "Browse by category", articles: "Articles", results: "Search results",
    no_results: "No articles found. Try different words or contact support.",
    back: "Back", all_cats: "All categories", article_count: "articles",
    cat_getting_started: "Getting Started", cat_account_login: "Account & Login", cat_admin_panels: "Admin Panels",
    cat_roles: "Roles & Permissions", cat_invitations: "Invitations", cat_troubleshooting: "Troubleshooting",
    cat_privacy: "Privacy & Security", cat_contact: "Contact Support",
    contact_cta: "Still need help? Message our support team.", contact_btn: "Contact support",
    footer: "© 2026 CityCore Admin. All rights reserved.", privacy: "Privacy Policy",
    w_open: "Open support", w_close: "Close", w_title: "CityCore Admin Support",
    w_welcome_1: "Hi! Welcome to CityCore Admin Support 👋",
    w_welcome_2: "Please note that this is a messaging service, not a live chat. One of our support agents will get back to you as soon as possible.",
    w_welcome_3: "During periods of high demand, response times may be longer. If you have already contacted us about the same issue, please continue using your existing ticket.",
    w_pick: "What do you need help with?", w_my_tickets: "My tickets", w_new: "New ticket",
    cat_account: "I have a problem with my account.",
    cat_payment: "I have a problem with a payment or subscription.",
    cat_technical: "I have a technical problem with the app.",
    cat_report_user: "I want to report another user.",
    cat_feedback: "I have feedback or a question.",
    cat_bug: "I want to report a bug.",
    cat_admin_panel: "I need help with my admin panel.",
    cat_other: "Other problems.",
    sign_in: "Sign in", sign_up: "Create account", sign_out: "Sign out", email: "Email", password: "Password",
    auth_needed: "Please sign in so we can link your ticket to your account and keep it private.",
    auth_demo: "Demo mode: data is stored only in this browser.",
    subject: "Subject", message: "Message", msg_ph: "Describe your issue…", attach: "Attach images or videos",
    send: "Send", submit_ticket: "Submit ticket", ticket: "Ticket", created: "Created",
    no_tickets: "You have no tickets yet.", reply_ph: "Write a reply…", closed_note: "This ticket is closed. Please open a new ticket.",
    you: "You", support: "Support", sending: "Sending…", saved: "Saved",
    notif: "Notifications", notif_reply: "Support replied to", notif_none: "No notifications.", mark_read: "Mark all read",
    err_generic: "Something went wrong. Please try again.", err_file: "Only images and videos up to {mb} MB are allowed.",
    err_required: "Please fill in all fields.",
    st_open: "Open", st_pending: "Pending", st_in_progress: "In Progress", st_resolved: "Resolved", st_closed: "Closed",
    pr_low: "Low", pr_normal: "Normal", pr_high: "High", pr_urgent: "Urgent",
    s_title: "Support Dashboard", s_denied: "Access denied. This area is for authorized support staff only.",
    s_tickets: "Tickets", s_stats: "Statistics", s_team: "Team & permissions", s_audit: "Audit log",
    s_status: "Status", s_category: "Category", s_priority: "Priority", s_assignee: "Assignee", s_all: "All",
    s_unassigned: "Unassigned", s_search: "Search tickets…", s_requester: "Requester", s_updated: "Updated",
    s_assign_me: "Assign to me", s_total: "Total tickets", s_last7: "Last 7 days", s_unassigned_open: "Unassigned & active",
    s_by_status: "By status", s_by_category: "By category", s_role: "Role", s_active: "Active",
    s_add_staff: "Add / update staff member", s_save: "Save", s_actor: "Actor", s_action: "Action", s_when: "When",
    s_perm_reply: "Reply", s_perm_assign: "Assign / prioritise", s_perm_change_status: "Change status",
    s_perm_view_stats: "View statistics", s_perm_view_audit: "View audit log", s_select: "Select a ticket",
    s_no_perm: "You don't have permission for this.", r_founder: "Founder", r_admin: "Admin", r_agent: "Agent"
  },
  fr: {
    nav_home: "Accueil", nav_help: "Centre d'aide", nav_support: "Assistance", nav_staff: "Équipe",
    hero_title: "Bonjour, comment pouvons-nous vous aider ?",
    search_ph: "Rechercher des articles", search_btn: "Rechercher",
    platform: "Plateforme", p_all: "Toutes les plateformes", p_ios: "iOS", p_ipados: "iPadOS", p_android: "Android", p_web: "Web",
    language: "Langue", theme: "Changer de thème",
    help_cats: "Parcourir par catégorie", articles: "Articles", results: "Résultats de recherche",
    no_results: "Aucun article trouvé. Essayez d'autres mots ou contactez l'assistance.",
    back: "Retour", all_cats: "Toutes les catégories", article_count: "articles",
    cat_getting_started: "Premiers pas", cat_account_login: "Compte et connexion", cat_admin_panels: "Panneaux d'administration",
    cat_roles: "Rôles et autorisations", cat_invitations: "Invitations", cat_troubleshooting: "Dépannage",
    cat_privacy: "Confidentialité et sécurité", cat_contact: "Contacter l'assistance",
    contact_cta: "Besoin d'aide ? Écrivez à notre équipe d'assistance.", contact_btn: "Contacter l'assistance",
    footer: "© 2026 CityCore Admin. Tous droits réservés.", privacy: "Politique de confidentialité",
    w_open: "Ouvrir l'assistance", w_close: "Fermer", w_title: "Assistance CityCore Admin",
    w_welcome_1: "Bonjour ! Bienvenue sur l'assistance CityCore Admin 👋",
    w_welcome_2: "Veuillez noter qu'il s'agit d'un service de messagerie et non d'un chat en direct. L'un de nos agents vous répondra dès que possible.",
    w_welcome_3: "En période de forte demande, les délais de réponse peuvent être plus longs. Si vous nous avez déjà contactés pour le même problème, veuillez continuer à utiliser votre ticket existant.",
    w_pick: "De quoi avez-vous besoin ?", w_my_tickets: "Mes tickets", w_new: "Nouveau ticket",
    cat_account: "J'ai un problème avec mon compte.",
    cat_payment: "J'ai un problème avec un paiement ou un abonnement.",
    cat_technical: "J'ai un problème technique avec l'application.",
    cat_report_user: "Je veux signaler un autre utilisateur.",
    cat_feedback: "J'ai un commentaire ou une question.",
    cat_bug: "Je veux signaler un bug.",
    cat_admin_panel: "J'ai besoin d'aide avec mon panneau d'administration.",
    cat_other: "Autres problèmes.",
    sign_in: "Se connecter", sign_up: "Créer un compte", sign_out: "Se déconnecter", email: "E-mail", password: "Mot de passe",
    auth_needed: "Connectez-vous pour que nous liions votre ticket à votre compte et le gardions privé.",
    auth_demo: "Mode démo : les données restent uniquement dans ce navigateur.",
    subject: "Objet", message: "Message", msg_ph: "Décrivez votre problème…", attach: "Joindre des images ou vidéos",
    send: "Envoyer", submit_ticket: "Envoyer le ticket", ticket: "Ticket", created: "Créé",
    no_tickets: "Vous n'avez pas encore de ticket.", reply_ph: "Écrire une réponse…", closed_note: "Ce ticket est fermé. Veuillez ouvrir un nouveau ticket.",
    you: "Vous", support: "Assistance", sending: "Envoi…", saved: "Enregistré",
    notif: "Notifications", notif_reply: "L'assistance a répondu à", notif_none: "Aucune notification.", mark_read: "Tout marquer comme lu",
    err_generic: "Une erreur est survenue. Veuillez réessayer.", err_file: "Seules les images et vidéos jusqu'à {mb} Mo sont autorisées.",
    err_required: "Veuillez remplir tous les champs.",
    st_open: "Ouvert", st_pending: "En attente", st_in_progress: "En cours", st_resolved: "Résolu", st_closed: "Fermé",
    pr_low: "Faible", pr_normal: "Normale", pr_high: "Élevée", pr_urgent: "Urgente",
    s_title: "Tableau de bord de l'assistance", s_denied: "Accès refusé. Cet espace est réservé au personnel d'assistance autorisé.",
    s_tickets: "Tickets", s_stats: "Statistiques", s_team: "Équipe et autorisations", s_audit: "Journal d'audit",
    s_status: "Statut", s_category: "Catégorie", s_priority: "Priorité", s_assignee: "Assigné à", s_all: "Tous",
    s_unassigned: "Non assigné", s_search: "Rechercher des tickets…", s_requester: "Demandeur", s_updated: "Mis à jour",
    s_assign_me: "M'assigner", s_total: "Total des tickets", s_last7: "7 derniers jours", s_unassigned_open: "Non assignés et actifs",
    s_by_status: "Par statut", s_by_category: "Par catégorie", s_role: "Rôle", s_active: "Actif",
    s_add_staff: "Ajouter / modifier un membre", s_save: "Enregistrer", s_actor: "Acteur", s_action: "Action", s_when: "Quand",
    s_perm_reply: "Répondre", s_perm_assign: "Assigner / prioriser", s_perm_change_status: "Changer le statut",
    s_perm_view_stats: "Voir les statistiques", s_perm_view_audit: "Voir le journal d'audit", s_select: "Sélectionnez un ticket",
    s_no_perm: "Vous n'avez pas la permission.", r_founder: "Fondateur", r_admin: "Admin", r_agent: "Agent"
  },
  ht: {
    nav_home: "Akèy", nav_help: "Sant Èd", nav_support: "Sipò", nav_staff: "Ekip",
    hero_title: "Bonjou, ki jan nou ka ede w ?",
    search_ph: "Chèche atik", search_btn: "Chèche",
    platform: "Platfòm", p_all: "Tout platfòm", p_ios: "iOS", p_ipados: "iPadOS", p_android: "Android", p_web: "Wèb",
    language: "Lang", theme: "Chanje tèm",
    help_cats: "Navige pa kategori", articles: "Atik", results: "Rezilta rechèch",
    no_results: "Pa gen atik ki jwenn. Eseye lòt mo oswa kontakte sipò.",
    back: "Retounen", all_cats: "Tout kategori", article_count: "atik",
    cat_getting_started: "Kòmanse", cat_account_login: "Kont ak koneksyon", cat_admin_panels: "Panèl Admin",
    cat_roles: "Wòl ak pèmisyon", cat_invitations: "Envitasyon", cat_troubleshooting: "Rezoud pwoblèm",
    cat_privacy: "Konfidansyalite ak sekirite", cat_contact: "Kontakte sipò",
    contact_cta: "Ou toujou bezwen èd ? Ekri ekip sipò nou an.", contact_btn: "Kontakte sipò",
    footer: "© 2026 CityCore Admin. Tout dwa rezève.", privacy: "Politik konfidansyalite",
    w_open: "Louvri sipò", w_close: "Fèmen", w_title: "Sipò CityCore Admin",
    w_welcome_1: "Bonjou ! Byenveni nan Sipò CityCore Admin 👋",
    w_welcome_2: "Tanpri sonje se yon sèvis mesaj, se pa yon chat dirèk. Youn nan ajan sipò nou yo ap reponn ou le pli vit posib.",
    w_welcome_3: "Lè gen anpil demann, repons yo ka pran plis tan. Si ou deja kontakte nou pou menm pwoblèm nan, tanpri kontinye itilize tikè ou a.",
    w_pick: "Kisa ou bezwen èd pou li ?", w_my_tickets: "Tikè m yo", w_new: "Nouvo tikè",
    cat_account: "Mwen gen yon pwoblèm ak kont mwen.",
    cat_payment: "Mwen gen yon pwoblèm ak yon peman oswa yon abònman.",
    cat_technical: "Mwen gen yon pwoblèm teknik ak aplikasyon an.",
    cat_report_user: "Mwen vle rapòte yon lòt itilizatè.",
    cat_feedback: "Mwen gen yon kòmantè oswa yon kesyon.",
    cat_bug: "Mwen vle rapòte yon bug.",
    cat_admin_panel: "Mwen bezwen èd ak panèl admin mwen.",
    cat_other: "Lòt pwoblèm.",
    sign_in: "Konekte", sign_up: "Kreye yon kont", sign_out: "Dekonekte", email: "Imèl", password: "Modpas",
    auth_needed: "Tanpri konekte pou nou ka lye tikè w la ak kont ou epi kenbe l prive.",
    auth_demo: "Mòd demo : done yo rete sèlman nan navigatè sa a.",
    subject: "Sijè", message: "Mesaj", msg_ph: "Dekri pwoblèm ou an…", attach: "Ajoute imaj oswa videyo",
    send: "Voye", submit_ticket: "Voye tikè a", ticket: "Tikè", created: "Kreye",
    no_tickets: "Ou poko gen tikè.", reply_ph: "Ekri yon repons…", closed_note: "Tikè sa a fèmen. Tanpri louvri yon nouvo tikè.",
    you: "Ou", support: "Sipò", sending: "Y ap voye…", saved: "Anrejistre",
    notif: "Notifikasyon", notif_reply: "Sipò reponn sou", notif_none: "Pa gen notifikasyon.", mark_read: "Make tout tankou li",
    err_generic: "Gen yon bagay ki pa mache. Tanpri eseye ankò.", err_file: "Se sèlman imaj ak videyo jiska {mb} Mo ki aksepte.",
    err_required: "Tanpri ranpli tout chan yo.",
    st_open: "Ouvè", st_pending: "An datant", st_in_progress: "An kou", st_resolved: "Rezoud", st_closed: "Fèmen",
    pr_low: "Ba", pr_normal: "Nòmal", pr_high: "Wo", pr_urgent: "Ijan",
    s_title: "Tablo bò sipò", s_denied: "Aksè refize. Zòn sa a rezève pou anplwaye sipò ki otorize sèlman.",
    s_tickets: "Tikè", s_stats: "Estatistik", s_team: "Ekip ak pèmisyon", s_audit: "Jounal odit",
    s_status: "Estati", s_category: "Kategori", s_priority: "Priyorite", s_assignee: "Asiyen bay", s_all: "Tout",
    s_unassigned: "Pa asiyen", s_search: "Chèche tikè…", s_requester: "Demandè", s_updated: "Mete ajou",
    s_assign_me: "Asiyen ban mwen", s_total: "Total tikè", s_last7: "7 dènye jou", s_unassigned_open: "Pa asiyen epi aktif",
    s_by_status: "Pa estati", s_by_category: "Pa kategori", s_role: "Wòl", s_active: "Aktif",
    s_add_staff: "Ajoute / modifye yon manm", s_save: "Anrejistre", s_actor: "Aktè", s_action: "Aksyon", s_when: "Kilè",
    s_perm_reply: "Reponn", s_perm_assign: "Asiyen / priyorite", s_perm_change_status: "Chanje estati",
    s_perm_view_stats: "Wè estatistik", s_perm_view_audit: "Wè jounal odit", s_select: "Chwazi yon tikè",
    s_no_perm: "Ou pa gen pèmisyon pou sa.", r_founder: "Fondatè", r_admin: "Admin", r_agent: "Ajan"
  }
};

let lang = localStorage.getItem("cc_lang") || (navigator.language || "en").slice(0, 2);
if (!D[lang]) lang = "en";

export const getLang = () => lang;
export function t(key, vars = {}) {
  let s = (D[lang] && D[lang][key]) || D.en[key] || key;
  for (const k in vars) s = s.replace(`{${k}}`, vars[k]);
  return s;
}
export function setLang(code) {
  if (!D[code]) return;
  lang = code;
  localStorage.setItem("cc_lang", code);
  document.documentElement.lang = code;
  applyI18n();
  window.dispatchEvent(new CustomEvent("cc:lang"));
}
export function applyI18n(root = document) {
  root.querySelectorAll("[data-i18n]").forEach(n => { n.textContent = t(n.dataset.i18n); });
  root.querySelectorAll("[data-i18n-ph]").forEach(n => { n.placeholder = t(n.dataset.i18nPh); });
  root.querySelectorAll("[data-i18n-aria]").forEach(n => { n.setAttribute("aria-label", t(n.dataset.i18nAria)); });
  root.querySelectorAll("[data-lang-select]").forEach(sel => { sel.value = lang; });
}
export function fmtDate(iso) {
  return new Date(iso).toLocaleString(lang === "ht" ? "fr" : lang, { dateStyle: "medium", timeStyle: "short" });
}
document.documentElement.lang = lang;
