import Vector3D							= require("awayjs-core/lib/geom/Vector3D");

import Geometry							= require("awayjs-display/lib/base/Geometry");

import AnimatorBase						= require("awayjs-renderergl/lib/animators/AnimatorBase");

import AnimationClipNodeBase			= require("awayjs-renderergl/lib/animators/nodes/AnimationClipNodeBase");
import VertexClipState					= require("awayjs-renderergl/lib/animators/states/VertexClipState");

/**
 * A vertex animation node containing time-based animation data as individual geometry obejcts.
 */
class VertexClipNode extends AnimationClipNodeBase
{
	private _frames:Array<Geometry> = new Array<Geometry>();
	private _translations:Array<Vector3D> = new Array<Vector3D>();

	/**
	 * Returns a vector of geometry frames representing the vertex values of each animation frame in the clip.
	 */
	public get frames():Array<Geometry>
	{
		return this._frames;
	}

	/**
	 * Creates a new <code>VertexClipNode</code> object.
	 */
	constructor()
	{
		super();

		this._pStateClass = VertexClipState;
	}

	/**
	 * Adds a geometry object to the internal timeline of the animation node.
	 *
	 * @param geometry The geometry object to add to the timeline of the node.
	 * @param duration The specified duration of the frame in milliseconds.
	 * @param translation The absolute translation of the frame, used in root delta calculations for mesh movement.
	 */
	public addFrame(geometry:Geometry, duration:number /*uint*/, translation:Vector3D = null)
	{
		this._frames.push(geometry);
		this._pDurations.push(duration);
		this._translations.push(translation || new Vector3D());

		this._pNumFrames = this._pDurations.length;

		this._pStitchDirty = true;
	}

	/**
	 * @inheritDoc
	 */
	public _pUpdateStitch()
	{
		super._pUpdateStitch();

		var i:number /*uint*/ = this._pNumFrames - 1;
		var p1:Vector3D, p2:Vector3D, delta:Vector3D;
		while (i--) {
			this._pTotalDuration += this._pDurations[i];
			p1 = this._translations[i];
			p2 = this._translations[i + 1];
			delta = p2.subtract(p1);
			this._pTotalDelta.x += delta.x;
			this._pTotalDelta.y += delta.y;
			this._pTotalDelta.z += delta.z;
		}

		if (this._pNumFrames > 1 && (this._pStitchFinalFrame || !this._pLooping)) {
			this._pTotalDuration += this._pDurations[this._pNumFrames - 1];
			p1 = this._translations[0];
			p2 = this._translations[1];
			delta = p2.subtract(p1);
			this._pTotalDelta.x += delta.x;
			this._pTotalDelta.y += delta.y;
			this._pTotalDelta.z += delta.z;
		}
	}
}

export = VertexClipNode;