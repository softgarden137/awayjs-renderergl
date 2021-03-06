import Geometry							= require("awayjs-display/lib/base/Geometry");
import SubGeometryBase					= require("awayjs-display/lib/base/SubGeometryBase");
import TriangleSubGeometry				= require("awayjs-display/lib/base/TriangleSubGeometry");
import TriangleSubMesh					= require("awayjs-display/lib/base/TriangleSubMesh");
import Camera							= require("awayjs-display/lib/entities/Camera");
import Mesh								= require("awayjs-display/lib/entities/Mesh");

import Stage							= require("awayjs-stagegl/lib/base/Stage");
import ContextGLProgramType				= require("awayjs-stagegl/lib/base/ContextGLProgramType");
import VertexDataPool					= require("awayjs-stagegl/lib/pool/VertexDataPool");

import AnimatorBase						= require("awayjs-renderergl/lib/animators/AnimatorBase");
import VertexAnimationSet				= require("awayjs-renderergl/lib/animators/VertexAnimationSet");
import VertexAnimationMode				= require("awayjs-renderergl/lib/animators/data/VertexAnimationMode");
import IVertexAnimationState			= require("awayjs-renderergl/lib/animators/states/IVertexAnimationState");
import IAnimationTransition				= require("awayjs-renderergl/lib/animators/transitions/IAnimationTransition");
import TriangleSubMeshRenderable		= require("awayjs-renderergl/lib/pool/TriangleSubMeshRenderable");
import RenderableBase					= require("awayjs-renderergl/lib/pool/RenderableBase");
import ShaderObjectBase					= require("awayjs-renderergl/lib/compilation/ShaderObjectBase");

/**
 * Provides an interface for assigning vertex-based animation data sets to mesh-based entity objects
 * and controlling the various available states of animation through an interative playhead that can be
 * automatically updated or manually triggered.
 */
class VertexAnimator extends AnimatorBase
{
	private _vertexAnimationSet:VertexAnimationSet;
	private _poses:Array<Geometry> = new Array<Geometry>();
	private _weights:Array<number> = Array<number>(1, 0, 0, 0);
	private _numPoses:number /*uint*/;
	private _blendMode:string;
	private _activeVertexState:IVertexAnimationState;

	/**
	 * Creates a new <code>VertexAnimator</code> object.
	 *
	 * @param vertexAnimationSet The animation data set containing the vertex animations used by the animator.
	 */
	constructor(vertexAnimationSet:VertexAnimationSet)
	{
		super(vertexAnimationSet);

		this._vertexAnimationSet = vertexAnimationSet;
		this._numPoses = vertexAnimationSet.numPoses;
		this._blendMode = vertexAnimationSet.blendMode;
	}

	/**
	 * @inheritDoc
	 */
	public clone():AnimatorBase
	{
		return new VertexAnimator(this._vertexAnimationSet);
	}

	/**
	 * Plays a sequence with a given name. If the sequence is not found, it may not be loaded yet, and it will retry every frame.
	 * @param sequenceName The name of the clip to be played.
	 */
	public play(name:string, transition:IAnimationTransition = null, offset:number = NaN)
	{
		if (this._pActiveAnimationName == name)
			return;

		this._pActiveAnimationName = name;

		//TODO: implement transitions in vertex animator

		if (!this._pAnimationSet.hasAnimation(name))
			throw new Error("Animation root node " + name + " not found!");

		this._pActiveNode = this._pAnimationSet.getAnimation(name);

		this._pActiveState = this.getAnimationState(this._pActiveNode);

		if (this.updatePosition) {
			//update straight away to reset position deltas
			this._pActiveState.update(this._pAbsoluteTime);
			this._pActiveState.positionDelta;
		}

		this._activeVertexState = <IVertexAnimationState> this._pActiveState;

		this.start();

		//apply a time offset if specified
		if (!isNaN(offset))
			this.reset(name, offset);
	}

	/**
	 * @inheritDoc
	 */
	public _pUpdateDeltaTime(dt:number)
	{
		super._pUpdateDeltaTime(dt);

		var geometryFlag:boolean = false;

		if (this._poses[0] != this._activeVertexState.currentGeometry) {
			this._poses[0] = this._activeVertexState.currentGeometry;
			geometryFlag = true;
		}

		if (this._poses[1] != this._activeVertexState.nextGeometry) {
			this._poses[1] = this._activeVertexState.nextGeometry;
			geometryFlag = true;
		}

		this._weights[0] = 1 - (this._weights[1] = this._activeVertexState.blendWeight);

		if (geometryFlag) {
			//invalidate meshes
			var mesh:Mesh;
			var len:number = this._pOwners.length;
			for (var i:number = 0; i < len; i++) {
				mesh = this._pOwners[i];
				mesh._iInvalidateRenderableGeometries();
			}
		}
	}

	/**
	 * @inheritDoc
	 */
	public setRenderState(shaderObject:ShaderObjectBase, renderable:RenderableBase, stage:Stage, camera:Camera, vertexConstantOffset:number /*int*/, vertexStreamOffset:number /*int*/)
	{
		// todo: add code for when running on cpu

		// if no poses defined, set temp data
		if (!this._poses.length) {
			this.setNullPose(shaderObject, renderable, stage, vertexConstantOffset, vertexStreamOffset);
			return;
		}

		// this type of animation can only be SubMesh
		var subMesh:TriangleSubMesh = <TriangleSubMesh> (<TriangleSubMeshRenderable> renderable).subMesh;
		var subGeom:SubGeometryBase;
		var i:number /*uint*/;
		var len:number /*uint*/ = this._numPoses;

		stage.context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, vertexConstantOffset, this._weights, 1);

		if (this._blendMode == VertexAnimationMode.ABSOLUTE)
			i = 1;
		else
			i = 0;

		for (; i < len; ++i) {
			subGeom = this._poses[i].subGeometries[subMesh._iIndex] || subMesh.subGeometry;

			stage.activateBuffer(vertexStreamOffset++, VertexDataPool.getItem(subGeom, renderable.getIndexData(), TriangleSubGeometry.POSITION_DATA), subGeom.getOffset(TriangleSubGeometry.POSITION_DATA), TriangleSubGeometry.POSITION_FORMAT);

			if (shaderObject.normalDependencies > 0)
				stage.activateBuffer(vertexStreamOffset++, VertexDataPool.getItem(subGeom, renderable.getIndexData(), TriangleSubGeometry.NORMAL_DATA), subGeom.getOffset(TriangleSubGeometry.NORMAL_DATA), TriangleSubGeometry.NORMAL_FORMAT);
		}
	}

	private setNullPose(shaderObject:ShaderObjectBase, renderable:RenderableBase, stage:Stage, vertexConstantOffset:number /*int*/, vertexStreamOffset:number /*int*/)
	{
		stage.context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, vertexConstantOffset, this._weights, 1);

		if (this._blendMode == VertexAnimationMode.ABSOLUTE) {
			var len:number /*uint*/ = this._numPoses;
			for (var i:number /*uint*/ = 1; i < len; ++i) {
				stage.activateBuffer(vertexStreamOffset++, renderable.getVertexData(TriangleSubGeometry.POSITION_DATA), renderable.getVertexOffset(TriangleSubGeometry.POSITION_DATA), TriangleSubGeometry.POSITION_FORMAT);

				if (shaderObject.normalDependencies > 0)
					stage.activateBuffer(vertexStreamOffset++, renderable.getVertexData(TriangleSubGeometry.NORMAL_DATA), renderable.getVertexOffset(TriangleSubGeometry.NORMAL_DATA), TriangleSubGeometry.NORMAL_FORMAT);
			}
		}
		// todo: set temp data for additive?
	}

	/**
	 * Verifies if the animation will be used on cpu. Needs to be true for all passes for a material to be able to use it on gpu.
	 * Needs to be called if gpu code is potentially required.
	 */
	public testGPUCompatibility(shaderObject:ShaderObjectBase)
	{
	}

	public getRenderableSubGeometry(renderable:TriangleSubMeshRenderable, sourceSubGeometry:TriangleSubGeometry):TriangleSubGeometry
	{
		if (this._blendMode == VertexAnimationMode.ABSOLUTE && this._poses.length)
			return <TriangleSubGeometry> this._poses[0].subGeometries[renderable.subMesh._iIndex] || sourceSubGeometry;

		//nothing to do here
		return sourceSubGeometry;
	}
}

export = VertexAnimator;