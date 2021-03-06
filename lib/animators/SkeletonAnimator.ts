import Quaternion						= require("awayjs-core/lib/geom/Quaternion");
import Vector3D							= require("awayjs-core/lib/geom/Vector3D");

import ISubMesh							= require("awayjs-display/lib/base/ISubMesh");
import TriangleSubGeometry				= require("awayjs-display/lib/base/TriangleSubGeometry");
import TriangleSubMesh					= require("awayjs-display/lib/base/TriangleSubMesh");
import Camera							= require("awayjs-display/lib/entities/Camera");
import SubGeometryEvent					= require("awayjs-display/lib/events/SubGeometryEvent");

import ContextGLProgramType				= require("awayjs-stagegl/lib/base/ContextGLProgramType");
import Stage							= require("awayjs-stagegl/lib/base/Stage");

import AnimatorBase						= require("awayjs-renderergl/lib/animators/AnimatorBase");
import SkeletonAnimationSet				= require("awayjs-renderergl/lib/animators/SkeletonAnimationSet");
import JointPose						= require("awayjs-renderergl/lib/animators/data/JointPose");
import Skeleton							= require("awayjs-renderergl/lib/animators/data/Skeleton");
import SkeletonJoint					= require("awayjs-renderergl/lib/animators/data/SkeletonJoint");
import SkeletonPose						= require("awayjs-renderergl/lib/animators/data/SkeletonPose");
import ISkeletonAnimationState			= require("awayjs-renderergl/lib/animators/states/ISkeletonAnimationState");
import IAnimationTransition				= require("awayjs-renderergl/lib/animators/transitions/IAnimationTransition");
import AnimationStateEvent				= require("awayjs-renderergl/lib/events/AnimationStateEvent");
import ShaderObjectBase					= require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
import RenderableBase					= require("awayjs-renderergl/lib/pool/RenderableBase");
import TriangleSubMeshRenderable		= require("awayjs-renderergl/lib/pool/TriangleSubMeshRenderable");

/**
 * Provides an interface for assigning skeleton-based animation data sets to mesh-based entity objects
 * and controlling the various available states of animation through an interative playhead that can be
 * automatically updated or manually triggered.
 */
class SkeletonAnimator extends AnimatorBase
{
	private _globalMatrices:Array<number>;
	private _globalPose:SkeletonPose = new SkeletonPose();
	private _globalPropertiesDirty:boolean;
	private _numJoints:number /*uint*/;
	private _morphedSubGeometry:Object = new Object();
	private _morphedSubGeometryDirty:Object = new Object();
	private _condensedMatrices:Array<number>;

	private _skeleton:Skeleton;
	private _forceCPU:boolean;
	private _useCondensedIndices:boolean;
	private _jointsPerVertex:number /*uint*/;
	private _activeSkeletonState:ISkeletonAnimationState;
	private _onTransitionCompleteDelegate:(event:AnimationStateEvent) => void;

	private _onIndicesUpdateDelegate:(event:SubGeometryEvent) => void;
	private _onVerticesUpdateDelegate:(event:SubGeometryEvent) => void;

	/**
	 * returns the calculated global matrices of the current skeleton pose.
	 *
	 * @see #globalPose
	 */
	public get globalMatrices():Array<number>
	{
		if (this._globalPropertiesDirty)
			this.updateGlobalProperties();

		return this._globalMatrices;
	}

	/**
	 * returns the current skeleton pose output from the animator.
	 *
	 * @see away.animators.data.SkeletonPose
	 */
	public get globalPose():SkeletonPose
	{
		if (this._globalPropertiesDirty)
			this.updateGlobalProperties();

		return this._globalPose;
	}

	/**
	 * Returns the skeleton object in use by the animator - this defines the number and heirarchy of joints used by the
	 * skinned geoemtry to which skeleon animator is applied.
	 */
	public get skeleton():Skeleton
	{
		return this._skeleton;
	}

	/**
	 * Indicates whether the skeleton animator is disabled by default for GPU rendering, something that allows the animator to perform calculation on the GPU.
	 * Defaults to false.
	 */
	public get forceCPU():boolean
	{
		return this._forceCPU;
	}

	/**
	 * Offers the option of enabling GPU accelerated animation on skeletons larger than 32 joints
	 * by condensing the number of joint index values required per mesh. Only applicable to
	 * skeleton animations that utilise more than one mesh object. Defaults to false.
	 */
	public get useCondensedIndices():boolean
	{
		return this._useCondensedIndices;
	}

	public set useCondensedIndices(value:boolean)
	{
		this._useCondensedIndices = value;
	}

	/**
	 * Creates a new <code>SkeletonAnimator</code> object.
	 *
	 * @param skeletonAnimationSet The animation data set containing the skeleton animations used by the animator.
	 * @param skeleton The skeleton object used for calculating the resulting global matrices for transforming skinned mesh data.
	 * @param forceCPU Optional value that only allows the animator to perform calculation on the CPU. Defaults to false.
	 */
	constructor(animationSet:SkeletonAnimationSet, skeleton:Skeleton, forceCPU:boolean = false)
	{
		super(animationSet);

		this._skeleton = skeleton;
		this._forceCPU = forceCPU;
		this._jointsPerVertex = animationSet.jointsPerVertex;

		this._numJoints = this._skeleton.numJoints;
		this._globalMatrices = new Array<number>(this._numJoints*12);

		var j:number /*int*/ = 0;
		for (var i:number /*uint*/ = 0; i < this._numJoints; ++i) {
			this._globalMatrices[j++] = 1;
			this._globalMatrices[j++] = 0;
			this._globalMatrices[j++] = 0;
			this._globalMatrices[j++] = 0;
			this._globalMatrices[j++] = 0;
			this._globalMatrices[j++] = 1;
			this._globalMatrices[j++] = 0;
			this._globalMatrices[j++] = 0;
			this._globalMatrices[j++] = 0;
			this._globalMatrices[j++] = 0;
			this._globalMatrices[j++] = 1;
			this._globalMatrices[j++] = 0;
		}

		this._onTransitionCompleteDelegate = (event:AnimationStateEvent) => this.onTransitionComplete(event);
		this._onIndicesUpdateDelegate = (event:SubGeometryEvent) => this.onIndicesUpdate(event);
		this._onVerticesUpdateDelegate = (event:SubGeometryEvent) => this.onVerticesUpdate(event);
	}

	/**
	 * @inheritDoc
	 */
	public clone():AnimatorBase
	{
		/* The cast to SkeletonAnimationSet should never fail, as _animationSet can only be set
		 through the constructor, which will only accept a SkeletonAnimationSet. */
		return new SkeletonAnimator(<SkeletonAnimationSet> this._pAnimationSet, this._skeleton, this._forceCPU);
	}

	/**
	 * Plays an animation state registered with the given name in the animation data set.
	 *
	 * @param name The data set name of the animation state to be played.
	 * @param transition An optional transition object that determines how the animator will transition from the currently active animation state.
	 * @param offset An option offset time (in milliseconds) that resets the state's internal clock to the absolute time of the animator plus the offset value. Required for non-looping animation states.
	 */
	public play(name:string, transition:IAnimationTransition = null, offset:number = NaN)
	{
		if (this._pActiveAnimationName == name)
			return;

		this._pActiveAnimationName = name;

		if (!this._pAnimationSet.hasAnimation(name))
			throw new Error("Animation root node " + name + " not found!");

		if (transition && this._pActiveNode) {
			//setup the transition
			this._pActiveNode = transition.getAnimationNode(this, this._pActiveNode, this._pAnimationSet.getAnimation(name), this._pAbsoluteTime);
			this._pActiveNode.addEventListener(AnimationStateEvent.TRANSITION_COMPLETE, this._onTransitionCompleteDelegate);
		} else
			this._pActiveNode = this._pAnimationSet.getAnimation(name);

		this._pActiveState = this.getAnimationState(this._pActiveNode);

		if (this.updatePosition) {
			//update straight away to reset position deltas
			this._pActiveState.update(this._pAbsoluteTime);
			this._pActiveState.positionDelta;
		}

		this._activeSkeletonState = <ISkeletonAnimationState> this._pActiveState;

		this.start();

		//apply a time offset if specified
		if (!isNaN(offset))
			this.reset(name, offset);
	}

	/**
	 * @inheritDoc
	 */
	public setRenderState(shaderObject:ShaderObjectBase, renderable:RenderableBase, stage:Stage, camera:Camera, vertexConstantOffset:number /*int*/, vertexStreamOffset:number /*int*/)
	{
		// do on request of globalProperties
		if (this._globalPropertiesDirty)
			this.updateGlobalProperties();

		var subGeometry:TriangleSubGeometry = <TriangleSubGeometry> (<TriangleSubMesh> (<TriangleSubMeshRenderable> renderable).subMesh).subGeometry;

		subGeometry.useCondensedIndices = this._useCondensedIndices;

		if (this._useCondensedIndices) {
			// using a condensed data set
			this.updateCondensedMatrices(subGeometry.condensedIndexLookUp, subGeometry.numCondensedJoints);
			stage.context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, vertexConstantOffset, this._condensedMatrices, subGeometry.numCondensedJoints*3);
		} else {
			if (this._pAnimationSet.usesCPU) {
				if (this._morphedSubGeometryDirty[subGeometry.id])
					this.morphSubGeometry(<TriangleSubMeshRenderable> renderable, subGeometry);

				return
			}
			stage.context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, vertexConstantOffset, this._globalMatrices, this._numJoints*3);
		}

		stage.activateBuffer(vertexStreamOffset, renderable.getVertexData(TriangleSubGeometry.JOINT_INDEX_DATA), renderable.getVertexOffset(TriangleSubGeometry.JOINT_INDEX_DATA), renderable.JOINT_INDEX_FORMAT);
		stage.activateBuffer(vertexStreamOffset + 1, renderable.getVertexData(TriangleSubGeometry.JOINT_WEIGHT_DATA), renderable.getVertexOffset(TriangleSubGeometry.JOINT_WEIGHT_DATA), renderable.JOINT_WEIGHT_FORMAT);
	}

	/**
	 * @inheritDoc
	 */
	public testGPUCompatibility(shaderObject:ShaderObjectBase)
	{
		if (!this._useCondensedIndices && (this._forceCPU || this._jointsPerVertex > 4 || shaderObject.numUsedVertexConstants + this._numJoints*3 > 128))
			this._pAnimationSet.cancelGPUCompatibility();
	}

	/**
	 * Applies the calculated time delta to the active animation state node or state transition object.
	 */
	public _pUpdateDeltaTime(dt:number)
	{
		super._pUpdateDeltaTime(dt);

		//invalidate pose matrices
		this._globalPropertiesDirty = true;

		//trigger geometry invalidation if using CPU animation
		if (this._pAnimationSet.usesCPU)
			for (var key in this._morphedSubGeometryDirty)
				this._morphedSubGeometryDirty[key] = true;
	}

	private updateCondensedMatrices(condensedIndexLookUp:Array<number> /*uint*/, numJoints:number /*uint*/)
	{
		var i:number /*uint*/ = 0, j:number /*uint*/ = 0;
		var len:number /*uint*/;
		var srcIndex:number /*uint*/;

		this._condensedMatrices = new Array<number>();

		do {
			srcIndex = condensedIndexLookUp[i]*4;
			len = srcIndex + 12;
			// copy into condensed
			while (srcIndex < len)
				this._condensedMatrices[j++] = this._globalMatrices[srcIndex++];
		} while (++i < numJoints);
	}

	private updateGlobalProperties()
	{
		this._globalPropertiesDirty = false;

		//get global pose
		this.localToGlobalPose(this._activeSkeletonState.getSkeletonPose(this._skeleton), this._globalPose, this._skeleton);

		// convert pose to matrix
		var mtxOffset:number /*uint*/ = 0;
		var globalPoses:Array<JointPose> = this._globalPose.jointPoses;
		var raw:Array<number>;
		var ox:number, oy:number, oz:number, ow:number;
		var xy2:number, xz2:number, xw2:number;
		var yz2:number, yw2:number, zw2:number;
		var n11:number, n12:number, n13:number;
		var n21:number, n22:number, n23:number;
		var n31:number, n32:number, n33:number;
		var m11:number, m12:number, m13:number, m14:number;
		var m21:number, m22:number, m23:number, m24:number;
		var m31:number, m32:number, m33:number, m34:number;
		var joints:Array<SkeletonJoint> = this._skeleton.joints;
		var pose:JointPose;
		var quat:Quaternion;
		var vec:Vector3D;
		var t:number;

		for (var i:number /*uint*/ = 0; i < this._numJoints; ++i) {
			pose = globalPoses[i];
			quat = pose.orientation;
			vec = pose.translation;
			ox = quat.x;
			oy = quat.y;
			oz = quat.z;
			ow = quat.w;

			xy2 = (t = 2.0*ox)*oy;
			xz2 = t*oz;
			xw2 = t*ow;
			yz2 = (t = 2.0*oy)*oz;
			yw2 = t*ow;
			zw2 = 2.0*oz*ow;

			yz2 = 2.0*oy*oz;
			yw2 = 2.0*oy*ow;
			zw2 = 2.0*oz*ow;
			ox *= ox;
			oy *= oy;
			oz *= oz;
			ow *= ow;

			n11 = (t = ox - oy) - oz + ow;
			n12 = xy2 - zw2;
			n13 = xz2 + yw2;
			n21 = xy2 + zw2;
			n22 = -t - oz + ow;
			n23 = yz2 - xw2;
			n31 = xz2 - yw2;
			n32 = yz2 + xw2;
			n33 = -ox - oy + oz + ow;

			// prepend inverse bind pose
			raw = joints[i].inverseBindPose;
			m11 = raw[0];
			m12 = raw[4];
			m13 = raw[8];
			m14 = raw[12];
			m21 = raw[1];
			m22 = raw[5];
			m23 = raw[9];
			m24 = raw[13];
			m31 = raw[2];
			m32 = raw[6];
			m33 = raw[10];
			m34 = raw[14];

			this._globalMatrices[mtxOffset] = n11*m11 + n12*m21 + n13*m31;
			this._globalMatrices[mtxOffset + 1] = n11*m12 + n12*m22 + n13*m32;
			this._globalMatrices[mtxOffset + 2] = n11*m13 + n12*m23 + n13*m33;
			this._globalMatrices[mtxOffset + 3] = n11*m14 + n12*m24 + n13*m34 + vec.x;
			this._globalMatrices[mtxOffset + 4] = n21*m11 + n22*m21 + n23*m31;
			this._globalMatrices[mtxOffset + 5] = n21*m12 + n22*m22 + n23*m32;
			this._globalMatrices[mtxOffset + 6] = n21*m13 + n22*m23 + n23*m33;
			this._globalMatrices[mtxOffset + 7] = n21*m14 + n22*m24 + n23*m34 + vec.y;
			this._globalMatrices[mtxOffset + 8] = n31*m11 + n32*m21 + n33*m31;
			this._globalMatrices[mtxOffset + 9] = n31*m12 + n32*m22 + n33*m32;
			this._globalMatrices[mtxOffset + 10] = n31*m13 + n32*m23 + n33*m33;
			this._globalMatrices[mtxOffset + 11] = n31*m14 + n32*m24 + n33*m34 + vec.z;

			mtxOffset = mtxOffset + 12;
		}
	}


	public getRenderableSubGeometry(renderable:TriangleSubMeshRenderable, sourceSubGeometry:TriangleSubGeometry):TriangleSubGeometry
	{
		this._morphedSubGeometryDirty[sourceSubGeometry.id] = true;

		//early out for GPU animations
		if (!this._pAnimationSet.usesCPU)
			return sourceSubGeometry;

		var targetSubGeometry:TriangleSubGeometry;

		if (!(targetSubGeometry = this._morphedSubGeometry[sourceSubGeometry.id])) {
			//not yet stored
			targetSubGeometry = this._morphedSubGeometry[sourceSubGeometry.id] = sourceSubGeometry.clone();
			//turn off auto calculations on the morphed geometry
			targetSubGeometry.autoDeriveNormals = false;
			targetSubGeometry.autoDeriveTangents = false;
			targetSubGeometry.autoDeriveUVs = false;
			//add event listeners for any changes in UV values on the source geometry
			sourceSubGeometry.addEventListener(SubGeometryEvent.INDICES_UPDATED, this._onIndicesUpdateDelegate);
			sourceSubGeometry.addEventListener(SubGeometryEvent.VERTICES_UPDATED, this._onVerticesUpdateDelegate);
		}

		return targetSubGeometry;
	}

	/**
	 * If the animation can't be performed on GPU, transform vertices manually
	 * @param subGeom The subgeometry containing the weights and joint index data per vertex.
	 * @param pass The material pass for which we need to transform the vertices
	 */
	public morphSubGeometry(renderable:TriangleSubMeshRenderable, sourceSubGeometry:TriangleSubGeometry)
	{
		this._morphedSubGeometryDirty[sourceSubGeometry.id] = false;

		var sourcePositions:Array<number> = sourceSubGeometry.positions;
		var sourceNormals:Array<number> = sourceSubGeometry.vertexNormals;
		var sourceTangents:Array<number> = sourceSubGeometry.vertexTangents;

		var jointIndices:Array<number> = sourceSubGeometry.jointIndices;
		var jointWeights:Array<number> = sourceSubGeometry.jointWeights;

		var targetSubGeometry = this._morphedSubGeometry[sourceSubGeometry.id];

		var targetPositions:Array<number> = targetSubGeometry.positions;
		var targetNormals:Array<number> = targetSubGeometry.vertexNormals;
		var targetTangents:Array<number> = targetSubGeometry.vertexTangents;

		var index:number /*uint*/ = 0;
		var j:number /*uint*/ = 0;
		var k:number /*uint*/;
		var vx:number, vy:number, vz:number;
		var nx:number, ny:number, nz:number;
		var tx:number, ty:number, tz:number;
		var len:number /*int*/ = sourcePositions.length;
		var weight:number;
		var vertX:number, vertY:number, vertZ:number;
		var normX:number, normY:number, normZ:number;
		var tangX:number, tangY:number, tangZ:number;
		var m11:number, m12:number, m13:number, m14:number;
		var m21:number, m22:number, m23:number, m24:number;
		var m31:number, m32:number, m33:number, m34:number;

		while (index < len) {
			vertX = sourcePositions[index];
			vertY = sourcePositions[index + 1];
			vertZ = sourcePositions[index + 2];
			normX = sourceNormals[index];
			normY = sourceNormals[index + 1];
			normZ = sourceNormals[index + 2];
			tangX = sourceTangents[index];
			tangY = sourceTangents[index + 1];
			tangZ = sourceTangents[index + 2];
			vx = 0;
			vy = 0;
			vz = 0;
			nx = 0;
			ny = 0;
			nz = 0;
			tx = 0;
			ty = 0;
			tz = 0;
			k = 0;
			while (k < this._jointsPerVertex) {
				weight = jointWeights[j];
				if (weight > 0) {
					// implicit /3*12 (/3 because indices are multiplied by 3 for gpu matrix access, *12 because it's the matrix size)
					var mtxOffset:number /*uint*/ = jointIndices[j++] << 2;
					m11 = this._globalMatrices[mtxOffset];
					m12 = this._globalMatrices[mtxOffset + 1];
					m13 = this._globalMatrices[mtxOffset + 2];
					m14 = this._globalMatrices[mtxOffset + 3];
					m21 = this._globalMatrices[mtxOffset + 4];
					m22 = this._globalMatrices[mtxOffset + 5];
					m23 = this._globalMatrices[mtxOffset + 6];
					m24 = this._globalMatrices[mtxOffset + 7];
					m31 = this._globalMatrices[mtxOffset + 8];
					m32 = this._globalMatrices[mtxOffset + 9];
					m33 = this._globalMatrices[mtxOffset + 10];
					m34 = this._globalMatrices[mtxOffset + 11];
					vx += weight*(m11*vertX + m12*vertY + m13*vertZ + m14);
					vy += weight*(m21*vertX + m22*vertY + m23*vertZ + m24);
					vz += weight*(m31*vertX + m32*vertY + m33*vertZ + m34);
					nx += weight*(m11*normX + m12*normY + m13*normZ);
					ny += weight*(m21*normX + m22*normY + m23*normZ);
					nz += weight*(m31*normX + m32*normY + m33*normZ);
					tx += weight*(m11*tangX + m12*tangY + m13*tangZ);
					ty += weight*(m21*tangX + m22*tangY + m23*tangZ);
					tz += weight*(m31*tangX + m32*tangY + m33*tangZ);
					++k;
				} else {
					j += (this._jointsPerVertex - k);
					k = this._jointsPerVertex;
				}
			}

			targetPositions[index] = vx;
			targetPositions[index + 1] = vy;
			targetPositions[index + 2] = vz;
			targetNormals[index] = nx;
			targetNormals[index + 1] = ny;
			targetNormals[index + 2] = nz;
			targetTangents[index] = tx;
			targetTangents[index + 1] = ty;
			targetTangents[index + 2] = tz;

			index += 3;
		}

		targetSubGeometry.updatePositions(targetPositions);
		targetSubGeometry.updateVertexNormals(targetNormals);
		targetSubGeometry.updateVertexTangents(targetTangents);
	}

	/**
	 * Converts a local hierarchical skeleton pose to a global pose
	 * @param targetPose The SkeletonPose object that will contain the global pose.
	 * @param skeleton The skeleton containing the joints, and as such, the hierarchical data to transform to global poses.
	 */
	private localToGlobalPose(sourcePose:SkeletonPose, targetPose:SkeletonPose, skeleton:Skeleton)
	{
		var globalPoses:Array<JointPose> = targetPose.jointPoses;
		var globalJointPose:JointPose;
		var joints:Array<SkeletonJoint> = skeleton.joints;
		var len:number /*uint*/ = sourcePose.numJointPoses;
		var jointPoses:Array<JointPose> = sourcePose.jointPoses;
		var parentIndex:number /*int*/;
		var joint:SkeletonJoint;
		var parentPose:JointPose;
		var pose:JointPose;
		var or:Quaternion;
		var tr:Vector3D;
		var t:Vector3D;
		var q:Quaternion;

		var x1:number, y1:number, z1:number, w1:number;
		var x2:number, y2:number, z2:number, w2:number;
		var x3:number, y3:number, z3:number;

		// :s
		if (globalPoses.length != len)
			globalPoses.length = len;

		for (var i:number /*uint*/ = 0; i < len; ++i) {
			globalJointPose = globalPoses[i];

			if (globalJointPose == null)
				globalJointPose = globalPoses[i] = new JointPose();

			joint = joints[i];
			parentIndex = joint.parentIndex;
			pose = jointPoses[i];

			q = globalJointPose.orientation;
			t = globalJointPose.translation;

			if (parentIndex < 0) {
				tr = pose.translation;
				or = pose.orientation;
				q.x = or.x;
				q.y = or.y;
				q.z = or.z;
				q.w = or.w;
				t.x = tr.x;
				t.y = tr.y;
				t.z = tr.z;
			} else {
				// append parent pose
				parentPose = globalPoses[parentIndex];

				// rotate point
				or = parentPose.orientation;
				tr = pose.translation;
				x2 = or.x;
				y2 = or.y;
				z2 = or.z;
				w2 = or.w;
				x3 = tr.x;
				y3 = tr.y;
				z3 = tr.z;

				w1 = -x2*x3 - y2*y3 - z2*z3;
				x1 = w2*x3 + y2*z3 - z2*y3;
				y1 = w2*y3 - x2*z3 + z2*x3;
				z1 = w2*z3 + x2*y3 - y2*x3;

				// append parent translation
				tr = parentPose.translation;
				t.x = -w1*x2 + x1*w2 - y1*z2 + z1*y2 + tr.x;
				t.y = -w1*y2 + x1*z2 + y1*w2 - z1*x2 + tr.y;
				t.z = -w1*z2 - x1*y2 + y1*x2 + z1*w2 + tr.z;

				// append parent orientation
				x1 = or.x;
				y1 = or.y;
				z1 = or.z;
				w1 = or.w;
				or = pose.orientation;
				x2 = or.x;
				y2 = or.y;
				z2 = or.z;
				w2 = or.w;

				q.w = w1*w2 - x1*x2 - y1*y2 - z1*z2;
				q.x = w1*x2 + x1*w2 + y1*z2 - z1*y2;
				q.y = w1*y2 - x1*z2 + y1*w2 + z1*x2;
				q.z = w1*z2 + x1*y2 - y1*x2 + z1*w2;
			}
		}
	}

	private onTransitionComplete(event:AnimationStateEvent)
	{
		if (event.type == AnimationStateEvent.TRANSITION_COMPLETE) {
			event.animationNode.removeEventListener(AnimationStateEvent.TRANSITION_COMPLETE, this._onTransitionCompleteDelegate);
			//if this is the current active state transition, revert control to the active node
			if (this._pActiveState == event.animationState) {
				this._pActiveNode = this._pAnimationSet.getAnimation(this._pActiveAnimationName);
				this._pActiveState = this.getAnimationState(this._pActiveNode);
				this._activeSkeletonState = <ISkeletonAnimationState> this._pActiveState;
			}
		}
	}

	private onIndicesUpdate(event:SubGeometryEvent)
	{
		var subGeometry:TriangleSubGeometry = <TriangleSubGeometry> event.target;

		(<TriangleSubGeometry> this._morphedSubGeometry[subGeometry.id]).updateIndices(subGeometry.indices);
	}

	private onVerticesUpdate(event:SubGeometryEvent)
	{
		var subGeometry:TriangleSubGeometry = <TriangleSubGeometry> event.target;
		var morphGeometry:TriangleSubGeometry = <TriangleSubGeometry> this._morphedSubGeometry[subGeometry.id];

		switch(event.dataType) {
			case TriangleSubGeometry.UV_DATA:
				morphGeometry.updateUVs(subGeometry.uvs);
			case TriangleSubGeometry.SECONDARY_UV_DATA:
				morphGeometry.updateUVs(subGeometry.secondaryUVs);
		}
	}
}

export = SkeletonAnimator;