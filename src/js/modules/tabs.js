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
                hrefAttr = $button.attr("href"),
                $tab = $tabs.filter(hrefAttr);

            if (!$tab.length || $button.hasClass(_cssClasses.selectedBtn)) {
                return; // Tab not found || tab selected already
            }

            // Apply visual styling
            $tabs.addClass(_cssClasses.hidden);
            $tab.removeClass(_cssClasses.hidden);
            $buttons.removeClass(_cssClasses.selectedBtn);
            $button.addClass(_cssClasses.selectedBtn);

            // To prevent scrolling we remove id attr from selected tab,
            // change page hash and restore id
            if ($tabsContainer.parents(_cssClasses.container).length === 0) {
                $tab.removeAttr("id");
                window.location.hash = hrefAttr;
                $tab.attr("id", hrefAttr.substr(1));
            }

            // Dispatch custom event
            $button.trigger("tab:switch", $tab);
            $button.trigger("tab:open", $tab);
        },

        /**
         * Initialize tabs
         */
        _initialize = function () {
            $(_cssClasses.container).each(function () {
                var $tabContainer = $(this),
                    $tabs = $tabContainer.find(_cssClasses.tab),
                    $tab,
                    $buttons = $tabContainer.find(_cssClasses.button),
                    $nodes,
                    $selectedNode,
                    selectedClass,
                    selectedTabId,
                    idStoringAttr,
                    numButtons = $buttons.length,
                    hash = window.location.hash;

                // If there are nav buttons - take data from them,
                // otherwise - from tabs
                // todo: remove .js-tab of child .js-tabs
                $nodes = numButtons > 0 ? $buttons : $tabs;
                selectedClass = numButtons > 0 ? _cssClasses.selectedBtn
                        : _cssClasses.selectedTab;
                idStoringAttr = numButtons > 0 ? "href" : "id";

                $selectedNode = $nodes.filter("." + selectedClass);
                if (hash.length &&
                    $tabContainer.parents(_cssClasses.container).length === 0
                ) {
                    if (idStoringAttr === "id") {
                        $selectedNode = $(hash);
                    } else {
                        $selectedNode = $nodes.filter("[href='" + hash +"']");
                    }
                }

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

                $tab = $(selectedTabId);

                // Apply styling
                $tabs.addClass(_cssClasses.hidden);
                $tab.removeClass(_cssClasses.hidden);
                $nodes.removeClass(_cssClasses.selectedBtn);
                $selectedNode
                    .addClass(_cssClasses.selectedBtn)
                    .trigger("tab:open", $tab);
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
