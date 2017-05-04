var Core = (function (Core) {
    "use strict";

    var _cssClasses = {
            container: ".js-tabs",
            tab: ".js-tab",
            button: ".js-tabs-nav-item",
            selectedBtn: "js-tabs-nav-item-selected",
            selectedTab: "js-tab-selected",
            hidden: "hidden"
        },

        _document = $(document),

        /**
         * Handle the tab switching
         */
        _eSwitchTab = function (event) {
            event.preventDefault();

            var $button = $(this),
                $tabsContainer = $button.closest(_cssClasses.container),
                $tabs = $tabsContainer.find(_cssClasses.tab),
                $buttons = $tabsContainer.find(_cssClasses.button),
                $tab = $tabs.filter($button.attr("href"));

            if (!$tab.length || $button.hasClass(_cssClasses.selectedBtn)) {
                return; // Tab not found || tab selected already
            }

            // Apply visual styling
            $tabs.addClass(_cssClasses.hidden);
            $tab.removeClass(_cssClasses.hidden);
            $buttons.removeClass(_cssClasses.selectedBtn);
            $button.addClass(_cssClasses.selectedBtn);

            // Dispatch custom event
            $button.trigger("tab:switch", $tab);
        },

        /**
         * Initialize tabs
         */
        _initialize = function () {
            $(_cssClasses.container).each(function () {
                var $tabContainer = $(this),
                    $tabs = $tabContainer.find(_cssClasses.tab),
                    $buttons = $tabContainer.find(_cssClasses.button),
                    $nodes,
                    $selectedNode,
                    selectedClass,
                    selectedTabId,
                    idStoringAttr,
                    numButtons = $buttons.length;

                // If there are nav buttons - take data from them,
                // otherwise - from tabs
                $nodes = numButtons > 0 ? $buttons : $tabs;
                selectedClass = numButtons > 0 ? _cssClasses.selectedBtn
                        : _cssClasses.selectedTab;
                idStoringAttr = numButtons > 0 ? "href" : "id";

                $selectedNode = $nodes.filter("." + selectedClass);

                // If there is no selected tab - set first one as selected
                // Else if there is more than 1 selected tab - remove extra ones
                if (!$selectedNode.length) {
                    $selectedNode = $nodes
                        .first()
                        .addClass(selectedClass);
                } else if ($selectedNode.length > 1) {
                    $selectedNode = $selectedNode
                        .removeClass(selectedClass)
                        .first()
                        .addClass(_cssClasses.selectedBtn);
                }

                // Cache the id of the selected tab
                selectedTabId = $selectedNode.attr(idStoringAttr);

                // If id is taken from `id` attribute - add `#` to it
                if (idStoringAttr === "id") {
                    selectedTabId = "#" + selectedTabId;
                }

                // Apply styling
                $tabs.addClass(_cssClasses.hidden);
                $(selectedTabId).removeClass(_cssClasses.hidden);
            });
        },

        /**
         * Setup this module
         */
        setup = function () {
            _initialize();
            _document.on("click", _cssClasses.button, _eSwitchTab);
        };

    return Core.register("Tabs", {
        setup: setup
    });

}(Core || {}));
