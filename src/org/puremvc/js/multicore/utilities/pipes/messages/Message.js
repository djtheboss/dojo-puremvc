define(
    [
        "dojo/_base/declare",
        "org/puremvc/js/multicore/utilities/pipes/messages/PipeMessage"
    ],
    function(declare, PipeMessage) {

        var Message = declare(PipeMessage, {
            /**
             * Pipe Message.
             * <P>
             * Messages travelling through a Pipeline can
             * be filtered, and queued. In a queue, they may
             * be sorted by priority. Based on type, they
             * may used as control messages to modify the
             * behavior of filter or queue fittings connected
             * to the pipleline into which they are written.</P>
             */
            constructor: function(args) {
                if (args) {
                    declare.safeMixin(this, args);
                    this.type = args.type;
                    this.header = args.header;
                    this.body = args.body;
                    this.priority = args.priority;
                }
            }
        });

        // Message type base URI
        Message.PRIORITY_HIGH = 1;
        // Set filter parameters
        Message.PRIORITY_MED = 5;
        // Set filter function
        Message.PRIORITY_LOW = 10;
        Message.BASE = 'http://puremvc.org/namespaces/pipes/messages/';
        Message.NORMAL = 'http://puremvc.org/namespaces/pipes/messages/normal/';

        return Message;
    }
);