// Le module SAPUI5 définit une fonction de simulation d'un serveur pour les appels OData en utilisant MockServer
sap.ui.define([
    "sap/ui/core/util/MockServer", // Importation de MockServer pour simuler les appels OData
    "sap/ui/model/json/JSONModel", // Importation de JSONModel pour gérer les modèles de données JSON
    "sap/base/Log" // Importation de Log pour enregistrer les messages de journalisation
], function (MockServer, JSONModel, Log) {
    "use strict";

    // Déclaration des chemins utilisés dans l'application
    var _sAppPath = "demonr/", // Chemin de base de l'application
        _sJsonFilesPath = _sAppPath + "localService/mockdata";
    // Chemin des fichiers JSON simulés pour le serveur mock

    // Le module retourne un objet contenant une méthode "init" pour initialiser le serveur simulé
    return { // Méthode d'initialisation de l'application
        init: function () {

            return new Promise(function (fnResolve, fnReject) { // Le fichier manifest.json de l'application est chargé via JSONModel
                var sManifestUrl = sap.ui.require.toUrl(_sAppPath + "manifest.json"),
                    oManifestModel = new JSONModel(sManifestUrl);

                // Lorsque la requête du manifeste est terminée avec succès
                oManifestModel.attachRequestCompleted(function () { // Récupération de l'URL des fichiers JSON et des métadonnées à partir du manifest
                    var sJsonFilesUrl = sap.ui.require.toUrl(_sJsonFilesPath),
                        oMainDataSource = oManifestModel.getProperty("/sap.app/dataSources/employeeRemote"),
                        sMetadataUrl = sap.ui.require.toUrl(_sAppPath + oMainDataSource.settings.localUri);

                    // Création d'un MockServer avec l'URL de base définie par le manifeste
                    var oMockServer = new MockServer({rootUri: oMainDataSource.uri});

                    // Configuration du serveur simulé
                    MockServer.config({autoRespond: true, autoRespondAfter: 500});
                    // Les réponses sont simulées automatiquement après 500 ms

                    // Simulation des données en utilisant le fichier de métadonnées et le répertoire contenant les fichiers mockdata
                    oMockServer.simulate(sMetadataUrl, {sMockdataBaseUrl: sJsonFilesUrl});

                    // Démarrage du MockServer
                    oMockServer.start();

                    // Log d'information pour indiquer que l'application tourne avec des données simulées
                    Log.info("Running the app with mock data");

                    // Résolution de la promesse pour indiquer que l'initialisation est terminée
                    fnResolve();
                });

                // Si la requête du manifeste échoue, un message d'erreur est enregistré
                oManifestModel.attachRequestFailed(function () {
                    var sError = "Failed to load application manifest";

                    Log.error(sError); // Enregistrement de l'erreur dans les logs
                    fnReject(new Error(sError)); // Rejet de la promesse avec l'erreur
                });
            });
        }
    };
});
