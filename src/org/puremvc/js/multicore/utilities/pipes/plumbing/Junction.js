define(
    [
        "dojo/_base/declare",
        "org/puremvc/js/multicore/utilities/pipes/plumbing/PipeListener"
    ],
    function(declare, PipeListener) {

        var Junction = declare(null, {

            /**
             * @class org.puremvc.js.multicore.utilities.pipes.PipeAware
             * Pipe Aware interface.
             * <P>
             * Can be implemented by any PureMVC Core that wishes
             * to communicate with other Cores using the Pipes
             * utility.</P>
             */
            inputPipes: null,
            outputPipes: null,
            pipesMap: null,
            pipeTypesMap: null,


            constructor: function() {
                this.inputPipes = [];
                this.outputPipes = [];
                this.pipesMap = [];
                this.pipeTypesMap = [];
            },


            /**
             * Register a pipe with the junction.
             * <P>
             * Pipes are registered by unique name and type,
             * which must be either <code>Junction.INPUT</code>
             * or <code>Junction.OUTPUT</code>.</P>
             * <P>
             * NOTE: You cannot have an INPUT pipe and an OUTPUT
             * pipe registered with the same name. All pipe names
             * must be unique regardless of type.</P>
             *
             * @return Boolean true if successfully registered. false if another pipe exists by that name.
             */
            registerPipe: function(/*String*/name, /*String*/type, /*IPipeFitting*/pipe) {
                var success = true;
                if (this.pipesMap[name] == undefined) {
                    this.pipesMap[name] = pipe;
                    this.pipeTypesMap[name] = type;

                    switch (type) {
                        case Junction.INPUT:
                            this.inputPipes.push(name);
                            break;

                        case Junction.OUTPUT:
                            this.outputPipes.push(name);
                            break;

                        default:
                            success = false;
                    }
                }
                else {
                    success = false;
                }

                return success;
            },


            /**
             * Does this junction have a pipe by this name?
             *
             * @param name the pipe to check for
             * @return Boolean whether as pipe is registered with that name.
             */
            hasPipe: function(/*String*/name) {
                return (this.pipesMap[name] != undefined);
            },


            /**
             * Does this junction have an INPUT pipe by this name?
             *
             * @param name the pipe to check for
             * @return Boolean whether an INPUT pipe is registered with that name.
             */
            hasInputPipe: function(/*String*/name) {
                return (this.hasPipe(name) && (this.pipeTypesMap[name] == "input"));
            },


            /**
             * Does this junction have an OUTPUT pipe by this name?
             *
             * @param name the pipe to check for
             * @return Boolean whether an OUTPUT pipe is registered with that name.
             */
            hasOutputPipe: function(/*String*/name) {
                return (this.hasPipe(name) && (this.pipeTypesMap[name] == "output"));
            },


            /**
             * Remove the pipe with this name if it is registered.
             * <P>
             * NOTE: You cannot have an INPUT pipe and an OUTPUT
             * pipe registered with the same name. All pipe names
             * must be unique regardless of type.</P>
             *
             * @param name the pipe to remove
             */
            removePipe: function(/*String*/ name) {
                if (this.hasPipe(name)) {
                    var type = this.pipeTypesMap[name];
                    var pipesList = [];

                    switch (type) {
                        case Junction.INPUT:
                            pipesList = this.inputPipes;
                            break;

                        case Junction.OUTPUT:
                            pipesList = this.outputPipes;
                            break;
                    }

                    // @TODO: can I use dojo forEach here?
                    for (var i=0; i<pipesList.length; i++) {
                        if (pipesList[i] == name) {
                            pipesList.splice(i, 1);
                            break;
                        }
                    }

                    this.pipesMap.splice(this.pipesMap.indexOf(name), 1);
                    this.pipeTypesMap.splice(this.pipeTypesMap.indexOf(name), 1);
                }
            },


            /**
             * Retrieve the named pipe.
             *
             * @param name the pipe to retrieve
             * @return IPipeFitting the pipe registered by the given name if it exists
             */
            retrievePipe: function(/*String*/name) {
                return this.pipesMap[name];
            },


            /**
             * Add a PipeListener to an INPUT pipe.
             * <P>
             * NOTE: there can only be one PipeListener per pipe,
             * and the listener function must accept an IPipeMessage
             * as its sole argument.</P>
             *
             * @param name the INPUT pipe to add a PipeListener to
             * @param context the calling context or 'this' object
             * @param listener the function on the context to call
             */
            addPipeListener: function(/*String*/inputPipeName, /*Object*/context, /*Function*/listener) {
                var success = false;
                if (this.hasInputPipe(inputPipeName)) {
                    var pipe = this.pipesMap[inputPipeName]
                    success = pipe.connect(new PipeListener({context:context, listener:listener}));
                }
                return success;
            },


            /**
             * Send a message on an OUTPUT pipe.
             *
             * @param name the OUTPUT pipe to send the message on
             * @param message the IPipeMessage to send
             */
            sendMessage: function(/*String*/outputPipeName, /*IPipeMessage*/message) {
                var success = false;
                if (this.hasOutputPipe(outputPipeName)) {
                    var pipe = this.pipesMap[outputPipeName];
                    success = pipe.write(message)
                }
                return success;
            }
        });

        Junction.INPUT = "input";
        Junction.OUTPUT = "output";

        return Junction;
    }
);