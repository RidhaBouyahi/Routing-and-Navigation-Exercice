sap.ui.define([
    // Importation des modules nécessaires pour le fonctionnement de la table, du tri, du filtrage, et de la boîte de dialogue.
    "demonr/controller/BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/m/ViewSettingsDialog",
    "sap/m/ViewSettingsItem"
], function (BaseController, Filter, FilterOperator, Sorter, ViewSettingsDialog, ViewSettingsItem) {
    "use strict";

    // Définition du contrôleur pour la vue de l'aperçu des employés
    return BaseController.extend("demonr.controller.employee.overview.EmployeeOverviewContent", {

        // Méthode d'initialisation, exécutée dès le chargement du contrôleur
        // Méthode appelée lors de l'initialisation du contrôleur
        onInit: function () { // Récupère l'objet du routeur (pour la gestion de la navigation entre les vues)
            var oRouter = this.getRouter();

            // Initialisation des variables liées à la table, au tri et à la recherche
            this._oTable = this.byId("employeesTable"); // Récupère la table affichant les employés
            this._oVSD = null; // Référence à la boîte de dialogue des paramètres de vue, initialisée plus tard
            this._sSortField = null; // Champ de tri sélectionné (initialement aucun tri)
            this._bSortDescending = false; // Indicateur pour savoir si le tri est descendant (par défaut tri ascendant)
            this._aValidSortFields = ["EmployeeID", "FirstName", "LastName"]; // Liste des champs valides pour le tri
            this._sSearchQuery = null; // Valeur de la recherche (initialement vide)
            this._oRouterArgs = null;
            // Arguments du routeur (pour la navigation, comme les paramètres de l'URL)

            // Initialisation de la boîte de dialogue des paramètres de vue
            this._initViewSettingsDialog();
            // Méthode pour créer et configurer la boîte de dialogue des paramètres

            // Attache un événement à la route "employeeOverview" pour exécuter une méthode lors du changement de route
            oRouter.getRoute("employeeOverview").attachMatched(this._onRouteMatched, this);
        },

        // Méthode appelée lors de la correspondance d'une route (route activée par la navigation)
        _onRouteMatched: function (oEvent) { // Extrait les arguments de la route de l'événement
            this._oRouterArgs = oEvent.getParameter("arguments");

            // S'assure que l'objet "query" est défini dans les arguments (si ce n'est pas le cas, le crée comme un objet vide)
            this._oRouterArgs["?query"] = this._oRouterArgs["?query"] || {};
			var oQueryParameter = this._oRouterArgs["?query"];

            // Applique un filtre de recherche basé sur la valeur passée dans l'URL (le paramètre "search")
            this._applySearchFilter(oQueryParameter.search);
			// Applique un sorter  basé sur les valeurs passées dans l'URL (le paramètre "sortField" et "sortDescending")
			this._applySorter(oQueryParameter.sortField,oQueryParameter.sortDescending)

        },

        // Méthode appelée lorsque l'utilisateur appuie sur le bouton de tri
        onSortButtonPressed: function () { // Ouvre la boîte de dialogue permettant à l'utilisateur de sélectionner un critère de tri
            this._oVSD.open();
        },

        // Méthode appelée lors de la recherche dans la table des employés
        onSearchEmployeesTable: function (oEvent) {
            var oRouter = this.getRouter();

            // Récupère la valeur de la recherche (saisie par l'utilisateur) et l'assigne à l'objet des arguments du routeur
            this._oRouterArgs["?query"].search = oEvent.getSource().getValue();

            // Navigue vers la route "employeeOverview" en envoyant les arguments du routeur mis à jour, sans conserver l'historique de la navigation
            oRouter.navTo("employeeOverview", this._oRouterArgs, true /*no history*/
            );
        },

        // Méthode pour initialiser la boîte de dialogue des paramètres de vue
        _initViewSettingsDialog: function () { // Crée une nouvelle instance de la boîte de dialogue des paramètres de vue
            this._oVSD = new ViewSettingsDialog("vsd", { // Lorsque l'utilisateur confirme ses choix dans la boîte de dialogue
                confirm: function (oEvent) { // Affectation des choix de l'utilisateur aux arguments du routeur
					var oRouter = this.getRouter();
                    var oSortItem = oEvent.getParameter("sortItem");
                    this._oRouterArgs["?query"].sortField = oSortItem.getKey(); 
                    this._oRouterArgs["?query"].sortDescending = oEvent.getParameter("sortDescending");
                    // Navigue vers la route "employeeOverview" en envoyant les arguments du routeur mis à jour, sans conserver l'historique de la navigation
                    oRouter.navTo("employeeOverview", this._oRouterArgs, true /*no history*/
                    );
                }.bind(this)
            });

            // Ajout des options de tri dans la boîte de dialogue
            this._oVSD.addSortItem(new ViewSettingsItem({
                key: "EmployeeID", // Champ "EmployeeID" pour le tri
                text: "Employee ID", // Texte affiché pour l'option
                selected: true // Sélectionne par défaut "EmployeeID" comme champ de tri
            }));

            // Ajout des autres champs pour le tri
            this._oVSD.addSortItem(new ViewSettingsItem({key: "FirstName", text: "First Name", selected: false}));

            this._oVSD.addSortItem(new ViewSettingsItem({key: "LastName", text: "Last Name", selected: false}));
        },

        // Méthode pour appliquer un filtre de recherche à la table
        _applySearchFilter: function (sSearchQuery) {
            var aFilters,
                oFilter,
                oBinding;

            // Vérifie si la valeur de recherche est déjà appliquée, pour éviter de la réappliquer inutilement
            if (this._sSearchQuery === sSearchQuery) {
                return;
            }
            // Met à jour la valeur de recherche
            this._sSearchQuery = sSearchQuery;
            this.byId("searchField").setValue(sSearchQuery);
            // Met à jour le champ de recherche avec la nouvelle valeur

            // Crée un tableau de filtres pour la recherche
            aFilters = [];
            if (sSearchQuery && sSearchQuery.length > 0) { // Ajoute un filtre pour le prénom et le nom des employés si une recherche est effectuée
                aFilters.push(new Filter("FirstName", FilterOperator.Contains, sSearchQuery));
                aFilters.push(new Filter("LastName", FilterOperator.Contains, sSearchQuery));
                // Crée un filtre combiné (OR) entre les deux champs
                oFilter = new Filter({filters: aFilters, and: false});
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
        _applySorter: function (sSortField, sortDescending) {
            var bSortDescending,
                oBinding,
                oSorter;

            // Vérifie si le champ de tri est valide avant de procéder
            if (sSortField && this._aValidSortFields.indexOf(sSortField) > -1) { // Convertit la valeur de tri descendant en un booléen
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
                oSorter = new Sorter(sSortField, bSortDescending);
                // Crée un objet de tri avec les paramètres spécifiés

                // Synchronise la boîte de dialogue des paramètres de vue avec les choix de tri actuels
                this._syncViewSettingsDialogSorter(sSortField, bSortDescending);

                // Applique le tri à la table
                oBinding = this._oTable.getBinding("items");
                oBinding.sort(oSorter);
            }
        },

        // Méthode pour synchroniser la boîte de dialogue des paramètres de vue avec le tri appliqué
        _syncViewSettingsDialogSorter: function (sSortField, bSortDescending) { // Met à jour la boîte de dialogue avec le champ de tri et l'ordre sélectionnés
            this._oVSD.setSelectedSortItem(sSortField);
            this._oVSD.setSortDescending(bSortDescending);
        }

    });
});
