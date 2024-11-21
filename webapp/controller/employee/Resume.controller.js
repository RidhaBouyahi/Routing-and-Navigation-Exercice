sap.ui.define([
    "demonr/controller/BaseController", // Importation du contrôleur de base pour l'héritage
    "sap/ui/model/json/JSONModel" // Importation du modèle JSON pour gérer les données dans la vue
], function (BaseController, JSONModel) { // Fonction de rappel qui reçoit le contrôleur de base et le modèle JSON en paramètre
    "use strict"; // Active le mode strict pour une meilleure gestion des erreurs et une syntaxe plus rigoureuse

    var _aValidTabKeys = ["Info", "Projects", "Hobbies", "Notes"]; // Définition d'un tableau de clés valides pour les onglets
    return BaseController.extend("demonr.controller.employee.Resume", { // Création d'un nouveau contrôleur qui étend BaseController, permettant la réutilisation de la logique de base
        onInit() {
            var oRouter; // Déclaration de la variable pour le routeur

            this.getView().setModel(new JSONModel(), "view"); // Définition d'un modèle JSON pour la vue (model "view")

            oRouter = this.getRouter();
            // Récupération de l'instance du routeur actuel à partir du contrôleur

            // Attachement de l'événement "matched" au routeur, ce qui permet de définir une action
            // lorsqu'une route correspondante est activée. Ici, "employeeResume" est la route que nous écoutons.
            // Lors de la correspondance de cette route, la fonction _onRouteMatched sera appelée.
            oRouter.getRoute("employeeResume").attachMatched(this._onRouteMatched, this);
        },

        // Fonction appelée lorsque la route "employeeResume" est activée
        _onRouteMatched: function (oEvent) {
            var oView, // Déclaration de la variable pour la vue
                oArgs, // Déclaration de la variable pour les arguments de la route
                oQuery; // Déclaration de la variable pour les paramètres de la route

            oView = this.getView(); // Récupération de l'instance de la vue actuelle

            oArgs = oEvent.getParameter("arguments");
            // Récupération des arguments passés à la route, ici l'ID de l'employé

            // Liaison des données de la vue à un élément spécifique en fonction de l'ID de l'employé
            // Le chemin "/Employees(employeeId)" est construit dynamiquement en utilisant l'ID de l'employé passé dans les arguments
            oView.bindElement({
                path: "/Employees(" + oArgs.employeeId + ")", // Liaison au modèle OData avec le chemin dynamique
                events: {
                    // Définition des événements associés à cette liaison
                    // Quand les données changent (par exemple, après un chargement ou une modification), on appelle la fonction _onBindingChange
                    change: this._onBindingChange.bind(this),

                    // Avant la récupération des données, on marque la vue comme occupée pour indiquer un chargement
                    dataRequested: function (oEvent) {
                        oView.setBusy(true); // Affiche un indicateur de chargement (spinner)
                    },

                    // Après la récupération des données, on désactive l'indicateur de chargement
                    dataReceived: function (oEvent) {
                        oView.setBusy(false); // Cache l'indicateur de chargement
                    }
                }
            });

            // Récupération des paramètres de la route
            oQuery = oArgs["?query"];
            // Récupère les paramètres de la query dans l'URL (par exemple, tab)

            // Vérification si le paramètre "tab" est valide, s'il l'est, on met à jour le modèle
            if (oQuery && _aValidTabKeys.indexOf(oQuery.tab) > -1) { // Mise à jour de la propriété "selectedTabKey" dans le modèle "view"
                oView.getModel("view").setProperty("/selectedTabKey", oQuery.tab);
                
            } else { // Si l'onglet est invalide ou absent, on redirige vers l'onglet valide par défaut
                this.getRouter().navTo("employeeResume", {
                    employeeId: oArgs.employeeId,
                    "?query": {
                        tab: _aValidTabKeys[0] // Onglet par défaut (Info)
                    }
                }, true); // true indique qu'il ne faut pas ajouter cette navigation à l'historique de navigation
            }

            // var selectedTab = oQuery.tab; // Récupère la clé de l'onglet sélectionné tab
            // console.log("Onglet sélectionné : ", selectedTab); // Affiche la clé de l'onglet sélectionné dans la console
        },

        // Fonction appelée lorsque le lien de données a changé (par exemple, lorsqu'une nouvelle donnée a été chargée)
        _onBindingChange: function () {
            // Si aucun contexte de liaison n'est trouvé (l'objet de données n'existe pas ou n'est pas valide)
            // On redirige l'utilisateur vers une vue "notFound" pour afficher un message d'erreur ou une vue de remplacement
            if (!this.getView().getBindingContext()) {
                this.getRouter().getTargets().display("notFound"); // Affiche la vue "notFound"
            }
        },

        // Fonction appelée lorsque l'utilisateur sélectionne un nouvel onglet
        onTabSelect: function (oEvent) {
            var oBindingCtx = this.getView().getBindingContext(); // Récupère le contexte de liaison de la vue actuelle
            this.getRouter().navTo("employeeResume", {
                employeeId: oBindingCtx.getProperty("EmployeeID"), // Récupère l'ID de l'employé depuis le contexte de liaison
                "?query": {
                    tab: oEvent.getParameter("selectedKey") // Récupère la clé de l'onglet sélectionné
                }
            }, true /*without history*/
            ); // Redirige vers la même vue avec les paramètres de l'employé et l'onglet sélectionné, sans ajouter à l'historique de navigation
        }
    });

});
