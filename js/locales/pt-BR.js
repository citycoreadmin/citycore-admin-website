import portuguese from "./pt.js";

export default {
  messages: {
    ...portuguese.messages,
    skip_content: "Ir para o conteúdo",
    language_complete: "Completo",
    language_search: "Buscar idiomas",
    language_no_results: "Nenhum idioma corresponde à busca.",
    policy_intro: "O CityCore Admin é operado pela WOOBENS STUDIO. Esta página distingue o site estático do CityCore Admin do aplicativo CityCore Admin para iOS.",
    policy_website_intro: "O site oferece páginas da Central de Ajuda e não solicita informações de conta ou pagamento. Não há formulário de contato nem mensagens de suporte.",
    policy_website_data: "O site armazena o idioma, o tema e a plataforma selecionados no armazenamento local deste navegador. Você pode remover essas preferências apagando os dados deste site no navegador. O operador ainda não confirmou como o provedor de hospedagem trata as informações técnicas das solicitações.",
    policy_ios: "Aplicativo para iOS",
    policy_app_after: " do CityCore Admin indicam que nome, endereço de e-mail e fotos ou vídeos podem ser coletados, associados aos usuários e usados para o funcionamento do aplicativo.",
    policy_app_unknown: "A WOOBENS STUDIO ainda não confirmou uma descrição completa da coleta e do uso de dados, compartilhamento, segurança, retenção, exclusão ou práticas relativas a crianças no aplicativo publicado. As informações da App Store não estabelecem todas essas práticas.",
    policy_contact: "Entre em contato",
    policy_contact_before: "Para dúvidas sobre privacidade ou para solicitar a exclusão da sua conta ou dos seus dados, entre em contato com a WOOBENS STUDIO pelo endereço ",
    policy_contact_after: ". Uma solicitação não resulta em exclusão automática e não há promessa de prazo para processamento.",
    page_home_title: "CityCore Admin | Central de Ajuda",
    nav_help: "Central de Ajuda",
    search_ph: "Buscar artigos",
    search_btn: "Buscar",
    results: "Resultados da busca",
    no_results: "Nenhum artigo encontrado. Tente outras palavras.",
    cat_account_login: "Conta e acesso",
    cat_troubleshooting: "Solução de problemas",
    contact_status_body: "A Central de Ajuda oferece orientações para você encontrar respostas por conta própria. As mensagens por chamado serão ativadas após a conclusão dos testes de segurança e funcionamento. Não envie informações de conta ou pagamento por este site."
  },
  articles: {
    servers: {
      title: "Encontrar e criar painéis de administração",
      steps: [
        "Abra o CityCore Admin.",
        "Toque em «Servers» na navegação inferior.",
        "Seus painéis existentes aparecem em «YOUR ADMIN PANELS».",
        "Para criar um painel, toque em «+ Create Admin Panel»."
      ]
    },
    "panel-settings": {
      title: "Visão geral das configurações do painel",
      steps: [
        "Abra o painel de administração que deseja gerenciar.",
        "Abra «Panel Settings».",
        "Use «Members & Staff» para gerenciar membros e equipe.",
        "Use «Moderation» para configurar sanções e moderação.",
        "Use «Server Management» para gerenciar permissões, registros de auditoria, notificações e convites."
      ]
    },
    roles: {
      title: "Criar e atribuir funções",
      steps: [
        "Abra seu painel de administração.",
        "Acesse «Panel Settings».",
        "Toque em «Roles & Permissions».",
        "Use «Create Role» para criar uma função.",
        "Use «Assign Role» para atribuir uma função a um membro.",
        "As funções existentes aparecem em «ROLE HIERARCHY»."
      ]
    },
    "account-settings": {
      title: "Configurações da conta",
      steps: [
        "Toque em «Profile» na navegação inferior e abra «Settings».",
        "As configurações disponíveis podem variar conforme a versão do aplicativo.",
        "Use «Log Out» para sair da conta."
      ]
    },
    "get-started": {
      title: "Boas-vindas ao CityCore Admin",
      steps: [
        "Instale o CityCore Admin e crie sua conta.",
        "Abra a aba «Servers» para ver ou criar um painel de administração.",
        "Convide sua equipe e configure as funções.",
        "Use «Panel Settings» para configurar a moderação."
      ]
    },
    "login-problems": {
      title: "Não consigo entrar",
      steps: [
        "Verifique se há erros de digitação no endereço de e-mail e na senha.",
        "Use a opção de redefinição de senha na tela de acesso.",
        "Certifique-se de que o aplicativo está atualizado.",
        "As mensagens de suporte não estão disponíveis neste site no momento."
      ]
    },
    "invite-members": {
      title: "Convidar pessoas para seu painel",
      steps: [
        "Abra seu painel de administração e acesse «Panel Settings».",
        "Abra «Server Management» e depois «Invitations».",
        "Crie um convite e compartilhe-o.",
        "Você pode revogar um convite a qualquer momento na mesma tela."
      ]
    },
    "app-crash": {
      title: "O aplicativo fecha ou não carrega",
      steps: [
        "Force o fechamento do aplicativo e abra-o novamente.",
        "Verifique sua conexão com a internet.",
        "Atualize o aplicativo para a versão mais recente.",
        "Reinicie o dispositivo.",
        "No momento, este site não pode receber relatórios de erros nem anexos."
      ]
    },
    "privacy-security": {
      title: "Manter sua conta segura",
      steps: [
        "Use uma senha forte e exclusiva.",
        "Não compartilhe sua senha com ninguém.",
        "Para dúvidas sobre privacidade ou solicitações de exclusão da conta ou dos dados, consulte o link para a Política de Privacidade no final desta página."
      ]
    },
    contact: {
      title: "Disponibilidade do suporte",
      steps: [
        "No momento, este site oferece apenas artigos de autoatendimento na Central de Ajuda.",
        "As mensagens por chamado estão sendo preparadas e serão ativadas após a conclusão dos testes de segurança e funcionamento.",
        "Não envie informações de conta, senha ou pagamento por este site."
      ]
    }
  }
};
