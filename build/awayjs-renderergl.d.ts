declare module "awayjs-renderergl/lib/errors/AnimationSetError" {
	import Error = require("awayjs-core/lib/errors/Error");
	class AnimationSetError extends Error {
	    constructor(message: string);
	}
	export = AnimationSetError;
	
}
declare module "awayjs-renderergl/lib/animators/states/IAnimationState" {
	import Vector3D = require("awayjs-core/lib/geom/Vector3D");
	interface IAnimationState {
	    positionDelta: Vector3D;
	    offset(startTime: number): any;
	    update(time: number): any;
	    /**
	     * Sets the animation phase of the node.
	     *
	     * @param value The phase value to use. 0 represents the beginning of an animation clip, 1 represents the end.
	     */
	    phase(value: number): any;
	}
	export = IAnimationState;
	
}
declare module "awayjs-renderergl/lib/compilation/ShaderRegisterElement" {
	/**
	 * A single register element (an entire register or a single register's component) used by the RegisterPool.
	 */
	class ShaderRegisterElement {
	    private _regName;
	    private _index;
	    private _toStr;
	    private static COMPONENTS;
	    _component: number;
	    /**
	     * Creates a new ShaderRegisterElement object.
	     *
	     * @param regName The name of the register.
	     * @param index The index of the register.
	     * @param component The register's component, if not the entire register is represented.
	     */
	    constructor(regName: string, index: number, component?: number);
	    /**
	     * Converts the register or the components AGAL string representation.
	     */
	    toString(): string;
	    /**
	     * The register's name.
	     */
	    regName: string;
	    /**
	     * The register's index.
	     */
	    index: number;
	}
	export = ShaderRegisterElement;
	
}
declare module "awayjs-renderergl/lib/compilation/RegisterPool" {
	import ShaderRegisterElement = require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
	/**
	 * RegisterPool is used by the shader compilation process to keep track of which registers of a certain type are
	 * currently used and should not be allowed to be written to. Either entire registers can be requested and locked,
	 * or single components (x, y, z, w) of a single register.
	 * It is used by ShaderRegisterCache to track usages of individual register types.
	 *
	 * @see away.materials.ShaderRegisterCache
	 */
	class RegisterPool {
	    private static _regPool;
	    private static _regCompsPool;
	    private _vectorRegisters;
	    private _registerComponents;
	    private _regName;
	    private _usedSingleCount;
	    private _usedVectorCount;
	    private _regCount;
	    private _persistent;
	    /**
	     * Creates a new RegisterPool object.
	     * @param regName The base name of the register type ("ft" for fragment temporaries, "vc" for vertex constants, etc)
	     * @param regCount The amount of available registers of this type.
	     * @param persistent Whether or not registers, once reserved, can be freed again. For example, temporaries are not persistent, but constants are.
	     */
	    constructor(regName: string, regCount: number, persistent?: boolean);
	    /**
	     * Retrieve an entire vector register that's still available.
	     */
	    requestFreeVectorReg(): ShaderRegisterElement;
	    /**
	     * Retrieve a single vector component that's still available.
	     */
	    requestFreeRegComponent(): ShaderRegisterElement;
	    /**
	     * Marks a register as used, so it cannot be retrieved. The register won't be able to be used until removeUsage
	     * has been called usageCount times again.
	     * @param register The register to mark as used.
	     * @param usageCount The amount of usages to add.
	     */
	    addUsage(register: ShaderRegisterElement, usageCount: number): void;
	    /**
	     * Removes a usage from a register. When usages reach 0, the register is freed again.
	     * @param register The register for which to remove a usage.
	     */
	    removeUsage(register: ShaderRegisterElement): void;
	    /**
	     * Disposes any resources used by the current RegisterPool object.
	     */
	    dispose(): void;
	    /**
	     * Indicates whether or not any registers are in use.
	     */
	    hasRegisteredRegs(): boolean;
	    /**
	     * Initializes all registers.
	     */
	    private initRegisters(regName, regCount);
	    private static _initPool(regName, regCount);
	    /**
	     * Check if the temp register is either used for single or vector use
	     */
	    private isRegisterUsed(index);
	    private _initArray(a, val);
	}
	export = RegisterPool;
	
}
declare module "awayjs-renderergl/lib/compilation/ShaderRegisterCache" {
	import ShaderRegisterElement = require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
	/**
	 * ShaderRegister Cache provides the usage management system for all registers during shading compilation.
	 */
	class ShaderRegisterCache {
	    private _fragmentTempCache;
	    private _vertexTempCache;
	    private _varyingCache;
	    private _fragmentConstantsCache;
	    private _vertexConstantsCache;
	    private _textureCache;
	    private _vertexAttributesCache;
	    private _vertexConstantOffset;
	    private _vertexAttributesOffset;
	    private _varyingsOffset;
	    private _fragmentConstantOffset;
	    private _fragmentOutputRegister;
	    private _vertexOutputRegister;
	    private _numUsedVertexConstants;
	    private _numUsedFragmentConstants;
	    private _numUsedStreams;
	    private _numUsedTextures;
	    private _numUsedVaryings;
	    private _profile;
	    /**
	     * Create a new ShaderRegisterCache object.
	     *
	     * @param profile The compatibility profile used by the renderer.
	     */
	    constructor(profile: string);
	    /**
	     * Resets all registers.
	     */
	    reset(): void;
	    /**
	     * Disposes all resources used.
	     */
	    dispose(): void;
	    /**
	     * Marks a fragment temporary register as used, so it cannot be retrieved. The register won't be able to be used until removeUsage
	     * has been called usageCount times again.
	     * @param register The register to mark as used.
	     * @param usageCount The amount of usages to add.
	     */
	    addFragmentTempUsages(register: ShaderRegisterElement, usageCount: number): void;
	    /**
	     * Removes a usage from a fragment temporary register. When usages reach 0, the register is freed again.
	     * @param register The register for which to remove a usage.
	     */
	    removeFragmentTempUsage(register: ShaderRegisterElement): void;
	    /**
	     * Marks a vertex temporary register as used, so it cannot be retrieved. The register won't be able to be used
	     * until removeUsage has been called usageCount times again.
	     * @param register The register to mark as used.
	     * @param usageCount The amount of usages to add.
	     */
	    addVertexTempUsages(register: ShaderRegisterElement, usageCount: number): void;
	    /**
	     * Removes a usage from a vertex temporary register. When usages reach 0, the register is freed again.
	     * @param register The register for which to remove a usage.
	     */
	    removeVertexTempUsage(register: ShaderRegisterElement): void;
	    /**
	     * Retrieve an entire fragment temporary register that's still available. The register won't be able to be used until removeUsage
	     * has been called usageCount times again.
	     */
	    getFreeFragmentVectorTemp(): ShaderRegisterElement;
	    /**
	     * Retrieve a single component from a fragment temporary register that's still available.
	     */
	    getFreeFragmentSingleTemp(): ShaderRegisterElement;
	    /**
	     * Retrieve an available varying register
	     */
	    getFreeVarying(): ShaderRegisterElement;
	    /**
	     * Retrieve an available fragment constant register
	     */
	    getFreeFragmentConstant(): ShaderRegisterElement;
	    /**
	     * Retrieve an available vertex constant register
	     */
	    getFreeVertexConstant(): ShaderRegisterElement;
	    /**
	     * Retrieve an entire vertex temporary register that's still available.
	     */
	    getFreeVertexVectorTemp(): ShaderRegisterElement;
	    /**
	     * Retrieve a single component from a vertex temporary register that's still available.
	     */
	    getFreeVertexSingleTemp(): ShaderRegisterElement;
	    /**
	     * Retrieve an available vertex attribute register
	     */
	    getFreeVertexAttribute(): ShaderRegisterElement;
	    /**
	     * Retrieve an available texture register
	     */
	    getFreeTextureReg(): ShaderRegisterElement;
	    /**
	     * Indicates the start index from which to retrieve vertex constants.
	     */
	    vertexConstantOffset: number;
	    /**
	     * Indicates the start index from which to retrieve vertex attributes.
	     */
	    vertexAttributesOffset: number;
	    /**
	     * Indicates the start index from which to retrieve varying registers.
	     */
	    varyingsOffset: number;
	    /**
	     * Indicates the start index from which to retrieve fragment constants.
	     */
	    fragmentConstantOffset: number;
	    /**
	     * The fragment output register.
	     */
	    fragmentOutputRegister: ShaderRegisterElement;
	    /**
	     * The amount of used vertex constant registers.
	     */
	    numUsedVertexConstants: number;
	    /**
	     * The amount of used fragment constant registers.
	     */
	    numUsedFragmentConstants: number;
	    /**
	     * The amount of used vertex streams.
	     */
	    numUsedStreams: number;
	    /**
	     * The amount of used texture slots.
	     */
	    numUsedTextures: number;
	    /**
	     * The amount of used varying registers.
	     */
	    numUsedVaryings: number;
	}
	export = ShaderRegisterCache;
	
}
declare module "awayjs-renderergl/lib/compilation/ShaderRegisterData" {
	import ShaderRegisterElement = require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
	/**
	 * ShaderRegisterData contains the "named" registers, generated by the compiler and to be passed on to the methods.
	 */
	class ShaderRegisterData {
	    normalVarying: ShaderRegisterElement;
	    colorVarying: ShaderRegisterElement;
	    tangentVarying: ShaderRegisterElement;
	    bitangentVarying: ShaderRegisterElement;
	    uvVarying: ShaderRegisterElement;
	    secondaryUVVarying: ShaderRegisterElement;
	    viewDirVarying: ShaderRegisterElement;
	    shadowTarget: ShaderRegisterElement;
	    shadedTarget: ShaderRegisterElement;
	    globalPositionVertex: ShaderRegisterElement;
	    globalPositionVarying: ShaderRegisterElement;
	    localPosition: ShaderRegisterElement;
	    normalInput: ShaderRegisterElement;
	    colorInput: ShaderRegisterElement;
	    tangentInput: ShaderRegisterElement;
	    animatedNormal: ShaderRegisterElement;
	    animatedTangent: ShaderRegisterElement;
	    commons: ShaderRegisterElement;
	    projectionFragment: ShaderRegisterElement;
	    normalFragment: ShaderRegisterElement;
	    viewDirFragment: ShaderRegisterElement;
	    bitangent: ShaderRegisterElement;
	    constructor();
	}
	export = ShaderRegisterData;
	
}
declare module "awayjs-renderergl/lib/pool/IRenderableClass" {
	import IRenderableOwner = require("awayjs-display/lib/base/IRenderableOwner");
	import IRenderable = require("awayjs-display/lib/pool/IRenderable");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
	import RenderablePoolBase = require("awayjs-renderergl/lib/pool/RenderablePoolBase");
	/**
	 * IRenderableClass is an interface for the constructable class definition IRenderable that is used to
	 * create renderable objects in the rendering pipeline to render the contents of a partition
	 *
	 * @class away.render.IRenderableClass
	 */
	interface IRenderableClass {
	    /**
	     *
	     */
	    id: string;
	    vertexAttributesOffset: number;
	    /**
	     *
	     */
	    new (pool: RenderablePoolBase, renderableOwner: IRenderableOwner, stage: Stage): IRenderable;
	    _iIncludeDependencies(shaderObject: ShaderObjectBase): any;
	    _iGetVertexCode(shaderObject: ShaderObjectBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    _iGetFragmentCode(shaderObject: ShaderObjectBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	}
	export = IRenderableClass;
	
}
declare module "awayjs-renderergl/lib/passes/IRenderPassBase" {
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
	import AnimationSetBase = require("awayjs-renderergl/lib/animators/AnimationSetBase");
	/**
	 *
	 * @class away.pool.ScreenPasses
	 */
	interface IRenderPassBase {
	    animationSet: AnimationSetBase;
	    _iIncludeDependencies(shaderObject: ShaderObjectBase): any;
	    _iInitConstantData(shaderObject: ShaderObjectBase): any;
	    _iGetPreLightingVertexCode(shaderObject: ShaderObjectBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    _iGetPreLightingFragmentCode(shaderObject: ShaderObjectBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    _iGetVertexCode(shaderObject: ShaderObjectBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    _iGetFragmentCode(shaderObject: ShaderObjectBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    _iGetNormalVertexCode(shaderObject: ShaderObjectBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    _iGetNormalFragmentCode(shaderObject: ShaderObjectBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    _pOutputsNormals(shaderObject: ShaderObjectBase): boolean;
	    _pOutputsTangentNormals(shaderObject: ShaderObjectBase): boolean;
	    _pUsesTangentSpace(shaderObject: ShaderObjectBase): boolean;
	}
	export = IRenderPassBase;
	
}
declare module "awayjs-renderergl/lib/passes/RenderPassBase" {
	import Matrix3D = require("awayjs-core/lib/geom/Matrix3D");
	import EventDispatcher = require("awayjs-core/lib/events/EventDispatcher");
	import Camera = require("awayjs-display/lib/entities/Camera");
	import IRenderObjectOwner = require("awayjs-display/lib/base/IRenderObjectOwner");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import AnimationSetBase = require("awayjs-renderergl/lib/animators/AnimationSetBase");
	import RenderableBase = require("awayjs-renderergl/lib/pool/RenderableBase");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
	import IRenderableClass = require("awayjs-renderergl/lib/pool/IRenderableClass");
	import IRenderPassBase = require("awayjs-renderergl/lib/passes/IRenderPassBase");
	import RenderObjectBase = require("awayjs-renderergl/lib/compilation/RenderObjectBase");
	/**
	 * RenderPassBase provides an abstract base class for material shader passes. A material pass constitutes at least
	 * a render call per required renderable.
	 */
	class RenderPassBase extends EventDispatcher implements IRenderPassBase {
	    private _renderObject;
	    _renderObjectOwner: IRenderObjectOwner;
	    _renderableClass: IRenderableClass;
	    _stage: Stage;
	    _shader: ShaderObjectBase;
	    private _preserveAlpha;
	    private _forceSeparateMVP;
	    private _depthCompareMode;
	    private _blendFactorSource;
	    private _blendFactorDest;
	    _pEnableBlending: boolean;
	    private _writeDepth;
	    shader: ShaderObjectBase;
	    animationSet: AnimationSetBase;
	    /**
	     * Indicates whether the output alpha value should remain unchanged compared to the material's original alpha.
	     */
	    preserveAlpha: boolean;
	    /**
	     * Indicates whether the screen projection should be calculated by forcing a separate scene matrix and
	     * view-projection matrix. This is used to prevent rounding errors when using multiple passes with different
	     * projection code.
	     */
	    forceSeparateMVP: boolean;
	    /**
	     * Creates a new RenderPassBase object.
	     */
	    constructor(renderObject: RenderObjectBase, renderObjectOwner: IRenderObjectOwner, renderableClass: IRenderableClass, stage: Stage);
	    /**
	     * Indicate whether this pass should write to the depth buffer or not. Ignored when blending is enabled.
	     */
	    writeDepth: boolean;
	    /**
	     * The depth compare mode used to render the renderables using this material.
	     *
	     * @see away.stagegl.ContextGLCompareMode
	     */
	    depthCompareMode: string;
	    /**
	     * Cleans up any resources used by the current object.
	     * @param deep Indicates whether other resources should be cleaned up, that could potentially be shared across different instances.
	     */
	    dispose(): void;
	    /**
	     * Renders the current pass. Before calling renderPass, activatePass needs to be called with the same index.
	     * @param pass The pass used to render the renderable.
	     * @param renderable The IRenderable object to draw.
	     * @param stage The Stage object used for rendering.
	     * @param entityCollector The EntityCollector object that contains the visible scene data.
	     * @param viewProjection The view-projection matrix used to project to the screen. This is not the same as
	     * camera.viewProjection as it includes the scaling factors when rendering to textures.
	     *
	     * @internal
	     */
	    _iRender(renderable: RenderableBase, camera: Camera, viewProjection: Matrix3D): void;
	    /**
	     * The blend mode to use when drawing this renderable. The following blend modes are supported:
	     * <ul>
	     * <li>BlendMode.NORMAL: No blending, unless the material inherently needs it</li>
	     * <li>BlendMode.LAYER: Force blending. This will draw the object the same as NORMAL, but without writing depth writes.</li>
	     * <li>BlendMode.MULTIPLY</li>
	     * <li>BlendMode.ADD</li>
	     * <li>BlendMode.ALPHA</li>
	     * </ul>
	     */
	    setBlendMode(value: string): void;
	    /**
	     * Sets the render state for the pass that is independent of the rendered object. This needs to be called before
	     * calling renderPass. Before activating a pass, the previously used pass needs to be deactivated.
	     * @param stage The Stage object which is currently used for rendering.
	     * @param camera The camera from which the scene is viewed.
	     * @private
	     */
	    _iActivate(camera: Camera): void;
	    /**
	     * Clears the render state for the pass. This needs to be called before activating another pass.
	     * @param stage The Stage used for rendering
	     *
	     * @private
	     */
	    _iDeactivate(): void;
	    /**
	     * Marks the shader program as invalid, so it will be recompiled before the next render.
	     *
	     * @param updateMaterial Indicates whether the invalidation should be performed on the entire material. Should always pass "true" unless it's called from the material itself.
	     */
	    invalidatePass(): void;
	    _iIncludeDependencies(shaderObject: ShaderObjectBase): void;
	    _iInitConstantData(shaderObject: ShaderObjectBase): void;
	    _iGetPreLightingVertexCode(shaderObject: ShaderObjectBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    _iGetPreLightingFragmentCode(shaderObject: ShaderObjectBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    _iGetVertexCode(shaderObject: ShaderObjectBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    _iGetFragmentCode(shaderObject: ShaderObjectBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    _iGetNormalVertexCode(shaderObject: ShaderObjectBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    _iGetNormalFragmentCode(shaderObject: ShaderObjectBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * Indicates whether or not normals are calculated at all.
	     */
	    _pOutputsNormals(shaderObject: ShaderObjectBase): boolean;
	    /**
	     * Indicates whether or not normals are calculated in tangent space.
	     */
	    _pOutputsTangentNormals(shaderObject: ShaderObjectBase): boolean;
	    /**
	     * Indicates whether or not normals are allowed in tangent space. This is only the case if no object-space
	     * dependencies exist.
	     */
	    _pUsesTangentSpace(shaderObject: ShaderObjectBase): boolean;
	}
	export = RenderPassBase;
	
}
declare module "awayjs-renderergl/lib/compilation/RenderObjectBase" {
	import IRenderObject = require("awayjs-display/lib/pool/IRenderObject");
	import IRenderObjectOwner = require("awayjs-display/lib/base/IRenderObjectOwner");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import RenderObjectPool = require("awayjs-renderergl/lib/compilation/RenderObjectPool");
	import RenderPassBase = require("awayjs-renderergl/lib/passes/RenderPassBase");
	import IRenderableClass = require("awayjs-renderergl/lib/pool/IRenderableClass");
	/**
	 *
	 * @class away.pool.ScreenPasses
	 */
	class RenderObjectBase implements IRenderObject {
	    _forceSeparateMVP: boolean;
	    private _pool;
	    _renderObjectOwner: IRenderObjectOwner;
	    _renderableClass: IRenderableClass;
	    _stage: Stage;
	    private _renderOrderId;
	    private _invalidAnimation;
	    private _invalidRenderObject;
	    private _passes;
	    _pRequiresBlending: boolean;
	    private _onPassChangeDelegate;
	    renderObjectId: number;
	    /**
	     * Indicates whether or not the renderable requires alpha blending during rendering.
	     */
	    requiresBlending: boolean;
	    renderOrderId: number;
	    passes: RenderPassBase[];
	    constructor(pool: RenderObjectPool, renderObjectOwner: IRenderObjectOwner, renderableClass: IRenderableClass, stage: Stage);
	    _iIncludeDependencies(shaderObject: ShaderObjectBase): void;
	    /**
	     *
	     */
	    dispose(): void;
	    /**
	     *
	     */
	    invalidateRenderObject(): void;
	    /**
	     *
	     */
	    invalidatePasses(): void;
	    /**
	     *
	     */
	    invalidateAnimation(): void;
	    /**
	     *
	     * @param renderObjectOwner
	     */
	    private _updateAnimation();
	    /**
	     * Performs any processing that needs to occur before any of its passes are used.
	     *
	     * @private
	     */
	    _pUpdateRenderObject(): void;
	    /**
	     * Removes a pass from the renderObjectOwner.
	     * @param pass The pass to be removed.
	     */
	    _pRemoveScreenPass(pass: RenderPassBase): void;
	    /**
	     * Removes all passes from the renderObjectOwner
	     */
	    _pClearScreenPasses(): void;
	    /**
	     * Adds a pass to the renderObjectOwner
	     * @param pass
	     */
	    _pAddScreenPass(pass: RenderPassBase): void;
	    /**
	     * Listener for when a pass's shader code changes. It recalculates the render order id.
	     */
	    private onPassChange(event);
	    /**
	     * test if animation will be able to run on gpu BEFORE compiling materials
	     * test if the shader objects supports animating the animation set in the vertex shader
	     * if any object using this material fails to support accelerated animations for any of the shader objects,
	     * we should do everything on cpu (otherwise we have the cost of both gpu + cpu animations)
	     */
	    private _getEnabledGPUAnimation();
	}
	export = RenderObjectBase;
	
}
declare module "awayjs-renderergl/lib/compilation/IRenderObjectClass" {
	import IRenderObjectOwner = require("awayjs-display/lib/base/IRenderObjectOwner");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import RenderObjectBase = require("awayjs-renderergl/lib/compilation/RenderObjectBase");
	import RenderObjectPool = require("awayjs-renderergl/lib/compilation/RenderObjectPool");
	import IRenderableClass = require("awayjs-renderergl/lib/pool/IRenderableClass");
	/**
	 * IRenderObjectClass is an interface for the constructable class definition RenderObjectBase that is used to
	 * create render objects in the rendering pipeline to render the contents of a partition
	 *
	 * @class away.render.RenderObjectBase
	 */
	interface IRenderObjectClass {
	    /**
	     *
	     */
	    id: string;
	    /**
	     *
	     */
	    new (pool: RenderObjectPool, renderObjectOwner: IRenderObjectOwner, renderableClass: IRenderableClass, stage: Stage): RenderObjectBase;
	}
	export = IRenderObjectClass;
	
}
declare module "awayjs-renderergl/lib/compilation/RenderObjectPool" {
	import IRenderObjectOwner = require("awayjs-display/lib/base/IRenderObjectOwner");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import IRenderObjectClass = require("awayjs-renderergl/lib/compilation/IRenderObjectClass");
	import RenderObjectBase = require("awayjs-renderergl/lib/compilation/RenderObjectBase");
	import IRenderableClass = require("awayjs-renderergl/lib/pool/IRenderableClass");
	/**
	 * @class away.pool.RenderObjectPool
	 */
	class RenderObjectPool {
	    private _renderObjectPool;
	    private _renderObjectClass;
	    private _renderableClass;
	    private _stage;
	    /**
	     * //TODO
	     *
	     * @param renderObjectClass
	     */
	    constructor(renderObjectClass: IRenderObjectClass, renderableClass: IRenderableClass, stage: Stage);
	    /**
	     * //TODO
	     *
	     * @param renderableOwner
	     * @returns IRenderable
	     */
	    getItem(renderObjectOwner: IRenderObjectOwner): RenderObjectBase;
	    /**
	     * //TODO
	     *
	     * @param renderableOwner
	     */
	    disposeItem(renderObjectOwner: IRenderObjectOwner): void;
	}
	export = RenderObjectPool;
	
}
declare module "awayjs-renderergl/lib/utils/ShaderCompilerHelper" {
	import TextureProxyBase = require("awayjs-core/lib/textures/TextureProxyBase");
	import ShaderRegisterData = require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
	class ShaderCompilerHelper {
	    /**
	     * A helper method that generates standard code for sampling from a texture using the normal uv coordinates.
	     * @param vo The MethodVO object linking this method with the pass currently being compiled.
	     * @param sharedReg The shared register object for the shader.
	     * @param inputReg The texture stream register.
	     * @param texture The texture which will be assigned to the given slot.
	     * @param uvReg An optional uv register if coordinates different from the primary uv coordinates are to be used.
	     * @param forceWrap If true, texture wrapping is enabled regardless of the material setting.
	     * @return The fragment code that performs the sampling.
	     *
	     * @protected
	     */
	    static getTex2DSampleCode(targetReg: ShaderRegisterElement, sharedReg: ShaderRegisterData, inputReg: ShaderRegisterElement, texture: TextureProxyBase, smooth: boolean, repeat: boolean, mipmaps: boolean, uvReg?: ShaderRegisterElement, forceWrap?: string): string;
	    /**
	     * A helper method that generates standard code for sampling from a cube texture.
	     * @param vo The MethodVO object linking this method with the pass currently being compiled.
	     * @param targetReg The register in which to store the sampled colour.
	     * @param inputReg The texture stream register.
	     * @param texture The cube map which will be assigned to the given slot.
	     * @param uvReg The direction vector with which to sample the cube map.
	     *
	     * @protected
	     */
	    static getTexCubeSampleCode(targetReg: ShaderRegisterElement, inputReg: ShaderRegisterElement, texture: TextureProxyBase, smooth: boolean, mipmaps: boolean, uvReg: ShaderRegisterElement): string;
	    /**
	     * Generates a texture format string for the sample instruction.
	     * @param texture The texture for which to get the format string.
	     * @return
	     *
	     * @protected
	     */
	    static getFormatStringForTexture(texture: TextureProxyBase): string;
	}
	export = ShaderCompilerHelper;
	
}
declare module "awayjs-renderergl/lib/passes/BasicMaterialPass" {
	import Camera = require("awayjs-display/lib/entities/Camera");
	import IRenderObjectOwner = require("awayjs-display/lib/base/IRenderObjectOwner");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import RenderObjectBase = require("awayjs-renderergl/lib/compilation/RenderObjectBase");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
	import IRenderableClass = require("awayjs-renderergl/lib/pool/IRenderableClass");
	import RenderPassBase = require("awayjs-renderergl/lib/passes/RenderPassBase");
	/**
	 * BasicMaterialPass forms an abstract base class for the default shaded materials provided by Stage,
	 * using material methods to define their appearance.
	 */
	class BasicMaterialPass extends RenderPassBase {
	    private _diffuseR;
	    private _diffuseG;
	    private _diffuseB;
	    private _diffuseA;
	    private _fragmentConstantsIndex;
	    private _texturesIndex;
	    constructor(renderObject: RenderObjectBase, renderObjectOwner: IRenderObjectOwner, renderableClass: IRenderableClass, stage: Stage);
	    _iIncludeDependencies(shaderObject: ShaderObjectBase): void;
	    /**
	     * @inheritDoc
	     */
	    _iGetFragmentCode(shaderObject: ShaderObjectBase, regCache: ShaderRegisterCache, sharedReg: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    _iActivate(camera: Camera): void;
	}
	export = BasicMaterialPass;
	
}
declare module "awayjs-renderergl/lib/compilation/RenderBasicMaterialObject" {
	import BasicMaterial = require("awayjs-display/lib/materials/BasicMaterial");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import RenderObjectBase = require("awayjs-renderergl/lib/compilation/RenderObjectBase");
	import RenderObjectPool = require("awayjs-renderergl/lib/compilation/RenderObjectPool");
	import IRenderableClass = require("awayjs-renderergl/lib/pool/IRenderableClass");
	/**
	 * RenderMaterialObject forms an abstract base class for the default shaded materials provided by Stage,
	 * using material methods to define their appearance.
	 */
	class RenderBasicMaterialObject extends RenderObjectBase {
	    /**
	     *
	     */
	    static id: string;
	    private _material;
	    private _screenPass;
	    constructor(pool: RenderObjectPool, material: BasicMaterial, renderableClass: IRenderableClass, stage: Stage);
	    /**
	     * @inheritDoc
	     */
	    _pUpdateRenderObject(): void;
	}
	export = RenderBasicMaterialObject;
	
}
declare module "awayjs-renderergl/lib/passes/SkyboxPass" {
	import Camera = require("awayjs-display/lib/entities/Camera");
	import Skybox = require("awayjs-display/lib/entities/Skybox");
	import IRenderObjectOwner = require("awayjs-display/lib/base/IRenderObjectOwner");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import RenderPassBase = require("awayjs-renderergl/lib/passes/RenderPassBase");
	import RenderObjectBase = require("awayjs-renderergl/lib/compilation/RenderObjectBase");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
	import IRenderableClass = require("awayjs-renderergl/lib/pool/IRenderableClass");
	/**
	 * SkyboxPass forms an abstract base class for the default shaded materials provided by Stage,
	 * using material methods to define their appearance.
	 */
	class SkyboxPass extends RenderPassBase {
	    _skybox: Skybox;
	    constructor(renderObject: RenderObjectBase, renderObjectOwner: IRenderObjectOwner, renderableClass: IRenderableClass, stage: Stage);
	    /**
	    * @inheritDoc
	    */
	    _iGetFragmentCode(shaderObject: ShaderObjectBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    _iActivate(camera: Camera): void;
	}
	export = SkyboxPass;
	
}
declare module "awayjs-renderergl/lib/compilation/SkyboxRenderObject" {
	import IRenderObjectOwner = require("awayjs-display/lib/base/IRenderObjectOwner");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import RenderObjectBase = require("awayjs-renderergl/lib/compilation/RenderObjectBase");
	import RenderObjectPool = require("awayjs-renderergl/lib/compilation/RenderObjectPool");
	import IRenderableClass = require("awayjs-renderergl/lib/pool/IRenderableClass");
	/**
	 * SkyboxRenderObject forms an abstract base class for the default shaded materials provided by Stage,
	 * using material methods to define their appearance.
	 */
	class SkyboxRenderObject extends RenderObjectBase {
	    /**
	     *
	     */
	    static id: string;
	    private _screenPass;
	    constructor(pool: RenderObjectPool, renderObjectOwner: IRenderObjectOwner, renderableClass: IRenderableClass, stage: Stage);
	    /**
	     * @inheritDoc
	     */
	    _pUpdateRenderObject(): void;
	}
	export = SkyboxRenderObject;
	
}
declare module "awayjs-renderergl/lib/passes/DepthPass" {
	import Camera = require("awayjs-display/lib/entities/Camera");
	import IRenderObjectOwner = require("awayjs-display/lib/base/IRenderObjectOwner");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import RenderObjectBase = require("awayjs-renderergl/lib/compilation/RenderObjectBase");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
	import IRenderableClass = require("awayjs-renderergl/lib/pool/IRenderableClass");
	import RenderPassBase = require("awayjs-renderergl/lib/passes/RenderPassBase");
	/**
	 * DepthRenderObject forms an abstract base class for the default shaded materials provided by Stage,
	 * using material methods to define their appearance.
	 */
	class DepthPass extends RenderPassBase {
	    private _fragmentConstantsIndex;
	    private _texturesIndex;
	    constructor(renderObject: RenderObjectBase, renderObjectOwner: IRenderObjectOwner, renderableClass: IRenderableClass, stage: Stage);
	    _iIncludeDependencies(shaderObject: ShaderObjectBase): void;
	    _iInitConstantData(shaderObject: ShaderObjectBase): void;
	    /**
	     * @inheritDoc
	     */
	    _iGetFragmentCode(shaderObject: ShaderObjectBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    _iActivate(camera: Camera): void;
	}
	export = DepthPass;
	
}
declare module "awayjs-renderergl/lib/compilation/DepthRenderObject" {
	import IRenderObjectOwner = require("awayjs-display/lib/base/IRenderObjectOwner");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import RenderObjectBase = require("awayjs-renderergl/lib/compilation/RenderObjectBase");
	import RenderObjectPool = require("awayjs-renderergl/lib/compilation/RenderObjectPool");
	import IRenderableClass = require("awayjs-renderergl/lib/pool/IRenderableClass");
	/**
	 * DepthRenderObject forms an abstract base class for the default shaded materials provided by Stage,
	 * using material methods to define their appearance.
	 */
	class DepthRenderObject extends RenderObjectBase {
	    /**
	     *
	     */
	    static id: string;
	    constructor(pool: RenderObjectPool, renderObjectOwner: IRenderObjectOwner, renderableClass: IRenderableClass, stage: Stage);
	}
	export = DepthRenderObject;
	
}
declare module "awayjs-renderergl/lib/passes/DistancePass" {
	import IRenderObjectOwner = require("awayjs-display/lib/base/IRenderObjectOwner");
	import Camera = require("awayjs-display/lib/entities/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import RenderObjectBase = require("awayjs-renderergl/lib/compilation/RenderObjectBase");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
	import IRenderableClass = require("awayjs-renderergl/lib/pool/IRenderableClass");
	import RenderPassBase = require("awayjs-renderergl/lib/passes/RenderPassBase");
	/**
	 * DistancePass is a pass that writes distance values to a depth map as a 32-bit value exploded over the 4 texture channels.
	 * This is used to render omnidirectional shadow maps.
	 */
	class DistancePass extends RenderPassBase {
	    private _fragmentConstantsIndex;
	    private _texturesIndex;
	    /**
	     * Creates a new DistancePass object.
	     *
	     * @param material The material to which this pass belongs.
	     */
	    constructor(renderObject: RenderObjectBase, renderObjectOwner: IRenderObjectOwner, renderableClass: IRenderableClass, stage: Stage);
	    /**
	     * Initializes the unchanging constant data for this material.
	     */
	    _iInitConstantData(shaderObject: ShaderObjectBase): void;
	    _iIncludeDependencies(shaderObject: ShaderObjectBase): void;
	    /**
	     * @inheritDoc
	     */
	    _iGetFragmentCode(shaderObject: ShaderObjectBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    _iActivate(camera: Camera): void;
	}
	export = DistancePass;
	
}
declare module "awayjs-renderergl/lib/compilation/DistanceRenderObject" {
	import IRenderObjectOwner = require("awayjs-display/lib/base/IRenderObjectOwner");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import RenderObjectPool = require("awayjs-renderergl/lib/compilation/RenderObjectPool");
	import RenderObjectBase = require("awayjs-renderergl/lib/compilation/RenderObjectBase");
	import IRenderableClass = require("awayjs-renderergl/lib/pool/IRenderableClass");
	/**
	 * DistanceRenderObject is a pass that writes distance values to a depth map as a 32-bit value exploded over the 4 texture channels.
	 * This is used to render omnidirectional shadow maps.
	 */
	class DistanceRenderObject extends RenderObjectBase {
	    /**
	     *
	     */
	    static id: string;
	    /**
	     * Creates a new DistanceRenderObject object.
	     *
	     * @param material The material to which this pass belongs.
	     */
	    constructor(pool: RenderObjectPool, renderObjectOwner: IRenderObjectOwner, renderableClass: IRenderableClass, stage: Stage);
	}
	export = DistanceRenderObject;
	
}
declare module "awayjs-renderergl/lib/pool/RenderablePoolBase" {
	import IRenderObjectOwner = require("awayjs-display/lib/base/IRenderObjectOwner");
	import IRenderableOwner = require("awayjs-display/lib/base/IRenderableOwner");
	import IRenderablePool = require("awayjs-display/lib/pool/IRenderablePool");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import RenderableBase = require("awayjs-renderergl/lib/pool/RenderableBase");
	import IRenderableClass = require("awayjs-renderergl/lib/pool/IRenderableClass");
	import RenderObjectBase = require("awayjs-renderergl/lib/compilation/RenderObjectBase");
	/**
	 * @class away.pool.RenderablePoolBase
	 */
	class RenderablePoolBase implements IRenderablePool {
	    static _pools: Object;
	    _stage: Stage;
	    _renderablePool: Object;
	    _renderableClass: IRenderableClass;
	    private _materialRenderObjectPool;
	    private _skyboxRenderObjectPool;
	    private _depthRenderObjectPool;
	    private _distanceRenderObjectPool;
	    /**
	     * //TODO
	     *
	     * @param renderableClass
	     */
	    constructor(renderableClass: IRenderableClass, stage: Stage);
	    /**
	     * //TODO
	     *
	     * @param renderableOwner
	     * @returns IRenderable
	     */
	    getItem(renderableOwner: IRenderableOwner): RenderableBase;
	    /**
	     *
	     * @param material
	     * @param renderable
	     */
	    getMaterialRenderObject(renderObjectOwner: IRenderObjectOwner): RenderObjectBase;
	    /**
	     *
	     * @param material
	     * @param renderable
	     */
	    getSkyboxRenderObject(renderObjectOwner: IRenderObjectOwner): RenderObjectBase;
	    /**
	     *
	     * @param material
	     * @param renderable
	     */
	    getDepthRenderObject(renderObjectOwner: IRenderObjectOwner): RenderObjectBase;
	    /**
	     *
	     * @param material
	     * @param renderable
	     */
	    getDistanceRenderObject(renderObjectOwner: IRenderObjectOwner): RenderObjectBase;
	    /**
	     * //TODO
	     *
	     * @param renderableOwner
	     */
	    disposeItem(renderableOwner: IRenderableOwner): void;
	    dispose(): void;
	    /**
	     * //TODO
	     *
	     * @param renderableClass
	     * @returns RenderablePoolBase
	     */
	    static getPool(renderableClass: IRenderableClass, stage: Stage): RenderablePoolBase;
	    /**
	     * //TODO
	     *
	     * @param renderableClass
	     */
	    static disposePool(renderableClass: IRenderableClass, stage: Stage): void;
	}
	export = RenderablePoolBase;
	
}
declare module "awayjs-renderergl/lib/pool/RenderableBase" {
	import Matrix3D = require("awayjs-core/lib/geom/Matrix3D");
	import IRenderableOwner = require("awayjs-display/lib/base/IRenderableOwner");
	import IRenderObjectOwner = require("awayjs-display/lib/base/IRenderObjectOwner");
	import SubGeometryBase = require("awayjs-display/lib/base/SubGeometryBase");
	import IRenderable = require("awayjs-display/lib/pool/IRenderable");
	import IEntity = require("awayjs-display/lib/entities/IEntity");
	import Camera = require("awayjs-display/lib/entities/Camera");
	import IndexData = require("awayjs-stagegl/lib/pool/IndexData");
	import VertexData = require("awayjs-stagegl/lib/pool/VertexData");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
	import RenderablePoolBase = require("awayjs-renderergl/lib/pool/RenderablePoolBase");
	import RenderObjectBase = require("awayjs-renderergl/lib/compilation/RenderObjectBase");
	import RenderPassBase = require("awayjs-renderergl/lib/passes/RenderPassBase");
	/**
	 * @class RenderableListItem
	 */
	class RenderableBase implements IRenderable {
	    private _onIndicesUpdatedDelegate;
	    private _onVerticesUpdatedDelegate;
	    private _onRenderObjectOwnerUpdatedDelegate;
	    private _subGeometry;
	    private _geometryDirty;
	    private _indexData;
	    private _indexDataDirty;
	    private _vertexData;
	    _pVertexDataDirty: Object;
	    private _vertexOffset;
	    _level: number;
	    private _indexOffset;
	    private _overflow;
	    private _numTriangles;
	    private _concatenateArrays;
	    JOINT_INDEX_FORMAT: string;
	    JOINT_WEIGHT_FORMAT: string;
	    /**
	     *
	     */
	    _pool: RenderablePoolBase;
	    _stage: Stage;
	    /**
	     *
	     */
	    overflow: RenderableBase;
	    /**
	     *
	     */
	    numTriangles: number;
	    /**
	     *
	     */
	    next: RenderableBase;
	    id: number;
	    /**
	     *
	     */
	    renderObjectId: number;
	    /**
	     *
	     */
	    renderOrderId: number;
	    /**
	     *
	     */
	    zIndex: number;
	    /**
	     *
	     */
	    cascaded: boolean;
	    /**
	     *
	     */
	    renderSceneTransform: Matrix3D;
	    /**
	     *
	     */
	    sourceEntity: IEntity;
	    /**
	     *
	     */
	    renderableOwner: IRenderableOwner;
	    /**
	     *
	     */
	    renderObjectOwner: IRenderObjectOwner;
	    /**
	     *
	     */
	    renderObject: RenderObjectBase;
	    /**
	     *
	     */
	    getIndexData(): IndexData;
	    /**
	     *
	     */
	    getVertexData(dataType: string): VertexData;
	    /**
	     *
	     */
	    getVertexOffset(dataType: string): number;
	    /**
	     *
	     * @param sourceEntity
	     * @param renderableOwner
	     * @param subGeometry
	     * @param animationSubGeometry
	     */
	    constructor(pool: RenderablePoolBase, sourceEntity: IEntity, renderableOwner: IRenderableOwner, renderObjectOwner: IRenderObjectOwner, stage: Stage, level?: number, indexOffset?: number);
	    dispose(): void;
	    invalidateGeometry(): void;
	    /**
	     *
	     */
	    invalidateIndexData(): void;
	    /**
	     * //TODO
	     *
	     * @param dataType
	     */
	    invalidateVertexData(dataType: string): void;
	    _pGetSubGeometry(): SubGeometryBase;
	    static _iGetVertexCode(shaderObject: ShaderObjectBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    static _iGetFragmentCode(shaderObject: ShaderObjectBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * //TODO
	     *
	     * @param subGeometry
	     * @param offset
	     * @internal
	     */
	    _iFillIndexData(indexOffset: number): void;
	    _pGetOverflowRenderable(indexOffset: number): RenderableBase;
	    /**
	     * Sets the render state for the pass that is independent of the rendered object. This needs to be called before
	     * calling renderPass. Before activating a pass, the previously used pass needs to be deactivated.
	     * @param stage The Stage object which is currently used for rendering.
	     * @param camera The camera from which the scene is viewed.
	     * @private
	     */
	    _iActivate(pass: RenderPassBase, camera: Camera): void;
	    /**
	     * Renders an object to the current render target.
	     *
	     * @private
	     */
	    _iRender(pass: RenderPassBase, camera: Camera, viewProjection: Matrix3D): void;
	    /**
	     * Clears the render state for the pass. This needs to be called before activating another pass.
	     * @param stage The Stage used for rendering
	     *
	     * @private
	     */
	    _iDeactivate(pass: RenderPassBase): void;
	    /**
	     * //TODO
	     *
	     * @private
	     */
	    private _updateGeometry();
	    /**
	     * //TODO
	     *
	     * @private
	     */
	    private _updateIndexData();
	    /**
	     * //TODO
	     *
	     * @param dataType
	     * @private
	     */
	    private _updateVertexData(dataType);
	    /**
	     * //TODO
	     *
	     * @param event
	     * @private
	     */
	    private _onIndicesUpdated(event);
	    /**
	     * //TODO
	     *
	     * @param event
	     * @private
	     */
	    private _onVerticesUpdated(event);
	    private _onRenderObjectOwnerUpdated(event);
	}
	export = RenderableBase;
	
}
declare module "awayjs-renderergl/lib/pool/TriangleSubMeshRenderable" {
	import Matrix3D = require("awayjs-core/lib/geom/Matrix3D");
	import TriangleSubMesh = require("awayjs-display/lib/base/TriangleSubMesh");
	import TriangleSubGeometry = require("awayjs-display/lib/base/TriangleSubGeometry");
	import Camera = require("awayjs-display/lib/entities/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
	import RenderableBase = require("awayjs-renderergl/lib/pool/RenderableBase");
	import RenderablePoolBase = require("awayjs-renderergl/lib/pool/RenderablePoolBase");
	import RenderPassBase = require("awayjs-renderergl/lib/passes/RenderPassBase");
	/**
	 * @class away.pool.TriangleSubMeshRenderable
	 */
	class TriangleSubMeshRenderable extends RenderableBase {
	    /**
	     *
	     */
	    static id: string;
	    static vertexAttributesOffset: number;
	    /**
	     *
	     */
	    subMesh: TriangleSubMesh;
	    /**
	     * //TODO
	     *
	     * @param pool
	     * @param subMesh
	     * @param level
	     * @param indexOffset
	     */
	    constructor(pool: RenderablePoolBase, subMesh: TriangleSubMesh, stage: Stage, level?: number, indexOffset?: number);
	    /**
	     *
	     * @returns {SubGeometryBase}
	     * @protected
	     */
	    _pGetSubGeometry(): TriangleSubGeometry;
	    static _iIncludeDependencies(shaderObject: ShaderObjectBase): void;
	    static _iGetVertexCode(shaderObject: ShaderObjectBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    _iRender(pass: RenderPassBase, camera: Camera, viewProjection: Matrix3D): void;
	    /**
	     * //TODO
	     *
	     * @param pool
	     * @param renderableOwner
	     * @param level
	     * @param indexOffset
	     * @returns {away.pool.TriangleSubMeshRenderable}
	     * @protected
	     */
	    _pGetOverflowRenderable(indexOffset: number): RenderableBase;
	}
	export = TriangleSubMeshRenderable;
	
}
declare module "awayjs-renderergl/lib/events/AnimatorEvent" {
	import Event = require("awayjs-core/lib/events/Event");
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	/**
	 * Dispatched to notify changes in an animator's state.
	 */
	class AnimatorEvent extends Event {
	    /**
	     * Defines the value of the type property of a start event object.
	     */
	    static START: string;
	    /**
	     * Defines the value of the type property of a stop event object.
	     */
	    static STOP: string;
	    /**
	     * Defines the value of the type property of a cycle complete event object.
	     */
	    static CYCLE_COMPLETE: string;
	    private _animator;
	    /**
	     * Create a new <code>AnimatorEvent</code> object.
	     *
	     * @param type The event type.
	     * @param animator The animator object that is the subject of this event.
	     */
	    constructor(type: string, animator: AnimatorBase);
	    animator: AnimatorBase;
	    /**
	     * Clones the event.
	     *
	     * @return An exact duplicate of the current event object.
	     */
	    clone(): Event;
	}
	export = AnimatorEvent;
	
}
declare module "awayjs-renderergl/lib/animators/AnimatorBase" {
	import NamedAssetBase = require("awayjs-core/lib/library/NamedAssetBase");
	import IAnimationSet = require("awayjs-display/lib/animators/IAnimationSet");
	import IAnimator = require("awayjs-display/lib/animators/IAnimator");
	import AnimationNodeBase = require("awayjs-display/lib/animators/nodes/AnimationNodeBase");
	import TriangleSubGeometry = require("awayjs-display/lib/base/TriangleSubGeometry");
	import Camera = require("awayjs-display/lib/entities/Camera");
	import Mesh = require("awayjs-display/lib/entities/Mesh");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import IAnimationState = require("awayjs-renderergl/lib/animators/states/IAnimationState");
	import RenderableBase = require("awayjs-renderergl/lib/pool/RenderableBase");
	import TriangleSubMeshRenderable = require("awayjs-renderergl/lib/pool/TriangleSubMeshRenderable");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	/**
	 * Dispatched when playback of an animation inside the animator object starts.
	 *
	 * @eventType away3d.events.AnimatorEvent
	 */
	/**
	 * Dispatched when playback of an animation inside the animator object stops.
	 *
	 * @eventType away3d.events.AnimatorEvent
	 */
	/**
	 * Dispatched when playback of an animation reaches the end of an animation.
	 *
	 * @eventType away3d.events.AnimatorEvent
	 */
	/**
	 * Provides an abstract base class for animator classes that control animation output from a data set subtype of <code>AnimationSetBase</code>.
	 *
	 * @see away.animators.AnimationSetBase
	 */
	class AnimatorBase extends NamedAssetBase implements IAnimator {
	    private _broadcaster;
	    private _isPlaying;
	    private _autoUpdate;
	    private _startEvent;
	    private _stopEvent;
	    private _cycleEvent;
	    private _time;
	    private _playbackSpeed;
	    _pAnimationSet: IAnimationSet;
	    _pOwners: Mesh[];
	    _pActiveNode: AnimationNodeBase;
	    _pActiveState: IAnimationState;
	    _pActiveAnimationName: string;
	    _pAbsoluteTime: number;
	    private _animationStates;
	    /**
	     * Enables translation of the animated mesh from data returned per frame via the positionDelta property of the active animation node. Defaults to true.
	     *
	     * @see away.animators.IAnimationState#positionDelta
	     */
	    updatePosition: boolean;
	    getAnimationState(node: AnimationNodeBase): IAnimationState;
	    getAnimationStateByName(name: string): IAnimationState;
	    /**
	     * Returns the internal absolute time of the animator, calculated by the current time and the playback speed.
	     *
	     * @see #time
	     * @see #playbackSpeed
	     */
	    absoluteTime: number;
	    /**
	     * Returns the animation data set in use by the animator.
	     */
	    animationSet: IAnimationSet;
	    /**
	     * Returns the current active animation state.
	     */
	    activeState: IAnimationState;
	    /**
	     * Returns the current active animation node.
	     */
	    activeAnimation: AnimationNodeBase;
	    /**
	     * Returns the current active animation node.
	     */
	    activeAnimationName: string;
	    /**
	     * Determines whether the animators internal update mechanisms are active. Used in cases
	     * where manual updates are required either via the <code>time</code> property or <code>update()</code> method.
	     * Defaults to true.
	     *
	     * @see #time
	     * @see #update()
	     */
	    autoUpdate: boolean;
	    /**
	     * Gets and sets the internal time clock of the animator.
	     */
	    time: number;
	    /**
	     * Sets the animation phase of the current active state's animation clip(s).
	     *
	     * @param value The phase value to use. 0 represents the beginning of an animation clip, 1 represents the end.
	     */
	    phase(value: number): void;
	    /**
	     * Creates a new <code>AnimatorBase</code> object.
	     *
	     * @param animationSet The animation data set to be used by the animator object.
	     */
	    constructor(animationSet: IAnimationSet);
	    /**
	     * The amount by which passed time should be scaled. Used to slow down or speed up animations. Defaults to 1.
	     */
	    playbackSpeed: number;
	    setRenderState(shaderObject: ShaderObjectBase, renderable: RenderableBase, stage: Stage, camera: Camera, vertexConstantOffset: number, vertexStreamOffset: number): void;
	    /**
	     * Resumes the automatic playback clock controling the active state of the animator.
	     */
	    start(): void;
	    /**
	     * Pauses the automatic playback clock of the animator, in case manual updates are required via the
	     * <code>time</code> property or <code>update()</code> method.
	     *
	     * @see #time
	     * @see #update()
	     */
	    stop(): void;
	    /**
	     * Provides a way to manually update the active state of the animator when automatic
	     * updates are disabled.
	     *
	     * @see #stop()
	     * @see #autoUpdate
	     */
	    update(time: number): void;
	    reset(name: string, offset?: number): void;
	    /**
	     * Used by the mesh object to which the animator is applied, registers the owner for internal use.
	     *
	     * @private
	     */
	    addOwner(mesh: Mesh): void;
	    /**
	     * Used by the mesh object from which the animator is removed, unregisters the owner for internal use.
	     *
	     * @private
	     */
	    removeOwner(mesh: Mesh): void;
	    /**
	     * Internal abstract method called when the time delta property of the animator's contents requires updating.
	     *
	     * @private
	     */
	    _pUpdateDeltaTime(dt: number): void;
	    /**
	     * Enter frame event handler for automatically updating the active state of the animator.
	     */
	    private onEnterFrame(event?);
	    private applyPositionDelta();
	    /**
	     *  for internal use.
	     *
	     * @private
	     */
	    dispatchCycleEvent(): void;
	    /**
	     * @inheritDoc
	     */
	    clone(): AnimatorBase;
	    /**
	     * @inheritDoc
	     */
	    dispose(): void;
	    /**
	     * @inheritDoc
	     */
	    testGPUCompatibility(shaderObject: ShaderObjectBase): void;
	    /**
	     * @inheritDoc
	     */
	    assetType: string;
	    getRenderableSubGeometry(renderable: TriangleSubMeshRenderable, sourceSubGeometry: TriangleSubGeometry): TriangleSubGeometry;
	}
	export = AnimatorBase;
	
}
declare module "awayjs-renderergl/lib/animators/data/AnimationRegisterCache" {
	import Matrix3D = require("awayjs-core/lib/geom/Matrix3D");
	import AnimationNodeBase = require("awayjs-display/lib/animators/nodes/AnimationNodeBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
	import ShaderRegisterElement = require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
	/**
	 * ...
	 */
	class AnimationRegisterCache extends ShaderRegisterCache {
	    positionAttribute: ShaderRegisterElement;
	    uvAttribute: ShaderRegisterElement;
	    positionTarget: ShaderRegisterElement;
	    scaleAndRotateTarget: ShaderRegisterElement;
	    velocityTarget: ShaderRegisterElement;
	    vertexTime: ShaderRegisterElement;
	    vertexLife: ShaderRegisterElement;
	    vertexZeroConst: ShaderRegisterElement;
	    vertexOneConst: ShaderRegisterElement;
	    vertexTwoConst: ShaderRegisterElement;
	    uvTarget: ShaderRegisterElement;
	    colorAddTarget: ShaderRegisterElement;
	    colorMulTarget: ShaderRegisterElement;
	    colorAddVary: ShaderRegisterElement;
	    colorMulVary: ShaderRegisterElement;
	    uvVar: ShaderRegisterElement;
	    rotationRegisters: ShaderRegisterElement[];
	    needFragmentAnimation: boolean;
	    needUVAnimation: boolean;
	    sourceRegisters: string[];
	    targetRegisters: string[];
	    private indexDictionary;
	    hasUVNode: boolean;
	    needVelocity: boolean;
	    hasBillboard: boolean;
	    hasColorMulNode: boolean;
	    hasColorAddNode: boolean;
	    constructor(profile: string);
	    reset(): void;
	    setUVSourceAndTarget(UVAttribute: string, UVVaring: string): void;
	    setRegisterIndex(node: AnimationNodeBase, parameterIndex: number, registerIndex: number): void;
	    getRegisterIndex(node: AnimationNodeBase, parameterIndex: number): number;
	    getInitCode(): string;
	    getCombinationCode(): string;
	    initColorRegisters(): string;
	    getColorPassCode(): string;
	    getColorCombinationCode(shadedTarget: string): string;
	    private getRegisterFromString(code);
	    vertexConstantData: number[];
	    fragmentConstantData: number[];
	    private _numVertexConstant;
	    private _numFragmentConstant;
	    numVertexConstant: number;
	    numFragmentConstant: number;
	    setDataLength(): void;
	    setVertexConst(index: number, x?: number, y?: number, z?: number, w?: number): void;
	    setVertexConstFromArray(index: number, data: number[]): void;
	    setVertexConstFromMatrix(index: number, matrix: Matrix3D): void;
	    setFragmentConst(index: number, x?: number, y?: number, z?: number, w?: number): void;
	}
	export = AnimationRegisterCache;
	
}
declare module "awayjs-renderergl/lib/compilation/ShaderCompilerBase" {
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
	import IRenderPassBase = require("awayjs-renderergl/lib/passes/IRenderPassBase");
	import IRenderableClass = require("awayjs-renderergl/lib/pool/IRenderableClass");
	/**
	 * ShaderCompilerBase is an abstract base class for shader compilers that use modular shader methods to assemble a
	 * material. Concrete subclasses are used by the default materials.
	 *
	 * @see away.materials.ShadingMethodBase
	 */
	class ShaderCompilerBase {
	    _pShaderObject: ShaderObjectBase;
	    _pSharedRegisters: ShaderRegisterData;
	    _pRegisterCache: ShaderRegisterCache;
	    _pRenderableClass: IRenderableClass;
	    _pRenderPass: IRenderPassBase;
	    _pVertexCode: string;
	    _pFragmentCode: string;
	    _pPostAnimationFragmentCode: string;
	    _pAnimatableAttributes: string[];
	    _pAnimationTargetRegisters: string[];
	    private _uvTarget;
	    private _uvSource;
	    /**
	     * Creates a new ShaderCompilerBase object.
	     * @param profile The compatibility profile of the renderer.
	     */
	    constructor(renderableClass: IRenderableClass, renderPass: IRenderPassBase, shaderObject: ShaderObjectBase);
	    /**
	     * Compiles the code after all setup on the compiler has finished.
	     */
	    compile(): void;
	    pIncludeDependencies(): void;
	    /**
	     * Compile the code for the methods.
	     */
	    pCompileDependencies(): void;
	    private compileGlobalPositionCode();
	    /**
	     * Calculate the (possibly animated) UV coordinates.
	     */
	    private compileUVCode();
	    /**
	     * Provide the secondary UV coordinates.
	     */
	    private compileSecondaryUVCode();
	    /**
	     * Calculate the view direction.
	     */
	    compileViewDirCode(): void;
	    /**
	     * Calculate the normal.
	     */
	    compileNormalCode(): void;
	    /**
	     * Reset all the indices to "unused".
	     */
	    pInitRegisterIndices(): void;
	    /**
	     * Disposes all resources used by the compiler.
	     */
	    dispose(): void;
	    /**
	     * The generated vertex code.
	     */
	    vertexCode: string;
	    /**
	     * The generated fragment code.
	     */
	    fragmentCode: string;
	    /**
	     * The generated fragment code.
	     */
	    postAnimationFragmentCode: string;
	    /**
	     * The register name containing the final shaded colour.
	     */
	    shadedTarget: string;
	}
	export = ShaderCompilerBase;
	
}
declare module "awayjs-renderergl/lib/compilation/ShaderObjectBase" {
	import Matrix3D = require("awayjs-core/lib/geom/Matrix3D");
	import Texture2DBase = require("awayjs-core/lib/textures/Texture2DBase");
	import Camera = require("awayjs-display/lib/entities/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ProgramData = require("awayjs-stagegl/lib/pool/ProgramData");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import RenderableBase = require("awayjs-renderergl/lib/pool/RenderableBase");
	import IRenderPassBase = require("awayjs-renderergl/lib/passes/IRenderPassBase");
	import ShaderCompilerBase = require("awayjs-renderergl/lib/compilation/ShaderCompilerBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
	import IRenderableClass = require("awayjs-renderergl/lib/pool/IRenderableClass");
	/**
	 * ShaderObjectBase keeps track of the number of dependencies for "named registers" used across a pass.
	 * Named registers are that are not necessarily limited to a single method. They are created by the compiler and
	 * passed on to methods. The compiler uses the results to reserve usages through RegisterPool, which can be removed
	 * each time a method has been compiled into the shader.
	 *
	 * @see RegisterPool.addUsage
	 */
	class ShaderObjectBase {
	    private _renderableClass;
	    private _renderPass;
	    _stage: Stage;
	    private _programData;
	    private _invalidShader;
	    private _invalidProgram;
	    private _animationVertexCode;
	    private _animationFragmentCode;
	    programData: ProgramData;
	    profile: string;
	    usesAnimation: boolean;
	    private _defaultCulling;
	    _pInverseSceneMatrix: number[];
	    animationRegisterCache: AnimationRegisterCache;
	    /**
	     * The amount of used vertex constants in the vertex code. Used by the animation code generation to know from which index on registers are available.
	     */
	    numUsedVertexConstants: number;
	    /**
	     * The amount of used fragment constants in the fragment code. Used by the animation code generation to know from which index on registers are available.
	     */
	    numUsedFragmentConstants: number;
	    /**
	     * The amount of used vertex streams in the vertex code. Used by the animation code generation to know from which index on streams are available.
	     */
	    numUsedStreams: number;
	    /**
	     *
	     */
	    numUsedTextures: number;
	    /**
	     *
	     */
	    numUsedVaryings: number;
	    animatableAttributes: string[];
	    animationTargetRegisters: string[];
	    uvSource: string;
	    uvTarget: string;
	    useAlphaPremultiplied: boolean;
	    useBothSides: boolean;
	    useMipmapping: boolean;
	    useSmoothTextures: boolean;
	    repeatTextures: boolean;
	    usesUVTransform: boolean;
	    alphaThreshold: number;
	    texture: Texture2DBase;
	    color: number;
	    ambientR: number;
	    ambientG: number;
	    ambientB: number;
	    /**
	     * Indicates whether the pass requires any fragment animation code.
	     */
	    usesFragmentAnimation: boolean;
	    /**
	     * The amount of dependencies on the projected position.
	     */
	    projectionDependencies: number;
	    /**
	     * The amount of dependencies on the normal vector.
	     */
	    normalDependencies: number;
	    /**
	     * The amount of dependencies on the vertex color.
	     */
	    colorDependencies: number;
	    /**
	     * The amount of dependencies on the view direction.
	     */
	    viewDirDependencies: number;
	    /**
	     * The amount of dependencies on the primary UV coordinates.
	     */
	    uvDependencies: number;
	    /**
	     * The amount of dependencies on the secondary UV coordinates.
	     */
	    secondaryUVDependencies: number;
	    /**
	     * The amount of dependencies on the local position. This can be 0 while hasGlobalPosDependencies is true when
	     * the global position is used as a temporary value (fe to calculate the view direction)
	     */
	    localPosDependencies: number;
	    /**
	     * The amount of dependencies on the global position. This can be 0 while hasGlobalPosDependencies is true when
	     * the global position is used as a temporary value (fe to calculate the view direction)
	     */
	    globalPosDependencies: number;
	    /**
	     * The amount of tangent vector dependencies (fragment shader).
	     */
	    tangentDependencies: number;
	    /**
	     *
	     */
	    outputsNormals: boolean;
	    /**
	     *
	     */
	    outputsColors: boolean;
	    /**
	     * Indicates whether or not normal calculations are expected in tangent space. This is only the case if no world-space
	     * dependencies exist.
	     */
	    usesTangentSpace: boolean;
	    /**
	     * Indicates whether or not normal calculations are output in tangent space.
	     */
	    outputsTangentNormals: boolean;
	    /**
	     * Indicates whether there are any dependencies on the world-space position vector.
	     */
	    usesGlobalPosFragment: boolean;
	    vertexConstantData: number[];
	    fragmentConstantData: number[];
	    /**
	     * The index for the common data register.
	     */
	    commonsDataIndex: number;
	    /**
	     * The index for the UV vertex attribute stream.
	     */
	    uvBufferIndex: number;
	    /**
	     * The index for the secondary UV vertex attribute stream.
	     */
	    secondaryUVBufferIndex: number;
	    /**
	     * The index for the vertex normal attribute stream.
	     */
	    normalBufferIndex: number;
	    /**
	     * The index for the color attribute stream.
	     */
	    colorBufferIndex: number;
	    /**
	     * The index for the vertex tangent attribute stream.
	     */
	    tangentBufferIndex: number;
	    /**
	     * The index of the vertex constant containing the view matrix.
	     */
	    viewMatrixIndex: number;
	    /**
	     * The index of the vertex constant containing the scene matrix.
	     */
	    sceneMatrixIndex: number;
	    /**
	     * The index of the vertex constant containing the uniform scene matrix (the inverse transpose).
	     */
	    sceneNormalMatrixIndex: number;
	    /**
	     * The index of the vertex constant containing the camera position.
	     */
	    cameraPositionIndex: number;
	    /**
	     * The index for the UV transformation matrix vertex constant.
	     */
	    uvTransformIndex: number;
	    /**
	     * Creates a new MethodCompilerVO object.
	     */
	    constructor(renderableClass: IRenderableClass, renderPass: IRenderPassBase, stage: Stage);
	    _iIncludeDependencies(): void;
	    /**
	     * Factory method to create a concrete compiler object for this object
	     *
	     * @param renderableClass
	     * @param renderPass
	     * @param stage
	     * @returns {ShaderCompilerBase}
	     */
	    createCompiler(renderableClass: IRenderableClass, renderPass: IRenderPassBase): ShaderCompilerBase;
	    /**
	     * Clears dependency counts for all registers. Called when recompiling a pass.
	     */
	    reset(): void;
	    pInitRegisterIndices(): void;
	    /**
	     * Initializes the unchanging constant data for this shader object.
	     */
	    initConstantData(registerCache: ShaderRegisterCache, animatableAttributes: string[], animationTargetRegisters: string[], uvSource: string, uvTarget: string): void;
	    /**
	     * @inheritDoc
	     */
	    _iActivate(camera: Camera): void;
	    /**
	     * @inheritDoc
	     */
	    _iDeactivate(): void;
	    /**
	     *
	     *
	     * @param renderable
	     * @param stage
	     * @param camera
	     */
	    _iRender(renderable: RenderableBase, camera: Camera, viewProjection: Matrix3D): void;
	    invalidateProgram(): void;
	    invalidateShader(): void;
	    dispose(): void;
	    private _updateProgram();
	    private _calcAnimationCode(shadedTarget);
	}
	export = ShaderObjectBase;
	
}
declare module "awayjs-renderergl/lib/animators/AnimationSetBase" {
	import IAsset = require("awayjs-core/lib/library/IAsset");
	import NamedAssetBase = require("awayjs-core/lib/library/NamedAssetBase");
	import AnimationNodeBase = require("awayjs-display/lib/animators/nodes/AnimationNodeBase");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	/**
	 * Provides an abstract base class for data set classes that hold animation data for use in animator classes.
	 *
	 * @see away.animators.AnimatorBase
	 */
	class AnimationSetBase extends NamedAssetBase implements IAsset {
	    private _usesCPU;
	    private _animations;
	    private _animationNames;
	    private _animationDictionary;
	    constructor();
	    /**
	     * Retrieves a temporary GPU register that's still free.
	     *
	     * @param exclude An array of non-free temporary registers.
	     * @param excludeAnother An additional register that's not free.
	     * @return A temporary register that can be used.
	     */
	    _pFindTempReg(exclude: string[], excludeAnother?: string): string;
	    /**
	     * Indicates whether the properties of the animation data contained within the set combined with
	     * the vertex registers already in use on shading materials allows the animation data to utilise
	     * GPU calls.
	     */
	    usesCPU: boolean;
	    /**
	     * Called by the material to reset the GPU indicator before testing whether register space in the shader
	     * is available for running GPU-based animation code.
	     *
	     * @private
	     */
	    resetGPUCompatibility(): void;
	    cancelGPUCompatibility(): void;
	    /**
	     * @inheritDoc
	     */
	    getAGALVertexCode(shaderObject: ShaderObjectBase): string;
	    /**
	     * @inheritDoc
	     */
	    activate(shaderObject: ShaderObjectBase, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    deactivate(shaderObject: ShaderObjectBase, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    getAGALFragmentCode(shaderObject: ShaderObjectBase, shadedTarget: string): string;
	    /**
	     * @inheritDoc
	     */
	    getAGALUVCode(shaderObject: ShaderObjectBase): string;
	    /**
	     * @inheritDoc
	     */
	    doneAGALCode(shaderObject: ShaderObjectBase): void;
	    /**
	     * @inheritDoc
	     */
	    assetType: string;
	    /**
	     * Returns a vector of animation state objects that make up the contents of the animation data set.
	     */
	    animations: AnimationNodeBase[];
	    /**
	     * Returns a vector of animation state objects that make up the contents of the animation data set.
	     */
	    animationNames: string[];
	    /**
	     * Check to determine whether a state is registered in the animation set under the given name.
	     *
	     * @param stateName The name of the animation state object to be checked.
	     */
	    hasAnimation(name: string): boolean;
	    /**
	     * Retrieves the animation state object registered in the animation data set under the given name.
	     *
	     * @param stateName The name of the animation state object to be retrieved.
	     */
	    getAnimation(name: string): AnimationNodeBase;
	    /**
	     * Adds an animation state object to the aniamtion data set under the given name.
	     *
	     * @param stateName The name under which the animation state object will be stored.
	     * @param animationState The animation state object to be staored in the set.
	     */
	    addAnimation(node: AnimationNodeBase): void;
	    /**
	     * Cleans up any resources used by the current object.
	     */
	    dispose(): void;
	}
	export = AnimationSetBase;
	
}
declare module "awayjs-renderergl/lib/pool/BillboardRenderable" {
	import Matrix3D = require("awayjs-core/lib/geom/Matrix3D");
	import SubGeometryBase = require("awayjs-display/lib/base/SubGeometryBase");
	import Billboard = require("awayjs-display/lib/entities/Billboard");
	import Camera = require("awayjs-display/lib/entities/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
	import RenderableBase = require("awayjs-renderergl/lib/pool/RenderableBase");
	import RenderablePoolBase = require("awayjs-renderergl/lib/pool/RenderablePoolBase");
	import RenderPassBase = require("awayjs-renderergl/lib/passes/RenderPassBase");
	/**
	 * @class away.pool.RenderableListItem
	 */
	class BillboardRenderable extends RenderableBase {
	    private static _materialGeometry;
	    /**
	     *
	     */
	    static id: string;
	    static vertexAttributesOffset: number;
	    /**
	     *
	     */
	    private _billboard;
	    /**
	     * //TODO
	     *
	     * @param pool
	     * @param billboard
	     */
	    constructor(pool: RenderablePoolBase, billboard: Billboard, stage: Stage);
	    /**
	     * //TODO
	     *
	     * @returns {away.base.TriangleSubGeometry}
	     */
	    _pGetSubGeometry(): SubGeometryBase;
	    static _iIncludeDependencies(shaderObject: ShaderObjectBase): void;
	    static _iGetVertexCode(shaderObject: ShaderObjectBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    _iActivate(pass: RenderPassBase, camera: Camera): void;
	    /**
	     * @inheritDoc
	     */
	    _iRender(pass: RenderPassBase, camera: Camera, viewProjection: Matrix3D): void;
	}
	export = BillboardRenderable;
	
}
declare module "awayjs-renderergl/lib/pool/LineSegmentRenderable" {
	import Matrix3D = require("awayjs-core/lib/geom/Matrix3D");
	import LineSubGeometry = require("awayjs-display/lib/base/LineSubGeometry");
	import Camera = require("awayjs-display/lib/entities/Camera");
	import LineSegment = require("awayjs-display/lib/entities/LineSegment");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
	import RenderableBase = require("awayjs-renderergl/lib/pool/RenderableBase");
	import RenderablePoolBase = require("awayjs-renderergl/lib/pool/RenderablePoolBase");
	import RenderPassBase = require("awayjs-renderergl/lib/passes/RenderPassBase");
	/**
	 * @class away.pool.LineSubMeshRenderable
	 */
	class LineSegmentRenderable extends RenderableBase {
	    private static _lineGeometry;
	    static pONE_VECTOR: number[];
	    static pFRONT_VECTOR: number[];
	    private _constants;
	    private _calcMatrix;
	    private _thickness;
	    /**
	     *
	     */
	    static id: string;
	    static vertexAttributesOffset: number;
	    /**
	     *
	     */
	    private _lineSegment;
	    /**
	     * //TODO
	     *
	     * @param pool
	     * @param subMesh
	     * @param level
	     * @param dataOffset
	     */
	    constructor(pool: RenderablePoolBase, lineSegment: LineSegment, stage: Stage, level?: number, indexOffset?: number);
	    /**
	     * //TODO
	     *
	     * @returns {base.LineSubGeometry}
	     * @protected
	     */
	    _pGetSubGeometry(): LineSubGeometry;
	    static _iIncludeDependencies(shaderObject: ShaderObjectBase): void;
	    /**
	     * @inheritDoc
	     */
	    static _iGetVertexCode(shader: ShaderObjectBase, regCache: ShaderRegisterCache, sharedReg: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    _iActivate(pass: RenderPassBase, camera: Camera): void;
	    /**
	     * @inheritDoc
	     */
	    _iRender(pass: RenderPassBase, camera: Camera, viewProjection: Matrix3D): void;
	    /**
	     * //TODO
	     *
	     * @param pool
	     * @param renderableOwner
	     * @param level
	     * @param indexOffset
	     * @returns {away.pool.LineSubMeshRenderable}
	     * @private
	     */
	    _pGetOverflowRenderable(indexOffset: number): RenderableBase;
	}
	export = LineSegmentRenderable;
	
}
declare module "awayjs-renderergl/lib/pool/LineSubMeshRenderable" {
	import Matrix3D = require("awayjs-core/lib/geom/Matrix3D");
	import LineSubMesh = require("awayjs-display/lib/base/LineSubMesh");
	import LineSubGeometry = require("awayjs-display/lib/base/LineSubGeometry");
	import Camera = require("awayjs-display/lib/entities/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
	import RenderableBase = require("awayjs-renderergl/lib/pool/RenderableBase");
	import RenderablePoolBase = require("awayjs-renderergl/lib/pool/RenderablePoolBase");
	import RenderPassBase = require("awayjs-renderergl/lib/passes/RenderPassBase");
	/**
	 * @class away.pool.LineSubMeshRenderable
	 */
	class LineSubMeshRenderable extends RenderableBase {
	    static pONE_VECTOR: number[];
	    static pFRONT_VECTOR: number[];
	    private _constants;
	    private _calcMatrix;
	    private _thickness;
	    /**
	     *
	     */
	    static id: string;
	    static vertexAttributesOffset: number;
	    /**
	     *
	     */
	    subMesh: LineSubMesh;
	    /**
	     * //TODO
	     *
	     * @param pool
	     * @param subMesh
	     * @param level
	     * @param dataOffset
	     */
	    constructor(pool: RenderablePoolBase, subMesh: LineSubMesh, stage: Stage, level?: number, indexOffset?: number);
	    /**
	     * //TODO
	     *
	     * @returns {base.LineSubGeometry}
	     * @protected
	     */
	    _pGetSubGeometry(): LineSubGeometry;
	    static _iIncludeDependencies(shaderObject: ShaderObjectBase): void;
	    /**
	     * @inheritDoc
	     */
	    static _iGetVertexCode(shader: ShaderObjectBase, regCache: ShaderRegisterCache, sharedReg: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    _iActivate(pass: RenderPassBase, camera: Camera): void;
	    /**
	     * @inheritDoc
	     */
	    _iRender(pass: RenderPassBase, camera: Camera, viewProjection: Matrix3D): void;
	    /**
	     * //TODO
	     *
	     * @param pool
	     * @param renderableOwner
	     * @param level
	     * @param indexOffset
	     * @returns {away.pool.LineSubMeshRenderable}
	     * @private
	     */
	    _pGetOverflowRenderable(indexOffset: number): RenderableBase;
	}
	export = LineSubMeshRenderable;
	
}
declare module "awayjs-renderergl/lib/pool/RendererPoolBase" {
	import LineSubMesh = require("awayjs-display/lib/base/LineSubMesh");
	import TriangleSubMesh = require("awayjs-display/lib/base/TriangleSubMesh");
	import IRendererPool = require("awayjs-display/lib/pool/IRendererPool");
	import Billboard = require("awayjs-display/lib/entities/Billboard");
	import LineSegment = require("awayjs-display/lib/entities/LineSegment");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import RenderablePoolBase = require("awayjs-renderergl/lib/pool/RenderablePoolBase");
	import RendererBase = require("awayjs-renderergl/lib/base/RendererBase");
	/**
	 * RendererPoolBase forms an abstract base class for classes that are used in the rendering pipeline to render the
	 * contents of a partition
	 *
	 * @class away.render.RendererPoolBase
	 */
	class RendererPoolBase implements IRendererPool {
	    _billboardRenderablePool: RenderablePoolBase;
	    _lineSegmentRenderablePool: RenderablePoolBase;
	    _triangleSubMeshRenderablePool: RenderablePoolBase;
	    _lineSubMeshRenderablePool: RenderablePoolBase;
	    _pStage: Stage;
	    private _renderer;
	    /**
	     * Creates a new RendererPoolBase object.
	     */
	    constructor(renderer: RendererBase);
	    /**
	     * The Stage that will provide the ContextGL used for rendering.
	     */
	    stage: Stage;
	    _pUpdatePool(): void;
	    /**
	     * Disposes the resources used by the RendererPoolBase.
	     */
	    dispose(): void;
	    /**
	     *
	     * @param billboard
	     * @protected
	     */
	    applyBillboard(billboard: Billboard): void;
	    /**
	     *
	     * @param lineSubMesh
	     */
	    applyLineSegment(lineSegment: LineSegment): void;
	    /**
	     *
	     * @param triangleSubMesh
	     */
	    applyTriangleSubMesh(triangleSubMesh: TriangleSubMesh): void;
	    /**
	     *
	     * @param lineSubMesh
	     */
	    applyLineSubMesh(lineSubMesh: LineSubMesh): void;
	}
	export = RendererPoolBase;
	
}
declare module "awayjs-renderergl/lib/pool/IRendererPoolClass" {
	import RendererPoolBase = require("awayjs-renderergl/lib/pool/RendererPoolBase");
	import RendererBase = require("awayjs-renderergl/lib/base/RendererBase");
	/**
	 * IRendererPoolClass is an interface for the constructable class definition IRenderable that is used to
	 * create renderable objects in the rendering pipeline to render the contents of a partition
	 *
	 * @class away.render.IRendererPoolClass
	 */
	interface IRendererPoolClass {
	    /**
	     *
	     */
	    new (renderer: RendererBase): RendererPoolBase;
	}
	export = IRendererPoolClass;
	
}
declare module "awayjs-renderergl/lib/managers/RTTBufferManager" {
	import Rectangle = require("awayjs-core/lib/geom/Rectangle");
	import EventDispatcher = require("awayjs-core/lib/events/EventDispatcher");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import IIndexBuffer = require("awayjs-stagegl/lib/base/IIndexBuffer");
	import IVertexBuffer = require("awayjs-stagegl/lib/base/IVertexBuffer");
	class RTTBufferManager extends EventDispatcher {
	    private static _instances;
	    private _renderToTextureVertexBuffer;
	    private _renderToScreenVertexBuffer;
	    private _indexBuffer;
	    private _stage;
	    private _viewWidth;
	    private _viewHeight;
	    private _textureWidth;
	    private _textureHeight;
	    private _renderToTextureRect;
	    private _buffersInvalid;
	    private _textureRatioX;
	    private _textureRatioY;
	    constructor(stage: Stage);
	    static getInstance(stage: Stage): RTTBufferManager;
	    private static getRTTBufferManagerFromStage(stage);
	    private static deleteRTTBufferManager(stage);
	    textureRatioX: number;
	    textureRatioY: number;
	    viewWidth: number;
	    viewHeight: number;
	    renderToTextureVertexBuffer: IVertexBuffer;
	    renderToScreenVertexBuffer: IVertexBuffer;
	    indexBuffer: IIndexBuffer;
	    renderToTextureRect: Rectangle;
	    textureWidth: number;
	    textureHeight: number;
	    dispose(): void;
	    private updateRTTBuffers();
	}
	export = RTTBufferManager;
	
}
declare module "awayjs-renderergl/lib/base/RendererBase" {
	import BitmapData = require("awayjs-core/lib/base/BitmapData");
	import Matrix3D = require("awayjs-core/lib/geom/Matrix3D");
	import Rectangle = require("awayjs-core/lib/geom/Rectangle");
	import Vector3D = require("awayjs-core/lib/geom/Vector3D");
	import EventDispatcher = require("awayjs-core/lib/events/EventDispatcher");
	import TextureProxyBase = require("awayjs-core/lib/textures/TextureProxyBase");
	import IRenderObjectOwner = require("awayjs-display/lib/base/IRenderObjectOwner");
	import IEntitySorter = require("awayjs-display/lib/sort/IEntitySorter");
	import Camera = require("awayjs-display/lib/entities/Camera");
	import StageEvent = require("awayjs-display/lib/events/StageEvent");
	import CollectorBase = require("awayjs-display/lib/traverse/CollectorBase");
	import ShadowCasterCollector = require("awayjs-display/lib/traverse/ShadowCasterCollector");
	import IContextGL = require("awayjs-stagegl/lib/base/IContextGL");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import RenderObjectBase = require("awayjs-renderergl/lib/compilation/RenderObjectBase");
	import RenderableBase = require("awayjs-renderergl/lib/pool/RenderableBase");
	import IRendererPoolClass = require("awayjs-renderergl/lib/pool/IRendererPoolClass");
	import RTTBufferManager = require("awayjs-renderergl/lib/managers/RTTBufferManager");
	import RenderPassBase = require("awayjs-renderergl/lib/passes/RenderPassBase");
	/**
	 * RendererBase forms an abstract base class for classes that are used in the rendering pipeline to render the
	 * contents of a partition
	 *
	 * @class away.render.RendererBase
	 */
	class RendererBase extends EventDispatcher {
	    private _numUsedStreams;
	    private _numUsedTextures;
	    private _rendererPool;
	    _pRendererPoolClass: IRendererPoolClass;
	    _pContext: IContextGL;
	    _pStage: Stage;
	    _pCamera: Camera;
	    _iEntryPoint: Vector3D;
	    _pCameraForward: Vector3D;
	    _pRttBufferManager: RTTBufferManager;
	    private _viewPort;
	    private _viewportDirty;
	    private _scissorDirty;
	    _pBackBufferInvalid: boolean;
	    _pDepthTextureInvalid: boolean;
	    _depthPrepass: boolean;
	    private _backgroundR;
	    private _backgroundG;
	    private _backgroundB;
	    private _backgroundAlpha;
	    _shareContext: boolean;
	    _width: number;
	    _height: number;
	    textureRatioX: number;
	    textureRatioY: number;
	    private _snapshotBitmapData;
	    private _snapshotRequired;
	    _pRttViewProjectionMatrix: Matrix3D;
	    private _localPos;
	    private _globalPos;
	    _pScissorRect: Rectangle;
	    private _scissorUpdated;
	    private _viewPortUpdated;
	    private _onContextUpdateDelegate;
	    private _onViewportUpdatedDelegate;
	    _pNumTriangles: number;
	    _pOpaqueRenderableHead: RenderableBase;
	    _pBlendedRenderableHead: RenderableBase;
	    _disableColor: boolean;
	    _renderBlended: boolean;
	    renderBlended: boolean;
	    disableColor: boolean;
	    /**
	     *
	     */
	    numTriangles: number;
	    /**
	     *
	     */
	    renderableSorter: IEntitySorter;
	    /**
	     * A viewPort rectangle equivalent of the Stage size and position.
	     */
	    viewPort: Rectangle;
	    /**
	     * A scissor rectangle equivalent of the view size and position.
	     */
	    scissorRect: Rectangle;
	    /**
	     *
	     */
	    x: number;
	    /**
	     *
	     */
	    y: number;
	    /**
	     *
	     */
	    width: number;
	    /**
	     *
	     */
	    height: number;
	    /**
	     * Creates a new RendererBase object.
	     */
	    constructor(rendererPoolClass?: IRendererPoolClass, stage?: Stage);
	    activatePass(renderable: RenderableBase, pass: RenderPassBase, camera: Camera): void;
	    deactivatePass(renderable: RenderableBase, pass: RenderPassBase): void;
	    _iCreateEntityCollector(): CollectorBase;
	    /**
	     * The background color's red component, used when clearing.
	     *
	     * @private
	     */
	    _iBackgroundR: number;
	    /**
	     * The background color's green component, used when clearing.
	     *
	     * @private
	     */
	    _iBackgroundG: number;
	    /**
	     * The background color's blue component, used when clearing.
	     *
	     * @private
	     */
	    _iBackgroundB: number;
	    context: IContextGL;
	    /**
	     * The Stage that will provide the ContextGL used for rendering.
	     */
	    stage: Stage;
	    iSetStage(value: Stage): void;
	    /**
	     * Defers control of ContextGL clear() and present() calls to Stage, enabling multiple Stage frameworks
	     * to share the same ContextGL object.
	     */
	    shareContext: boolean;
	    /**
	     * Disposes the resources used by the RendererBase.
	     */
	    dispose(): void;
	    render(entityCollector: CollectorBase): void;
	    /**
	     * Renders the potentially visible geometry to the back buffer or texture.
	     * @param entityCollector The EntityCollector object containing the potentially visible geometry.
	     * @param target An option target texture to render to.
	     * @param surfaceSelector The index of a CubeTexture's face to render to.
	     * @param additionalClearMask Additional clear mask information, in case extra clear channels are to be omitted.
	     */
	    _iRender(entityCollector: CollectorBase, target?: TextureProxyBase, scissorRect?: Rectangle, surfaceSelector?: number): void;
	    _iRenderCascades(entityCollector: ShadowCasterCollector, target: TextureProxyBase, numCascades: number, scissorRects: Rectangle[], cameras: Camera[]): void;
	    pCollectRenderables(entityCollector: CollectorBase): void;
	    /**
	     * Renders the potentially visible geometry to the back buffer or texture. Only executed if everything is set up.
	     *
	     * @param entityCollector The EntityCollector object containing the potentially visible geometry.
	     * @param target An option target texture to render to.
	     * @param surfaceSelector The index of a CubeTexture's face to render to.
	     * @param additionalClearMask Additional clear mask information, in case extra clear channels are to be omitted.
	     */
	    pExecuteRender(entityCollector: CollectorBase, target?: TextureProxyBase, scissorRect?: Rectangle, surfaceSelector?: number): void;
	    queueSnapshot(bmd: BitmapData): void;
	    /**
	     * Performs the actual drawing of geometry to the target.
	     * @param entityCollector The EntityCollector object containing the potentially visible geometry.
	     */
	    pDraw(entityCollector: CollectorBase): void;
	    /**
	     * Draw a list of renderables.
	     *
	     * @param renderables The renderables to draw.
	     * @param entityCollector The EntityCollector containing all potentially visible information.
	     */
	    drawRenderables(renderable: RenderableBase, entityCollector: CollectorBase): void;
	    /**
	     * Assign the context once retrieved
	     */
	    private onContextUpdate(event);
	    _iBackgroundAlpha: number;
	    /**
	     * @private
	     */
	    private notifyScissorUpdate();
	    /**
	     * @private
	     */
	    private notifyViewportUpdate();
	    /**
	     *
	     */
	    onViewportUpdated(event: StageEvent): void;
	    /**
	     *
	     */
	    updateGlobalPos(): void;
	    /**
	     *
	     * @param renderable
	     * @protected
	     */
	    applyRenderable(renderable: RenderableBase): void;
	    _pGetRenderObject(renderable: RenderableBase, renderObjectOwner: IRenderObjectOwner): RenderObjectBase;
	}
	export = RendererBase;
	
}
declare module "awayjs-renderergl/lib/DepthRenderer" {
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import IRenderObjectOwner = require("awayjs-display/lib/base/IRenderObjectOwner");
	import RendererBase = require("awayjs-renderergl/lib/base/RendererBase");
	import RenderObjectBase = require("awayjs-renderergl/lib/compilation/RenderObjectBase");
	import RenderableBase = require("awayjs-renderergl/lib/pool/RenderableBase");
	import IRendererPoolClass = require("awayjs-renderergl/lib/pool/IRendererPoolClass");
	/**
	 * The DepthRenderer class renders 32-bit depth information encoded as RGBA
	 *
	 * @class away.render.DepthRenderer
	 */
	class DepthRenderer extends RendererBase {
	    /**
	     * Creates a new DepthRenderer object.
	     * @param renderBlended Indicates whether semi-transparent objects should be rendered.
	     * @param distanceBased Indicates whether the written depth value is distance-based or projected depth-based
	     */
	    constructor(rendererPoolClass?: IRendererPoolClass, stage?: Stage);
	    _pGetRenderObject(renderable: RenderableBase, renderObjectOwner: IRenderObjectOwner): RenderObjectBase;
	}
	export = DepthRenderer;
	
}
declare module "awayjs-renderergl/lib/DistanceRenderer" {
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import IRenderObjectOwner = require("awayjs-display/lib/base/IRenderObjectOwner");
	import RendererBase = require("awayjs-renderergl/lib/base/RendererBase");
	import RenderObjectBase = require("awayjs-renderergl/lib/compilation/RenderObjectBase");
	import RenderableBase = require("awayjs-renderergl/lib/pool/RenderableBase");
	import IRendererPoolClass = require("awayjs-renderergl/lib/pool/IRendererPoolClass");
	/**
	 * The DistanceRenderer class renders 32-bit depth information encoded as RGBA
	 *
	 * @class away.render.DistanceRenderer
	 */
	class DistanceRenderer extends RendererBase {
	    /**
	     * Creates a new DistanceRenderer object.
	     * @param renderBlended Indicates whether semi-transparent objects should be rendered.
	     * @param distanceBased Indicates whether the written depth value is distance-based or projected depth-based
	     */
	    constructor(rendererPoolClass?: IRendererPoolClass, stage?: Stage);
	    _pGetRenderObject(renderable: RenderableBase, renderObjectOwner: IRenderObjectOwner): RenderObjectBase;
	}
	export = DistanceRenderer;
	
}
declare module "awayjs-renderergl/lib/filters/tasks/Filter3DTaskBase" {
	import Camera = require("awayjs-display/lib/entities/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import IProgram = require("awayjs-stagegl/lib/base/IProgram");
	import ITexture = require("awayjs-stagegl/lib/base/ITexture");
	class Filter3DTaskBase {
	    private _mainInputTexture;
	    private _scaledTextureWidth;
	    private _scaledTextureHeight;
	    private _textureWidth;
	    private _textureHeight;
	    private _textureDimensionsInvalid;
	    private _program3DInvalid;
	    private _program3D;
	    private _target;
	    private _requireDepthRender;
	    private _textureScale;
	    constructor(requireDepthRender?: boolean);
	    /**
	     * The texture scale for the input of this texture. This will define the output of the previous entry in the chain
	     */
	    textureScale: number;
	    target: ITexture;
	    textureWidth: number;
	    textureHeight: number;
	    getMainInputTexture(stage: Stage): ITexture;
	    dispose(): void;
	    pInvalidateProgram(): void;
	    pUpdateProgram(stage: Stage): void;
	    pGetVertexCode(): string;
	    pGetFragmentCode(): string;
	    pUpdateTextures(stage: Stage): void;
	    getProgram(stage: Stage): IProgram;
	    activate(stage: Stage, camera: Camera, depthTexture: ITexture): void;
	    deactivate(stage: Stage): void;
	    requireDepthRender: boolean;
	}
	export = Filter3DTaskBase;
	
}
declare module "awayjs-renderergl/lib/filters/Filter3DBase" {
	import Camera = require("awayjs-display/lib/entities/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ITexture = require("awayjs-stagegl/lib/base/ITexture");
	import Filter3DTaskBase = require("awayjs-renderergl/lib/filters/tasks/Filter3DTaskBase");
	class Filter3DBase {
	    private _tasks;
	    private _requireDepthRender;
	    private _textureWidth;
	    private _textureHeight;
	    constructor();
	    requireDepthRender: boolean;
	    pAddTask(filter: Filter3DTaskBase): void;
	    tasks: Filter3DTaskBase[];
	    getMainInputTexture(stage: Stage): ITexture;
	    textureWidth: number;
	    textureHeight: number;
	    setRenderTargets(mainTarget: ITexture, stage: Stage): void;
	    dispose(): void;
	    update(stage: Stage, camera: Camera): void;
	}
	export = Filter3DBase;
	
}
declare module "awayjs-renderergl/lib/Filter3DRenderer" {
	import Camera = require("awayjs-display/lib/entities/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ITexture = require("awayjs-stagegl/lib/base/ITexture");
	import Filter3DBase = require("awayjs-renderergl/lib/filters/Filter3DBase");
	/**
	 * @class away.render.Filter3DRenderer
	 */
	class Filter3DRenderer {
	    private _filters;
	    private _tasks;
	    private _filterTasksInvalid;
	    private _mainInputTexture;
	    private _requireDepthRender;
	    private _rttManager;
	    private _stage;
	    private _filterSizesInvalid;
	    private _onRTTResizeDelegate;
	    constructor(stage: Stage);
	    private onRTTResize(event);
	    requireDepthRender: boolean;
	    getMainInputTexture(stage: Stage): ITexture;
	    filters: Filter3DBase[];
	    private updateFilterTasks(stage);
	    render(stage: Stage, camera: Camera, depthTexture: ITexture): void;
	    private updateFilterSizes();
	    dispose(): void;
	}
	export = Filter3DRenderer;
	
}
declare module "awayjs-renderergl/lib/pool/SkyboxRenderable" {
	import Matrix3D = require("awayjs-core/lib/geom/Matrix3D");
	import TriangleSubGeometry = require("awayjs-display/lib/base/TriangleSubGeometry");
	import Skybox = require("awayjs-display/lib/entities/Skybox");
	import Camera = require("awayjs-display/lib/entities/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
	import RenderableBase = require("awayjs-renderergl/lib/pool/RenderableBase");
	import RenderablePoolBase = require("awayjs-renderergl/lib/pool/RenderablePoolBase");
	import RenderPassBase = require("awayjs-renderergl/lib/passes/RenderPassBase");
	/**
	 * @class away.pool.SkyboxRenderable
	 */
	class SkyboxRenderable extends RenderableBase {
	    private _vertexArray;
	    /**
	     *
	     */
	    static id: string;
	    static vertexAttributesOffset: number;
	    /**
	     *
	     */
	    private static _geometry;
	    /**
	     * //TODO
	     *
	     * @param pool
	     * @param skybox
	     */
	    constructor(pool: RenderablePoolBase, skybox: Skybox, stage: Stage);
	    /**
	     * //TODO
	     *
	     * @returns {away.base.TriangleSubGeometry}
	     * @private
	     */
	    _pGetSubGeometry(): TriangleSubGeometry;
	    static _iIncludeDependencies(shaderObject: ShaderObjectBase): void;
	    /**
	     * @inheritDoc
	     */
	    static _iGetVertexCode(shaderObject: ShaderObjectBase, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * @inheritDoc
	     */
	    _iRender(pass: RenderPassBase, camera: Camera, viewProjection: Matrix3D): void;
	}
	export = SkyboxRenderable;
	
}
declare module "awayjs-renderergl/lib/DefaultRenderer" {
	import Rectangle = require("awayjs-core/lib/geom/Rectangle");
	import TextureProxyBase = require("awayjs-core/lib/textures/TextureProxyBase");
	import IRenderer = require("awayjs-display/lib/render/IRenderer");
	import EntityCollector = require("awayjs-display/lib/traverse/EntityCollector");
	import CollectorBase = require("awayjs-display/lib/traverse/CollectorBase");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import Filter3DRenderer = require("awayjs-renderergl/lib/Filter3DRenderer");
	import RendererBase = require("awayjs-renderergl/lib/base/RendererBase");
	import Filter3DBase = require("awayjs-renderergl/lib/filters/Filter3DBase");
	import RenderObjectBase = require("awayjs-renderergl/lib/compilation/RenderObjectBase");
	import IRenderObjectOwner = require("awayjs-display/lib/base/IRenderObjectOwner");
	import IRendererPoolClass = require("awayjs-renderergl/lib/pool/IRendererPoolClass");
	import RenderableBase = require("awayjs-renderergl/lib/pool/RenderableBase");
	/**
	 * The DefaultRenderer class provides the default rendering method. It renders the scene graph objects using the
	 * materials assigned to them.
	 *
	 * @class away.render.DefaultRenderer
	 */
	class DefaultRenderer extends RendererBase implements IRenderer {
	    _pRequireDepthRender: boolean;
	    private _skyboxRenderablePool;
	    private _pDistanceRenderer;
	    private _pDepthRenderer;
	    private _skyboxProjection;
	    _pFilter3DRenderer: Filter3DRenderer;
	    _pDepthRender: TextureProxyBase;
	    private _antiAlias;
	    antiAlias: number;
	    /**
	     *
	     */
	    depthPrepass: boolean;
	    /**
	     *
	     * @returns {*}
	     */
	    filters3d: Filter3DBase[];
	    /**
	     * Creates a new DefaultRenderer object.
	     *
	     * @param antiAlias The amount of anti-aliasing to use.
	     * @param renderMode The render mode to use.
	     */
	    constructor(rendererPoolClass?: IRendererPoolClass, stage?: Stage);
	    render(entityCollector: CollectorBase): void;
	    pExecuteRender(entityCollector: EntityCollector, target?: TextureProxyBase, scissorRect?: Rectangle, surfaceSelector?: number): void;
	    private updateLights(entityCollector);
	    /**
	     * @inheritDoc
	     */
	    pDraw(entityCollector: EntityCollector): void;
	    _pGetRenderObject(renderable: RenderableBase, renderObjectOwner: IRenderObjectOwner): RenderObjectBase;
	    /**
	     * Draw the skybox if present.
	     *
	     * @param entityCollector The EntityCollector containing all potentially visible information.
	     */
	    private drawSkybox(entityCollector);
	    private updateSkyboxProjection(camera);
	    dispose(): void;
	    /**
	     *
	     */
	    pRenderDepthPrepass(entityCollector: EntityCollector): void;
	    /**
	     *
	     */
	    pRenderSceneDepthToTexture(entityCollector: EntityCollector): void;
	    /**
	     * Updates the backbuffer dimensions.
	     */
	    pUpdateBackBuffer(): void;
	    iSetStage(value: Stage): void;
	    /**
	     *
	     */
	    private initDepthTexture(context);
	}
	export = DefaultRenderer;
	
}
declare module "awayjs-renderergl/lib/animators/data/ParticleData" {
	import TriangleSubGeometry = require("awayjs-display/lib/base/TriangleSubGeometry");
	class ParticleData {
	    particleIndex: number;
	    numVertices: number;
	    startVertexIndex: number;
	    subGeometry: TriangleSubGeometry;
	}
	export = ParticleData;
	
}
declare module "awayjs-renderergl/lib/animators/data/ParticleAnimationData" {
	import ParticleData = require("awayjs-renderergl/lib/animators/data/ParticleData");
	/**
	 * ...
	 */
	class ParticleAnimationData {
	    index: number;
	    startTime: number;
	    totalTime: number;
	    duration: number;
	    delay: number;
	    startVertexIndex: number;
	    numVertices: number;
	    constructor(index: number, startTime: number, duration: number, delay: number, particle: ParticleData);
	}
	export = ParticleAnimationData;
	
}
declare module "awayjs-renderergl/lib/animators/data/AnimationSubGeometry" {
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import IContextGL = require("awayjs-stagegl/lib/base/IContextGL");
	import IVertexBuffer = require("awayjs-stagegl/lib/base/IVertexBuffer");
	import ParticleAnimationData = require("awayjs-renderergl/lib/animators/data/ParticleAnimationData");
	/**
	 * ...
	 */
	class AnimationSubGeometry {
	    static SUBGEOM_ID_COUNT: number;
	    _pVertexData: number[];
	    _pVertexBuffer: IVertexBuffer[];
	    _pBufferContext: IContextGL[];
	    _pBufferDirty: boolean[];
	    private _numVertices;
	    private _totalLenOfOneVertex;
	    numProcessedVertices: number;
	    previousTime: number;
	    animationParticles: ParticleAnimationData[];
	    /**
	     * An id for this animation subgeometry, used to identify animation subgeometries when using animation sets.
	     *
	     * @private
	     */
	    _iUniqueId: number;
	    constructor();
	    createVertexData(numVertices: number, totalLenOfOneVertex: number): void;
	    activateVertexBuffer(index: number, bufferOffset: number, stage: Stage, format: string): void;
	    dispose(): void;
	    invalidateBuffer(): void;
	    vertexData: number[];
	    numVertices: number;
	    totalLenOfOneVertex: number;
	}
	export = AnimationSubGeometry;
	
}
declare module "awayjs-renderergl/lib/animators/data/ParticleProperties" {
	/**
	 * Dynamic class for holding the local properties of a particle, used for processing the static properties
	 * of particles in the particle animation set before beginning upload to the GPU.
	 */
	class ParticleProperties {
	    /**
	     * The index of the current particle being set.
	     */
	    index: number;
	    /**
	     * The total number of particles being processed by the particle animation set.
	     */
	    total: number;
	    /**
	     * The start time of the particle.
	     */
	    startTime: number;
	    /**
	     * The duration of the particle, an optional value used when the particle aniamtion set settings for <code>useDuration</code> are enabled in the constructor.
	     *
	     * @see away.animators.ParticleAnimationSet
	     */
	    duration: number;
	    /**
	     * The delay between cycles of the particle, an optional value used when the particle aniamtion set settings for <code>useLooping</code> and  <code>useDelay</code> are enabled in the constructor.
	     *
	     * @see away.animators.ParticleAnimationSet
	     */
	    delay: number;
	}
	export = ParticleProperties;
	
}
declare module "awayjs-renderergl/lib/animators/data/ParticlePropertiesMode" {
	/**
	 * Options for setting the properties mode of a particle animation node.
	 */
	class ParticlePropertiesMode {
	    /**
	     * Mode that defines the particle node as acting on global properties (ie. the properties set in the node constructor or the corresponding animation state).
	     */
	    static GLOBAL: number;
	    /**
	     * Mode that defines the particle node as acting on local static properties (ie. the properties of particles set in the initialising on the animation set).
	     */
	    static LOCAL_STATIC: number;
	    /**
	     * Mode that defines the particle node as acting on local dynamic properties (ie. the properties of the particles set in the corresponding animation state).
	     */
	    static LOCAL_DYNAMIC: number;
	}
	export = ParticlePropertiesMode;
	
}
declare module "awayjs-renderergl/lib/animators/nodes/ParticleNodeBase" {
	import AnimationNodeBase = require("awayjs-display/lib/animators/nodes/AnimationNodeBase");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ParticleAnimationSet = require("awayjs-renderergl/lib/animators/ParticleAnimationSet");
	import ParticleProperties = require("awayjs-renderergl/lib/animators/data/ParticleProperties");
	/**
	 * Provides an abstract base class for particle animation nodes.
	 */
	class ParticleNodeBase extends AnimationNodeBase {
	    private _priority;
	    _pMode: number;
	    _pDataLength: number;
	    _pOneData: number[];
	    _iDataOffset: number;
	    private static GLOBAL;
	    private static LOCAL_STATIC;
	    private static LOCAL_DYNAMIC;
	    private static MODES;
	    /**
	     * Returns the property mode of the particle animation node. Typically set in the node constructor
	     *
	     * @see away.animators.ParticlePropertiesMode
	     */
	    mode: number;
	    /**
	     * Returns the priority of the particle animation node, used to order the agal generated in a particle animation set. Set automatically on instantiation.
	     *
	     * @see away.animators.ParticleAnimationSet
	     * @see #getAGALVertexCode
	     */
	    priority: number;
	    /**
	     * Returns the length of the data used by the node when in <code>LOCAL_STATIC</code> mode. Used to generate the local static data of the particle animation set.
	     *
	     * @see away.animators.ParticleAnimationSet
	     * @see #getAGALVertexCode
	     */
	    dataLength: number;
	    /**
	     * Returns the generated data vector of the node after one particle pass during the generation of all local static data of the particle animation set.
	     *
	     * @see away.animators.ParticleAnimationSet
	     * @see #generatePropertyOfOneParticle
	     */
	    oneData: number[];
	    /**
	     * Creates a new <code>ParticleNodeBase</code> object.
	     *
	     * @param               name            Defines the generic name of the particle animation node.
	     * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
	     * @param               dataLength      Defines the length of the data used by the node when in <code>LOCAL_STATIC</code> mode.
	     * @param    [optional] priority        the priority of the particle animation node, used to order the agal generated in a particle animation set. Defaults to 1.
	     */
	    constructor(name: string, mode: number, dataLength: number, priority?: number);
	    /**
	     * Returns the AGAL code of the particle animation node for use in the vertex shader.
	     */
	    getAGALVertexCode(shaderObject: ShaderObjectBase, animationRegisterCache: AnimationRegisterCache): string;
	    /**
	     * Returns the AGAL code of the particle animation node for use in the fragment shader.
	     */
	    getAGALFragmentCode(shaderObject: ShaderObjectBase, animationRegisterCache: AnimationRegisterCache): string;
	    /**
	     * Returns the AGAL code of the particle animation node for use in the fragment shader when UV coordinates are required.
	     */
	    getAGALUVCode(shaderObject: ShaderObjectBase, animationRegisterCache: AnimationRegisterCache): string;
	    /**
	     * Called internally by the particle animation set when assigning the set of static properties originally defined by the initParticleFunc of the set.
	     *
	     * @see away.animators.ParticleAnimationSet#initParticleFunc
	     */
	    _iGeneratePropertyOfOneParticle(param: ParticleProperties): void;
	    /**
	     * Called internally by the particle animation set when determining the requirements of the particle animation node AGAL.
	     */
	    _iProcessAnimationSetting(particleAnimationSet: ParticleAnimationSet): void;
	}
	export = ParticleNodeBase;
	
}
declare module "awayjs-renderergl/lib/events/AnimationStateEvent" {
	import AnimationNodeBase = require("awayjs-display/lib/animators/nodes/AnimationNodeBase");
	import Event = require("awayjs-core/lib/events/Event");
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import IAnimationState = require("awayjs-renderergl/lib/animators/states/IAnimationState");
	/**
	 * Dispatched to notify changes in an animation state's state.
	 */
	class AnimationStateEvent extends Event {
	    /**
	     * Dispatched when a non-looping clip node inside an animation state reaches the end of its timeline.
	     */
	    static PLAYBACK_COMPLETE: string;
	    static TRANSITION_COMPLETE: string;
	    private _animator;
	    private _animationState;
	    private _animationNode;
	    /**
	     * Create a new <code>AnimatonStateEvent</code>
	     *
	     * @param type The event type.
	     * @param animator The animation state object that is the subject of this event.
	     * @param animationNode The animation node inside the animation state from which the event originated.
	     */
	    constructor(type: string, animator: AnimatorBase, animationState: IAnimationState, animationNode: AnimationNodeBase);
	    /**
	     * The animator object that is the subject of this event.
	     */
	    animator: AnimatorBase;
	    /**
	     * The animation state object that is the subject of this event.
	     */
	    animationState: IAnimationState;
	    /**
	     * The animation node inside the animation state from which the event originated.
	     */
	    animationNode: AnimationNodeBase;
	    /**
	     * Clones the event.
	     *
	     * @return An exact duplicate of the current object.
	     */
	    clone(): Event;
	}
	export = AnimationStateEvent;
	
}
declare module "awayjs-renderergl/lib/animators/states/AnimationStateBase" {
	import Vector3D = require("awayjs-core/lib/geom/Vector3D");
	import AnimationNodeBase = require("awayjs-display/lib/animators/nodes/AnimationNodeBase");
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import IAnimationState = require("awayjs-renderergl/lib/animators/states/IAnimationState");
	/**
	 *
	 */
	class AnimationStateBase implements IAnimationState {
	    _pAnimationNode: AnimationNodeBase;
	    _pRootDelta: Vector3D;
	    _pPositionDeltaDirty: boolean;
	    _pTime: number;
	    _pStartTime: number;
	    _pAnimator: AnimatorBase;
	    /**
	     * Returns a 3d vector representing the translation delta of the animating entity for the current timestep of animation
	     */
	    positionDelta: Vector3D;
	    constructor(animator: AnimatorBase, animationNode: AnimationNodeBase);
	    /**
	     * Resets the start time of the node to a  new value.
	     *
	     * @param startTime The absolute start time (in milliseconds) of the node's starting time.
	     */
	    offset(startTime: number): void;
	    /**
	     * Updates the configuration of the node to its current state.
	     *
	     * @param time The absolute time (in milliseconds) of the animator's play head position.
	     *
	     * @see AnimatorBase#update()
	     */
	    update(time: number): void;
	    /**
	     * Sets the animation phase of the node.
	     *
	     * @param value The phase value to use. 0 represents the beginning of an animation clip, 1 represents the end.
	     */
	    phase(value: number): void;
	    /**
	     * Updates the node's internal playhead position.
	     *
	     * @param time The local time (in milliseconds) of the node's playhead position.
	     */
	    _pUpdateTime(time: number): void;
	    /**
	     * Updates the node's root delta position
	     */
	    _pUpdatePositionDelta(): void;
	}
	export = AnimationStateBase;
	
}
declare module "awayjs-renderergl/lib/animators/states/ParticleStateBase" {
	import Vector3D = require("awayjs-core/lib/geom/Vector3D");
	import Camera = require("awayjs-display/lib/entities/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ParticleAnimator = require("awayjs-renderergl/lib/animators/ParticleAnimator");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import AnimationSubGeometry = require("awayjs-renderergl/lib/animators/data/AnimationSubGeometry");
	import ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
	import AnimationStateBase = require("awayjs-renderergl/lib/animators/states/AnimationStateBase");
	import RenderableBase = require("awayjs-renderergl/lib/pool/RenderableBase");
	/**
	 * ...
	 */
	class ParticleStateBase extends AnimationStateBase {
	    private _particleNode;
	    _pDynamicProperties: Vector3D[];
	    _pDynamicPropertiesDirty: Object;
	    _pNeedUpdateTime: boolean;
	    constructor(animator: ParticleAnimator, particleNode: ParticleNodeBase, needUpdateTime?: boolean);
	    needUpdateTime: boolean;
	    setRenderState(stage: Stage, renderable: RenderableBase, animationSubGeometry: AnimationSubGeometry, animationRegisterCache: AnimationRegisterCache, camera: Camera): void;
	    _pUpdateDynamicProperties(animationSubGeometry: AnimationSubGeometry): void;
	}
	export = ParticleStateBase;
	
}
declare module "awayjs-renderergl/lib/animators/ParticleAnimator" {
	import Camera = require("awayjs-display/lib/entities/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import ParticleAnimationSet = require("awayjs-renderergl/lib/animators/ParticleAnimationSet");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import RenderableBase = require("awayjs-renderergl/lib/pool/RenderableBase");
	/**
	 * Provides an interface for assigning paricle-based animation data sets to mesh-based entity objects
	 * and controlling the various available states of animation through an interative playhead that can be
	 * automatically updated or manually triggered.
	 *
	 * Requires that the containing geometry of the parent mesh is particle geometry
	 *
	 * @see away.base.ParticleGeometry
	 */
	class ParticleAnimator extends AnimatorBase {
	    private _particleAnimationSet;
	    private _animationParticleStates;
	    private _animatorParticleStates;
	    private _timeParticleStates;
	    private _totalLenOfOneVertex;
	    private _animatorSubGeometries;
	    /**
	     * Creates a new <code>ParticleAnimator</code> object.
	     *
	     * @param particleAnimationSet The animation data set containing the particle animations used by the animator.
	     */
	    constructor(particleAnimationSet: ParticleAnimationSet);
	    /**
	     * @inheritDoc
	     */
	    clone(): AnimatorBase;
	    /**
	     * @inheritDoc
	     */
	    setRenderState(shaderObject: ShaderObjectBase, renderable: RenderableBase, stage: Stage, camera: Camera, vertexConstantOffset: number, vertexStreamOffset: number): void;
	    /**
	     * @inheritDoc
	     */
	    testGPUCompatibility(shaderObject: ShaderObjectBase): void;
	    /**
	     * @inheritDoc
	     */
	    start(): void;
	    /**
	     * @inheritDoc
	     */
	    _pUpdateDeltaTime(dt: number): void;
	    /**
	     * @inheritDoc
	     */
	    resetTime(offset?: number): void;
	    dispose(): void;
	    private getAnimatorSubGeometry(subMesh);
	}
	export = ParticleAnimator;
	
}
declare module "awayjs-renderergl/lib/animators/states/ParticleTimeState" {
	import Camera = require("awayjs-display/lib/entities/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ParticleAnimator = require("awayjs-renderergl/lib/animators/ParticleAnimator");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import AnimationSubGeometry = require("awayjs-renderergl/lib/animators/data/AnimationSubGeometry");
	import ParticleTimeNode = require("awayjs-renderergl/lib/animators/nodes/ParticleTimeNode");
	import ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
	import RenderableBase = require("awayjs-renderergl/lib/pool/RenderableBase");
	/**
	 * ...
	 */
	class ParticleTimeState extends ParticleStateBase {
	    /** @private */
	    static TIME_STREAM_INDEX: number;
	    /** @private */
	    static TIME_CONSTANT_INDEX: number;
	    private _particleTimeNode;
	    constructor(animator: ParticleAnimator, particleTimeNode: ParticleTimeNode);
	    setRenderState(stage: Stage, renderable: RenderableBase, animationSubGeometry: AnimationSubGeometry, animationRegisterCache: AnimationRegisterCache, camera: Camera): void;
	}
	export = ParticleTimeState;
	
}
declare module "awayjs-renderergl/lib/animators/nodes/ParticleTimeNode" {
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ParticleProperties = require("awayjs-renderergl/lib/animators/data/ParticleProperties");
	import ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
	import ParticleTimeState = require("awayjs-renderergl/lib/animators/states/ParticleTimeState");
	/**
	 * A particle animation node used as the base node for timekeeping inside a particle. Automatically added to a particle animation set on instatiation.
	 */
	class ParticleTimeNode extends ParticleNodeBase {
	    /** @private */
	    _iUsesDuration: boolean;
	    /** @private */
	    _iUsesDelay: boolean;
	    /** @private */
	    _iUsesLooping: boolean;
	    /**
	     * Creates a new <code>ParticleTimeNode</code>
	     *
	     * @param    [optional] usesDuration    Defines whether the node uses the <code>duration</code> data in the static properties to determine how long a particle is visible for. Defaults to false.
	     * @param    [optional] usesDelay       Defines whether the node uses the <code>delay</code> data in the static properties to determine how long a particle is hidden for. Defaults to false. Requires <code>usesDuration</code> to be true.
	     * @param    [optional] usesLooping     Defines whether the node creates a looping timeframe for each particle determined by the <code>startTime</code>, <code>duration</code> and <code>delay</code> data in the static properties function. Defaults to false. Requires <code>usesLooping</code> to be true.
	     */
	    constructor(usesDuration?: boolean, usesLooping?: boolean, usesDelay?: boolean);
	    /**
	     * @inheritDoc
	     */
	    getAGALVertexCode(shaderObject: ShaderObjectBase, animationRegisterCache: AnimationRegisterCache): string;
	    /**
	     * @inheritDoc
	     */
	    getAnimationState(animator: AnimatorBase): ParticleTimeState;
	    /**
	     * @inheritDoc
	     */
	    _iGeneratePropertyOfOneParticle(param: ParticleProperties): void;
	}
	export = ParticleTimeNode;
	
}
declare module "awayjs-renderergl/lib/base/ParticleGeometry" {
	import Geometry = require("awayjs-display/lib/base/Geometry");
	import ParticleData = require("awayjs-renderergl/lib/animators/data/ParticleData");
	/**
	 * @class away.base.ParticleGeometry
	 */
	class ParticleGeometry extends Geometry {
	    particles: ParticleData[];
	    numParticles: number;
	}
	export = ParticleGeometry;
	
}
declare module "awayjs-renderergl/lib/animators/ParticleAnimationSet" {
	import IAnimationSet = require("awayjs-display/lib/animators/IAnimationSet");
	import AnimationNodeBase = require("awayjs-display/lib/animators/nodes/AnimationNodeBase");
	import ISubMesh = require("awayjs-display/lib/base/ISubMesh");
	import Mesh = require("awayjs-display/lib/entities/Mesh");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import AnimationSetBase = require("awayjs-renderergl/lib/animators/AnimationSetBase");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	/**
	 * The animation data set used by particle-based animators, containing particle animation data.
	 *
	 * @see away.animators.ParticleAnimator
	 */
	class ParticleAnimationSet extends AnimationSetBase implements IAnimationSet {
	    /** @private */
	    _iAnimationRegisterCache: AnimationRegisterCache;
	    private _timeNode;
	    /**
	     * Property used by particle nodes that require compilation at the end of the shader
	     */
	    static POST_PRIORITY: number;
	    /**
	     * Property used by particle nodes that require color compilation
	     */
	    static COLOR_PRIORITY: number;
	    private _animationSubGeometries;
	    private _particleNodes;
	    private _localDynamicNodes;
	    private _localStaticNodes;
	    private _totalLenOfOneVertex;
	    hasUVNode: boolean;
	    needVelocity: boolean;
	    hasBillboard: boolean;
	    hasColorMulNode: boolean;
	    hasColorAddNode: boolean;
	    /**
	     * Initialiser function for static particle properties. Needs to reference a with the following format
	     *
	     * <code>
	     * initParticleFunc(prop:ParticleProperties)
	     * {
	     * 		//code for settings local properties
	     * }
	     * </code>
	     *
	     * Aside from setting any properties required in particle animation nodes using local static properties, the initParticleFunc function
	     * is required to time node requirements as they may be needed. These properties on the ParticleProperties object can include
	     * <code>startTime</code>, <code>duration</code> and <code>delay</code>. The use of these properties is determined by the setting
	     * arguments passed in the constructor of the particle animation set. By default, only the <code>startTime</code> property is required.
	     */
	    initParticleFunc: Function;
	    /**
	     * Initialiser function scope for static particle properties
	     */
	    initParticleScope: Object;
	    /**
	     * Creates a new <code>ParticleAnimationSet</code>
	     *
	     * @param    [optional] usesDuration    Defines whether the animation set uses the <code>duration</code> data in its static properties to determine how long a particle is visible for. Defaults to false.
	     * @param    [optional] usesLooping     Defines whether the animation set uses a looping timeframe for each particle determined by the <code>startTime</code>, <code>duration</code> and <code>delay</code> data in its static properties function. Defaults to false. Requires <code>usesDuration</code> to be true.
	     * @param    [optional] usesDelay       Defines whether the animation set uses the <code>delay</code> data in its static properties to determine how long a particle is hidden for. Defaults to false. Requires <code>usesLooping</code> to be true.
	     */
	    constructor(usesDuration?: boolean, usesLooping?: boolean, usesDelay?: boolean);
	    /**
	     * Returns a vector of the particle animation nodes contained within the set.
	     */
	    particleNodes: ParticleNodeBase[];
	    /**
	     * @inheritDoc
	     */
	    addAnimation(node: AnimationNodeBase): void;
	    /**
	     * @inheritDoc
	     */
	    activate(shaderObject: ShaderObjectBase, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    deactivate(shaderObject: ShaderObjectBase, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    getAGALVertexCode(shaderObject: ShaderObjectBase): string;
	    /**
	     * @inheritDoc
	     */
	    getAGALUVCode(shaderObject: ShaderObjectBase): string;
	    /**
	     * @inheritDoc
	     */
	    getAGALFragmentCode(shaderObject: ShaderObjectBase, shadedTarget: string): string;
	    /**
	     * @inheritDoc
	     */
	    doneAGALCode(shaderObject: ShaderObjectBase): void;
	    /**
	     * @inheritDoc
	     */
	    usesCPU: boolean;
	    /**
	     * @inheritDoc
	     */
	    cancelGPUCompatibility(): void;
	    dispose(): void;
	    getAnimationSubGeometry(subMesh: ISubMesh): any;
	    /** @private */
	    _iGenerateAnimationSubGeometries(mesh: Mesh): void;
	}
	export = ParticleAnimationSet;
	
}
declare module "awayjs-renderergl/lib/animators/SkeletonAnimationSet" {
	import IAnimationSet = require("awayjs-display/lib/animators/IAnimationSet");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import AnimationSetBase = require("awayjs-renderergl/lib/animators/AnimationSetBase");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	/**
	 * The animation data set used by skeleton-based animators, containing skeleton animation data.
	 *
	 * @see away.animators.SkeletonAnimator
	 */
	class SkeletonAnimationSet extends AnimationSetBase implements IAnimationSet {
	    private _jointsPerVertex;
	    /**
	     * Returns the amount of skeleton joints that can be linked to a single vertex via skinned weight values. For GPU-base animation, the
	     * maximum allowed value is 4.
	     */
	    jointsPerVertex: number;
	    /**
	     * Creates a new <code>SkeletonAnimationSet</code> object.
	     *
	     * @param jointsPerVertex Sets the amount of skeleton joints that can be linked to a single vertex via skinned weight values. For GPU-base animation, the maximum allowed value is 4. Defaults to 4.
	     */
	    constructor(jointsPerVertex?: number);
	    /**
	     * @inheritDoc
	     */
	    getAGALVertexCode(shaderObject: ShaderObjectBase): string;
	    /**
	     * @inheritDoc
	     */
	    activate(shaderObject: ShaderObjectBase, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    deactivate(shaderObject: ShaderObjectBase, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    getAGALFragmentCode(shaderObject: ShaderObjectBase, shadedTarget: string): string;
	    /**
	     * @inheritDoc
	     */
	    getAGALUVCode(shaderObject: ShaderObjectBase): string;
	    /**
	     * @inheritDoc
	     */
	    doneAGALCode(shaderObject: ShaderObjectBase): void;
	}
	export = SkeletonAnimationSet;
	
}
declare module "awayjs-renderergl/lib/animators/data/JointPose" {
	import Matrix3D = require("awayjs-core/lib/geom/Matrix3D");
	import Quaternion = require("awayjs-core/lib/geom/Quaternion");
	import Vector3D = require("awayjs-core/lib/geom/Vector3D");
	/**
	 * Contains transformation data for a skeleton joint, used for skeleton animation.
	 *
	 * @see away.animation.Skeleton
	 * @see away.animation.SkeletonJoint
	 *
	 * todo: support (uniform) scale
	 */
	class JointPose {
	    /**
	     * The name of the joint to which the pose is associated
	     */
	    name: string;
	    /**
	     * The rotation of the pose stored as a quaternion
	     */
	    orientation: Quaternion;
	    /**
	     * The translation of the pose
	     */
	    translation: Vector3D;
	    constructor();
	    /**
	     * Converts the transformation to a Matrix3D representation.
	     *
	     * @param target An optional target matrix to store the transformation. If not provided, it will create a new instance.
	     * @return The transformation matrix of the pose.
	     */
	    toMatrix3D(target?: Matrix3D): Matrix3D;
	    /**
	     * Copies the transformation data from a source pose object into the existing pose object.
	     *
	     * @param pose The source pose to copy from.
	     */
	    copyFrom(pose: JointPose): void;
	}
	export = JointPose;
	
}
declare module "awayjs-renderergl/lib/animators/data/SkeletonJoint" {
	/**
	 * A value obect representing a single joint in a skeleton object.
	 *
	 * @see away.animators.Skeleton
	 */
	class SkeletonJoint {
	    /**
	     * The index of the parent joint in the skeleton's joints vector.
	     *
	     * @see away.animators.Skeleton#joints
	     */
	    parentIndex: number;
	    /**
	     * The name of the joint
	     */
	    name: string;
	    /**
	     * The inverse bind pose matrix, as raw data, used to transform vertices to bind joint space in preparation for transformation using the joint matrix.
	     */
	    inverseBindPose: number[];
	    /**
	     * Creates a new <code>SkeletonJoint</code> object
	     */
	    constructor();
	}
	export = SkeletonJoint;
	
}
declare module "awayjs-renderergl/lib/animators/data/Skeleton" {
	import SkeletonJoint = require("awayjs-renderergl/lib/animators/data/SkeletonJoint");
	import IAsset = require("awayjs-core/lib/library/IAsset");
	import NamedAssetBase = require("awayjs-core/lib/library/NamedAssetBase");
	/**
	 * A Skeleton object is a hierarchical grouping of joint objects that can be used for skeletal animation.
	 *
	 * @see away.animators.SkeletonJoint
	 */
	class Skeleton extends NamedAssetBase implements IAsset {
	    /**
	     * A flat list of joint objects that comprise the skeleton. Every joint except for the root has a parentIndex
	     * property that is an index into this list.
	     * A child joint should always have a higher index than its parent.
	     */
	    joints: SkeletonJoint[];
	    /**
	     * The total number of joints in the skeleton.
	     */
	    numJoints: number;
	    /**
	     * Creates a new <code>Skeleton</code> object
	     */
	    constructor();
	    /**
	     * Returns the joint object in the skeleton with the given name, otherwise returns a null object.
	     *
	     * @param jointName The name of the joint object to be found.
	     * @return The joint object with the given name.
	     *
	     * @see #joints
	     */
	    jointFromName(jointName: string): SkeletonJoint;
	    /**
	     * Returns the joint index, given the joint name. -1 is returned if the joint name is not found.
	     *
	     * @param jointName The name of the joint object to be found.
	     * @return The index of the joint object in the joints Array
	     *
	     * @see #joints
	     */
	    jointIndexFromName(jointName: string): number;
	    /**
	     * @inheritDoc
	     */
	    dispose(): void;
	    /**
	     * @inheritDoc
	     */
	    assetType: string;
	}
	export = Skeleton;
	
}
declare module "awayjs-renderergl/lib/animators/data/SkeletonPose" {
	import IAsset = require("awayjs-core/lib/library/IAsset");
	import NamedAssetBase = require("awayjs-core/lib/library/NamedAssetBase");
	import JointPose = require("awayjs-renderergl/lib/animators/data/JointPose");
	/**
	 * A collection of pose objects, determining the pose for an entire skeleton.
	 * The <code>jointPoses</code> vector object corresponds to a skeleton's <code>joints</code> vector object, however, there is no
	 * reference to a skeleton's instance, since several skeletons can be influenced by the same pose (eg: animation
	 * clips are added to any animator with a valid skeleton)
	 *
	 * @see away.animators.Skeleton
	 * @see away.animators.JointPose
	 */
	class SkeletonPose extends NamedAssetBase implements IAsset {
	    /**
	     * A flat list of pose objects that comprise the skeleton pose. The pose indices correspond to the target skeleton's joint indices.
	     *
	     * @see away.animators.Skeleton#joints
	     */
	    jointPoses: JointPose[];
	    /**
	     * The total number of joint poses in the skeleton pose.
	     */
	    numJointPoses: number;
	    /**
	     * Creates a new <code>SkeletonPose</code> object.
	     */
	    constructor();
	    /**
	     * @inheritDoc
	     */
	    assetType: string;
	    /**
	     * Returns the joint pose object with the given joint name, otherwise returns a null object.
	     *
	     * @param jointName The name of the joint object whose pose is to be found.
	     * @return The pose object with the given joint name.
	     */
	    jointPoseFromName(jointName: string): JointPose;
	    /**
	     * Returns the pose index, given the joint name. -1 is returned if the joint name is not found in the pose.
	     *
	     * @param The name of the joint object whose pose is to be found.
	     * @return The index of the pose object in the jointPoses Array
	     *
	     * @see #jointPoses
	     */
	    jointPoseIndexFromName(jointName: string): number;
	    /**
	     * Creates a copy of the <code>SkeletonPose</code> object, with a dulpicate of its component joint poses.
	     *
	     * @return SkeletonPose
	     */
	    clone(): SkeletonPose;
	    /**
	     * @inheritDoc
	     */
	    dispose(): void;
	}
	export = SkeletonPose;
	
}
declare module "awayjs-renderergl/lib/animators/states/ISkeletonAnimationState" {
	import IAnimationState = require("awayjs-renderergl/lib/animators/states/IAnimationState");
	import Skeleton = require("awayjs-renderergl/lib/animators/data/Skeleton");
	import SkeletonPose = require("awayjs-renderergl/lib/animators/data/SkeletonPose");
	interface ISkeletonAnimationState extends IAnimationState {
	    /**
	     * Returns the output skeleton pose of the animation node.
	     */
	    getSkeletonPose(skeleton: Skeleton): SkeletonPose;
	}
	export = ISkeletonAnimationState;
	
}
declare module "awayjs-renderergl/lib/animators/transitions/IAnimationTransition" {
	import AnimationNodeBase = require("awayjs-display/lib/animators/nodes/AnimationNodeBase");
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	/**
	 *
	 */
	interface IAnimationTransition {
	    getAnimationNode(animator: AnimatorBase, startNode: AnimationNodeBase, endNode: AnimationNodeBase, startTime: number): AnimationNodeBase;
	}
	export = IAnimationTransition;
	
}
declare module "awayjs-renderergl/lib/animators/SkeletonAnimator" {
	import TriangleSubGeometry = require("awayjs-display/lib/base/TriangleSubGeometry");
	import Camera = require("awayjs-display/lib/entities/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import SkeletonAnimationSet = require("awayjs-renderergl/lib/animators/SkeletonAnimationSet");
	import Skeleton = require("awayjs-renderergl/lib/animators/data/Skeleton");
	import SkeletonPose = require("awayjs-renderergl/lib/animators/data/SkeletonPose");
	import IAnimationTransition = require("awayjs-renderergl/lib/animators/transitions/IAnimationTransition");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import RenderableBase = require("awayjs-renderergl/lib/pool/RenderableBase");
	import TriangleSubMeshRenderable = require("awayjs-renderergl/lib/pool/TriangleSubMeshRenderable");
	/**
	 * Provides an interface for assigning skeleton-based animation data sets to mesh-based entity objects
	 * and controlling the various available states of animation through an interative playhead that can be
	 * automatically updated or manually triggered.
	 */
	class SkeletonAnimator extends AnimatorBase {
	    private _globalMatrices;
	    private _globalPose;
	    private _globalPropertiesDirty;
	    private _numJoints;
	    private _morphedSubGeometry;
	    private _morphedSubGeometryDirty;
	    private _condensedMatrices;
	    private _skeleton;
	    private _forceCPU;
	    private _useCondensedIndices;
	    private _jointsPerVertex;
	    private _activeSkeletonState;
	    private _onTransitionCompleteDelegate;
	    private _onIndicesUpdateDelegate;
	    private _onVerticesUpdateDelegate;
	    /**
	     * returns the calculated global matrices of the current skeleton pose.
	     *
	     * @see #globalPose
	     */
	    globalMatrices: number[];
	    /**
	     * returns the current skeleton pose output from the animator.
	     *
	     * @see away.animators.data.SkeletonPose
	     */
	    globalPose: SkeletonPose;
	    /**
	     * Returns the skeleton object in use by the animator - this defines the number and heirarchy of joints used by the
	     * skinned geoemtry to which skeleon animator is applied.
	     */
	    skeleton: Skeleton;
	    /**
	     * Indicates whether the skeleton animator is disabled by default for GPU rendering, something that allows the animator to perform calculation on the GPU.
	     * Defaults to false.
	     */
	    forceCPU: boolean;
	    /**
	     * Offers the option of enabling GPU accelerated animation on skeletons larger than 32 joints
	     * by condensing the number of joint index values required per mesh. Only applicable to
	     * skeleton animations that utilise more than one mesh object. Defaults to false.
	     */
	    useCondensedIndices: boolean;
	    /**
	     * Creates a new <code>SkeletonAnimator</code> object.
	     *
	     * @param skeletonAnimationSet The animation data set containing the skeleton animations used by the animator.
	     * @param skeleton The skeleton object used for calculating the resulting global matrices for transforming skinned mesh data.
	     * @param forceCPU Optional value that only allows the animator to perform calculation on the CPU. Defaults to false.
	     */
	    constructor(animationSet: SkeletonAnimationSet, skeleton: Skeleton, forceCPU?: boolean);
	    /**
	     * @inheritDoc
	     */
	    clone(): AnimatorBase;
	    /**
	     * Plays an animation state registered with the given name in the animation data set.
	     *
	     * @param name The data set name of the animation state to be played.
	     * @param transition An optional transition object that determines how the animator will transition from the currently active animation state.
	     * @param offset An option offset time (in milliseconds) that resets the state's internal clock to the absolute time of the animator plus the offset value. Required for non-looping animation states.
	     */
	    play(name: string, transition?: IAnimationTransition, offset?: number): void;
	    /**
	     * @inheritDoc
	     */
	    setRenderState(shaderObject: ShaderObjectBase, renderable: RenderableBase, stage: Stage, camera: Camera, vertexConstantOffset: number, vertexStreamOffset: number): void;
	    /**
	     * @inheritDoc
	     */
	    testGPUCompatibility(shaderObject: ShaderObjectBase): void;
	    /**
	     * Applies the calculated time delta to the active animation state node or state transition object.
	     */
	    _pUpdateDeltaTime(dt: number): void;
	    private updateCondensedMatrices(condensedIndexLookUp, numJoints);
	    private updateGlobalProperties();
	    getRenderableSubGeometry(renderable: TriangleSubMeshRenderable, sourceSubGeometry: TriangleSubGeometry): TriangleSubGeometry;
	    /**
	     * If the animation can't be performed on GPU, transform vertices manually
	     * @param subGeom The subgeometry containing the weights and joint index data per vertex.
	     * @param pass The material pass for which we need to transform the vertices
	     */
	    morphSubGeometry(renderable: TriangleSubMeshRenderable, sourceSubGeometry: TriangleSubGeometry): void;
	    /**
	     * Converts a local hierarchical skeleton pose to a global pose
	     * @param targetPose The SkeletonPose object that will contain the global pose.
	     * @param skeleton The skeleton containing the joints, and as such, the hierarchical data to transform to global poses.
	     */
	    private localToGlobalPose(sourcePose, targetPose, skeleton);
	    private onTransitionComplete(event);
	    private onIndicesUpdate(event);
	    private onVerticesUpdate(event);
	}
	export = SkeletonAnimator;
	
}
declare module "awayjs-renderergl/lib/animators/data/VertexAnimationMode" {
	/**
	 * Options for setting the animation mode of a vertex animator object.
	 *
	 * @see away.animators.VertexAnimator
	 */
	class VertexAnimationMode {
	    /**
	     * Animation mode that adds all outputs from active vertex animation state to form the current vertex animation pose.
	     */
	    static ADDITIVE: string;
	    /**
	     * Animation mode that picks the output from a single vertex animation state to form the current vertex animation pose.
	     */
	    static ABSOLUTE: string;
	}
	export = VertexAnimationMode;
	
}
declare module "awayjs-renderergl/lib/animators/VertexAnimationSet" {
	import IAnimationSet = require("awayjs-display/lib/animators/IAnimationSet");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import AnimationSetBase = require("awayjs-renderergl/lib/animators/AnimationSetBase");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	/**
	 * The animation data set used by vertex-based animators, containing vertex animation state data.
	 *
	 * @see VertexAnimator
	 */
	class VertexAnimationSet extends AnimationSetBase implements IAnimationSet {
	    private _numPoses;
	    private _blendMode;
	    /**
	     * Returns the number of poses made available at once to the GPU animation code.
	     */
	    numPoses: number;
	    /**
	     * Returns the active blend mode of the vertex animator object.
	     */
	    blendMode: string;
	    /**
	     * Returns whether or not normal data is used in last set GPU pass of the vertex shader.
	     */
	    /**
	     * Creates a new <code>VertexAnimationSet</code> object.
	     *
	     * @param numPoses The number of poses made available at once to the GPU animation code.
	     * @param blendMode Optional value for setting the animation mode of the vertex animator object.
	     *
	     * @see away3d.animators.data.VertexAnimationMode
	     */
	    constructor(numPoses?: number, blendMode?: string);
	    /**
	     * @inheritDoc
	     */
	    getAGALVertexCode(shaderObject: ShaderObjectBase): string;
	    /**
	     * @inheritDoc
	     */
	    activate(shaderObject: ShaderObjectBase, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    deactivate(shaderObject: ShaderObjectBase, stage: Stage): void;
	    /**
	     * @inheritDoc
	     */
	    getAGALFragmentCode(shaderObject: ShaderObjectBase, shadedTarget: string): string;
	    /**
	     * @inheritDoc
	     */
	    getAGALUVCode(shaderObject: ShaderObjectBase): string;
	    /**
	     * @inheritDoc
	     */
	    doneAGALCode(shaderObject: ShaderObjectBase): void;
	    /**
	     * Generates the vertex AGAL code for absolute blending.
	     */
	    private getAbsoluteAGALCode(shaderObject);
	    /**
	     * Generates the vertex AGAL code for additive blending.
	     */
	    private getAdditiveAGALCode(shaderObject);
	}
	export = VertexAnimationSet;
	
}
declare module "awayjs-renderergl/lib/animators/states/IVertexAnimationState" {
	import Geometry = require("awayjs-display/lib/base/Geometry");
	import IAnimationState = require("awayjs-renderergl/lib/animators/states/IAnimationState");
	/**
	 * Provides an interface for animation node classes that hold animation data for use in the Vertex animator class.
	 *
	 * @see away.animators.VertexAnimator
	 */
	interface IVertexAnimationState extends IAnimationState {
	    /**
	     * Returns the current geometry frame of animation in the clip based on the internal playhead position.
	     */
	    currentGeometry: Geometry;
	    /**
	     * Returns the current geometry frame of animation in the clip based on the internal playhead position.
	     */
	    nextGeometry: Geometry;
	    /**
	     * Returns a fractional value between 0 and 1 representing the blending ratio of the current playhead position
	     * between the current geometry frame (0) and next geometry frame (1) of the animation.
	     */
	    blendWeight: number;
	}
	export = IVertexAnimationState;
	
}
declare module "awayjs-renderergl/lib/animators/VertexAnimator" {
	import TriangleSubGeometry = require("awayjs-display/lib/base/TriangleSubGeometry");
	import Camera = require("awayjs-display/lib/entities/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import VertexAnimationSet = require("awayjs-renderergl/lib/animators/VertexAnimationSet");
	import IAnimationTransition = require("awayjs-renderergl/lib/animators/transitions/IAnimationTransition");
	import TriangleSubMeshRenderable = require("awayjs-renderergl/lib/pool/TriangleSubMeshRenderable");
	import RenderableBase = require("awayjs-renderergl/lib/pool/RenderableBase");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	/**
	 * Provides an interface for assigning vertex-based animation data sets to mesh-based entity objects
	 * and controlling the various available states of animation through an interative playhead that can be
	 * automatically updated or manually triggered.
	 */
	class VertexAnimator extends AnimatorBase {
	    private _vertexAnimationSet;
	    private _poses;
	    private _weights;
	    private _numPoses;
	    private _blendMode;
	    private _activeVertexState;
	    /**
	     * Creates a new <code>VertexAnimator</code> object.
	     *
	     * @param vertexAnimationSet The animation data set containing the vertex animations used by the animator.
	     */
	    constructor(vertexAnimationSet: VertexAnimationSet);
	    /**
	     * @inheritDoc
	     */
	    clone(): AnimatorBase;
	    /**
	     * Plays a sequence with a given name. If the sequence is not found, it may not be loaded yet, and it will retry every frame.
	     * @param sequenceName The name of the clip to be played.
	     */
	    play(name: string, transition?: IAnimationTransition, offset?: number): void;
	    /**
	     * @inheritDoc
	     */
	    _pUpdateDeltaTime(dt: number): void;
	    /**
	     * @inheritDoc
	     */
	    setRenderState(shaderObject: ShaderObjectBase, renderable: RenderableBase, stage: Stage, camera: Camera, vertexConstantOffset: number, vertexStreamOffset: number): void;
	    private setNullPose(shaderObject, renderable, stage, vertexConstantOffset, vertexStreamOffset);
	    /**
	     * Verifies if the animation will be used on cpu. Needs to be true for all passes for a material to be able to use it on gpu.
	     * Needs to be called if gpu code is potentially required.
	     */
	    testGPUCompatibility(shaderObject: ShaderObjectBase): void;
	    getRenderableSubGeometry(renderable: TriangleSubMeshRenderable, sourceSubGeometry: TriangleSubGeometry): TriangleSubGeometry;
	}
	export = VertexAnimator;
	
}
declare module "awayjs-renderergl/lib/passes/IRenderLightingPass" {
	import LightPickerBase = require("awayjs-display/lib/materials/lightpickers/LightPickerBase");
	import ShaderLightingObject = require("awayjs-renderergl/lib/compilation/ShaderLightingObject");
	import ShaderRegisterCache = require("awayjs-renderergl/lib/compilation/ShaderRegisterCache");
	import ShaderRegisterData = require("awayjs-renderergl/lib/compilation/ShaderRegisterData");
	import ShaderRegisterElement = require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
	import IRenderPassBase = require("awayjs-renderergl/lib/passes/IRenderPassBase");
	/**
	 *
	 * @class away.pool.ScreenPasses
	 */
	interface IRenderLightingPass extends IRenderPassBase {
	    enableLightFallOff: boolean;
	    diffuseLightSources: number;
	    specularLightSources: number;
	    numDirectionalLights: number;
	    numPointLights: number;
	    numLightProbes: number;
	    pointLightsOffset: number;
	    directionalLightsOffset: number;
	    lightProbesOffset: number;
	    lightPicker: LightPickerBase;
	    _iGetPerLightDiffuseFragmentCode(shaderObject: ShaderLightingObject, lightDirReg: ShaderRegisterElement, diffuseColorReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    _iGetPerLightSpecularFragmentCode(shaderObject: ShaderLightingObject, lightDirReg: ShaderRegisterElement, specularColorReg: ShaderRegisterElement, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    _iGetPerProbeDiffuseFragmentCode(shaderObject: ShaderLightingObject, texReg: ShaderRegisterElement, weightReg: string, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    _iGetPerProbeSpecularFragmentCode(shaderObject: ShaderLightingObject, texReg: ShaderRegisterElement, weightReg: string, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    _iGetPostLightingVertexCode(shaderObject: ShaderLightingObject, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    _iGetPostLightingFragmentCode(shaderObject: ShaderLightingObject, registerCache: ShaderRegisterCache, sharedRegisters: ShaderRegisterData): string;
	    /**
	     * Indicates whether the shader uses any shadows.
	     */
	    _iUsesShadows(shaderObject: ShaderLightingObject): boolean;
	    /**
	     * Indicates whether the shader uses any specular component.
	     */
	    _iUsesSpecular(shaderObject: ShaderLightingObject): boolean;
	    /**
	     * Indicates whether the shader uses any diffuse component.
	     */
	    _iUsesDiffuse(shaderObject: ShaderLightingObject): boolean;
	}
	export = IRenderLightingPass;
	
}
declare module "awayjs-renderergl/lib/compilation/ShaderLightingObject" {
	import Matrix3D = require("awayjs-core/lib/geom/Matrix3D");
	import Camera = require("awayjs-display/lib/entities/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import IRenderLightingPass = require("awayjs-renderergl/lib/passes/IRenderLightingPass");
	import RenderableBase = require("awayjs-renderergl/lib/pool/RenderableBase");
	import ShaderCompilerBase = require("awayjs-renderergl/lib/compilation/ShaderCompilerBase");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import IRenderableClass = require("awayjs-renderergl/lib/pool/IRenderableClass");
	/**
	 * ShaderObjectBase keeps track of the number of dependencies for "named registers" used across a pass.
	 * Named registers are that are not necessarily limited to a single method. They are created by the compiler and
	 * passed on to methods. The compiler uses the results to reserve usages through RegisterPool, which can be removed
	 * each time a method has been compiled into the shader.
	 *
	 * @see RegisterPool.addUsage
	 */
	class ShaderLightingObject extends ShaderObjectBase {
	    _renderLightingPass: IRenderLightingPass;
	    private _includeCasters;
	    /**
	     * The first index for the fragment constants containing the light data.
	     */
	    lightFragmentConstantIndex: number;
	    /**
	     * The starting index if the vertex constant to which light data needs to be uploaded.
	     */
	    lightVertexConstantIndex: number;
	    /**
	     * Indices for the light probe diffuse textures.
	     */
	    lightProbeDiffuseIndices: number[];
	    /**
	     * Indices for the light probe specular textures.
	     */
	    lightProbeSpecularIndices: number[];
	    /**
	     * The index of the fragment constant containing the weights for the light probes.
	     */
	    probeWeightsIndex: number;
	    numLights: number;
	    numDirectionalLights: number;
	    numPointLights: number;
	    numLightProbes: number;
	    usesLightFallOff: boolean;
	    usesShadows: boolean;
	    /**
	     * Indicates whether the shader uses any lights.
	     */
	    usesLights: boolean;
	    /**
	     * Indicates whether the shader uses any light probes.
	     */
	    usesProbes: boolean;
	    /**
	     * Indicates whether the lights uses any specular components.
	     */
	    usesLightsForSpecular: boolean;
	    /**
	     * Indicates whether the probes uses any specular components.
	     */
	    usesProbesForSpecular: boolean;
	    /**
	     * Indicates whether the lights uses any diffuse components.
	     */
	    usesLightsForDiffuse: boolean;
	    /**
	     * Indicates whether the probes uses any diffuse components.
	     */
	    usesProbesForDiffuse: boolean;
	    /**
	     * Creates a new MethodCompilerVO object.
	     */
	    constructor(renderableClass: IRenderableClass, renderLightingPass: IRenderLightingPass, stage: Stage);
	    _iIncludeDependencies(): void;
	    /**
	     * Factory method to create a concrete compiler object for this object
	     *
	     * @param materialPassVO
	     * @returns {away.materials.ShaderLightingCompiler}
	     */
	    createCompiler(renderableClass: IRenderableClass, renderPass: IRenderLightingPass): ShaderCompilerBase;
	    /**
	     * Clears dependency counts for all registers. Called when recompiling a pass.
	     */
	    reset(): void;
	    /**
	     *
	     *
	     * @param renderable
	     * @param stage
	     * @param camera
	     */
	    _iRender(renderable: RenderableBase, camera: Camera, viewProjection: Matrix3D): void;
	    /**
	     * Updates constant data render state used by the lights. This method is optional for subclasses to implement.
	     */
	    private updateLights();
	    /**
	     * Updates constant data render state used by the light probes. This method is optional for subclasses to implement.
	     */
	    private updateProbes();
	}
	export = ShaderLightingObject;
	
}
declare module "awayjs-renderergl/lib/compilation/ShaderLightingCompiler" {
	import ShaderLightingObject = require("awayjs-renderergl/lib/compilation/ShaderLightingObject");
	import ShaderCompilerBase = require("awayjs-renderergl/lib/compilation/ShaderCompilerBase");
	import ShaderRegisterElement = require("awayjs-renderergl/lib/compilation/ShaderRegisterElement");
	import IRenderLightingPass = require("awayjs-renderergl/lib/passes/IRenderLightingPass");
	import IRenderableClass = require("awayjs-renderergl/lib/pool/IRenderableClass");
	/**
	 * ShaderCompilerBase is an abstract base class for shader compilers that use modular shader methods to assemble a
	 * material. Concrete subclasses are used by the default materials.
	 *
	 * @see away.materials.ShadingMethodBase
	 */
	class ShaderLightingCompiler extends ShaderCompilerBase {
	    private _shaderLightingObject;
	    private _renderLightingPass;
	    _pointLightFragmentConstants: ShaderRegisterElement[];
	    _pointLightVertexConstants: ShaderRegisterElement[];
	    _dirLightFragmentConstants: ShaderRegisterElement[];
	    _dirLightVertexConstants: ShaderRegisterElement[];
	    _pNumProbeRegisters: number;
	    /**
	     * Creates a new ShaderCompilerBase object.
	     * @param profile The compatibility profile of the renderer.
	     */
	    constructor(renderableClass: IRenderableClass, renderLightingPass: IRenderLightingPass, shaderLightingObject: ShaderLightingObject);
	    /**
	     * Compile the code for the methods.
	     */
	    pCompileDependencies(): void;
	    /**
	     * Provides the code to provide shadow mapping.
	     */
	    pCompileShadowCode(): void;
	    /**
	     * Initializes constant registers to contain light data.
	     */
	    private initLightRegisters();
	    /**
	     * Compiles the shading code for directional and point lights.
	     */
	    private compileLightCode();
	    /**
	     * Compiles shading code for light probes.
	     */
	    private compileLightProbeCode();
	    /**
	     * Reset all the indices to "unused".
	     */
	    pInitRegisterIndices(): void;
	}
	export = ShaderLightingCompiler;
	
}
declare module "awayjs-renderergl/lib/events/ShadingMethodEvent" {
	import Event = require("awayjs-core/lib/events/Event");
	class ShadingMethodEvent extends Event {
	    static SHADER_INVALIDATED: string;
	    constructor(type: string);
	}
	export = ShadingMethodEvent;
	
}
declare module "awayjs-renderergl/lib/managers/DefaultMaterialManager" {
	import BitmapData = require("awayjs-core/lib/base/BitmapData");
	import BitmapTexture = require("awayjs-core/lib/textures/BitmapTexture");
	import IRenderableOwner = require("awayjs-display/lib/base/IRenderableOwner");
	import BasicMaterial = require("awayjs-display/lib/materials/BasicMaterial");
	class DefaultMaterialManager {
	    private static _defaultBitmapData;
	    private static _defaultTriangleMaterial;
	    private static _defaultLineMaterial;
	    private static _defaultTexture;
	    static getDefaultMaterial(renderableOwner?: IRenderableOwner): BasicMaterial;
	    static getDefaultTexture(renderableOwner?: IRenderableOwner): BitmapTexture;
	    private static createDefaultTexture();
	    static createCheckeredBitmapData(): BitmapData;
	    private static createDefaultTriangleMaterial();
	    private static createDefaultLineMaterial();
	}
	export = DefaultMaterialManager;
	
}
declare module "awayjs-renderergl/lib/pick/PickingColliderBase" {
	import Point = require("awayjs-core/lib/geom/Point");
	import Vector3D = require("awayjs-core/lib/geom/Vector3D");
	import PickingCollisionVO = require("awayjs-display/lib/pick/PickingCollisionVO");
	import Billboard = require("awayjs-display/lib/entities/Billboard");
	import Mesh = require("awayjs-display/lib/entities/Mesh");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import RenderableBase = require("awayjs-renderergl/lib/pool/RenderableBase");
	/**
	 * An abstract base class for all picking collider classes. It should not be instantiated directly.
	 *
	 * @class away.pick.PickingColliderBase
	 */
	class PickingColliderBase {
	    private _billboardRenderablePool;
	    private _subMeshRenderablePool;
	    rayPosition: Vector3D;
	    rayDirection: Vector3D;
	    constructor(stage: Stage);
	    _pPetCollisionNormal(indexData: number[], vertexData: number[], triangleIndex: number): Vector3D;
	    _pGetCollisionUV(indexData: number[], uvData: number[], triangleIndex: number, v: number, w: number, u: number, uvOffset: number, uvStride: number): Point;
	    /**
	     * @inheritDoc
	     */
	    _pTestRenderableCollision(renderable: RenderableBase, pickingCollisionVO: PickingCollisionVO, shortestCollisionDistance: number): boolean;
	    /**
	     * @inheritDoc
	     */
	    setLocalRay(localPosition: Vector3D, localDirection: Vector3D): void;
	    /**
	     * Tests a <code>Billboard</code> object for a collision with the picking ray.
	     *
	     * @param billboard The billboard instance to be tested.
	     * @param pickingCollisionVO The collision object used to store the collision results
	     * @param shortestCollisionDistance The current value of the shortest distance to a detected collision along the ray.
	     * @param findClosest
	     */
	    testBillboardCollision(billboard: Billboard, pickingCollisionVO: PickingCollisionVO, shortestCollisionDistance: number): boolean;
	    /**
	     * Tests a <code>Mesh</code> object for a collision with the picking ray.
	     *
	     * @param mesh The mesh instance to be tested.
	     * @param pickingCollisionVO The collision object used to store the collision results
	     * @param shortestCollisionDistance The current value of the shortest distance to a detected collision along the ray.
	     * @param findClosest
	     */
	    testMeshCollision(mesh: Mesh, pickingCollisionVO: PickingCollisionVO, shortestCollisionDistance: number, findClosest: boolean): boolean;
	}
	export = PickingColliderBase;
	
}
declare module "awayjs-renderergl/lib/pick/JSPickingCollider" {
	import PickingCollisionVO = require("awayjs-display/lib/pick/PickingCollisionVO");
	import IPickingCollider = require("awayjs-display/lib/pick/IPickingCollider");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import PickingColliderBase = require("awayjs-renderergl/lib/pick/PickingColliderBase");
	import RenderableBase = require("awayjs-renderergl/lib/pool/RenderableBase");
	/**
	 * Pure JS picking collider for display objects. Used with the <code>RaycastPicker</code> picking object.
	 *
	 * @see away.base.DisplayObject#pickingCollider
	 * @see away.pick.RaycastPicker
	 *
	 * @class away.pick.JSPickingCollider
	 */
	class JSPickingCollider extends PickingColliderBase implements IPickingCollider {
	    private _findClosestCollision;
	    /**
	     * Creates a new <code>JSPickingCollider</code> object.
	     *
	     * @param findClosestCollision Determines whether the picking collider searches for the closest collision along the ray. Defaults to false.
	     */
	    constructor(stage: Stage, findClosestCollision?: boolean);
	    /**
	     * @inheritDoc
	     */
	    _pTestRenderableCollision(renderable: RenderableBase, pickingCollisionVO: PickingCollisionVO, shortestCollisionDistance: number): boolean;
	}
	export = JSPickingCollider;
	
}
declare module "awayjs-renderergl/lib/pick/ShaderPicker" {
	import Vector3D = require("awayjs-core/lib/geom/Vector3D");
	import Scene = require("awayjs-display/lib/containers/Scene");
	import View = require("awayjs-display/lib/containers/View");
	import IPicker = require("awayjs-display/lib/pick/IPicker");
	import PickingCollisionVO = require("awayjs-display/lib/pick/PickingCollisionVO");
	import EntityCollector = require("awayjs-display/lib/traverse/EntityCollector");
	import ITextureBase = require("awayjs-stagegl/lib/base/ITextureBase");
	/**
	 * Picks a 3d object from a view or scene by performing a separate render pass on the scene around the area being picked using key color values,
	 * then reading back the color value of the pixel in the render representing the picking ray. Requires multiple passes and readbacks for retriving details
	 * on an entity that has its shaderPickingDetails property set to true.
	 *
	 * A read-back operation from any GPU is not a very efficient process, and the amount of processing used can vary significantly between different hardware.
	 *
	 * @see away.entities.Entity#shaderPickingDetails
	 *
	 * @class away.pick.ShaderPicker
	 */
	class ShaderPicker implements IPicker {
	    private _opaqueRenderableHead;
	    private _blendedRenderableHead;
	    private _stage;
	    private _context;
	    private _onlyMouseEnabled;
	    private _objectProgram;
	    private _triangleProgram;
	    private _bitmapData;
	    private _viewportData;
	    private _boundOffsetScale;
	    private _id;
	    private _interactives;
	    private _interactiveId;
	    private _hitColor;
	    private _projX;
	    private _projY;
	    private _hitRenderable;
	    private _hitEntity;
	    private _localHitPosition;
	    private _hitUV;
	    private _faceIndex;
	    private _subGeometryIndex;
	    private _localHitNormal;
	    private _rayPos;
	    private _rayDir;
	    private _potentialFound;
	    private static MOUSE_SCISSOR_RECT;
	    private _shaderPickingDetails;
	    /**
	     * @inheritDoc
	     */
	    onlyMouseEnabled: boolean;
	    /**
	     * Creates a new <code>ShaderPicker</code> object.
	     *
	     * @param shaderPickingDetails Determines whether the picker includes a second pass to calculate extra
	     * properties such as uv and normal coordinates.
	     */
	    constructor(shaderPickingDetails?: boolean);
	    /**
	     * @inheritDoc
	     */
	    getViewCollision(x: number, y: number, view: View): PickingCollisionVO;
	    /**
	     * @inheritDoc
	     */
	    getSceneCollision(position: Vector3D, direction: Vector3D, scene: Scene): PickingCollisionVO;
	    /**
	     * @inheritDoc
	     */
	    pDraw(entityCollector: EntityCollector, target: ITextureBase): void;
	    /**
	     * Draw a list of renderables.
	     * @param renderables The renderables to draw.
	     * @param camera The camera for which to render.
	     */
	    private drawRenderables(renderable, camera);
	    private updateRay(camera);
	    /**
	     * Creates the Program that color-codes objects.
	     */
	    private initObjectProgram();
	    /**
	     * Creates the Program that renders positions.
	     */
	    private initTriangleProgram();
	    /**
	     * Gets more detailed information about the hir position, if required.
	     * @param camera The camera used to view the hit object.
	     */
	    private getHitDetails(camera);
	    /**
	     * Finds a first-guess approximate position about the hit position.
	     *
	     * @param camera The camera used to view the hit object.
	     */
	    private getApproximatePosition(camera);
	    /**
	     * Use the approximate position info to find the face under the mouse position from which we can derive the precise
	     * ray-face intersection point, then use barycentric coordinates to figure out the uv coordinates, etc.
	     * @param camera The camera used to view the hit object.
	     */
	    private getPreciseDetails(camera);
	    /**
	     * Finds the precise hit position by unprojecting the screen coordinate back unto the hit face's plane and
	     * calculating the intersection point.
	     * @param camera The camera used to render the object.
	     * @param invSceneTransform The inverse scene transformation of the hit object.
	     * @param nx The x-coordinate of the face's plane normal.
	     * @param ny The y-coordinate of the face plane normal.
	     * @param nz The z-coordinate of the face plane normal.
	     * @param px The x-coordinate of a point on the face's plane (ie a face vertex)
	     * @param py The y-coordinate of a point on the face's plane (ie a face vertex)
	     * @param pz The z-coordinate of a point on the face's plane (ie a face vertex)
	     */
	    private getPrecisePosition(invSceneTransform, nx, ny, nz, px, py, pz);
	    dispose(): void;
	}
	export = ShaderPicker;
	
}
declare module "awayjs-renderergl/lib/tools/data/ParticleGeometryTransform" {
	import Matrix = require("awayjs-core/lib/geom/Matrix");
	import Matrix3D = require("awayjs-core/lib/geom/Matrix3D");
	/**
	 * ...
	 */
	class ParticleGeometryTransform {
	    private _defaultVertexTransform;
	    private _defaultInvVertexTransform;
	    private _defaultUVTransform;
	    vertexTransform: Matrix3D;
	    UVTransform: Matrix;
	    invVertexTransform: Matrix3D;
	}
	export = ParticleGeometryTransform;
	
}
declare module "awayjs-renderergl/lib/utils/ParticleGeometryHelper" {
	import Geometry = require("awayjs-display/lib/base/Geometry");
	import ParticleGeometry = require("awayjs-renderergl/lib/base/ParticleGeometry");
	import ParticleGeometryTransform = require("awayjs-renderergl/lib/tools/data/ParticleGeometryTransform");
	/**
	 * ...
	 */
	class ParticleGeometryHelper {
	    static MAX_VERTEX: number;
	    static generateGeometry(geometries: Geometry[], transforms?: ParticleGeometryTransform[]): ParticleGeometry;
	}
	export = ParticleGeometryHelper;
	
}
declare module "awayjs-renderergl/lib/utils/PerspectiveMatrix3D" {
	import Matrix3D = require("awayjs-core/lib/geom/Matrix3D");
	/**
	 *
	 */
	class PerspectiveMatrix3D extends Matrix3D {
	    constructor(v?: number[]);
	    perspectiveFieldOfViewLH(fieldOfViewY: number, aspectRatio: number, zNear: number, zFar: number): void;
	}
	export = PerspectiveMatrix3D;
	
}
declare module "awayjs-renderergl/lib/animators/data/ColorSegmentPoint" {
	import ColorTransform = require("awayjs-core/lib/geom/ColorTransform");
	class ColorSegmentPoint {
	    private _color;
	    private _life;
	    constructor(life: number, color: ColorTransform);
	    color: ColorTransform;
	    life: number;
	}
	export = ColorSegmentPoint;
	
}
declare module "awayjs-renderergl/lib/animators/nodes/AnimationClipNodeBase" {
	import Vector3D = require("awayjs-core/lib/geom/Vector3D");
	import AnimationNodeBase = require("awayjs-display/lib/animators/nodes/AnimationNodeBase");
	/**
	 * Provides an abstract base class for nodes with time-based animation data in an animation blend tree.
	 */
	class AnimationClipNodeBase extends AnimationNodeBase {
	    _pLooping: boolean;
	    _pTotalDuration: number;
	    _pLastFrame: number;
	    _pStitchDirty: boolean;
	    _pStitchFinalFrame: boolean;
	    _pNumFrames: number;
	    _pDurations: number[];
	    _pTotalDelta: Vector3D;
	    fixedFrameRate: boolean;
	    /**
	     * Determines whether the contents of the animation node have looping characteristics enabled.
	     */
	    looping: boolean;
	    /**
	     * Defines if looping content blends the final frame of animation data with the first (true) or works on the
	     * assumption that both first and last frames are identical (false). Defaults to false.
	     */
	    stitchFinalFrame: boolean;
	    totalDuration: number;
	    totalDelta: Vector3D;
	    lastFrame: number;
	    /**
	     * Returns a vector of time values representing the duration (in milliseconds) of each animation frame in the clip.
	     */
	    durations: number[];
	    /**
	     * Creates a new <code>AnimationClipNodeBase</code> object.
	     */
	    constructor();
	    /**
	     * Updates the node's final frame stitch state.
	     *
	     * @see #stitchFinalFrame
	     */
	    _pUpdateStitch(): void;
	}
	export = AnimationClipNodeBase;
	
}
declare module "awayjs-renderergl/lib/animators/states/ParticleAccelerationState" {
	import Vector3D = require("awayjs-core/lib/geom/Vector3D");
	import Camera = require("awayjs-display/lib/entities/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ParticleAnimator = require("awayjs-renderergl/lib/animators/ParticleAnimator");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import AnimationSubGeometry = require("awayjs-renderergl/lib/animators/data/AnimationSubGeometry");
	import ParticleAccelerationNode = require("awayjs-renderergl/lib/animators/nodes/ParticleAccelerationNode");
	import ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
	import RenderableBase = require("awayjs-renderergl/lib/pool/RenderableBase");
	/**
	 * ...
	 */
	class ParticleAccelerationState extends ParticleStateBase {
	    /** @private */
	    static ACCELERATION_INDEX: number;
	    private _particleAccelerationNode;
	    private _acceleration;
	    private _halfAcceleration;
	    /**
	     * Defines the acceleration vector of the state, used when in global mode.
	     */
	    acceleration: Vector3D;
	    constructor(animator: ParticleAnimator, particleAccelerationNode: ParticleAccelerationNode);
	    /**
	     * @inheritDoc
	     */
	    setRenderState(stage: Stage, renderable: RenderableBase, animationSubGeometry: AnimationSubGeometry, animationRegisterCache: AnimationRegisterCache, camera: Camera): void;
	    private updateAccelerationData();
	}
	export = ParticleAccelerationState;
	
}
declare module "awayjs-renderergl/lib/animators/nodes/ParticleAccelerationNode" {
	import Vector3D = require("awayjs-core/lib/geom/Vector3D");
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ParticleProperties = require("awayjs-renderergl/lib/animators/data/ParticleProperties");
	import ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
	import ParticleAccelerationState = require("awayjs-renderergl/lib/animators/states/ParticleAccelerationState");
	/**
	 * A particle animation node used to apply a constant acceleration vector to the motion of a particle.
	 */
	class ParticleAccelerationNode extends ParticleNodeBase {
	    /** @private */
	    _acceleration: Vector3D;
	    /**
	     * Reference for acceleration node properties on a single particle (when in local property mode).
	     * Expects a <code>Vector3D</code> object representing the direction of acceleration on the particle.
	     */
	    static ACCELERATION_VECTOR3D: string;
	    /**
	     * Creates a new <code>ParticleAccelerationNode</code>
	     *
	     * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
	     * @param    [optional] acceleration    Defines the default acceleration vector of the node, used when in global mode.
	     */
	    constructor(mode: number, acceleration?: Vector3D);
	    /**
	     * @inheritDoc
	     */
	    pGetAGALVertexCode(shaderObject: ShaderObjectBase, animationRegisterCache: AnimationRegisterCache): string;
	    /**
	     * @inheritDoc
	     */
	    getAnimationState(animator: AnimatorBase): ParticleAccelerationState;
	    /**
	     * @inheritDoc
	     */
	    _iGeneratePropertyOfOneParticle(param: ParticleProperties): void;
	}
	export = ParticleAccelerationNode;
	
}
declare module "awayjs-renderergl/lib/animators/states/ParticleBezierCurveState" {
	import Vector3D = require("awayjs-core/lib/geom/Vector3D");
	import Camera = require("awayjs-display/lib/entities/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ParticleAnimator = require("awayjs-renderergl/lib/animators/ParticleAnimator");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import AnimationSubGeometry = require("awayjs-renderergl/lib/animators/data/AnimationSubGeometry");
	import ParticleBezierCurveNode = require("awayjs-renderergl/lib/animators/nodes/ParticleBezierCurveNode");
	import ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
	import RenderableBase = require("awayjs-renderergl/lib/pool/RenderableBase");
	/**
	 * ...
	 */
	class ParticleBezierCurveState extends ParticleStateBase {
	    /** @private */
	    static BEZIER_CONTROL_INDEX: number;
	    /** @private */
	    static BEZIER_END_INDEX: number;
	    private _particleBezierCurveNode;
	    private _controlPoint;
	    private _endPoint;
	    /**
	     * Defines the default control point of the node, used when in global mode.
	     */
	    controlPoint: Vector3D;
	    /**
	     * Defines the default end point of the node, used when in global mode.
	     */
	    endPoint: Vector3D;
	    constructor(animator: ParticleAnimator, particleBezierCurveNode: ParticleBezierCurveNode);
	    setRenderState(stage: Stage, renderable: RenderableBase, animationSubGeometry: AnimationSubGeometry, animationRegisterCache: AnimationRegisterCache, camera: Camera): void;
	}
	export = ParticleBezierCurveState;
	
}
declare module "awayjs-renderergl/lib/animators/nodes/ParticleBezierCurveNode" {
	import Vector3D = require("awayjs-core/lib/geom/Vector3D");
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ParticleProperties = require("awayjs-renderergl/lib/animators/data/ParticleProperties");
	import ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
	import ParticleBezierCurveState = require("awayjs-renderergl/lib/animators/states/ParticleBezierCurveState");
	/**
	 * A particle animation node used to control the position of a particle over time along a bezier curve.
	 */
	class ParticleBezierCurveNode extends ParticleNodeBase {
	    /** @private */
	    _iControlPoint: Vector3D;
	    /** @private */
	    _iEndPoint: Vector3D;
	    /**
	     * Reference for bezier curve node properties on a single particle (when in local property mode).
	     * Expects a <code>Vector3D</code> object representing the control point position (0, 1, 2) of the curve.
	     */
	    static BEZIER_CONTROL_VECTOR3D: string;
	    /**
	     * Reference for bezier curve node properties on a single particle (when in local property mode).
	     * Expects a <code>Vector3D</code> object representing the end point position (0, 1, 2) of the curve.
	     */
	    static BEZIER_END_VECTOR3D: string;
	    /**
	     * Creates a new <code>ParticleBezierCurveNode</code>
	     *
	     * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
	     * @param    [optional] controlPoint    Defines the default control point of the node, used when in global mode.
	     * @param    [optional] endPoint        Defines the default end point of the node, used when in global mode.
	     */
	    constructor(mode: number, controlPoint?: Vector3D, endPoint?: Vector3D);
	    /**
	     * @inheritDoc
	     */
	    getAGALVertexCode(shaderObject: ShaderObjectBase, animationRegisterCache: AnimationRegisterCache): string;
	    /**
	     * @inheritDoc
	     */
	    getAnimationState(animator: AnimatorBase): ParticleBezierCurveState;
	    /**
	     * @inheritDoc
	     */
	    _iGeneratePropertyOfOneParticle(param: ParticleProperties): void;
	}
	export = ParticleBezierCurveNode;
	
}
declare module "awayjs-renderergl/lib/animators/states/ParticleBillboardState" {
	import Vector3D = require("awayjs-core/lib/geom/Vector3D");
	import Camera = require("awayjs-display/lib/entities/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ParticleAnimator = require("awayjs-renderergl/lib/animators/ParticleAnimator");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import AnimationSubGeometry = require("awayjs-renderergl/lib/animators/data/AnimationSubGeometry");
	import ParticleBillboardNode = require("awayjs-renderergl/lib/animators/nodes/ParticleBillboardNode");
	import ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
	import RenderableBase = require("awayjs-renderergl/lib/pool/RenderableBase");
	/**
	 * ...
	 */
	class ParticleBillboardState extends ParticleStateBase {
	    /** @private */
	    static MATRIX_INDEX: number;
	    private _matrix;
	    private _billboardAxis;
	    /**
	     *
	     */
	    constructor(animator: ParticleAnimator, particleNode: ParticleBillboardNode);
	    setRenderState(stage: Stage, renderable: RenderableBase, animationSubGeometry: AnimationSubGeometry, animationRegisterCache: AnimationRegisterCache, camera: Camera): void;
	    /**
	     * Defines the billboard axis.
	     */
	    billboardAxis: Vector3D;
	}
	export = ParticleBillboardState;
	
}
declare module "awayjs-renderergl/lib/animators/nodes/ParticleBillboardNode" {
	import Vector3D = require("awayjs-core/lib/geom/Vector3D");
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ParticleAnimationSet = require("awayjs-renderergl/lib/animators/ParticleAnimationSet");
	import ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
	import ParticleBillboardState = require("awayjs-renderergl/lib/animators/states/ParticleBillboardState");
	/**
	 * A particle animation node that controls the rotation of a particle to always face the camera.
	 */
	class ParticleBillboardNode extends ParticleNodeBase {
	    /** @private */
	    _iBillboardAxis: Vector3D;
	    /**
	     * Creates a new <code>ParticleBillboardNode</code>
	     */
	    constructor(billboardAxis?: Vector3D);
	    /**
	     * @inheritDoc
	     */
	    getAGALVertexCode(shaderObject: ShaderObjectBase, animationRegisterCache: AnimationRegisterCache): string;
	    /**
	     * @inheritDoc
	     */
	    getAnimationState(animator: AnimatorBase): ParticleBillboardState;
	    /**
	     * @inheritDoc
	     */
	    _iProcessAnimationSetting(particleAnimationSet: ParticleAnimationSet): void;
	}
	export = ParticleBillboardNode;
	
}
declare module "awayjs-renderergl/lib/animators/states/ParticleColorState" {
	import ColorTransform = require("awayjs-core/lib/geom/ColorTransform");
	import Camera = require("awayjs-display/lib/entities/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ParticleAnimator = require("awayjs-renderergl/lib/animators/ParticleAnimator");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import AnimationSubGeometry = require("awayjs-renderergl/lib/animators/data/AnimationSubGeometry");
	import ParticleColorNode = require("awayjs-renderergl/lib/animators/nodes/ParticleColorNode");
	import ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
	import RenderableBase = require("awayjs-renderergl/lib/pool/RenderableBase");
	/**
	 * ...
	 * @author ...
	 */
	class ParticleColorState extends ParticleStateBase {
	    /** @private */
	    static START_MULTIPLIER_INDEX: number;
	    /** @private */
	    static DELTA_MULTIPLIER_INDEX: number;
	    /** @private */
	    static START_OFFSET_INDEX: number;
	    /** @private */
	    static DELTA_OFFSET_INDEX: number;
	    /** @private */
	    static CYCLE_INDEX: number;
	    private _particleColorNode;
	    private _usesMultiplier;
	    private _usesOffset;
	    private _usesCycle;
	    private _usesPhase;
	    private _startColor;
	    private _endColor;
	    private _cycleDuration;
	    private _cyclePhase;
	    private _cycleData;
	    private _startMultiplierData;
	    private _deltaMultiplierData;
	    private _startOffsetData;
	    private _deltaOffsetData;
	    /**
	     * Defines the start color transform of the state, when in global mode.
	     */
	    startColor: ColorTransform;
	    /**
	     * Defines the end color transform of the state, when in global mode.
	     */
	    endColor: ColorTransform;
	    /**
	     * Defines the duration of the animation in seconds, used as a period independent of particle duration when in global mode. Defaults to 1.
	     */
	    cycleDuration: number;
	    /**
	     * Defines the phase of the cycle in degrees, used as the starting offset of the cycle when in global mode. Defaults to 0.
	     */
	    cyclePhase: number;
	    constructor(animator: ParticleAnimator, particleColorNode: ParticleColorNode);
	    setRenderState(stage: Stage, renderable: RenderableBase, animationSubGeometry: AnimationSubGeometry, animationRegisterCache: AnimationRegisterCache, camera: Camera): void;
	    private updateColorData();
	}
	export = ParticleColorState;
	
}
declare module "awayjs-renderergl/lib/animators/nodes/ParticleColorNode" {
	import ColorTransform = require("awayjs-core/lib/geom/ColorTransform");
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ParticleAnimationSet = require("awayjs-renderergl/lib/animators/ParticleAnimationSet");
	import ParticleProperties = require("awayjs-renderergl/lib/animators/data/ParticleProperties");
	import ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
	import ParticleColorState = require("awayjs-renderergl/lib/animators/states/ParticleColorState");
	/**
	 * A particle animation node used to control the color variation of a particle over time.
	 */
	class ParticleColorNode extends ParticleNodeBase {
	    /** @private */
	    _iUsesMultiplier: boolean;
	    /** @private */
	    _iUsesOffset: boolean;
	    /** @private */
	    _iUsesCycle: boolean;
	    /** @private */
	    _iUsesPhase: boolean;
	    /** @private */
	    _iStartColor: ColorTransform;
	    /** @private */
	    _iEndColor: ColorTransform;
	    /** @private */
	    _iCycleDuration: number;
	    /** @private */
	    _iCyclePhase: number;
	    /**
	     * Reference for color node properties on a single particle (when in local property mode).
	     * Expects a <code>ColorTransform</code> object representing the start color transform applied to the particle.
	     */
	    static COLOR_START_COLORTRANSFORM: string;
	    /**
	     * Reference for color node properties on a single particle (when in local property mode).
	     * Expects a <code>ColorTransform</code> object representing the end color transform applied to the particle.
	     */
	    static COLOR_END_COLORTRANSFORM: string;
	    /**
	     * Creates a new <code>ParticleColorNode</code>
	     *
	     * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
	     * @param    [optional] usesMultiplier  Defines whether the node uses multiplier data in the shader for its color transformations. Defaults to true.
	     * @param    [optional] usesOffset      Defines whether the node uses offset data in the shader for its color transformations. Defaults to true.
	     * @param    [optional] usesCycle       Defines whether the node uses the <code>cycleDuration</code> property in the shader to calculate the period of the animation independent of particle duration. Defaults to false.
	     * @param    [optional] usesPhase       Defines whether the node uses the <code>cyclePhase</code> property in the shader to calculate a starting offset to the cycle rotation of the particle. Defaults to false.
	     * @param    [optional] startColor      Defines the default start color transform of the node, when in global mode.
	     * @param    [optional] endColor        Defines the default end color transform of the node, when in global mode.
	     * @param    [optional] cycleDuration   Defines the duration of the animation in seconds, used as a period independent of particle duration when in global mode. Defaults to 1.
	     * @param    [optional] cyclePhase      Defines the phase of the cycle in degrees, used as the starting offset of the cycle when in global mode. Defaults to 0.
	     */
	    constructor(mode: number, usesMultiplier?: boolean, usesOffset?: boolean, usesCycle?: boolean, usesPhase?: boolean, startColor?: ColorTransform, endColor?: ColorTransform, cycleDuration?: number, cyclePhase?: number);
	    /**
	     * @inheritDoc
	     */
	    getAGALVertexCode(shaderObject: ShaderObjectBase, animationRegisterCache: AnimationRegisterCache): string;
	    /**
	     * @inheritDoc
	     */
	    getAnimationState(animator: AnimatorBase): ParticleColorState;
	    /**
	     * @inheritDoc
	     */
	    _iProcessAnimationSetting(particleAnimationSet: ParticleAnimationSet): void;
	    /**
	     * @inheritDoc
	     */
	    _iGeneratePropertyOfOneParticle(param: ParticleProperties): void;
	}
	export = ParticleColorNode;
	
}
declare module "awayjs-renderergl/lib/animators/states/ParticleFollowState" {
	import DisplayObject = require("awayjs-display/lib/base/DisplayObject");
	import Camera = require("awayjs-display/lib/entities/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ParticleAnimator = require("awayjs-renderergl/lib/animators/ParticleAnimator");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import AnimationSubGeometry = require("awayjs-renderergl/lib/animators/data/AnimationSubGeometry");
	import ParticleFollowNode = require("awayjs-renderergl/lib/animators/nodes/ParticleFollowNode");
	import ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
	import RenderableBase = require("awayjs-renderergl/lib/pool/RenderableBase");
	/**
	 * ...
	 */
	class ParticleFollowState extends ParticleStateBase {
	    /** @private */
	    static FOLLOW_POSITION_INDEX: number;
	    /** @private */
	    static FOLLOW_ROTATION_INDEX: number;
	    private _particleFollowNode;
	    private _followTarget;
	    private _targetPos;
	    private _targetEuler;
	    private _prePos;
	    private _preEuler;
	    private _smooth;
	    private _temp;
	    constructor(animator: ParticleAnimator, particleFollowNode: ParticleFollowNode);
	    followTarget: DisplayObject;
	    smooth: boolean;
	    /**
	     * @inheritDoc
	     */
	    setRenderState(stage: Stage, renderable: RenderableBase, animationSubGeometry: AnimationSubGeometry, animationRegisterCache: AnimationRegisterCache, camera: Camera): void;
	    private processPosition(currentTime, deltaTime, animationSubGeometry);
	    private precessRotation(currentTime, deltaTime, animationSubGeometry);
	    private processPositionAndRotation(currentTime, deltaTime, animationSubGeometry);
	}
	export = ParticleFollowState;
	
}
declare module "awayjs-renderergl/lib/animators/nodes/ParticleFollowNode" {
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
	import ParticleFollowState = require("awayjs-renderergl/lib/animators/states/ParticleFollowState");
	/**
	 * A particle animation node used to create a follow behaviour on a particle system.
	 */
	class ParticleFollowNode extends ParticleNodeBase {
	    /** @private */
	    _iUsesPosition: boolean;
	    /** @private */
	    _iUsesRotation: boolean;
	    /** @private */
	    _iSmooth: boolean;
	    /**
	     * Creates a new <code>ParticleFollowNode</code>
	     *
	     * @param    [optional] usesPosition     Defines wehether the individual particle reacts to the position of the target.
	     * @param    [optional] usesRotation     Defines wehether the individual particle reacts to the rotation of the target.
	     * @param    [optional] smooth     Defines wehether the state calculate the interpolated value.
	     */
	    constructor(usesPosition?: boolean, usesRotation?: boolean, smooth?: boolean);
	    /**
	     * @inheritDoc
	     */
	    getAGALVertexCode(shaderObject: ShaderObjectBase, animationRegisterCache: AnimationRegisterCache): string;
	    /**
	     * @inheritDoc
	     */
	    getAnimationState(animator: AnimatorBase): ParticleFollowState;
	}
	export = ParticleFollowNode;
	
}
declare module "awayjs-renderergl/lib/animators/states/ParticleInitialColorState" {
	import ColorTransform = require("awayjs-core/lib/geom/ColorTransform");
	import Camera = require("awayjs-display/lib/entities/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ParticleAnimator = require("awayjs-renderergl/lib/animators/ParticleAnimator");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import AnimationSubGeometry = require("awayjs-renderergl/lib/animators/data/AnimationSubGeometry");
	import ParticleInitialColorNode = require("awayjs-renderergl/lib/animators/nodes/ParticleInitialColorNode");
	import ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
	import RenderableBase = require("awayjs-renderergl/lib/pool/RenderableBase");
	/**
	*
	*/
	class ParticleInitialColorState extends ParticleStateBase {
	    /** @private */
	    static MULTIPLIER_INDEX: number;
	    /** @private */
	    static OFFSET_INDEX: number;
	    private _particleInitialColorNode;
	    private _usesMultiplier;
	    private _usesOffset;
	    private _initialColor;
	    private _multiplierData;
	    private _offsetData;
	    constructor(animator: ParticleAnimator, particleInitialColorNode: ParticleInitialColorNode);
	    /**
	     * Defines the initial color transform of the state, when in global mode.
	     */
	    initialColor: ColorTransform;
	    /**
	     * @inheritDoc
	     */
	    setRenderState(stage: Stage, renderable: RenderableBase, animationSubGeometry: AnimationSubGeometry, animationRegisterCache: AnimationRegisterCache, camera: Camera): void;
	    private updateColorData();
	}
	export = ParticleInitialColorState;
	
}
declare module "awayjs-renderergl/lib/animators/nodes/ParticleInitialColorNode" {
	import ColorTransform = require("awayjs-core/lib/geom/ColorTransform");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ParticleAnimationSet = require("awayjs-renderergl/lib/animators/ParticleAnimationSet");
	import ParticleProperties = require("awayjs-renderergl/lib/animators/data/ParticleProperties");
	import ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
	/**
	 *
	 */
	class ParticleInitialColorNode extends ParticleNodeBase {
	    /** @private */
	    _iUsesMultiplier: boolean;
	    /** @private */
	    _iUsesOffset: boolean;
	    /** @private */
	    _iInitialColor: ColorTransform;
	    /**
	     * Reference for color node properties on a single particle (when in local property mode).
	     * Expects a <code>ColorTransform</code> object representing the color transform applied to the particle.
	     */
	    static COLOR_INITIAL_COLORTRANSFORM: string;
	    constructor(mode: number, usesMultiplier?: boolean, usesOffset?: boolean, initialColor?: ColorTransform);
	    /**
	     * @inheritDoc
	     */
	    getAGALVertexCode(shaderObject: ShaderObjectBase, animationRegisterCache: AnimationRegisterCache): string;
	    /**
	     * @inheritDoc
	     */
	    _iProcessAnimationSetting(particleAnimationSet: ParticleAnimationSet): void;
	    /**
	     * @inheritDoc
	     */
	    _iGeneratePropertyOfOneParticle(param: ParticleProperties): void;
	}
	export = ParticleInitialColorNode;
	
}
declare module "awayjs-renderergl/lib/animators/states/ParticleOrbitState" {
	import Vector3D = require("awayjs-core/lib/geom/Vector3D");
	import Camera = require("awayjs-display/lib/entities/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ParticleAnimator = require("awayjs-renderergl/lib/animators/ParticleAnimator");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import AnimationSubGeometry = require("awayjs-renderergl/lib/animators/data/AnimationSubGeometry");
	import ParticleOrbitNode = require("awayjs-renderergl/lib/animators/nodes/ParticleOrbitNode");
	import ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
	import RenderableBase = require("awayjs-renderergl/lib/pool/RenderableBase");
	/**
	 * ...
	 */
	class ParticleOrbitState extends ParticleStateBase {
	    /** @private */
	    static ORBIT_INDEX: number;
	    /** @private */
	    static EULERS_INDEX: number;
	    private _particleOrbitNode;
	    private _usesEulers;
	    private _usesCycle;
	    private _usesPhase;
	    private _radius;
	    private _cycleDuration;
	    private _cyclePhase;
	    private _eulers;
	    private _orbitData;
	    private _eulersMatrix;
	    /**
	     * Defines the radius of the orbit when in global mode. Defaults to 100.
	     */
	    radius: number;
	    /**
	     * Defines the duration of the orbit in seconds, used as a period independent of particle duration when in global mode. Defaults to 1.
	     */
	    cycleDuration: number;
	    /**
	     * Defines the phase of the orbit in degrees, used as the starting offset of the cycle when in global mode. Defaults to 0.
	     */
	    cyclePhase: number;
	    /**
	     * Defines the euler rotation in degrees, applied to the orientation of the orbit when in global mode.
	     */
	    eulers: Vector3D;
	    constructor(animator: ParticleAnimator, particleOrbitNode: ParticleOrbitNode);
	    setRenderState(stage: Stage, renderable: RenderableBase, animationSubGeometry: AnimationSubGeometry, animationRegisterCache: AnimationRegisterCache, camera: Camera): void;
	    private updateOrbitData();
	}
	export = ParticleOrbitState;
	
}
declare module "awayjs-renderergl/lib/animators/nodes/ParticleOrbitNode" {
	import Vector3D = require("awayjs-core/lib/geom/Vector3D");
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ParticleProperties = require("awayjs-renderergl/lib/animators/data/ParticleProperties");
	import ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
	import ParticleOrbitState = require("awayjs-renderergl/lib/animators/states/ParticleOrbitState");
	/**
	 * A particle animation node used to control the position of a particle over time around a circular orbit.
	 */
	class ParticleOrbitNode extends ParticleNodeBase {
	    /** @private */
	    _iUsesEulers: boolean;
	    /** @private */
	    _iUsesCycle: boolean;
	    /** @private */
	    _iUsesPhase: boolean;
	    /** @private */
	    _iRadius: number;
	    /** @private */
	    _iCycleDuration: number;
	    /** @private */
	    _iCyclePhase: number;
	    /** @private */
	    _iEulers: Vector3D;
	    /**
	     * Reference for orbit node properties on a single particle (when in local property mode).
	     * Expects a <code>Vector3D</code> object representing the radius (x), cycle speed (y) and cycle phase (z) of the motion on the particle.
	     */
	    static ORBIT_VECTOR3D: string;
	    /**
	     * Creates a new <code>ParticleOrbitNode</code> object.
	     *
	     * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
	     * @param    [optional] usesEulers      Defines whether the node uses the <code>eulers</code> property in the shader to calculate a rotation on the orbit. Defaults to true.
	     * @param    [optional] usesCycle       Defines whether the node uses the <code>cycleDuration</code> property in the shader to calculate the period of the orbit independent of particle duration. Defaults to false.
	     * @param    [optional] usesPhase       Defines whether the node uses the <code>cyclePhase</code> property in the shader to calculate a starting offset to the cycle rotation of the particle. Defaults to false.
	     * @param    [optional] radius          Defines the radius of the orbit when in global mode. Defaults to 100.
	     * @param    [optional] cycleDuration   Defines the duration of the orbit in seconds, used as a period independent of particle duration when in global mode. Defaults to 1.
	     * @param    [optional] cyclePhase      Defines the phase of the orbit in degrees, used as the starting offset of the cycle when in global mode. Defaults to 0.
	     * @param    [optional] eulers          Defines the euler rotation in degrees, applied to the orientation of the orbit when in global mode.
	     */
	    constructor(mode: number, usesEulers?: boolean, usesCycle?: boolean, usesPhase?: boolean, radius?: number, cycleDuration?: number, cyclePhase?: number, eulers?: Vector3D);
	    /**
	     * @inheritDoc
	     */
	    getAGALVertexCode(shaderObject: ShaderObjectBase, animationRegisterCache: AnimationRegisterCache): string;
	    /**
	     * @inheritDoc
	     */
	    getAnimationState(animator: AnimatorBase): ParticleOrbitState;
	    /**
	     * @inheritDoc
	     */
	    _iGeneratePropertyOfOneParticle(param: ParticleProperties): void;
	}
	export = ParticleOrbitNode;
	
}
declare module "awayjs-renderergl/lib/animators/states/ParticleOscillatorState" {
	import Vector3D = require("awayjs-core/lib/geom/Vector3D");
	import Camera = require("awayjs-display/lib/entities/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ParticleAnimator = require("awayjs-renderergl/lib/animators/ParticleAnimator");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import AnimationSubGeometry = require("awayjs-renderergl/lib/animators/data/AnimationSubGeometry");
	import ParticleOscillatorNode = require("awayjs-renderergl/lib/animators/nodes/ParticleOscillatorNode");
	import ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
	import RenderableBase = require("awayjs-renderergl/lib/pool/RenderableBase");
	/**
	 * ...
	 */
	class ParticleOscillatorState extends ParticleStateBase {
	    /** @private */
	    static OSCILLATOR_INDEX: number;
	    private _particleOscillatorNode;
	    private _oscillator;
	    private _oscillatorData;
	    /**
	     * Defines the default oscillator axis (x, y, z) and cycleDuration (w) of the state, used when in global mode.
	     */
	    oscillator: Vector3D;
	    constructor(animator: ParticleAnimator, particleOscillatorNode: ParticleOscillatorNode);
	    /**
	     * @inheritDoc
	     */
	    setRenderState(stage: Stage, renderable: RenderableBase, animationSubGeometry: AnimationSubGeometry, animationRegisterCache: AnimationRegisterCache, camera: Camera): void;
	    private updateOscillatorData();
	}
	export = ParticleOscillatorState;
	
}
declare module "awayjs-renderergl/lib/animators/nodes/ParticleOscillatorNode" {
	import Vector3D = require("awayjs-core/lib/geom/Vector3D");
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ParticleProperties = require("awayjs-renderergl/lib/animators/data/ParticleProperties");
	import ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
	import ParticleOscillatorState = require("awayjs-renderergl/lib/animators/states/ParticleOscillatorState");
	/**
	 * A particle animation node used to control the position of a particle over time using simple harmonic motion.
	 */
	class ParticleOscillatorNode extends ParticleNodeBase {
	    /** @private */
	    _iOscillator: Vector3D;
	    /**
	     * Reference for ocsillator node properties on a single particle (when in local property mode).
	     * Expects a <code>Vector3D</code> object representing the axis (x,y,z) and cycle speed (w) of the motion on the particle.
	     */
	    static OSCILLATOR_VECTOR3D: string;
	    /**
	     * Creates a new <code>ParticleOscillatorNode</code>
	     *
	     * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
	     * @param    [optional] oscillator      Defines the default oscillator axis (x, y, z) and cycleDuration (w) of the node, used when in global mode.
	     */
	    constructor(mode: number, oscillator?: Vector3D);
	    /**
	     * @inheritDoc
	     */
	    getAGALVertexCode(shaderObject: ShaderObjectBase, animationRegisterCache: AnimationRegisterCache): string;
	    /**
	     * @inheritDoc
	     */
	    getAnimationState(animator: AnimatorBase): ParticleOscillatorState;
	    /**
	     * @inheritDoc
	     */
	    _iGeneratePropertyOfOneParticle(param: ParticleProperties): void;
	}
	export = ParticleOscillatorNode;
	
}
declare module "awayjs-renderergl/lib/animators/states/ParticlePositionState" {
	import Vector3D = require("awayjs-core/lib/geom/Vector3D");
	import Camera = require("awayjs-display/lib/entities/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ParticleAnimator = require("awayjs-renderergl/lib/animators/ParticleAnimator");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import AnimationSubGeometry = require("awayjs-renderergl/lib/animators/data/AnimationSubGeometry");
	import ParticlePositionNode = require("awayjs-renderergl/lib/animators/nodes/ParticlePositionNode");
	import ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
	import RenderableBase = require("awayjs-renderergl/lib/pool/RenderableBase");
	/**
	 * ...
	 * @author ...
	 */
	class ParticlePositionState extends ParticleStateBase {
	    /** @private */
	    static POSITION_INDEX: number;
	    private _particlePositionNode;
	    private _position;
	    /**
	     * Defines the position of the particle when in global mode. Defaults to 0,0,0.
	     */
	    position: Vector3D;
	    /**
	     *
	     */
	    getPositions(): Vector3D[];
	    setPositions(value: Vector3D[]): void;
	    constructor(animator: ParticleAnimator, particlePositionNode: ParticlePositionNode);
	    /**
	     * @inheritDoc
	     */
	    setRenderState(stage: Stage, renderable: RenderableBase, animationSubGeometry: AnimationSubGeometry, animationRegisterCache: AnimationRegisterCache, camera: Camera): void;
	}
	export = ParticlePositionState;
	
}
declare module "awayjs-renderergl/lib/animators/nodes/ParticlePositionNode" {
	import Vector3D = require("awayjs-core/lib/geom/Vector3D");
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ParticleProperties = require("awayjs-renderergl/lib/animators/data/ParticleProperties");
	import ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
	import ParticlePositionState = require("awayjs-renderergl/lib/animators/states/ParticlePositionState");
	/**
	 * A particle animation node used to set the starting position of a particle.
	 */
	class ParticlePositionNode extends ParticleNodeBase {
	    /** @private */
	    _iPosition: Vector3D;
	    /**
	     * Reference for position node properties on a single particle (when in local property mode).
	     * Expects a <code>Vector3D</code> object representing position of the particle.
	     */
	    static POSITION_VECTOR3D: string;
	    /**
	     * Creates a new <code>ParticlePositionNode</code>
	     *
	     * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
	     * @param    [optional] position        Defines the default position of the particle when in global mode. Defaults to 0,0,0.
	     */
	    constructor(mode: number, position?: Vector3D);
	    /**
	     * @inheritDoc
	     */
	    getAGALVertexCode(shaderObject: ShaderObjectBase, animationRegisterCache: AnimationRegisterCache): string;
	    /**
	     * @inheritDoc
	     */
	    getAnimationState(animator: AnimatorBase): ParticlePositionState;
	    /**
	     * @inheritDoc
	     */
	    _iGeneratePropertyOfOneParticle(param: ParticleProperties): void;
	}
	export = ParticlePositionNode;
	
}
declare module "awayjs-renderergl/lib/animators/states/ParticleRotateToHeadingState" {
	import Camera = require("awayjs-display/lib/entities/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ParticleAnimator = require("awayjs-renderergl/lib/animators/ParticleAnimator");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import AnimationSubGeometry = require("awayjs-renderergl/lib/animators/data/AnimationSubGeometry");
	import ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
	import ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
	import RenderableBase = require("awayjs-renderergl/lib/pool/RenderableBase");
	/**
	 * ...
	 */
	class ParticleRotateToHeadingState extends ParticleStateBase {
	    /** @private */
	    static MATRIX_INDEX: number;
	    private _matrix;
	    constructor(animator: ParticleAnimator, particleNode: ParticleNodeBase);
	    setRenderState(stage: Stage, renderable: RenderableBase, animationSubGeometry: AnimationSubGeometry, animationRegisterCache: AnimationRegisterCache, camera: Camera): void;
	}
	export = ParticleRotateToHeadingState;
	
}
declare module "awayjs-renderergl/lib/animators/nodes/ParticleRotateToHeadingNode" {
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ParticleAnimationSet = require("awayjs-renderergl/lib/animators/ParticleAnimationSet");
	import ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
	import ParticleRotateToHeadingState = require("awayjs-renderergl/lib/animators/states/ParticleRotateToHeadingState");
	/**
	 * A particle animation node used to control the rotation of a particle to match its heading vector.
	 */
	class ParticleRotateToHeadingNode extends ParticleNodeBase {
	    /**
	     * Creates a new <code>ParticleBillboardNode</code>
	     */
	    constructor();
	    /**
	     * @inheritDoc
	     */
	    getAGALVertexCode(shaderObject: ShaderObjectBase, animationRegisterCache: AnimationRegisterCache): string;
	    /**
	     * @inheritDoc
	     */
	    getAnimationState(animator: AnimatorBase): ParticleRotateToHeadingState;
	    /**
	     * @inheritDoc
	     */
	    _iProcessAnimationSetting(particleAnimationSet: ParticleAnimationSet): void;
	}
	export = ParticleRotateToHeadingNode;
	
}
declare module "awayjs-renderergl/lib/animators/states/ParticleRotateToPositionState" {
	import Vector3D = require("awayjs-core/lib/geom/Vector3D");
	import Camera = require("awayjs-display/lib/entities/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ParticleAnimator = require("awayjs-renderergl/lib/animators/ParticleAnimator");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import AnimationSubGeometry = require("awayjs-renderergl/lib/animators/data/AnimationSubGeometry");
	import ParticleRotateToPositionNode = require("awayjs-renderergl/lib/animators/nodes/ParticleRotateToPositionNode");
	import ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
	import RenderableBase = require("awayjs-renderergl/lib/pool/RenderableBase");
	/**
	 * ...
	 */
	class ParticleRotateToPositionState extends ParticleStateBase {
	    /** @private */
	    static MATRIX_INDEX: number;
	    /** @private */
	    static POSITION_INDEX: number;
	    private _particleRotateToPositionNode;
	    private _position;
	    private _matrix;
	    private _offset;
	    /**
	     * Defines the position of the point the particle will rotate to face when in global mode. Defaults to 0,0,0.
	     */
	    position: Vector3D;
	    constructor(animator: ParticleAnimator, particleRotateToPositionNode: ParticleRotateToPositionNode);
	    setRenderState(stage: Stage, renderable: RenderableBase, animationSubGeometry: AnimationSubGeometry, animationRegisterCache: AnimationRegisterCache, camera: Camera): void;
	}
	export = ParticleRotateToPositionState;
	
}
declare module "awayjs-renderergl/lib/animators/nodes/ParticleRotateToPositionNode" {
	import Vector3D = require("awayjs-core/lib/geom/Vector3D");
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ParticleProperties = require("awayjs-renderergl/lib/animators/data/ParticleProperties");
	import ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
	import ParticleRotateToPositionState = require("awayjs-renderergl/lib/animators/states/ParticleRotateToPositionState");
	/**
	 * A particle animation node used to control the rotation of a particle to face to a position
	 */
	class ParticleRotateToPositionNode extends ParticleNodeBase {
	    /** @private */
	    _iPosition: Vector3D;
	    /**
	     * Reference for the position the particle will rotate to face for a single particle (when in local property mode).
	     * Expects a <code>Vector3D</code> object representing the position that the particle must face.
	     */
	    static POSITION_VECTOR3D: string;
	    /**
	     * Creates a new <code>ParticleRotateToPositionNode</code>
	     */
	    constructor(mode: number, position?: Vector3D);
	    /**
	     * @inheritDoc
	     */
	    getAGALVertexCode(shaderObject: ShaderObjectBase, animationRegisterCache: AnimationRegisterCache): string;
	    /**
	     * @inheritDoc
	     */
	    getAnimationState(animator: AnimatorBase): ParticleRotateToPositionState;
	    /**
	     * @inheritDoc
	     */
	    _iGeneratePropertyOfOneParticle(param: ParticleProperties): void;
	}
	export = ParticleRotateToPositionNode;
	
}
declare module "awayjs-renderergl/lib/animators/states/ParticleRotationalVelocityState" {
	import Vector3D = require("awayjs-core/lib/geom/Vector3D");
	import Camera = require("awayjs-display/lib/entities/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ParticleAnimator = require("awayjs-renderergl/lib/animators/ParticleAnimator");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import AnimationSubGeometry = require("awayjs-renderergl/lib/animators/data/AnimationSubGeometry");
	import ParticleRotationalVelocityNode = require("awayjs-renderergl/lib/animators/nodes/ParticleRotationalVelocityNode");
	import ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
	import RenderableBase = require("awayjs-renderergl/lib/pool/RenderableBase");
	/**
	 * ...
	 */
	class ParticleRotationalVelocityState extends ParticleStateBase {
	    /** @private */
	    static ROTATIONALVELOCITY_INDEX: number;
	    private _particleRotationalVelocityNode;
	    private _rotationalVelocityData;
	    private _rotationalVelocity;
	    /**
	     * Defines the default rotationalVelocity of the state, used when in global mode.
	     */
	    rotationalVelocity: Vector3D;
	    /**
	     *
	     */
	    getRotationalVelocities(): Vector3D[];
	    setRotationalVelocities(value: Vector3D[]): void;
	    constructor(animator: ParticleAnimator, particleRotationNode: ParticleRotationalVelocityNode);
	    /**
	     * @inheritDoc
	     */
	    setRenderState(stage: Stage, renderable: RenderableBase, animationSubGeometry: AnimationSubGeometry, animationRegisterCache: AnimationRegisterCache, camera: Camera): void;
	    private updateRotationalVelocityData();
	}
	export = ParticleRotationalVelocityState;
	
}
declare module "awayjs-renderergl/lib/animators/nodes/ParticleRotationalVelocityNode" {
	import Vector3D = require("awayjs-core/lib/geom/Vector3D");
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ParticleProperties = require("awayjs-renderergl/lib/animators/data/ParticleProperties");
	import ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
	import ParticleRotationalVelocityState = require("awayjs-renderergl/lib/animators/states/ParticleRotationalVelocityState");
	/**
	 * A particle animation node used to set the starting rotational velocity of a particle.
	 */
	class ParticleRotationalVelocityNode extends ParticleNodeBase {
	    /** @private */
	    _iRotationalVelocity: Vector3D;
	    /**
	     * Reference for rotational velocity node properties on a single particle (when in local property mode).
	     * Expects a <code>Vector3D</code> object representing the rotational velocity around an axis of the particle.
	     */
	    static ROTATIONALVELOCITY_VECTOR3D: string;
	    /**
	     * Creates a new <code>ParticleRotationalVelocityNode</code>
	     *
	     * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
	     */
	    constructor(mode: number, rotationalVelocity?: Vector3D);
	    /**
	     * @inheritDoc
	     */
	    getAGALVertexCode(shaderObject: ShaderObjectBase, animationRegisterCache: AnimationRegisterCache): string;
	    /**
	     * @inheritDoc
	     */
	    getAnimationState(animator: AnimatorBase): ParticleRotationalVelocityState;
	    /**
	     * @inheritDoc
	     */
	    _iGeneratePropertyOfOneParticle(param: ParticleProperties): void;
	}
	export = ParticleRotationalVelocityNode;
	
}
declare module "awayjs-renderergl/lib/animators/states/ParticleScaleState" {
	import Camera = require("awayjs-display/lib/entities/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ParticleAnimator = require("awayjs-renderergl/lib/animators/ParticleAnimator");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import AnimationSubGeometry = require("awayjs-renderergl/lib/animators/data/AnimationSubGeometry");
	import ParticleScaleNode = require("awayjs-renderergl/lib/animators/nodes/ParticleScaleNode");
	import ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
	import RenderableBase = require("awayjs-renderergl/lib/pool/RenderableBase");
	/**
	 * ...
	 */
	class ParticleScaleState extends ParticleStateBase {
	    /** @private */
	    static SCALE_INDEX: number;
	    private _particleScaleNode;
	    private _usesCycle;
	    private _usesPhase;
	    private _minScale;
	    private _maxScale;
	    private _cycleDuration;
	    private _cyclePhase;
	    private _scaleData;
	    /**
	     * Defines the end scale of the state, when in global mode. Defaults to 1.
	     */
	    minScale: number;
	    /**
	     * Defines the end scale of the state, when in global mode. Defaults to 1.
	     */
	    maxScale: number;
	    /**
	     * Defines the duration of the animation in seconds, used as a period independent of particle duration when in global mode. Defaults to 1.
	     */
	    cycleDuration: number;
	    /**
	     * Defines the phase of the cycle in degrees, used as the starting offset of the cycle when in global mode. Defaults to 0.
	     */
	    cyclePhase: number;
	    constructor(animator: ParticleAnimator, particleScaleNode: ParticleScaleNode);
	    setRenderState(stage: Stage, renderable: RenderableBase, animationSubGeometry: AnimationSubGeometry, animationRegisterCache: AnimationRegisterCache, camera: Camera): void;
	    private updateScaleData();
	}
	export = ParticleScaleState;
	
}
declare module "awayjs-renderergl/lib/animators/nodes/ParticleScaleNode" {
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ParticleProperties = require("awayjs-renderergl/lib/animators/data/ParticleProperties");
	import ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
	import ParticleScaleState = require("awayjs-renderergl/lib/animators/states/ParticleScaleState");
	/**
	 * A particle animation node used to control the scale variation of a particle over time.
	 */
	class ParticleScaleNode extends ParticleNodeBase {
	    /** @private */
	    _iUsesCycle: boolean;
	    /** @private */
	    _iUsesPhase: boolean;
	    /** @private */
	    _iMinScale: number;
	    /** @private */
	    _iMaxScale: number;
	    /** @private */
	    _iCycleDuration: number;
	    /** @private */
	    _iCyclePhase: number;
	    /**
	     * Reference for scale node properties on a single particle (when in local property mode).
	     * Expects a <code>Vector3D</code> representing the min scale (x), max scale(y), optional cycle speed (z) and phase offset (w) applied to the particle.
	     */
	    static SCALE_VECTOR3D: string;
	    /**
	     * Creates a new <code>ParticleScaleNode</code>
	     *
	     * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
	     * @param    [optional] usesCycle       Defines whether the node uses the <code>cycleDuration</code> property in the shader to calculate the period of animation independent of particle duration. Defaults to false.
	     * @param    [optional] usesPhase       Defines whether the node uses the <code>cyclePhase</code> property in the shader to calculate a starting offset to the animation cycle. Defaults to false.
	     * @param    [optional] minScale        Defines the default min scale transform of the node, when in global mode. Defaults to 1.
	     * @param    [optional] maxScale        Defines the default max color transform of the node, when in global mode. Defaults to 1.
	     * @param    [optional] cycleDuration   Defines the default duration of the animation in seconds, used as a period independent of particle duration when in global mode. Defaults to 1.
	     * @param    [optional] cyclePhase      Defines the default phase of the cycle in degrees, used as the starting offset of the cycle when in global mode. Defaults to 0.
	     */
	    constructor(mode: number, usesCycle: boolean, usesPhase: boolean, minScale?: number, maxScale?: number, cycleDuration?: number, cyclePhase?: number);
	    /**
	     * @inheritDoc
	     */
	    getAGALVertexCode(shaderObject: ShaderObjectBase, animationRegisterCache: AnimationRegisterCache): string;
	    /**
	     * @inheritDoc
	     */
	    getAnimationState(animator: AnimatorBase): ParticleScaleState;
	    /**
	     * @inheritDoc
	     */
	    _iGeneratePropertyOfOneParticle(param: ParticleProperties): void;
	}
	export = ParticleScaleNode;
	
}
declare module "awayjs-renderergl/lib/animators/states/ParticleSegmentedColorState" {
	import ColorTransform = require("awayjs-core/lib/geom/ColorTransform");
	import Camera = require("awayjs-display/lib/entities/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ParticleAnimator = require("awayjs-renderergl/lib/animators/ParticleAnimator");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import AnimationSubGeometry = require("awayjs-renderergl/lib/animators/data/AnimationSubGeometry");
	import ColorSegmentPoint = require("awayjs-renderergl/lib/animators/data/ColorSegmentPoint");
	import ParticleSegmentedColorNode = require("awayjs-renderergl/lib/animators/nodes/ParticleSegmentedColorNode");
	import ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
	import RenderableBase = require("awayjs-renderergl/lib/pool/RenderableBase");
	/**
	 *
	 */
	class ParticleSegmentedColorState extends ParticleStateBase {
	    /** @private */
	    static START_MULTIPLIER_INDEX: number;
	    /** @private */
	    static START_OFFSET_INDEX: number;
	    /** @private */
	    static TIME_DATA_INDEX: number;
	    private _usesMultiplier;
	    private _usesOffset;
	    private _startColor;
	    private _endColor;
	    private _segmentPoints;
	    private _numSegmentPoint;
	    private _timeLifeData;
	    private _multiplierData;
	    private _offsetData;
	    /**
	     * Defines the start color transform of the state, when in global mode.
	     */
	    startColor: ColorTransform;
	    /**
	     * Defines the end color transform of the state, when in global mode.
	     */
	    endColor: ColorTransform;
	    /**
	     * Defines the number of segments.
	     */
	    numSegmentPoint: number;
	    /**
	     * Defines the key points of color
	     */
	    segmentPoints: ColorSegmentPoint[];
	    usesMultiplier: boolean;
	    usesOffset: boolean;
	    constructor(animator: ParticleAnimator, particleSegmentedColorNode: ParticleSegmentedColorNode);
	    setRenderState(stage: Stage, renderable: RenderableBase, animationSubGeometry: AnimationSubGeometry, animationRegisterCache: AnimationRegisterCache, camera: Camera): void;
	    private updateColorData();
	}
	export = ParticleSegmentedColorState;
	
}
declare module "awayjs-renderergl/lib/animators/nodes/ParticleSegmentedColorNode" {
	import ColorTransform = require("awayjs-core/lib/geom/ColorTransform");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ParticleAnimationSet = require("awayjs-renderergl/lib/animators/ParticleAnimationSet");
	import ColorSegmentPoint = require("awayjs-renderergl/lib/animators/data/ColorSegmentPoint");
	import ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
	/**
	 *
	 */
	class ParticleSegmentedColorNode extends ParticleNodeBase {
	    /** @private */
	    _iUsesMultiplier: boolean;
	    /** @private */
	    _iUsesOffset: boolean;
	    /** @private */
	    _iStartColor: ColorTransform;
	    /** @private */
	    _iEndColor: ColorTransform;
	    /** @private */
	    _iNumSegmentPoint: number;
	    /** @private */
	    _iSegmentPoints: ColorSegmentPoint[];
	    constructor(usesMultiplier: boolean, usesOffset: boolean, numSegmentPoint: number, startColor: ColorTransform, endColor: ColorTransform, segmentPoints: ColorSegmentPoint[]);
	    /**
	     * @inheritDoc
	     */
	    _iProcessAnimationSetting(particleAnimationSet: ParticleAnimationSet): void;
	    /**
	     * @inheritDoc
	     */
	    getAGALVertexCode(shaderObject: ShaderObjectBase, animationRegisterCache: AnimationRegisterCache): string;
	}
	export = ParticleSegmentedColorNode;
	
}
declare module "awayjs-renderergl/lib/animators/states/ParticleSpriteSheetState" {
	import Camera = require("awayjs-display/lib/entities/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ParticleAnimator = require("awayjs-renderergl/lib/animators/ParticleAnimator");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import AnimationSubGeometry = require("awayjs-renderergl/lib/animators/data/AnimationSubGeometry");
	import ParticleSpriteSheetNode = require("awayjs-renderergl/lib/animators/nodes/ParticleSpriteSheetNode");
	import ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
	import RenderableBase = require("awayjs-renderergl/lib/pool/RenderableBase");
	/**
	 * ...
	 */
	class ParticleSpriteSheetState extends ParticleStateBase {
	    /** @private */
	    static UV_INDEX_0: number;
	    /** @private */
	    static UV_INDEX_1: number;
	    private _particleSpriteSheetNode;
	    private _usesCycle;
	    private _usesPhase;
	    private _totalFrames;
	    private _numColumns;
	    private _numRows;
	    private _cycleDuration;
	    private _cyclePhase;
	    private _spriteSheetData;
	    /**
	     * Defines the cycle phase, when in global mode. Defaults to zero.
	     */
	    cyclePhase: number;
	    /**
	     * Defines the cycle duration in seconds, when in global mode. Defaults to 1.
	     */
	    cycleDuration: number;
	    constructor(animator: ParticleAnimator, particleSpriteSheetNode: ParticleSpriteSheetNode);
	    setRenderState(stage: Stage, renderable: RenderableBase, animationSubGeometry: AnimationSubGeometry, animationRegisterCache: AnimationRegisterCache, camera: Camera): void;
	    private updateSpriteSheetData();
	}
	export = ParticleSpriteSheetState;
	
}
declare module "awayjs-renderergl/lib/animators/nodes/ParticleSpriteSheetNode" {
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ParticleAnimationSet = require("awayjs-renderergl/lib/animators/ParticleAnimationSet");
	import ParticleProperties = require("awayjs-renderergl/lib/animators/data/ParticleProperties");
	import ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
	import ParticleSpriteSheetState = require("awayjs-renderergl/lib/animators/states/ParticleSpriteSheetState");
	/**
	 * A particle animation node used when a spritesheet texture is required to animate the particle.
	 * NB: to enable use of this node, the <code>repeat</code> property on the material has to be set to true.
	 */
	class ParticleSpriteSheetNode extends ParticleNodeBase {
	    /** @private */
	    _iUsesCycle: boolean;
	    /** @private */
	    _iUsesPhase: boolean;
	    /** @private */
	    _iTotalFrames: number;
	    /** @private */
	    _iNumColumns: number;
	    /** @private */
	    _iNumRows: number;
	    /** @private */
	    _iCycleDuration: number;
	    /** @private */
	    _iCyclePhase: number;
	    /**
	     * Reference for spritesheet node properties on a single particle (when in local property mode).
	     * Expects a <code>Vector3D</code> representing the cycleDuration (x), optional phaseTime (y).
	     */
	    static UV_VECTOR3D: string;
	    /**
	     * Defines the number of columns in the spritesheet, when in global mode. Defaults to 1. Read only.
	     */
	    numColumns: number;
	    /**
	     * Defines the number of rows in the spritesheet, when in global mode. Defaults to 1. Read only.
	     */
	    numRows: number;
	    /**
	     * Defines the total number of frames used by the spritesheet, when in global mode. Defaults to the number defined by numColumns and numRows. Read only.
	     */
	    totalFrames: number;
	    /**
	     * Creates a new <code>ParticleSpriteSheetNode</code>
	     *
	     * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
	     * @param    [optional] numColumns      Defines the number of columns in the spritesheet, when in global mode. Defaults to 1.
	     * @param    [optional] numRows         Defines the number of rows in the spritesheet, when in global mode. Defaults to 1.
	     * @param    [optional] cycleDuration   Defines the default cycle duration in seconds, when in global mode. Defaults to 1.
	     * @param    [optional] cyclePhase      Defines the default cycle phase, when in global mode. Defaults to 0.
	     * @param    [optional] totalFrames     Defines the total number of frames used by the spritesheet, when in global mode. Defaults to the number defined by numColumns and numRows.
	     * @param    [optional] looping         Defines whether the spritesheet animation is set to loop indefinitely. Defaults to true.
	     */
	    constructor(mode: number, usesCycle: boolean, usesPhase: boolean, numColumns?: number, numRows?: number, cycleDuration?: number, cyclePhase?: number, totalFrames?: number);
	    /**
	     * @inheritDoc
	     */
	    getAGALUVCode(shaderObject: ShaderObjectBase, animationRegisterCache: AnimationRegisterCache): string;
	    /**
	     * @inheritDoc
	     */
	    getAnimationState(animator: AnimatorBase): ParticleSpriteSheetState;
	    /**
	     * @inheritDoc
	     */
	    _iProcessAnimationSetting(particleAnimationSet: ParticleAnimationSet): void;
	    /**
	     * @inheritDoc
	     */
	    _iGeneratePropertyOfOneParticle(param: ParticleProperties): void;
	}
	export = ParticleSpriteSheetNode;
	
}
declare module "awayjs-renderergl/lib/animators/states/ParticleUVState" {
	import Camera = require("awayjs-display/lib/entities/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ParticleAnimator = require("awayjs-renderergl/lib/animators/ParticleAnimator");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import AnimationSubGeometry = require("awayjs-renderergl/lib/animators/data/AnimationSubGeometry");
	import ParticleUVNode = require("awayjs-renderergl/lib/animators/nodes/ParticleUVNode");
	import ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
	import RenderableBase = require("awayjs-renderergl/lib/pool/RenderableBase");
	/**
	 * ...
	 */
	class ParticleUVState extends ParticleStateBase {
	    /** @private */
	    static UV_INDEX: number;
	    private _particleUVNode;
	    constructor(animator: ParticleAnimator, particleUVNode: ParticleUVNode);
	    setRenderState(stage: Stage, renderable: RenderableBase, animationSubGeometry: AnimationSubGeometry, animationRegisterCache: AnimationRegisterCache, camera: Camera): void;
	}
	export = ParticleUVState;
	
}
declare module "awayjs-renderergl/lib/animators/nodes/ParticleUVNode" {
	import Vector3D = require("awayjs-core/lib/geom/Vector3D");
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ParticleAnimationSet = require("awayjs-renderergl/lib/animators/ParticleAnimationSet");
	import ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
	import ParticleUVState = require("awayjs-renderergl/lib/animators/states/ParticleUVState");
	/**
	 * A particle animation node used to control the UV offset and scale of a particle over time.
	 */
	class ParticleUVNode extends ParticleNodeBase {
	    /** @private */
	    _iUvData: Vector3D;
	    /**
	     *
	     */
	    static U_AXIS: string;
	    /**
	     *
	     */
	    static V_AXIS: string;
	    private _cycle;
	    private _scale;
	    private _axis;
	    /**
	     * Creates a new <code>ParticleTimeNode</code>
	     *
	     * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
	     * @param    [optional] cycle           Defines whether the time track is in loop mode. Defaults to false.
	     * @param    [optional] scale           Defines whether the time track is in loop mode. Defaults to false.
	     * @param    [optional] axis            Defines whether the time track is in loop mode. Defaults to false.
	     */
	    constructor(mode: number, cycle?: number, scale?: number, axis?: string);
	    /**
	     *
	     */
	    cycle: number;
	    /**
	     *
	     */
	    scale: number;
	    /**
	     *
	     */
	    axis: string;
	    /**
	     * @inheritDoc
	     */
	    getAGALUVCode(shaderObject: ShaderObjectBase, animationRegisterCache: AnimationRegisterCache): string;
	    /**
	     * @inheritDoc
	     */
	    getAnimationState(animator: AnimatorBase): ParticleUVState;
	    private updateUVData();
	    /**
	     * @inheritDoc
	     */
	    _iProcessAnimationSetting(particleAnimationSet: ParticleAnimationSet): void;
	}
	export = ParticleUVNode;
	
}
declare module "awayjs-renderergl/lib/animators/states/ParticleVelocityState" {
	import Vector3D = require("awayjs-core/lib/geom/Vector3D");
	import Camera = require("awayjs-display/lib/entities/Camera");
	import Stage = require("awayjs-stagegl/lib/base/Stage");
	import ParticleAnimator = require("awayjs-renderergl/lib/animators/ParticleAnimator");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import AnimationSubGeometry = require("awayjs-renderergl/lib/animators/data/AnimationSubGeometry");
	import ParticleVelocityNode = require("awayjs-renderergl/lib/animators/nodes/ParticleVelocityNode");
	import ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
	import RenderableBase = require("awayjs-renderergl/lib/pool/RenderableBase");
	/**
	 * ...
	 */
	class ParticleVelocityState extends ParticleStateBase {
	    /** @private */
	    static VELOCITY_INDEX: number;
	    private _particleVelocityNode;
	    private _velocity;
	    /**
	     * Defines the default velocity vector of the state, used when in global mode.
	     */
	    velocity: Vector3D;
	    /**
	     *
	     */
	    getVelocities(): Vector3D[];
	    setVelocities(value: Vector3D[]): void;
	    constructor(animator: ParticleAnimator, particleVelocityNode: ParticleVelocityNode);
	    setRenderState(stage: Stage, renderable: RenderableBase, animationSubGeometry: AnimationSubGeometry, animationRegisterCache: AnimationRegisterCache, camera: Camera): void;
	}
	export = ParticleVelocityState;
	
}
declare module "awayjs-renderergl/lib/animators/nodes/ParticleVelocityNode" {
	import Vector3D = require("awayjs-core/lib/geom/Vector3D");
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import AnimationRegisterCache = require("awayjs-renderergl/lib/animators/data/AnimationRegisterCache");
	import ShaderObjectBase = require("awayjs-renderergl/lib/compilation/ShaderObjectBase");
	import ParticleProperties = require("awayjs-renderergl/lib/animators/data/ParticleProperties");
	import ParticleNodeBase = require("awayjs-renderergl/lib/animators/nodes/ParticleNodeBase");
	import ParticleVelocityState = require("awayjs-renderergl/lib/animators/states/ParticleVelocityState");
	/**
	 * A particle animation node used to set the starting velocity of a particle.
	 */
	class ParticleVelocityNode extends ParticleNodeBase {
	    /** @private */
	    _iVelocity: Vector3D;
	    /**
	     * Reference for velocity node properties on a single particle (when in local property mode).
	     * Expects a <code>Vector3D</code> object representing the direction of movement on the particle.
	     */
	    static VELOCITY_VECTOR3D: string;
	    /**
	     * Creates a new <code>ParticleVelocityNode</code>
	     *
	     * @param               mode            Defines whether the mode of operation acts on local properties of a particle or global properties of the node.
	     * @param    [optional] velocity        Defines the default velocity vector of the node, used when in global mode.
	     */
	    constructor(mode: number, velocity?: Vector3D);
	    /**
	     * @inheritDoc
	     */
	    getAGALVertexCode(shaderObject: ShaderObjectBase, animationRegisterCache: AnimationRegisterCache): string;
	    /**
	     * @inheritDoc
	     */
	    getAnimationState(animator: AnimatorBase): ParticleVelocityState;
	    /**
	     * @inheritDoc
	     */
	    _iGeneratePropertyOfOneParticle(param: ParticleProperties): void;
	}
	export = ParticleVelocityNode;
	
}
declare module "awayjs-renderergl/lib/animators/states/SkeletonBinaryLERPState" {
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import Skeleton = require("awayjs-renderergl/lib/animators/data/Skeleton");
	import SkeletonPose = require("awayjs-renderergl/lib/animators/data/SkeletonPose");
	import SkeletonBinaryLERPNode = require("awayjs-renderergl/lib/animators/nodes/SkeletonBinaryLERPNode");
	import AnimationStateBase = require("awayjs-renderergl/lib/animators/states/AnimationStateBase");
	import ISkeletonAnimationState = require("awayjs-renderergl/lib/animators/states/ISkeletonAnimationState");
	/**
	 *
	 */
	class SkeletonBinaryLERPState extends AnimationStateBase implements ISkeletonAnimationState {
	    private _blendWeight;
	    private _skeletonAnimationNode;
	    private _skeletonPose;
	    private _skeletonPoseDirty;
	    private _inputA;
	    private _inputB;
	    /**
	     * Defines a fractional value between 0 and 1 representing the blending ratio between inputA (0) and inputB (1),
	     * used to produce the skeleton pose output.
	     *
	     * @see inputA
	     * @see inputB
	     */
	    blendWeight: number;
	    constructor(animator: AnimatorBase, skeletonAnimationNode: SkeletonBinaryLERPNode);
	    /**
	     * @inheritDoc
	     */
	    phase(value: number): void;
	    /**
	     * @inheritDoc
	     */
	    _pUpdateTime(time: number): void;
	    /**
	     * Returns the current skeleton pose of the animation in the clip based on the internal playhead position.
	     */
	    getSkeletonPose(skeleton: Skeleton): SkeletonPose;
	    /**
	     * @inheritDoc
	     */
	    _pUpdatePositionDelta(): void;
	    /**
	     * Updates the output skeleton pose of the node based on the blendWeight value between input nodes.
	     *
	     * @param skeleton The skeleton used by the animator requesting the ouput pose.
	     */
	    private updateSkeletonPose(skeleton);
	}
	export = SkeletonBinaryLERPState;
	
}
declare module "awayjs-renderergl/lib/animators/nodes/SkeletonBinaryLERPNode" {
	import AnimationNodeBase = require("awayjs-display/lib/animators/nodes/AnimationNodeBase");
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import SkeletonBinaryLERPState = require("awayjs-renderergl/lib/animators/states/SkeletonBinaryLERPState");
	/**
	 * A skeleton animation node that uses two animation node inputs to blend a lineraly interpolated output of a skeleton pose.
	 */
	class SkeletonBinaryLERPNode extends AnimationNodeBase {
	    /**
	     * Defines input node A to use for the blended output.
	     */
	    inputA: AnimationNodeBase;
	    /**
	     * Defines input node B to use for the blended output.
	     */
	    inputB: AnimationNodeBase;
	    /**
	     * Creates a new <code>SkeletonBinaryLERPNode</code> object.
	     */
	    constructor();
	    /**
	     * @inheritDoc
	     */
	    getAnimationState(animator: AnimatorBase): SkeletonBinaryLERPState;
	}
	export = SkeletonBinaryLERPNode;
	
}
declare module "awayjs-renderergl/lib/animators/states/AnimationClipState" {
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import AnimationClipNodeBase = require("awayjs-renderergl/lib/animators/nodes/AnimationClipNodeBase");
	import AnimationStateBase = require("awayjs-renderergl/lib/animators/states/AnimationStateBase");
	/**
	 *
	 */
	class AnimationClipState extends AnimationStateBase {
	    private _animationClipNode;
	    private _animationStatePlaybackComplete;
	    _pBlendWeight: number;
	    _pCurrentFrame: number;
	    _pNextFrame: number;
	    _pOldFrame: number;
	    _pTimeDir: number;
	    _pFramesDirty: boolean;
	    /**
	     * Returns a fractional value between 0 and 1 representing the blending ratio of the current playhead position
	     * between the current frame (0) and next frame (1) of the animation.
	     *
	     * @see #currentFrame
	     * @see #nextFrame
	     */
	    blendWeight: number;
	    /**
	     * Returns the current frame of animation in the clip based on the internal playhead position.
	     */
	    currentFrame: number;
	    /**
	     * Returns the next frame of animation in the clip based on the internal playhead position.
	     */
	    nextFrame: number;
	    constructor(animator: AnimatorBase, animationClipNode: AnimationClipNodeBase);
	    /**
	     * @inheritDoc
	     */
	    update(time: number): void;
	    /**
	     * @inheritDoc
	     */
	    phase(value: number): void;
	    /**
	     * @inheritDoc
	     */
	    _pUpdateTime(time: number): void;
	    /**
	     * Updates the nodes internal playhead to determine the current and next animation frame, and the blendWeight between the two.
	     *
	     * @see #currentFrame
	     * @see #nextFrame
	     * @see #blendWeight
	     */
	    _pUpdateFrames(): void;
	    private notifyPlaybackComplete();
	}
	export = AnimationClipState;
	
}
declare module "awayjs-renderergl/lib/animators/states/SkeletonClipState" {
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import Skeleton = require("awayjs-renderergl/lib/animators/data/Skeleton");
	import SkeletonPose = require("awayjs-renderergl/lib/animators/data/SkeletonPose");
	import SkeletonClipNode = require("awayjs-renderergl/lib/animators/nodes/SkeletonClipNode");
	import AnimationClipState = require("awayjs-renderergl/lib/animators/states/AnimationClipState");
	import ISkeletonAnimationState = require("awayjs-renderergl/lib/animators/states/ISkeletonAnimationState");
	/**
	 *
	 */
	class SkeletonClipState extends AnimationClipState implements ISkeletonAnimationState {
	    private _rootPos;
	    private _frames;
	    private _skeletonClipNode;
	    private _skeletonPose;
	    private _skeletonPoseDirty;
	    private _currentPose;
	    private _nextPose;
	    /**
	     * Returns the current skeleton pose frame of animation in the clip based on the internal playhead position.
	     */
	    currentPose: SkeletonPose;
	    /**
	     * Returns the next skeleton pose frame of animation in the clip based on the internal playhead position.
	     */
	    nextPose: SkeletonPose;
	    constructor(animator: AnimatorBase, skeletonClipNode: SkeletonClipNode);
	    /**
	     * Returns the current skeleton pose of the animation in the clip based on the internal playhead position.
	     */
	    getSkeletonPose(skeleton: Skeleton): SkeletonPose;
	    /**
	     * @inheritDoc
	     */
	    _pUpdateTime(time: number): void;
	    /**
	     * @inheritDoc
	     */
	    _pUpdateFrames(): void;
	    /**
	     * Updates the output skeleton pose of the node based on the internal playhead position.
	     *
	     * @param skeleton The skeleton used by the animator requesting the ouput pose.
	     */
	    private updateSkeletonPose(skeleton);
	    /**
	     * @inheritDoc
	     */
	    _pUpdatePositionDelta(): void;
	}
	export = SkeletonClipState;
	
}
declare module "awayjs-renderergl/lib/animators/nodes/SkeletonClipNode" {
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import SkeletonPose = require("awayjs-renderergl/lib/animators/data/SkeletonPose");
	import AnimationClipNodeBase = require("awayjs-renderergl/lib/animators/nodes/AnimationClipNodeBase");
	import SkeletonClipState = require("awayjs-renderergl/lib/animators/states/SkeletonClipState");
	/**
	 * A skeleton animation node containing time-based animation data as individual skeleton poses.
	 */
	class SkeletonClipNode extends AnimationClipNodeBase {
	    private _frames;
	    /**
	     * Determines whether to use SLERP equations (true) or LERP equations (false) in the calculation
	     * of the output skeleton pose. Defaults to false.
	     */
	    highQuality: boolean;
	    /**
	     * Returns a vector of skeleton poses representing the pose of each animation frame in the clip.
	     */
	    frames: SkeletonPose[];
	    /**
	     * Creates a new <code>SkeletonClipNode</code> object.
	     */
	    constructor();
	    /**
	     * Adds a skeleton pose frame to the internal timeline of the animation node.
	     *
	     * @param skeletonPose The skeleton pose object to add to the timeline of the node.
	     * @param duration The specified duration of the frame in milliseconds.
	     */
	    addFrame(skeletonPose: SkeletonPose, duration: number): void;
	    /**
	     * @inheritDoc
	     */
	    getAnimationState(animator: AnimatorBase): SkeletonClipState;
	    /**
	     * @inheritDoc
	     */
	    _pUpdateStitch(): void;
	}
	export = SkeletonClipNode;
	
}
declare module "awayjs-renderergl/lib/animators/states/SkeletonDifferenceState" {
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import Skeleton = require("awayjs-renderergl/lib/animators/data/Skeleton");
	import SkeletonPose = require("awayjs-renderergl/lib/animators/data/SkeletonPose");
	import SkeletonDifferenceNode = require("awayjs-renderergl/lib/animators/nodes/SkeletonDifferenceNode");
	import AnimationStateBase = require("awayjs-renderergl/lib/animators/states/AnimationStateBase");
	import ISkeletonAnimationState = require("awayjs-renderergl/lib/animators/states/ISkeletonAnimationState");
	/**
	 *
	 */
	class SkeletonDifferenceState extends AnimationStateBase implements ISkeletonAnimationState {
	    private _blendWeight;
	    private static _tempQuat;
	    private _skeletonAnimationNode;
	    private _skeletonPose;
	    private _skeletonPoseDirty;
	    private _baseInput;
	    private _differenceInput;
	    /**
	     * Defines a fractional value between 0 and 1 representing the blending ratio between the base input (0) and difference input (1),
	     * used to produce the skeleton pose output.
	     *
	     * @see #baseInput
	     * @see #differenceInput
	     */
	    blendWeight: number;
	    constructor(animator: AnimatorBase, skeletonAnimationNode: SkeletonDifferenceNode);
	    /**
	     * @inheritDoc
	     */
	    phase(value: number): void;
	    /**
	     * @inheritDoc
	     */
	    _pUpdateTime(time: number): void;
	    /**
	     * Returns the current skeleton pose of the animation in the clip based on the internal playhead position.
	     */
	    getSkeletonPose(skeleton: Skeleton): SkeletonPose;
	    /**
	     * @inheritDoc
	     */
	    _pUpdatePositionDelta(): void;
	    /**
	     * Updates the output skeleton pose of the node based on the blendWeight value between base input and difference input nodes.
	     *
	     * @param skeleton The skeleton used by the animator requesting the ouput pose.
	     */
	    private updateSkeletonPose(skeleton);
	}
	export = SkeletonDifferenceState;
	
}
declare module "awayjs-renderergl/lib/animators/nodes/SkeletonDifferenceNode" {
	import AnimationNodeBase = require("awayjs-display/lib/animators/nodes/AnimationNodeBase");
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import SkeletonDifferenceState = require("awayjs-renderergl/lib/animators/states/SkeletonDifferenceState");
	/**
	 * A skeleton animation node that uses a difference input pose with a base input pose to blend a linearly interpolated output of a skeleton pose.
	 */
	class SkeletonDifferenceNode extends AnimationNodeBase {
	    /**
	     * Defines a base input node to use for the blended output.
	     */
	    baseInput: AnimationNodeBase;
	    /**
	     * Defines a difference input node to use for the blended output.
	     */
	    differenceInput: AnimationNodeBase;
	    /**
	     * Creates a new <code>SkeletonAdditiveNode</code> object.
	     */
	    constructor();
	    /**
	     * @inheritDoc
	     */
	    getAnimationState(animator: AnimatorBase): SkeletonDifferenceState;
	}
	export = SkeletonDifferenceNode;
	
}
declare module "awayjs-renderergl/lib/animators/states/SkeletonDirectionalState" {
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import Skeleton = require("awayjs-renderergl/lib/animators/data/Skeleton");
	import SkeletonPose = require("awayjs-renderergl/lib/animators/data/SkeletonPose");
	import SkeletonDirectionalNode = require("awayjs-renderergl/lib/animators/nodes/SkeletonDirectionalNode");
	import AnimationStateBase = require("awayjs-renderergl/lib/animators/states/AnimationStateBase");
	import ISkeletonAnimationState = require("awayjs-renderergl/lib/animators/states/ISkeletonAnimationState");
	/**
	 *
	 */
	class SkeletonDirectionalState extends AnimationStateBase implements ISkeletonAnimationState {
	    private _skeletonAnimationNode;
	    private _skeletonPose;
	    private _skeletonPoseDirty;
	    private _inputA;
	    private _inputB;
	    private _blendWeight;
	    private _direction;
	    private _blendDirty;
	    private _forward;
	    private _backward;
	    private _left;
	    private _right;
	    /**
	     * Defines the direction in degrees of the aniamtion between the forwards (0), right(90) backwards (180) and left(270) input nodes,
	     * used to produce the skeleton pose output.
	     */
	    direction: number;
	    constructor(animator: AnimatorBase, skeletonAnimationNode: SkeletonDirectionalNode);
	    /**
	     * @inheritDoc
	     */
	    phase(value: number): void;
	    /**
	     * @inheritDoc
	     */
	    _pUdateTime(time: number): void;
	    /**
	     * Returns the current skeleton pose of the animation in the clip based on the internal playhead position.
	     */
	    getSkeletonPose(skeleton: Skeleton): SkeletonPose;
	    /**
	     * @inheritDoc
	     */
	    _pUpdatePositionDelta(): void;
	    /**
	     * Updates the output skeleton pose of the node based on the direction value between forward, backwards, left and right input nodes.
	     *
	     * @param skeleton The skeleton used by the animator requesting the ouput pose.
	     */
	    private updateSkeletonPose(skeleton);
	    /**
	     * Updates the blend value for the animation output based on the direction value between forward, backwards, left and right input nodes.
	     *
	     * @private
	     */
	    private updateBlend();
	}
	export = SkeletonDirectionalState;
	
}
declare module "awayjs-renderergl/lib/animators/nodes/SkeletonDirectionalNode" {
	import AnimationNodeBase = require("awayjs-display/lib/animators/nodes/AnimationNodeBase");
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import SkeletonDirectionalState = require("awayjs-renderergl/lib/animators/states/SkeletonDirectionalState");
	/**
	 * A skeleton animation node that uses four directional input poses with an input direction to blend a linearly interpolated output of a skeleton pose.
	 */
	class SkeletonDirectionalNode extends AnimationNodeBase {
	    /**
	     * Defines the forward configured input node to use for the blended output.
	     */
	    forward: AnimationNodeBase;
	    /**
	     * Defines the backwards configured input node to use for the blended output.
	     */
	    backward: AnimationNodeBase;
	    /**
	     * Defines the left configured input node to use for the blended output.
	     */
	    left: AnimationNodeBase;
	    /**
	     * Defines the right configured input node to use for the blended output.
	     */
	    right: AnimationNodeBase;
	    constructor();
	    /**
	     * @inheritDoc
	     */
	    getAnimationState(animator: AnimatorBase): SkeletonDirectionalState;
	}
	export = SkeletonDirectionalNode;
	
}
declare module "awayjs-renderergl/lib/animators/states/SkeletonNaryLERPState" {
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import Skeleton = require("awayjs-renderergl/lib/animators/data/Skeleton");
	import SkeletonPose = require("awayjs-renderergl/lib/animators/data/SkeletonPose");
	import SkeletonNaryLERPNode = require("awayjs-renderergl/lib/animators/nodes/SkeletonNaryLERPNode");
	import AnimationStateBase = require("awayjs-renderergl/lib/animators/states/AnimationStateBase");
	import ISkeletonAnimationState = require("awayjs-renderergl/lib/animators/states/ISkeletonAnimationState");
	/**
	 *
	 */
	class SkeletonNaryLERPState extends AnimationStateBase implements ISkeletonAnimationState {
	    private _skeletonAnimationNode;
	    private _skeletonPose;
	    private _skeletonPoseDirty;
	    private _blendWeights;
	    private _inputs;
	    constructor(animator: AnimatorBase, skeletonAnimationNode: SkeletonNaryLERPNode);
	    /**
	     * @inheritDoc
	     */
	    phase(value: number): void;
	    /**
	     * @inheritDoc
	     */
	    _pUdateTime(time: number): void;
	    /**
	     * Returns the current skeleton pose of the animation in the clip based on the internal playhead position.
	     */
	    getSkeletonPose(skeleton: Skeleton): SkeletonPose;
	    /**
	     * Returns the blend weight of the skeleton aniamtion node that resides at the given input index.
	     *
	     * @param index The input index for which the skeleton animation node blend weight is requested.
	     */
	    getBlendWeightAt(index: number): number;
	    /**
	     * Sets the blend weight of the skeleton aniamtion node that resides at the given input index.
	     *
	     * @param index The input index on which the skeleton animation node blend weight is to be set.
	     * @param blendWeight The blend weight value to use for the given skeleton animation node index.
	     */
	    setBlendWeightAt(index: number, blendWeight: number): void;
	    /**
	     * @inheritDoc
	     */
	    _pUpdatePositionDelta(): void;
	    /**
	     * Updates the output skeleton pose of the node based on the blend weight values given to the input nodes.
	     *
	     * @param skeleton The skeleton used by the animator requesting the ouput pose.
	     */
	    private updateSkeletonPose(skeleton);
	}
	export = SkeletonNaryLERPState;
	
}
declare module "awayjs-renderergl/lib/animators/nodes/SkeletonNaryLERPNode" {
	import AnimationNodeBase = require("awayjs-display/lib/animators/nodes/AnimationNodeBase");
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import SkeletonNaryLERPState = require("awayjs-renderergl/lib/animators/states/SkeletonNaryLERPState");
	/**
	 * A skeleton animation node that uses an n-dimensional array of animation node inputs to blend a lineraly interpolated output of a skeleton pose.
	 */
	class SkeletonNaryLERPNode extends AnimationNodeBase {
	    _iInputs: AnimationNodeBase[];
	    private _numInputs;
	    numInputs: number;
	    /**
	     * Creates a new <code>SkeletonNaryLERPNode</code> object.
	     */
	    constructor();
	    /**
	     * Returns an integer representing the input index of the given skeleton animation node.
	     *
	     * @param input The skeleton animation node for with the input index is requested.
	     */
	    getInputIndex(input: AnimationNodeBase): number;
	    /**
	     * Returns the skeleton animation node object that resides at the given input index.
	     *
	     * @param index The input index for which the skeleton animation node is requested.
	     */
	    getInputAt(index: number): AnimationNodeBase;
	    /**
	     * Adds a new skeleton animation node input to the animation node.
	     */
	    addInput(input: AnimationNodeBase): void;
	    /**
	     * @inheritDoc
	     */
	    getAnimationState(animator: AnimatorBase): SkeletonNaryLERPState;
	}
	export = SkeletonNaryLERPNode;
	
}
declare module "awayjs-renderergl/lib/animators/states/VertexClipState" {
	import Geometry = require("awayjs-display/lib/base/Geometry");
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import VertexClipNode = require("awayjs-renderergl/lib/animators/nodes/VertexClipNode");
	import AnimationClipState = require("awayjs-renderergl/lib/animators/states/AnimationClipState");
	import IVertexAnimationState = require("awayjs-renderergl/lib/animators/states/IVertexAnimationState");
	/**
	 *
	 */
	class VertexClipState extends AnimationClipState implements IVertexAnimationState {
	    private _frames;
	    private _vertexClipNode;
	    private _currentGeometry;
	    private _nextGeometry;
	    /**
	     * @inheritDoc
	     */
	    currentGeometry: Geometry;
	    /**
	     * @inheritDoc
	     */
	    nextGeometry: Geometry;
	    constructor(animator: AnimatorBase, vertexClipNode: VertexClipNode);
	    /**
	     * @inheritDoc
	     */
	    _pUpdateFrames(): void;
	    /**
	     * @inheritDoc
	     */
	    _pUpdatePositionDelta(): void;
	}
	export = VertexClipState;
	
}
declare module "awayjs-renderergl/lib/animators/nodes/VertexClipNode" {
	import Vector3D = require("awayjs-core/lib/geom/Vector3D");
	import Geometry = require("awayjs-display/lib/base/Geometry");
	import AnimationClipNodeBase = require("awayjs-renderergl/lib/animators/nodes/AnimationClipNodeBase");
	/**
	 * A vertex animation node containing time-based animation data as individual geometry obejcts.
	 */
	class VertexClipNode extends AnimationClipNodeBase {
	    private _frames;
	    private _translations;
	    /**
	     * Returns a vector of geometry frames representing the vertex values of each animation frame in the clip.
	     */
	    frames: Geometry[];
	    /**
	     * Creates a new <code>VertexClipNode</code> object.
	     */
	    constructor();
	    /**
	     * Adds a geometry object to the internal timeline of the animation node.
	     *
	     * @param geometry The geometry object to add to the timeline of the node.
	     * @param duration The specified duration of the frame in milliseconds.
	     * @param translation The absolute translation of the frame, used in root delta calculations for mesh movement.
	     */
	    addFrame(geometry: Geometry, duration: number, translation?: Vector3D): void;
	    /**
	     * @inheritDoc
	     */
	    _pUpdateStitch(): void;
	}
	export = VertexClipNode;
	
}
declare module "awayjs-renderergl/lib/animators/transitions/CrossfadeTransitionState" {
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import SkeletonBinaryLERPState = require("awayjs-renderergl/lib/animators/states/SkeletonBinaryLERPState");
	import CrossfadeTransitionNode = require("awayjs-renderergl/lib/animators/transitions/CrossfadeTransitionNode");
	/**
	 *
	 */
	class CrossfadeTransitionState extends SkeletonBinaryLERPState {
	    private _crossfadeTransitionNode;
	    private _animationStateTransitionComplete;
	    constructor(animator: AnimatorBase, skeletonAnimationNode: CrossfadeTransitionNode);
	    /**
	     * @inheritDoc
	     */
	    _pUpdateTime(time: number): void;
	}
	export = CrossfadeTransitionState;
	
}
declare module "awayjs-renderergl/lib/animators/transitions/CrossfadeTransitionNode" {
	import SkeletonBinaryLERPNode = require("awayjs-renderergl/lib/animators/nodes/SkeletonBinaryLERPNode");
	/**
	 * A skeleton animation node that uses two animation node inputs to blend a lineraly interpolated output of a skeleton pose.
	 */
	class CrossfadeTransitionNode extends SkeletonBinaryLERPNode {
	    blendSpeed: number;
	    startBlend: number;
	    /**
	     * Creates a new <code>CrossfadeTransitionNode</code> object.
	     */
	    constructor();
	}
	export = CrossfadeTransitionNode;
	
}
declare module "awayjs-renderergl/lib/animators/transitions/CrossfadeTransition" {
	import AnimationNodeBase = require("awayjs-display/lib/animators/nodes/AnimationNodeBase");
	import AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
	import IAnimationTransition = require("awayjs-renderergl/lib/animators/transitions/IAnimationTransition");
	/**
	 *
	 */
	class CrossfadeTransition implements IAnimationTransition {
	    blendSpeed: number;
	    constructor(blendSpeed: number);
	    getAnimationNode(animator: AnimatorBase, startNode: AnimationNodeBase, endNode: AnimationNodeBase, startBlend: number): AnimationNodeBase;
	}
	export = CrossfadeTransition;
	
}
declare module "awayjs-renderergl/lib/tools/commands/Merge" {
	import DisplayObjectContainer = require("awayjs-display/lib/containers/DisplayObjectContainer");
	import Mesh = require("awayjs-display/lib/entities/Mesh");
	/**
	 *  Class Merge merges two or more static meshes into one.<code>Merge</code>
	 */
	class Merge {
	    private _objectSpace;
	    private _keepMaterial;
	    private _disposeSources;
	    private _geomVOs;
	    private _toDispose;
	    /**
	     * @param    keepMaterial    [optional]    Determines if the merged object uses the recevier mesh material information or keeps its source material(s). Defaults to false.
	     * If false and receiver object has multiple materials, the last material found in receiver submeshes is applied to the merged submesh(es).
	     * @param    disposeSources  [optional]    Determines if the mesh and geometry source(s) used for the merging are disposed. Defaults to false.
	     * If true, only receiver geometry and resulting mesh are kept in  memory.
	     * @param    objectSpace     [optional]    Determines if source mesh(es) is/are merged using objectSpace or worldspace. Defaults to false.
	     */
	    constructor(keepMaterial?: boolean, disposeSources?: boolean, objectSpace?: boolean);
	    /**
	     * Determines if the mesh and geometry source(s) used for the merging are disposed. Defaults to false.
	     */
	    disposeSources: boolean;
	    /**
	     * Determines if the material source(s) used for the merging are disposed. Defaults to false.
	     */
	    keepMaterial: boolean;
	    /**
	     * Determines if source mesh(es) is/are merged using objectSpace or worldspace. Defaults to false.
	     */
	    objectSpace: boolean;
	    /**
	     * Merges all the children of a container into a single Mesh. If no Mesh object is found, method returns the receiver without modification.
	     *
	     * @param    receiver           The Mesh to receive the merged contents of the container.
	     * @param    objectContainer    The DisplayObjectContainer holding the meshes to be mergd.
	     *
	     * @return The merged Mesh instance.
	     */
	    applyToContainer(receiver: Mesh, objectContainer: DisplayObjectContainer): void;
	    /**
	     * Merges all the meshes found in the Array&lt;Mesh&gt; into a single Mesh.
	     *
	     * @param    receiver    The Mesh to receive the merged contents of the meshes.
	     * @param    meshes      A series of Meshes to be merged with the reciever mesh.
	     */
	    applyToMeshes(receiver: Mesh, meshes: Mesh[]): void;
	    /**
	     *  Merges 2 meshes into one. It is recommand to use apply when 2 meshes are to be merged. If more need to be merged, use either applyToMeshes or applyToContainer methods.
	     *
	     * @param    receiver    The Mesh to receive the merged contents of both meshes.
	     * @param    mesh        The Mesh to be merged with the receiver mesh
	     */
	    apply(receiver: Mesh, mesh: Mesh): void;
	    private reset();
	    private merge(destMesh, dispose);
	    private collect(mesh, dispose);
	    private getSubGeomData(material);
	    private parseContainer(receiver, object);
	}
	export = Merge;
	
}