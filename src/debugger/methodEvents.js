export const methodEvents = (gyreInternal) =>
  (gyre) => ({
    gyre: {
      "addCommand": {
        before: (gId, callId, args) => {
          // console.log("addCommand", gId, callId, args);
          gyreInternal.trigger("commandAdded", gId, args[0], args.length > 2 ? args[2] : false);
        }
      },
      "addEvent": {
        before: (gId, callId, args) => {
          // console.log("addEvent mE", gId, callId, args);
          gyreInternal.trigger("eventAdded", gId, args[0], args.length > 2 ? args[2] : false);
        }
      },
      "addAggregate": {
        before: (gId, callId, args) => {
          // console.log("addAggregate mE", gId, callId, args);
          gyreInternal.trigger("aggregateAdded", gId, args[0], args.length > 2 ? args[2] : false);
        }
      },
      "addProjection": {
        before: (gId, callId, args) => {
          // console.log("addProjection mE", gId, callId, args);
          gyreInternal.trigger("projectionAdded", gId, args[0], args.length > 2 ? args[2] : false);
        }
      },
      "addListener": {
        before: (gId, callId, args) => {
          // console.log("addListener mE", gId, callId, args);
          gyreInternal.trigger("listenerAdded", gId, args[0], args.length > 2 ? args[2] : false);
        }
      },

      "issue": {
        before: (gId, callId, args) => {
          gyreInternal.trigger("commandIssued", gId, args[0], args.slice(1, args.length));
        }
      }
    },
    bus: {
      "trigger": {
        before: (gId, callId, args) => {
          gyreInternal.trigger("eventTriggered", gId, args[0]);
        }
      }
    },
    dispatcher: {},
    listenerHandler: {
      "sendUpdate": {
        before: (gId, callId, args) => {
          gyreInternal.trigger("projectionUpdated", gId, callId, args, gyre._internal.listenerHandler.getProjection(args[0]).getState());
        }
      }
    }
  });
