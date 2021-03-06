define(
    [
        "doh",
        "dojo/_base/declare",
        "org/puremvc/js/multicore/patterns/observer/Observer",
        "org/puremvc/js/multicore/patterns/observer/Notification",
        "org/puremvc/js/multicore/patterns/mediator/Mediator",
        "org/puremvc/js/multicore/core/View",
        "org/puremvc/js/multicore/core/ViewTestNote",
        "org/puremvc/js/multicore/core/ViewTestConstants",
        "org/puremvc/js/multicore/core/ViewTestMediator",
        "org/puremvc/js/multicore/core/ViewTestMediator2",
        "org/puremvc/js/multicore/core/ViewTestMediator3",
        "org/puremvc/js/multicore/core/ViewTestMediator4",
        "org/puremvc/js/multicore/core/ViewTestMediator5",
        "org/puremvc/js/multicore/core/ViewTestMediator6"
    ],
    function(doh, declare, Observer, Notification, Mediator, View, ViewTestNote, ViewTestConstants,
             ViewTestMediator, ViewTestMediator2, ViewTestMediator3, ViewTestMediator4, ViewTestMediator5, ViewTestMediator6) {

        var log = function(message) {
            if (window.console && console.log) {
                console.log(message);
            }
        };

        /**
         * A test variable that proves the viewTestMethod was invoked by the VIew
         * @type{number}
         * @private
         */
        var viewTestVar = 0;

        /**
         * @type {string}
         */
        var lastNotification = null;

        /**
         * @type {boolean}
         */
        var onRegisterCalled = false;

        /**
         * @type {boolean}
         */
        var onRemoveCalled = false;

        /**
         * @type {number}
         */
        var counter = 0;

        return doh.register("org.puremvc.js.multicore.ViewTest", [

            /**
            * Tests the View multiton factory method
            */
            function testGetInstance() {
                // Test Factory Method
                var view = View.getInstance('ViewTestKey1');

                // test assertions
                //assertTrue("Expecting instance not null", view != null);
                doh.assertTrue(view != null);
            },

            /**
            * Tests registration and notification of Observers.
            *
            * <P>
            * An Observer is created to callback the viewTestMethod of
            * this ViewTest instance. This Observer is registered with
            * the View to be notified of 'ViewTestEvent' events. Such
            * an event is created, and a value set on its payload. Then
            * the View is told to notify interested observers of this
            * Event.
            *
            * <P>
            * The View calls the Observer's notifyObserver method
            * which calls the viewTestMethod on this instance
            * of the ViewTest class. The viewTestMethod method will set
            * an instance variable to the value passed in on the Event
            * payload. We evaluate the instance variable to be sure
            * it is the same as that passed out as the payload of the
            * original 'ViewTestEvent'.
            *
            */
            function testRegisterAndNotifyObserver() {
                // Get the Multiton View instance
                var view = View.getInstance('ViewTestKey2');

                var viewTestMethod = function(note) {
                    this.viewTestVar = note.getBody();
                };

                // Create observer, passing in notification method and context
                var observer = new Observer(viewTestMethod, this);

                // Register Observer's interest in a particulat Notification with the View
                view.registerObserver(ViewTestNote.NAME, observer);

                // Create a ViewTestNote, setting
                // a body value, and tell the View to notify
                // Observers. Since the Observer is this class
                // and the notification method is viewTestMethod,
                // successful notification will result in our local
                // viewTestVar being set to the value we pass in
                // on the note body.
                var note = ViewTestNote.create(10);
                view.notifyObservers(note);

                // test assertions
                //assertTrue("Expecting viewTestVar = 10", this.viewTestVar == 10);
                doh.assertTrue(this.viewTestVar == 10);
            },

            /**
            * @return {void}
            */
            function testRegisterAndRetrieveMediator() {
                // Get the Multiton View instance
                var view = View.getInstance('ViewTestKey3');

                // Create and register the test mediator
                var viewTestMediator = new ViewTestMediator(this);
                view.registerMediator(viewTestMediator);

                // Retrieve the component
                var mediator = view.retrieveMediator(ViewTestMediator.NAME);

                doh.assertTrue(mediator instanceof ViewTestMediator);
            },

            /**
            * Tests the hasMediator method
            */
            function testHasMediator() {
                // register a Mediator
                var view = View.getInstance('ViewTestKey4');

                // Create and register the test mediator
                var mediator = new Mediator('hasMediatorTest', this);
                view.registerMediator(mediator);

                // assert that the view.hasMediator method returns true
                // for that mediator name
                //assertTrue("Expecting view.hasMediator('hasMediatorTest') == true", view.hasMediator('hasMediatorTest') == true);
                doh.assertTrue(view.hasMediator('hasMediatorTest') == true);

                view.removeMediator('hasMediatorTest');

                // assert that the view.hasMediator method returns false
                // for that mediator name
                //assertTrue("Expecting view.hasMediator('hasMediatorTest') == false", view.hasMediator('hasMediatorTest') == false);
                doh.assertTrue(view.hasMediator('hasMediatorTest') == false);
            },

            /**
            * Tests registering and removing a mediator
            * @return {void}
            */
            function testRegisterAndRemoveMediator() {
                // Get the Multiton View instance
                var view = View.getInstance('ViewTestKey5');

                // Create and register the test mediator
                var mediator = new Mediator('testing', this);
                view.registerMediator(mediator);

                // Remove the component
                var removedMediator = view.removeMediator('testing');

                //assertInstanceOf("The removed mediator was not null", Mediator, removedMediator);
                doh.assertTrue(removedMediator instanceof Mediator);

                // assert that we have removed the appropriate mediator
                //assertSame("Expecting removedMediator.getMediatorName() == 'testing'", 'testing', removedMediator.getMediatorName());
                doh.assertTrue(removedMediator.getMediatorName() == 'testing');

                // assert that the mediator is no longer retrievable
                //assertFalse("Expecting view.retrieveMediator( 'testing' ) == null )", !!view.retrieveMediator('testing'));
                doh.assertTrue(view.retrieveMediator('testing') == null);
            },

            /**
            * @return {void}
            */
            function testOnRegisterAndOnRemove() {
                // Get the Multiton View instance
                var view = View.getInstance('ViewTestKey6');

                // Create and register the test mediator
                var mediator = new ViewTestMediator4(this);
                view.registerMediator(mediator);

                // assert that onRegsiter was called, and the mediator responded by setting our boolean
                //assertTrue("Expecting onRegisterCalled == true", this.onRegisterCalled);
                doh.assertTrue(this.onRegisterCalled);

                // Remove the component
                view.removeMediator(ViewTestMediator4.NAME);

                // assert that the mediator is no longer retrievable
                //assertTrue("Expecting onRemoveCalled == true", this.onRemoveCalled);
                doh.assertTrue(this.onRemoveCalled);
            },

            /**
            * Tests successive register and remove of the same mediator
            * @return {void}
            */
            function testSuccessiveRegisterAndRemoveMediator() {
                // Get the Multiton View instance
                var view = View.getInstance('ViewTestKey7');

                // Create and register the test mediator,
                // but not so we have a reference to it
                view.registerMediator(new ViewTestMediator(this));

                // test that we can retrieve it
                //assertTrue("Expecting view.retrieveMediator( ViewTestMediator.NAME ) is ViewTestMediator", view.retrieveMediator(ViewTestMediator.NAME) instanceof ViewTestMediator);
                doh.assertTrue(view.retrieveMediator(ViewTestMediator.NAME) instanceof ViewTestMediator);

                // Remove the Mediator
                view.removeMediator(ViewTestMediator.NAME);

                // test that retrieving it now returns null
                //assertTrue("Expecting view.retrieveMediator( ViewTestMediator.NAME ) == null", view.retrieveMediator(ViewTestMediator.NAME) == null);
                doh.assertTrue(view.retrieveMediator(ViewTestMediator.NAME) == null);

                // test that removing the mediator again once its gone doesn't cause crash
                //assertTrue("Expecting view.removeMediator( ViewTestMediator.NAME ) doesn't crash", view.removeMediator(ViewTestMediator.NAME) == void(0));
                doh.assertTrue(view.removeMediator(ViewTestMediator.NAME) == void(0))

                // Create and register another instance of the test mediator,
                view.registerMediator(new ViewTestMediator(this));

                //assertTrue("Expecting view.retrieveMediator( ViewTestMediator.NAME ) is ViewTestMediator", view.retrieveMediator(ViewTestMediator.NAME) instanceof ViewTestMediator);
                doh.assertTrue(view.retrieveMediator(ViewTestMediator.NAME) instanceof ViewTestMediator);

                // Remove the Mediator
                view.removeMediator(ViewTestMediator.NAME);

                // test that retrieving it now returns null
                //assertTrue("Expecting view.retrieveMediator( ViewTestMediator.NAME ) == null", view.retrieveMediator(ViewTestMediator.NAME) == null);
                doh.assertTrue(view.retrieveMediator(ViewTestMediator.NAME) == null);
            },

            /**
            * Tests registering a Mediator for 2 different notifications, removing the
            * Mediator from the View, and seeing that neither notification causes the
            * Mediator to be notified. Added for the fix deployed in version 1.7
            */
            function testRemoveMediatorAndSubsequentlyNotify() {
                // Get the Multiton View instance
                var view = View.getInstance('ViewTestKey8');
                var component =
                {
                    lastNotification: null
                }

                // Create and register the test mediator to be removed.
                view.registerMediator(new ViewTestMediator2(component));

                // test that notifications work
                view.notifyObservers(new Notification(ViewTestConstants.NOTE1));
                //assertSame("Expecting lastNotification == ViewTestConstants.NOTE1", ViewTestConstants.NOTE1, component.lastNotification);
                doh.assertEqual(ViewTestConstants.NOTE1, component.lastNotification);

                view.notifyObservers(new Notification(ViewTestConstants.NOTE2));
                //assertSame("Expecting lastNotification == ViewTestConstants.NOTE2", ViewTestConstants.NOTE2, component.lastNotification);
                doh.assertEqual(ViewTestConstants.NOTE2, component.lastNotification);

                // Remove the Mediator
                view.removeMediator(ViewTestMediator2.NAME);

                // test that retrieving it now returns null
                //assertUndefined("Expecting view.retrieveMediator( ViewTestMediator2.NAME ) == null", view.retrieveMediator(ViewTestMediator2.NAME));
                doh.assertTrue(view.retrieveMediator(ViewTestMediator2.NAME) == null);

                // test that notifications no longer work
                // (ViewTestMediator2 is the one that sets lastNotification
                // on this component, and ViewTestMediator)
                component.lastNotification = null;

                view.notifyObservers(new Notification(ViewTestConstants.NOTE1));
                //assertNotEquals("Expecting lastNotification != ViewTestConstants.NOTE1", ViewTestConstants.NOTE1, component.lastNotification);
                doh.assertNotEqual(ViewTestConstants.NOTE1, component.lastNotification);

                view.notifyObservers(new Notification(ViewTestConstants.NOTE2));
                //assertNotEquals("Expecting lastNotification != ViewTestConstants.NOTE2", ViewTestConstants.NOTE2, component.lastNotification);
                doh.assertNotEqual(ViewTestConstants.NOTE2, component.lastNotification)

                View.removeView('ViewTestKey8');
            },

            /**
            * Tests registering one of two registered Mediators and seeing
            * that the remaining one still responds.
            * Added for the fix deployed in version 1.7.1
            */
            function testRemoveOneOfTwoMediatorsAndSusequentlyNotify() {
                // Get the Multiton View instance
                var view = View.getInstance('ViewTestKey9');
                var component = {
                    lastNotification: null
                }

                // Create and register that responds to notifications 1 and 2
                view.registerMediator(new ViewTestMediator2(component));

                // Create and register that responds to notification 3
                view.registerMediator(new ViewTestMediator3(component));

                // test that all notifications work
                view.notifyObservers(new Notification(ViewTestConstants.NOTE1));
                //assertSame("Expecting lastNotification == ViewTestConstants.NOTE1", ViewTestConstants.NOTE1, component.lastNotification);
                doh.assertEqual(ViewTestConstants.NOTE1, component.lastNotification);

                view.notifyObservers(new Notification(ViewTestConstants.NOTE2));
                //assertSame("Expecting lastNotification == ViewTestConstants.NOTE2",  ViewTestConstants.NOTE2, component.lastNotification);
                doh.assertEqual(ViewTestConstants.NOTE2, component.lastNotification);

                view.notifyObservers(new Notification(ViewTestConstants.NOTE3));
                //assertSame("Expecting lastNotification == ViewTestConstants.NOTE3", ViewTestConstants.NOTE3, component.lastNotification);
                doh.assertEqual(ViewTestConstants.NOTE3, component.lastNotification)

                // Remove the Mediator that responds to 1 and 2
                view.removeMediator(ViewTestMediator2.NAME);

                //console.log("retrieveing mediator");
                //console.dir(view.retrieveMediator());

                // test that retrieving it now returns null
                //assertUndefined("Expecting view.retrieveMediator( ViewTestMediator2.NAME ) == null", view.retrieveMediator(ViewTestMediator2.NAME));
                doh.assertTrue(view.retrieveMediator(ViewTestMediator2.NAME) == undefined);

                // test that notifications no longer work
                // for notifications 1 and 2, but still work for 3
                component.lastNotification = null;

                view.notifyObservers(new Notification(ViewTestConstants.NOTE1));
                //assertTrue("Expecting lastNotification != ViewTestConstants.NOTE1", component.lastNotification != ViewTestConstants.NOTE1);
                doh.assertTrue(component.lastNotification != ViewTestConstants.NOTE1);

                view.notifyObservers(new Notification(ViewTestConstants.NOTE2));
                //assertTrue("Expecting lastNotification != ViewTestConstants.NOTE2", component.lastNotification != ViewTestConstants.NOTE2);
                doh.assertTrue(component.lastNotification != ViewTestConstants.NOTE2);

                view.notifyObservers(new Notification(ViewTestConstants.NOTE3));
                doh.assertTrue(component.lastNotification == ViewTestConstants.NOTE3);

                // have to remove the view to reset the test with jsTestDriver
                // otherwise its retained in memory and the test conditions fail
                View.removeView('ViewTestKey9');
            },

            /**
            * Tests registering the same mediator twice.
            * A subsequent notification should only illicit
            * one response. Also, since reregistration
            * was causing 2 observers to be created, ensure
            * that after removal of the mediator there will
            * be no further response.
            *
            * Added for the fix deployed in version 2.0.4
            */
            function testMediatorReregistration() {
                // Get the Singleton View instance
                var view = View.getInstance('ViewTestKey10');
                var component = {
                    counter: 0
                }

                // Create and register that responds to notification 5
                view.registerMediator(new ViewTestMediator5(component));

                // try to register another instance of that mediator (uses the same NAME constant).
                view.registerMediator(new ViewTestMediator5(component));

                // test that the counter is only incremented once (mediator 5's response)
                component.counter = 0;
                view.notifyObservers(new Notification(ViewTestConstants.NOTE5));
                doh.assertEqual(component.counter, 1, "Expecting counter == 1");

                // Remove the Mediator
                view.removeMediator(ViewTestMediator5.NAME);

                // test that retrieving it now returns null
                doh.assertEqual(view.retrieveMediator(ViewTestMediator5.NAME), null, "Expecting view.retrieveMediator( ViewTestMediator5.NAME ) == null");

                // test that the counter is no longer incremented
                component.counter = 0;
                view.notifyObservers(new Notification(ViewTestConstants.NOTE5));
                doh.is(0, component.counter, "Expecting counter == 0");
            },

            /**
            * Tests the ability for the observer list to
            * be modified during the process of notification,
            * and all observers be properly notified. This
            * happens most often when multiple Mediators
            * respond to the same notification by removing
            * themselves.
            *
            * Added for the fix deployed in version 2.0.4
            */
            function testModifyObserverListDuringNotification() {
                // Get the Singleton View instance
                var view = View.getInstance('ViewTestKey11');

                // Create and register several mediator instances that respond to notification 6
                // by removing themselves, which will cause the observer list for that notification
                // to change. versions prior to MultiCore Version 2.0.5 will see every other mediator
                // fails to be notified.
                view.registerMediator(new ViewTestMediator6(ViewTestMediator6 + "/1", this));
                view.registerMediator(new ViewTestMediator6(ViewTestMediator6 + "/2", this));
                view.registerMediator(new ViewTestMediator6(ViewTestMediator6 + "/3", this));
                view.registerMediator(new ViewTestMediator6(ViewTestMediator6 + "/4", this));
                view.registerMediator(new ViewTestMediator6(ViewTestMediator6 + "/5", this));
                view.registerMediator(new ViewTestMediator6(ViewTestMediator6 + "/6", this));
                view.registerMediator(new ViewTestMediator6(ViewTestMediator6 + "/7", this));
                view.registerMediator(new ViewTestMediator6(ViewTestMediator6 + "/8", this));

                // clear the counter
                this.counter = 0;
                // send the notification. each of the above mediators will respond by removing
                // themselves and incrementing the counter by 1. This should leave us with a
                // count of 8, since 8 mediators will respond.
                view.notifyObservers(new Notification(ViewTestConstants.NOTE6));
                // verify the count is correct
                doh.is(8, this.counter, "Expecting counter == 8");

                // clear the counter
                this.counter = 0;
                view.notifyObservers(new Notification(ViewTestConstants.NOTE6));
                // verify the count is 0
                doh.is(0, this.counter, "Expecting counter == 0");
            }
        ]);
    }
);