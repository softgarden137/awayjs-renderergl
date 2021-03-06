import MathConsts						= require("awayjs-core/lib/geom/MathConsts");
import Matrix3D							= require("awayjs-core/lib/geom/Matrix3D");
import Vector3D							= require("awayjs-core/lib/geom/Vector3D");
import Orientation3D					= require("awayjs-core/lib/geom/Orientation3D");

import Camera							= require("awayjs-display/lib/entities/Camera");

import Stage							= require("awayjs-stagegl/lib/base/Stage");

import ParticleAnimator					= require("awayjs-renderergl/lib/animators/ParticleAnimator");
import AnimationRegisterCache			= require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
import AnimationSubGeometry				= require("awayjs-renderergl/lib/animators/data/AnimationSubGeometry");
import ParticleBillboardNode			= require("awayjs-renderergl/lib/animators/nodes/ParticleBillboardNode");
import ParticleStateBase				= require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
import RenderableBase					= require("awayjs-renderergl/lib/pool/RenderableBase");

/**
 * ...
 */
class ParticleBillboardState extends ParticleStateBase
{
	/** @private */
	public static MATRIX_INDEX:number /*int*/ = 0;

	private _matrix:Matrix3D = new Matrix3D;

	private _billboardAxis:Vector3D;

	/**
	 *
	 */
	constructor(animator:ParticleAnimator, particleNode:ParticleBillboardNode)
	{
		super(animator, particleNode);

		this._billboardAxis = particleNode._iBillboardAxis;
	}

	public setRenderState(stage:Stage, renderable:RenderableBase, animationSubGeometry:AnimationSubGeometry, animationRegisterCache:AnimationRegisterCache, camera:Camera)
	{
		var comps:Array<Vector3D>;
		if (this._billboardAxis) {
			var pos:Vector3D = renderable.sourceEntity.sceneTransform.position;
			var look:Vector3D = camera.sceneTransform.position.subtract(pos);
			var right:Vector3D = look.crossProduct(this._billboardAxis);
			right.normalize();
			look = this.billboardAxis.crossProduct(right);
			look.normalize();

			//create a quick inverse projection matrix
			this._matrix.copyFrom(renderable.sourceEntity.sceneTransform);
			comps = this._matrix.decompose(Orientation3D.AXIS_ANGLE);
			this._matrix.copyColumnFrom(0, right);
			this._matrix.copyColumnFrom(1, this.billboardAxis);
			this._matrix.copyColumnFrom(2, look);
			this._matrix.copyColumnFrom(3, pos);
			this._matrix.appendRotation(-comps[1].w*MathConsts.RADIANS_TO_DEGREES, comps[1]);
		} else {
			//create a quick inverse projection matrix
			this._matrix.copyFrom(renderable.sourceEntity.sceneTransform);
			this._matrix.append(camera.inverseSceneTransform);

			//decompose using axis angle rotations
			comps = this._matrix.decompose(Orientation3D.AXIS_ANGLE);

			//recreate the matrix with just the rotation data
			this._matrix.identity();
			this._matrix.appendRotation(-comps[1].w*MathConsts.RADIANS_TO_DEGREES, comps[1]);
		}

		//set a new matrix transform constant
		animationRegisterCache.setVertexConstFromMatrix(animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleBillboardState.MATRIX_INDEX), this._matrix);
	}

	/**
	 * Defines the billboard axis.
	 */
	public get billboardAxis():Vector3D
	{
		return this.billboardAxis;
	}

	public set billboardAxis(value:Vector3D)
	{
		this.billboardAxis = value? value.clone() : null;
		if (this.billboardAxis)
			this.billboardAxis.normalize();
	}

}

export = ParticleBillboardState;