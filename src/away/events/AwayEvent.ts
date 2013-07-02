/**
 * ...
 * @author Gary Paluk - http://www.plugin.io
 */
 
 ///<reference path="Event.ts" />
module away.events
{	
	export class AwayEvent extends away.events.Event
	{
		
		//public static INITIALIZE_SUCCESS: string = "initializeSuccess";
		//public static INITIALIZE_FAILED: string = "initializeFailed";

        public static CONTEXT3D_CREATE: string = "context3DCreate";
        public static ERROR: string = "context3DERROR";
		
		public message:string;
		
		constructor(type:string, message:string = "")
		{
			super(type);
			this.message = message;
		}
	}
}