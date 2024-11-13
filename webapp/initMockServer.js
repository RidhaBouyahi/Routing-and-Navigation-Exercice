// Le module sap.ui.define est utilisé pour définir une dépendance à deux autres modules : mockserver et MessageBox
sap.ui.define([
    "demonr/localService/mockserver",  // Le module personnalisé pour le serveur simulé
    "sap/m/MessageBox"                 // Le module SAPUI5 pour afficher des messages à l'utilisateur (par exemple, des alertes)
], function (mockserver, MessageBox) {
    "use strict";

    // Initialisation du serveur simulé
    mockserver.init().catch(function (oError) {
        // Si l'initialisation du serveur simulé échoue, une boîte de message d'erreur est affichée
        // L'objet oError contient l'erreur et son message
        MessageBox.error(oError.message);
    }).finally(function () {
        // Une fois que l'initialisation (qu'elle réussisse ou échoue) est terminée,
        // le composant intégré (support du composant) est chargé.
        // Ceci garantit que l'application SAPUI5 est prête à fonctionner, même si le serveur simulé échoue.
        sap.ui.require(["sap/ui/core/ComponentSupport"]);
    });
});
