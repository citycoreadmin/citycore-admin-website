import spanish from "./es.js";

export default {
  ...spanish,
  messages: {
    ...spanish.messages,
    policy_app_after: " de CityCore Admin indica que es posible que se recopilen el nombre, la dirección de correo electrónico y las fotos o los videos, que se vinculen a los usuarios y que se utilicen para el funcionamiento de la aplicación.",
    policy_contact_after: ". La solicitud no elimina los datos automáticamente y no se garantiza ningún plazo de procesamiento.",
    no_results: "No se encontraron artículos. Prueba con otras palabras."
  },
  articles: {
    ...spanish.articles,
    servers: {
      ...spanish.articles.servers,
      steps: [
        "Abre CityCore Admin.",
        "Toca «Servers» en la navegación inferior.",
        "Tus paneles existentes aparecen en «YOUR ADMIN PANELS».",
        "Para crear uno, toca «+ Create Admin Panel»."
      ]
    },
    roles: {
      ...spanish.articles.roles,
      steps: [
        "Abre tu panel de administración.",
        "Ve a «Panel Settings».",
        "Toca «Roles & Permissions».",
        "Usa «Create Role» para crear un rol.",
        "Usa «Assign Role» para asignárselo a un miembro.",
        "Los roles existentes aparecen en «ROLE HIERARCHY»."
      ]
    },
    "account-settings": {
      ...spanish.articles["account-settings"],
      steps: [
        "Toca «Profile» en la navegación inferior y abre «Settings».",
        "La configuración disponible puede variar según la versión de la aplicación.",
        "Usa «Log Out» para cerrar sesión."
      ]
    }
  }
};
