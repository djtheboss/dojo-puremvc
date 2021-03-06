define(
    [
        "dojo/_base/declare"
    ],
    function(declare) {
        var Model = declare("org.puremvc.js.multicore.core.Model", null, {
            /**
             * @class org.puremvc.js.multicore.core.Model
             *
             * A Multiton Model implementation.
             *
             * In PureMVC, the Model class provides
             * access to model objects (Proxies) by named lookup.
             *
             * The Model assumes these responsibilities:
             *
             * - Maintain a cache of {@link org.puremvc.js.multicore.patterns.proxy.Proxy Proxy}
             *   instances.
             * - Provide methods for registering, retrieving, and removing
             *   {@link org.puremvc.js.multicore.patterns.proxy.Proxy Proxy} instances.
             *
             * Your application must register
             * {@link org.puremvc.js.multicore.patterns.proxy.Proxy Proxy} instances with the Model.
             * Typically, you use a
             * {@link org.puremvc.js.multicore.patterns.command.SimpleCommand SimpleCommand}
             * or
             * {@link org.puremvc.js.multicore.patterns.command.MacroCommand MacroCommand}
             * to create and register Proxy instances once the Facade has initialized the
             * *Core* actors.
             *
             * This Model implementation is a Multiton, so you should not call the
             * constructor directly, but instead call the
             * {@link #getInstance static Multiton Factory method}
             * @constructor
             * @param {string} key
             *  The Models multiton key
             * @throws {Error}
             *  An error is thrown if this multitons key is already in use by another instance
             */
            constructor: function(key) {
                if (Model.instanceMap[key]) {
                    throw new Error(Model.MULTITON_MSG);
                }

                this.multitonKey = key;
                Model.instanceMap[key] = this;
                this.proxyMap = [];
                this.initializeModel();
            },

            /**
             * Initialize the Model instance.
             *
             * Called automatically by the constructor, this
             * is your opportunity to initialize the Singleton
             * instance in your subclass without overriding the
             * constructor.
             *
             * @return void
             */
            initializeModel: function() {
            },

            /**
             * Register a Proxy with the Model
             * @param {org.puremvc.js.multicore.patterns.proxy.Proxy}
                */
            registerProxy: function(proxy) {
                proxy.initializeNotifier(this.multitonKey);
                this.proxyMap[proxy.getProxyName()] = proxy;
                proxy.onRegister();
            },

            /**
             * @param {string} proxyName
             * @return {org.puremvc.js.multicore.patterns.proxy.Proxy}
             *  The Proxy instance previously registered with the provided proxyName
             */
            retrieveProxy: function(proxyName) {
                return this.proxyMap[proxyName];
            },

            /**
             * Check if a Proxy is registered
             * @param {string} proxyName
             * @return {boolean}
             *  whether a Proxy is currently registered with the given proxyName.
             */
            hasProxy: function(proxyName) {
                return this.proxyMap[proxyName] != null;
            },

            /**
             * Remove a Proxy from the Model.
             *
             * @param {string} proxyName
             *  The name of the Proxy instance to remove
             * @return {org.puremvc.js.multicore.patterns.proxy.Proxy}
             *  The Proxy that was removed from the Model
             */
            removeProxy: function(proxyName) {
                var proxy = this.proxyMap[proxyName];
                if (proxy) {
                    this.proxyMap[proxyName] = null;
                    proxy.onRemove();
                }
                return proxy;
            },

            /**
             * @ignore
             * The map used by the Model to store Proxy instances.
             *
             * @protected
             * @type Array
             */
            proxyMap: null,

            /**
             * @ignore
             * The Models multiton key.
             *
             * @protected
             * @type string
             */
            multitonKey: null
        });

        /**
         * @static
         * Remove a Model instance.
         *
         * @param {string} key
         * @return {void}
         */
        Model.removeModel = function(key) {
            delete Model.instanceMap[key];
        };

        /**
         * @ignore
         * The map used by the Model to store multiton instances
         *
         * @protected
         * @static
         * @type Array
         */
        Model.instanceMap = [];

        /**
         * @ignore
         * Message Constants
         *
         * @static
         * @type {string}
         */
        Model.MULTITON_MSG = "Model instance for this Multiton key already constructed!";

        /**
         * Model Multiton Factory method.
         *
         * @param {string} key
         *  The multiton key for the Model to retrieve
         * @return {org.puremvc.js.multicore.core.Model}
         *  the instance for this Multiton key
         */
        Model.getInstance = function(key) {
            if (Model.instanceMap[key] == null) {
                Model.instanceMap[key] = new Model(key);
            }

            return Model.instanceMap[key];
        };

        return Model;
    }
);