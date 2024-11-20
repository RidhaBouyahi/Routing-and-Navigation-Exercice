sap.ui.define([
	// Importation des modules nécessaires pour le fonctionnement de la table, du tri, du filtrage, et de la boîte de dialogue.
	"demonr/controller/BaseController",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Sorter",
	"sap/m/ViewSettingsDialog",
	"sap/m/ViewSettingsItem"
], function(
	BaseController,
	Filter,
	FilterOperator,
	Sorter,
	ViewSettingsDialog,
	ViewSettingsItem
) {
	"use strict";

	// Définition du contrôleur pour la vue de l'aperçu des employés
	return BaseController.extend("demonr.controller.employee.overview.EmployeeOverviewContent", {

		// Méthode d'initialisation, exécutée dès le chargement du contrôleur
		onInit: function () {
			// Initialisation des variables liées à la table, au tri, et à la recherche
			this._oTable = this.byId("employeesTable"); // Récupère la table des employés
			this._oVSD = null; // Référence à la boîte de dialogue des paramètres de vue (initialisée plus tard)
			this._sSortField = null; // Champ de tri sélectionné
			this._bSortDescending = false; // Indicateur si le tri est descendant
			this._aValidSortFields = ["EmployeeID", "FirstName", "LastName"]; // Champs valides pour le tri
			this._sSearchQuery = null; // Valeur de recherche

			// Initialisation de la boîte de dialogue des paramètres de vue
			this._initViewSettingsDialog();
		},

		// Méthode appelée lorsque l'utilisateur appuie sur le bouton de tri
		onSortButtonPressed : function () {
			// Ouvre la boîte de dialogue pour permettre à l'utilisateur de sélectionner un critère de tri
			this._oVSD.open();
		},

		// Méthode appelée lors de la recherche dans la table
		onSearchEmployeesTable : function (oEvent) {
			// Applique un filtre de recherche sur la table en fonction de la valeur saisie par l'utilisateur
			this._applySearchFilter(oEvent.getSource().getValue());
		},

		// Méthode pour initialiser la boîte de dialogue des paramètres de vue
		_initViewSettingsDialog : function () {
			// Crée une nouvelle instance de la boîte de dialogue des paramètres de vue
			this._oVSD = new ViewSettingsDialog("vsd", {
				// Lorsque l'utilisateur confirme ses choix dans la boîte de dialogue
				confirm: function (oEvent) {
					// Applique le tri en fonction de la sélection de l'utilisateur
					var oSortItem = oEvent.getParameter("sortItem");
					this._applySorter(oSortItem.getKey(), oEvent.getParameter("sortDescending"));
				}.bind(this)
			});

			// Ajout des options de tri dans la boîte de dialogue
			this._oVSD.addSortItem(new ViewSettingsItem({
				key: "EmployeeID", // Champ "EmployeeID" pour le tri
				text: "Employee ID", // Texte affiché pour l'option
				selected: true // Sélectionne par défaut "EmployeeID" comme champ de tri
			}));

			// Ajout des autres champs pour le tri
			this._oVSD.addSortItem(new ViewSettingsItem({
				key: "FirstName",
				text: "First Name",
				selected: false
			}));

			this._oVSD.addSortItem(new ViewSettingsItem({
				key: "LastName",
				text: "Last Name",
				selected: false
			}));
		},

		// Méthode pour appliquer un filtre de recherche à la table
		_applySearchFilter : function (sSearchQuery) {
			var aFilters, oFilter, oBinding;

			// Vérifie si la valeur de recherche est déjà appliquée, pour éviter de la réappliquer inutilement
			if (this._sSearchQuery === sSearchQuery) {
				return;
			}
			// Met à jour la valeur de recherche
			this._sSearchQuery = sSearchQuery;
			this.byId("searchField").setValue(sSearchQuery); // Met à jour le champ de recherche avec la nouvelle valeur

			// Crée un tableau de filtres pour la recherche
			aFilters = [];
			if (sSearchQuery && sSearchQuery.length > 0) {
				// Ajoute un filtre pour le prénom et le nom des employés si une recherche est effectuée
				aFilters.push(new Filter("FirstName", FilterOperator.Contains, sSearchQuery));
				aFilters.push(new Filter("LastName", FilterOperator.Contains, sSearchQuery));
				// Crée un filtre combiné (OR) entre les deux champs
				oFilter = new Filter({ filters: aFilters, and: false });
			} else {
				oFilter = null; // Si aucune recherche, aucun filtre n'est appliqué
			}

			// Applique le filtre à la liaison de la table
			oBinding = this._oTable.getBinding("items");
			oBinding.filter(oFilter, "Application");
		},

		/**
		 * Applique un tri sur la table en fonction du champ et de l'ordre spécifié.
		 * @param {string} sSortField - Le champ à utiliser pour le tri (ex: "EmployeeID")
		 * @param {boolean|string} sortDescending - Détermine si le tri est descendant (true) ou ascendant (false)
		 * @private
		 */
		_applySorter : function (sSortField, sortDescending){
			var bSortDescending, oBinding, oSorter;

			// Vérifie si le champ de tri est valide avant de procéder
			if (sSortField && this._aValidSortFields.indexOf(sSortField) > -1) {

				// Convertit la valeur de tri descendant en un booléen
				if (typeof sortDescending === "string") {
					bSortDescending = sortDescending === "true";
				} else if (typeof sortDescending === "boolean") {
					bSortDescending = sortDescending;
				} else {
					bSortDescending = false; // Valeur par défaut : tri ascendant
				}

				// Ne refait pas le tri si le tri actuel est identique à celui demandé
				if (this._sSortField && this._sSortField === sSortField && this._bSortDescending === bSortDescending) {
					return;
				}

				// Enregistre les informations sur le tri actuel
				this._sSortField = sSortField;
				this._bSortDescending = bSortDescending;
				oSorter = new Sorter(sSortField, bSortDescending); // Crée un objet de tri avec les paramètres spécifiés

				// Synchronise la boîte de dialogue des paramètres de vue avec les choix de tri actuels
				this._syncViewSettingsDialogSorter(sSortField, bSortDescending);

				// Applique le tri à la table
				oBinding = this._oTable.getBinding("items");
				oBinding.sort(oSorter);
			}
		},

		// Méthode pour synchroniser la boîte de dialogue des paramètres de vue avec le tri appliqué
		_syncViewSettingsDialogSorter : function (sSortField, bSortDescending) {
			// Met à jour la boîte de dialogue avec le champ de tri et l'ordre sélectionnés
			this._oVSD.setSelectedSortItem(sSortField);
			this._oVSD.setSortDescending(bSortDescending);
		}

	});
});
