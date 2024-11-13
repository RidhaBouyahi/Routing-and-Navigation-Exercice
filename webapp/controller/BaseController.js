// On définit un module SAPUI5 avec les dépendances nécessaires : 
// - Controller : pour gérer les interactions de la vue et le contrôleur
// - History : pour gérer l'historique de navigation dans l'application
// - UIComponent : pour accéder au composant principal et au routeur de l'application
sap.ui.define([
	"sap/ui/core/mvc/Controller",  // Dépendance pour le contrôleur MVC
	"sap/ui/core/routing/History", // Dépendance pour gérer l'historique de navigation
	"sap/ui/core/UIComponent"      // Dépendance pour accéder au composant principal de l'application
], function(Controller, History, UIComponent) {
	"use strict";  // Assure que le code est exécuté en mode strict pour éviter certaines erreurs

	// Définition du contrôleur de base (BaseController) qui étend le contrôleur SAPUI5 de base
	return Controller.extend("demonr.controller.BaseController", {

		// Fonction pour récupérer le routeur de l'application à partir du composant principal
		// Le routeur est utilisé pour gérer la navigation entre les vues
		getRouter : function () {
			return UIComponent.getRouterFor(this);  // Retourne le routeur lié au contrôleur actuel
		},

		// Fonction pour gérer la navigation vers la page précédente
		onNavBack: function () {
			var oHistory, sPreviousHash;

			// Récupère une instance de l'historique de navigation (historique des pages visitées)
			oHistory = History.getInstance();

			// Récupère le "hash" (URL partielle) de la page précédente dans l'historique
			sPreviousHash = oHistory.getPreviousHash();

			// Si l'historique contient une page précédente
			if (sPreviousHash !== undefined) {
				// Navigue en arrière dans l'historique du navigateur (simule un clic sur le bouton de retour du navigateur)
				window.history.go(-1);
			} else {
				// Si l'historique est vide (aucune page précédente), on redirige vers la page d'accueil de l'application
				// Cette navigation ne sera pas ajoutée à l'historique pour éviter un retour intempestif
				this.getRouter().navTo("appHome", {}, true /*no history*/);
			}
		}

	});  // Fin de la définition du contrôleur de base

});
