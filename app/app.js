//It's view model

(function (window, document) {

    var app = {
        /**
         * Add click listener on elements with current class name
         * @param className
         * @param func
         */
        addClickListener: function (className, func) {
            var elements = document.getElementsByClassName(className),
                i = elements.length;

            while (i--) {
                elements[i].addEventListener('click', func);
            }
        },
        /**
         * Enabling cross page navigation
         */
        navigation: function () {
            //Checking for b-nav__link_home element on page. For example on homepage this element is undefined.
            if (!!document.getElementsByClassName('b-nav__link_home')) {
                app.addClickListener('b-nav__link_home', function (event) {
                    history.pushState({page: 'home'}, 'Home page', '/');
                    app.pages.home();
                    event.preventDefault();
                    return false;
                });
            }
        },
        pages: {
            /**
             * Actions for activating homepage
             */
            home: function () {
                document.title = 'Home page';
                document.getElementsByClassName('b-layout')[0].innerHTML = app.render.home;
                app.navigation();
            }
        },
        render: {
            home: yr.run('app', (JSON.parse(window.wf.PagesData)).home)
        }
    };

    /**
     * Actions for back and forward buttons navigation
     */
    window.addEventListener('popstate', function (event) {
        if (event.state.page === 'home') {
            app.pages.home();
        } else if (event.state.page === 'projects') {
            app.pages.projects();
        }
    });

    var hash = window.location.hash || "";

    if (window.location.pathname === '/') {
        history.replaceState({page: 'home'}, 'Home page', '/' + !!hash ? hash : null);
        app.pages.home();
    }

    if (!!document.querySelector(hash)) {
        window.scrollTo(0, document.querySelector(hash).offsetTop);
    }

})(window, document);