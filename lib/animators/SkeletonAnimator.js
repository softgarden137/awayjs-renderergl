var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TriangleSubGeometry = require("awayjs-display/lib/base/TriangleSubGeometry");
var SubGeometryEvent = require("awayjs-display/lib/events/SubGeometryEvent");
var ContextGLProgramType = require("awayjs-stagegl/lib/base/ContextGLProgramType");
var AnimatorBase = require("awayjs-renderergl/lib/animators/AnimatorBase");
var JointPose = require("awayjs-renderergl/lib/animators/data/JointPose");
var SkeletonPose = require("awayjs-renderergl/lib/animators/data/SkeletonPose");
var AnimationStateEvent = require("awayjs-renderergl/lib/events/AnimationStateEvent");
/**
 * Provides an interface for assigning skeleton-based animation data sets to mesh-based entity objects
 * and controlling the various available states of animation through an interative playhead that can be
 * automatically updated or manually triggered.
 */
var SkeletonAnimator = (function (_super) {
    __extends(SkeletonAnimator, _super);
    /**
     * Creates a new <code>SkeletonAnimator</code> object.
     *
     * @param skeletonAnimationSet The animation data set containing the skeleton animations used by the animator.
     * @param skeleton The skeleton object used for calculating the resulting global matrices for transforming skinned mesh data.
     * @param forceCPU Optional value that only allows the animator to perform calculation on the CPU. Defaults to false.
     */
    function SkeletonAnimator(animationSet, skeleton, forceCPU) {
        var _this = this;
        if (forceCPU === void 0) { forceCPU = false; }
        _super.call(this, animationSet);
        this._globalPose = new SkeletonPose();
        this._morphedSubGeometry = new Object();
        this._morphedSubGeometryDirty = new Object();
        this._skeleton = skeleton;
        this._forceCPU = forceCPU;
        this._jointsPerVertex = animationSet.jointsPerVertex;
        this._numJoints = this._skeleton.numJoints;
        this._globalMatrices = new Array(this._numJoints * 12);
        var j = 0;
        for (var i = 0; i < this._numJoints; ++i) {
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
        this._onTransitionCompleteDelegate = function (event) { return _this.onTransitionComplete(event); };
        this._onIndicesUpdateDelegate = function (event) { return _this.onIndicesUpdate(event); };
        this._onVerticesUpdateDelegate = function (event) { return _this.onVerticesUpdate(event); };
    }
    Object.defineProperty(SkeletonAnimator.prototype, "globalMatrices", {
        /**
         * returns the calculated global matrices of the current skeleton pose.
         *
         * @see #globalPose
         */
        get: function () {
            if (this._globalPropertiesDirty)
                this.updateGlobalProperties();
            return this._globalMatrices;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SkeletonAnimator.prototype, "globalPose", {
        /**
         * returns the current skeleton pose output from the animator.
         *
         * @see away.animators.data.SkeletonPose
         */
        get: function () {
            if (this._globalPropertiesDirty)
                this.updateGlobalProperties();
            return this._globalPose;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SkeletonAnimator.prototype, "skeleton", {
        /**
         * Returns the skeleton object in use by the animator - this defines the number and heirarchy of joints used by the
         * skinned geoemtry to which skeleon animator is applied.
         */
        get: function () {
            return this._skeleton;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SkeletonAnimator.prototype, "forceCPU", {
        /**
         * Indicates whether the skeleton animator is disabled by default for GPU rendering, something that allows the animator to perform calculation on the GPU.
         * Defaults to false.
         */
        get: function () {
            return this._forceCPU;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SkeletonAnimator.prototype, "useCondensedIndices", {
        /**
         * Offers the option of enabling GPU accelerated animation on skeletons larger than 32 joints
         * by condensing the number of joint index values required per mesh. Only applicable to
         * skeleton animations that utilise more than one mesh object. Defaults to false.
         */
        get: function () {
            return this._useCondensedIndices;
        },
        set: function (value) {
            this._useCondensedIndices = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    SkeletonAnimator.prototype.clone = function () {
        /* The cast to SkeletonAnimationSet should never fail, as _animationSet can only be set
         through the constructor, which will only accept a SkeletonAnimationSet. */
        return new SkeletonAnimator(this._pAnimationSet, this._skeleton, this._forceCPU);
    };
    /**
     * Plays an animation state registered with the given name in the animation data set.
     *
     * @param name The data set name of the animation state to be played.
     * @param transition An optional transition object that determines how the animator will transition from the currently active animation state.
     * @param offset An option offset time (in milliseconds) that resets the state's internal clock to the absolute time of the animator plus the offset value. Required for non-looping animation states.
     */
    SkeletonAnimator.prototype.play = function (name, transition, offset) {
        if (transition === void 0) { transition = null; }
        if (offset === void 0) { offset = NaN; }
        if (this._pActiveAnimationName == name)
            return;
        this._pActiveAnimationName = name;
        if (!this._pAnimationSet.hasAnimation(name))
            throw new Error("Animation root node " + name + " not found!");
        if (transition && this._pActiveNode) {
            //setup the transition
            this._pActiveNode = transition.getAnimationNode(this, this._pActiveNode, this._pAnimationSet.getAnimation(name), this._pAbsoluteTime);
            this._pActiveNode.addEventListener(AnimationStateEvent.TRANSITION_COMPLETE, this._onTransitionCompleteDelegate);
        }
        else
            this._pActiveNode = this._pAnimationSet.getAnimation(name);
        this._pActiveState = this.getAnimationState(this._pActiveNode);
        if (this.updatePosition) {
            //update straight away to reset position deltas
            this._pActiveState.update(this._pAbsoluteTime);
            this._pActiveState.positionDelta;
        }
        this._activeSkeletonState = this._pActiveState;
        this.start();
        //apply a time offset if specified
        if (!isNaN(offset))
            this.reset(name, offset);
    };
    /**
     * @inheritDoc
     */
    SkeletonAnimator.prototype.setRenderState = function (shaderObject, renderable, stage, camera, vertexConstantOffset /*int*/, vertexStreamOffset /*int*/) {
        // do on request of globalProperties
        if (this._globalPropertiesDirty)
            this.updateGlobalProperties();
        var subGeometry = renderable.subMesh.subGeometry;
        subGeometry.useCondensedIndices = this._useCondensedIndices;
        if (this._useCondensedIndices) {
            // using a condensed data set
            this.updateCondensedMatrices(subGeometry.condensedIndexLookUp, subGeometry.numCondensedJoints);
            stage.context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, vertexConstantOffset, this._condensedMatrices, subGeometry.numCondensedJoints * 3);
        }
        else {
            if (this._pAnimationSet.usesCPU) {
                if (this._morphedSubGeometryDirty[subGeometry.id])
                    this.morphSubGeometry(renderable, subGeometry);
                return;
            }
            stage.context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, vertexConstantOffset, this._globalMatrices, this._numJoints * 3);
        }
        stage.activateBuffer(vertexStreamOffset, renderable.getVertexData(TriangleSubGeometry.JOINT_INDEX_DATA), renderable.getVertexOffset(TriangleSubGeometry.JOINT_INDEX_DATA), renderable.JOINT_INDEX_FORMAT);
        stage.activateBuffer(vertexStreamOffset + 1, renderable.getVertexData(TriangleSubGeometry.JOINT_WEIGHT_DATA), renderable.getVertexOffset(TriangleSubGeometry.JOINT_WEIGHT_DATA), renderable.JOINT_WEIGHT_FORMAT);
    };
    /**
     * @inheritDoc
     */
    SkeletonAnimator.prototype.testGPUCompatibility = function (shaderObject) {
        if (!this._useCondensedIndices && (this._forceCPU || this._jointsPerVertex > 4 || shaderObject.numUsedVertexConstants + this._numJoints * 3 > 128))
            this._pAnimationSet.cancelGPUCompatibility();
    };
    /**
     * Applies the calculated time delta to the active animation state node or state transition object.
     */
    SkeletonAnimator.prototype._pUpdateDeltaTime = function (dt) {
        _super.prototype._pUpdateDeltaTime.call(this, dt);
        //invalidate pose matrices
        this._globalPropertiesDirty = true;
        //trigger geometry invalidation if using CPU animation
        if (this._pAnimationSet.usesCPU)
            for (var key in this._morphedSubGeometryDirty)
                this._morphedSubGeometryDirty[key] = true;
    };
    SkeletonAnimator.prototype.updateCondensedMatrices = function (condensedIndexLookUp /*uint*/, numJoints /*uint*/) {
        var i = 0, j = 0;
        var len /*uint*/;
        var srcIndex /*uint*/;
        this._condensedMatrices = new Array();
        do {
            srcIndex = condensedIndexLookUp[i] * 4;
            len = srcIndex + 12;
            while (srcIndex < len)
                this._condensedMatrices[j++] = this._globalMatrices[srcIndex++];
        } while (++i < numJoints);
    };
    SkeletonAnimator.prototype.updateGlobalProperties = function () {
        this._globalPropertiesDirty = false;
        //get global pose
        this.localToGlobalPose(this._activeSkeletonState.getSkeletonPose(this._skeleton), this._globalPose, this._skeleton);
        // convert pose to matrix
        var mtxOffset = 0;
        var globalPoses = this._globalPose.jointPoses;
        var raw;
        var ox, oy, oz, ow;
        var xy2, xz2, xw2;
        var yz2, yw2, zw2;
        var n11, n12, n13;
        var n21, n22, n23;
        var n31, n32, n33;
        var m11, m12, m13, m14;
        var m21, m22, m23, m24;
        var m31, m32, m33, m34;
        var joints = this._skeleton.joints;
        var pose;
        var quat;
        var vec;
        var t;
        for (var i = 0; i < this._numJoints; ++i) {
            pose = globalPoses[i];
            quat = pose.orientation;
            vec = pose.translation;
            ox = quat.x;
            oy = quat.y;
            oz = quat.z;
            ow = quat.w;
            xy2 = (t = 2.0 * ox) * oy;
            xz2 = t * oz;
            xw2 = t * ow;
            yz2 = (t = 2.0 * oy) * oz;
            yw2 = t * ow;
            zw2 = 2.0 * oz * ow;
            yz2 = 2.0 * oy * oz;
            yw2 = 2.0 * oy * ow;
            zw2 = 2.0 * oz * ow;
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
            this._globalMatrices[mtxOffset] = n11 * m11 + n12 * m21 + n13 * m31;
            this._globalMatrices[mtxOffset + 1] = n11 * m12 + n12 * m22 + n13 * m32;
            this._globalMatrices[mtxOffset + 2] = n11 * m13 + n12 * m23 + n13 * m33;
            this._globalMatrices[mtxOffset + 3] = n11 * m14 + n12 * m24 + n13 * m34 + vec.x;
            this._globalMatrices[mtxOffset + 4] = n21 * m11 + n22 * m21 + n23 * m31;
            this._globalMatrices[mtxOffset + 5] = n21 * m12 + n22 * m22 + n23 * m32;
            this._globalMatrices[mtxOffset + 6] = n21 * m13 + n22 * m23 + n23 * m33;
            this._globalMatrices[mtxOffset + 7] = n21 * m14 + n22 * m24 + n23 * m34 + vec.y;
            this._globalMatrices[mtxOffset + 8] = n31 * m11 + n32 * m21 + n33 * m31;
            this._globalMatrices[mtxOffset + 9] = n31 * m12 + n32 * m22 + n33 * m32;
            this._globalMatrices[mtxOffset + 10] = n31 * m13 + n32 * m23 + n33 * m33;
            this._globalMatrices[mtxOffset + 11] = n31 * m14 + n32 * m24 + n33 * m34 + vec.z;
            mtxOffset = mtxOffset + 12;
        }
    };
    SkeletonAnimator.prototype.getRenderableSubGeometry = function (renderable, sourceSubGeometry) {
        this._morphedSubGeometryDirty[sourceSubGeometry.id] = true;
        //early out for GPU animations
        if (!this._pAnimationSet.usesCPU)
            return sourceSubGeometry;
        var targetSubGeometry;
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
    };
    /**
     * If the animation can't be performed on GPU, transform vertices manually
     * @param subGeom The subgeometry containing the weights and joint index data per vertex.
     * @param pass The material pass for which we need to transform the vertices
     */
    SkeletonAnimator.prototype.morphSubGeometry = function (renderable, sourceSubGeometry) {
        this._morphedSubGeometryDirty[sourceSubGeometry.id] = false;
        var sourcePositions = sourceSubGeometry.positions;
        var sourceNormals = sourceSubGeometry.vertexNormals;
        var sourceTangents = sourceSubGeometry.vertexTangents;
        var jointIndices = sourceSubGeometry.jointIndices;
        var jointWeights = sourceSubGeometry.jointWeights;
        var targetSubGeometry = this._morphedSubGeometry[sourceSubGeometry.id];
        var targetPositions = targetSubGeometry.positions;
        var targetNormals = targetSubGeometry.vertexNormals;
        var targetTangents = targetSubGeometry.vertexTangents;
        var index = 0;
        var j = 0;
        var k /*uint*/;
        var vx, vy, vz;
        var nx, ny, nz;
        var tx, ty, tz;
        var len = sourcePositions.length;
        var weight;
        var vertX, vertY, vertZ;
        var normX, normY, normZ;
        var tangX, tangY, tangZ;
        var m11, m12, m13, m14;
        var m21, m22, m23, m24;
        var m31, m32, m33, m34;
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
                    var mtxOffset = jointIndices[j++] << 2;
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
                    vx += weight * (m11 * vertX + m12 * vertY + m13 * vertZ + m14);
                    vy += weight * (m21 * vertX + m22 * vertY + m23 * vertZ + m24);
                    vz += weight * (m31 * vertX + m32 * vertY + m33 * vertZ + m34);
                    nx += weight * (m11 * normX + m12 * normY + m13 * normZ);
                    ny += weight * (m21 * normX + m22 * normY + m23 * normZ);
                    nz += weight * (m31 * normX + m32 * normY + m33 * normZ);
                    tx += weight * (m11 * tangX + m12 * tangY + m13 * tangZ);
                    ty += weight * (m21 * tangX + m22 * tangY + m23 * tangZ);
                    tz += weight * (m31 * tangX + m32 * tangY + m33 * tangZ);
                    ++k;
                }
                else {
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
    };
    /**
     * Converts a local hierarchical skeleton pose to a global pose
     * @param targetPose The SkeletonPose object that will contain the global pose.
     * @param skeleton The skeleton containing the joints, and as such, the hierarchical data to transform to global poses.
     */
    SkeletonAnimator.prototype.localToGlobalPose = function (sourcePose, targetPose, skeleton) {
        var globalPoses = targetPose.jointPoses;
        var globalJointPose;
        var joints = skeleton.joints;
        var len = sourcePose.numJointPoses;
        var jointPoses = sourcePose.jointPoses;
        var parentIndex /*int*/;
        var joint;
        var parentPose;
        var pose;
        var or;
        var tr;
        var t;
        var q;
        var x1, y1, z1, w1;
        var x2, y2, z2, w2;
        var x3, y3, z3;
        // :s
        if (globalPoses.length != len)
            globalPoses.length = len;
        for (var i = 0; i < len; ++i) {
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
            }
            else {
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
                w1 = -x2 * x3 - y2 * y3 - z2 * z3;
                x1 = w2 * x3 + y2 * z3 - z2 * y3;
                y1 = w2 * y3 - x2 * z3 + z2 * x3;
                z1 = w2 * z3 + x2 * y3 - y2 * x3;
                // append parent translation
                tr = parentPose.translation;
                t.x = -w1 * x2 + x1 * w2 - y1 * z2 + z1 * y2 + tr.x;
                t.y = -w1 * y2 + x1 * z2 + y1 * w2 - z1 * x2 + tr.y;
                t.z = -w1 * z2 - x1 * y2 + y1 * x2 + z1 * w2 + tr.z;
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
                q.w = w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2;
                q.x = w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2;
                q.y = w1 * y2 - x1 * z2 + y1 * w2 + z1 * x2;
                q.z = w1 * z2 + x1 * y2 - y1 * x2 + z1 * w2;
            }
        }
    };
    SkeletonAnimator.prototype.onTransitionComplete = function (event) {
        if (event.type == AnimationStateEvent.TRANSITION_COMPLETE) {
            event.animationNode.removeEventListener(AnimationStateEvent.TRANSITION_COMPLETE, this._onTransitionCompleteDelegate);
            //if this is the current active state transition, revert control to the active node
            if (this._pActiveState == event.animationState) {
                this._pActiveNode = this._pAnimationSet.getAnimation(this._pActiveAnimationName);
                this._pActiveState = this.getAnimationState(this._pActiveNode);
                this._activeSkeletonState = this._pActiveState;
            }
        }
    };
    SkeletonAnimator.prototype.onIndicesUpdate = function (event) {
        var subGeometry = event.target;
        this._morphedSubGeometry[subGeometry.id].updateIndices(subGeometry.indices);
    };
    SkeletonAnimator.prototype.onVerticesUpdate = function (event) {
        var subGeometry = event.target;
        var morphGeometry = this._morphedSubGeometry[subGeometry.id];
        switch (event.dataType) {
            case TriangleSubGeometry.UV_DATA:
                morphGeometry.updateUVs(subGeometry.uvs);
            case TriangleSubGeometry.SECONDARY_UV_DATA:
                morphGeometry.updateUVs(subGeometry.secondaryUVs);
        }
    };
    return SkeletonAnimator;
})(AnimatorBase);
module.exports = SkeletonAnimator;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvc2tlbGV0b25hbmltYXRvci50cyJdLCJuYW1lcyI6WyJTa2VsZXRvbkFuaW1hdG9yIiwiU2tlbGV0b25BbmltYXRvci5jb25zdHJ1Y3RvciIsIlNrZWxldG9uQW5pbWF0b3IuZ2xvYmFsTWF0cmljZXMiLCJTa2VsZXRvbkFuaW1hdG9yLmdsb2JhbFBvc2UiLCJTa2VsZXRvbkFuaW1hdG9yLnNrZWxldG9uIiwiU2tlbGV0b25BbmltYXRvci5mb3JjZUNQVSIsIlNrZWxldG9uQW5pbWF0b3IudXNlQ29uZGVuc2VkSW5kaWNlcyIsIlNrZWxldG9uQW5pbWF0b3IuY2xvbmUiLCJTa2VsZXRvbkFuaW1hdG9yLnBsYXkiLCJTa2VsZXRvbkFuaW1hdG9yLnNldFJlbmRlclN0YXRlIiwiU2tlbGV0b25BbmltYXRvci50ZXN0R1BVQ29tcGF0aWJpbGl0eSIsIlNrZWxldG9uQW5pbWF0b3IuX3BVcGRhdGVEZWx0YVRpbWUiLCJTa2VsZXRvbkFuaW1hdG9yLnVwZGF0ZUNvbmRlbnNlZE1hdHJpY2VzIiwiU2tlbGV0b25BbmltYXRvci51cGRhdGVHbG9iYWxQcm9wZXJ0aWVzIiwiU2tlbGV0b25BbmltYXRvci5nZXRSZW5kZXJhYmxlU3ViR2VvbWV0cnkiLCJTa2VsZXRvbkFuaW1hdG9yLm1vcnBoU3ViR2VvbWV0cnkiLCJTa2VsZXRvbkFuaW1hdG9yLmxvY2FsVG9HbG9iYWxQb3NlIiwiU2tlbGV0b25BbmltYXRvci5vblRyYW5zaXRpb25Db21wbGV0ZSIsIlNrZWxldG9uQW5pbWF0b3Iub25JbmRpY2VzVXBkYXRlIiwiU2tlbGV0b25BbmltYXRvci5vblZlcnRpY2VzVXBkYXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFJQSxJQUFPLG1CQUFtQixXQUFjLDZDQUE2QyxDQUFDLENBQUM7QUFHdkYsSUFBTyxnQkFBZ0IsV0FBZSw0Q0FBNEMsQ0FBQyxDQUFDO0FBRXBGLElBQU8sb0JBQW9CLFdBQWMsOENBQThDLENBQUMsQ0FBQztBQUd6RixJQUFPLFlBQVksV0FBZ0IsOENBQThDLENBQUMsQ0FBQztBQUVuRixJQUFPLFNBQVMsV0FBZ0IsZ0RBQWdELENBQUMsQ0FBQztBQUdsRixJQUFPLFlBQVksV0FBZ0IsbURBQW1ELENBQUMsQ0FBQztBQUd4RixJQUFPLG1CQUFtQixXQUFjLGtEQUFrRCxDQUFDLENBQUM7QUFLNUYsQUFLQTs7OztHQURHO0lBQ0csZ0JBQWdCO0lBQVNBLFVBQXpCQSxnQkFBZ0JBLFVBQXFCQTtJQStFMUNBOzs7Ozs7T0FNR0E7SUFDSEEsU0F0RktBLGdCQUFnQkEsQ0FzRlRBLFlBQWlDQSxFQUFFQSxRQUFpQkEsRUFBRUEsUUFBd0JBO1FBdEYzRkMsaUJBcWxCQ0E7UUEvZmtFQSx3QkFBd0JBLEdBQXhCQSxnQkFBd0JBO1FBRXpGQSxrQkFBTUEsWUFBWUEsQ0FBQ0EsQ0FBQ0E7UUFyRmJBLGdCQUFXQSxHQUFnQkEsSUFBSUEsWUFBWUEsRUFBRUEsQ0FBQ0E7UUFHOUNBLHdCQUFtQkEsR0FBVUEsSUFBSUEsTUFBTUEsRUFBRUEsQ0FBQ0E7UUFDMUNBLDZCQUF3QkEsR0FBVUEsSUFBSUEsTUFBTUEsRUFBRUEsQ0FBQ0E7UUFtRnREQSxJQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxRQUFRQSxDQUFDQTtRQUMxQkEsSUFBSUEsQ0FBQ0EsU0FBU0EsR0FBR0EsUUFBUUEsQ0FBQ0E7UUFDMUJBLElBQUlBLENBQUNBLGdCQUFnQkEsR0FBR0EsWUFBWUEsQ0FBQ0EsZUFBZUEsQ0FBQ0E7UUFFckRBLElBQUlBLENBQUNBLFVBQVVBLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLFNBQVNBLENBQUNBO1FBQzNDQSxJQUFJQSxDQUFDQSxlQUFlQSxHQUFHQSxJQUFJQSxLQUFLQSxDQUFTQSxJQUFJQSxDQUFDQSxVQUFVQSxHQUFDQSxFQUFFQSxDQUFDQSxDQUFDQTtRQUU3REEsSUFBSUEsQ0FBQ0EsR0FBa0JBLENBQUNBLENBQUNBO1FBQ3pCQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFtQkEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsVUFBVUEsRUFBRUEsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0E7WUFDMURBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1lBQzlCQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUM5QkEsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFDOUJBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1lBQzlCQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUM5QkEsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFDOUJBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1lBQzlCQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUM5QkEsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFDOUJBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1lBQzlCQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUM5QkEsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFDL0JBLENBQUNBO1FB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RUEsR0FBVUEsQ0FBQ0E7UUFDdkNBLElBQUlBLEdBQVVBLEVBQUVBLEdBQVVBLEVBQUVBLEdBQVVBLENBQUNBO1FBQ3ZDQSxJQUFJQSxHQUFVQSxFQUFFQSxHQUFVQSxFQUFFQSxHQUFVQSxFQUFFQSxHQUFVQSxDQUFDQTtRQUNuREEsSUFBSUEsR0FBVUEsRUFBRUEsR0FBVUEsRUFBRUEsR0FBVUEsRUFBRUEsR0FBVUEsQ0FBQ0E7UUFDbkRBLElBQUlBLEdBQVVBLEVBQUVBLEdBQVVBLEVBQUVBLEdBQVVBLEVBQUVBLEdBQVVBLENBQUNBO1FBQ25EQSxJQUFJQSxNQUFNQSxHQUF3QkEsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsQ0FBQ0E7UUFDeERBLElBQUlBLElBQWNBLENBQUNBO1FBQ25CQSxJQUFJQSxJQUFlQSxDQUFDQTtRQUNwQkEsSUFBSUEsR0FBWUEsQ0FBQ0E7UUFDakJBLElBQUlBLENBQVFBLENBQUNBO1FBRWJBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQW1CQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxFQUFFQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQTtZQUMxREEsSUFBSUEsR0FBR0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDdEJBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBO1lBQ3hCQSxHQUFHQSxHQUFHQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQTtZQUN2QkEsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDWkEsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDWkEsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDWkEsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFFWkEsR0FBR0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsR0FBR0EsR0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBQ0EsRUFBRUEsQ0FBQ0E7WUFDdEJBLEdBQUdBLEdBQUdBLENBQUNBLEdBQUNBLEVBQUVBLENBQUNBO1lBQ1hBLEdBQUdBLEdBQUdBLENBQUNBLEdBQUNBLEVBQUVBLENBQUNBO1lBQ1hBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLEdBQUdBLEdBQUNBLEVBQUVBLENBQUNBLEdBQUNBLEVBQUVBLENBQUNBO1lBQ3RCQSxHQUFHQSxHQUFHQSxDQUFDQSxHQUFDQSxFQUFFQSxDQUFDQTtZQUNYQSxHQUFHQSxHQUFHQSxHQUFHQSxHQUFDQSxFQUFFQSxHQUFDQSxFQUFFQSxDQUFDQTtZQUVoQkEsR0FBR0EsR0FBR0EsR0FBR0EsR0FBQ0EsRUFBRUEsR0FBQ0EsRUFBRUEsQ0FBQ0E7WUFDaEJBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUNBLEVBQUVBLEdBQUNBLEVBQUVBLENBQUNBO1lBQ2hCQSxHQUFHQSxHQUFHQSxHQUFHQSxHQUFDQSxFQUFFQSxHQUFDQSxFQUFFQSxDQUFDQTtZQUNoQkEsRUFBRUEsSUFBSUEsRUFBRUEsQ0FBQ0E7WUFDVEEsRUFBRUEsSUFBSUEsRUFBRUEsQ0FBQ0E7WUFDVEEsRUFBRUEsSUFBSUEsRUFBRUEsQ0FBQ0E7WUFDVEEsRUFBRUEsSUFBSUEsRUFBRUEsQ0FBQ0E7WUFFVEEsR0FBR0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsRUFBRUEsR0FBR0EsRUFBRUEsQ0FBQ0EsR0FBR0EsRUFBRUEsR0FBR0EsRUFBRUEsQ0FBQ0E7WUFDOUJBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUdBLENBQUNBO1lBQ2hCQSxHQUFHQSxHQUFHQSxHQUFHQSxHQUFHQSxHQUFHQSxDQUFDQTtZQUNoQkEsR0FBR0EsR0FBR0EsR0FBR0EsR0FBR0EsR0FBR0EsQ0FBQ0E7WUFDaEJBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLEVBQUVBLEdBQUdBLEVBQUVBLENBQUNBO1lBQ25CQSxHQUFHQSxHQUFHQSxHQUFHQSxHQUFHQSxHQUFHQSxDQUFDQTtZQUNoQkEsR0FBR0EsR0FBR0EsR0FBR0EsR0FBR0EsR0FBR0EsQ0FBQ0E7WUFDaEJBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUdBLENBQUNBO1lBQ2hCQSxHQUFHQSxHQUFHQSxDQUFDQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQTtZQUV6QkEsQUFDQUEsNEJBRDRCQTtZQUM1QkEsR0FBR0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsZUFBZUEsQ0FBQ0E7WUFDaENBLEdBQUdBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ2JBLEdBQUdBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ2JBLEdBQUdBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ2JBLEdBQUdBLEdBQUdBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBO1lBQ2RBLEdBQUdBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ2JBLEdBQUdBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ2JBLEdBQUdBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ2JBLEdBQUdBLEdBQUdBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBO1lBQ2RBLEdBQUdBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ2JBLEdBQUdBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ2JBLEdBQUdBLEdBQUdBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBO1lBQ2RBLEdBQUdBLEdBQUdBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBO1lBRWRBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLFNBQVNBLENBQUNBLEdBQUdBLEdBQUdBLEdBQUNBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUNBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUNBLEdBQUdBLENBQUNBO1lBQzlEQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxTQUFTQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxHQUFHQSxHQUFDQSxHQUFHQSxHQUFHQSxHQUFHQSxHQUFDQSxHQUFHQSxHQUFHQSxHQUFHQSxHQUFDQSxHQUFHQSxDQUFDQTtZQUNsRUEsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsU0FBU0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsR0FBR0EsR0FBQ0EsR0FBR0EsR0FBR0EsR0FBR0EsR0FBQ0EsR0FBR0EsR0FBR0EsR0FBR0EsR0FBQ0EsR0FBR0EsQ0FBQ0E7WUFDbEVBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLFNBQVNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLEdBQUdBLEdBQUNBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUNBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUNBLEdBQUdBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO1lBQzFFQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxTQUFTQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxHQUFHQSxHQUFDQSxHQUFHQSxHQUFHQSxHQUFHQSxHQUFDQSxHQUFHQSxHQUFHQSxHQUFHQSxHQUFDQSxHQUFHQSxDQUFDQTtZQUNsRUEsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsU0FBU0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsR0FBR0EsR0FBQ0EsR0FBR0EsR0FBR0EsR0FBR0EsR0FBQ0EsR0FBR0EsR0FBR0EsR0FBR0EsR0FBQ0EsR0FBR0EsQ0FBQ0E7WUFDbEVBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLFNBQVNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLEdBQUdBLEdBQUNBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUNBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUNBLEdBQUdBLENBQUNBO1lBQ2xFQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxTQUFTQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFH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LGVBQWVBLENBQUNBLFNBQVNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO29CQUMxQ0EsR0FBR0EsR0FBR0EsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsU0FBU0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQzFDQSxHQUFHQSxHQUFHQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxTQUFTQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDMUNBLEdBQUdBLEdBQUdBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLFNBQVNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO29CQUMxQ0EsR0FBR0EsR0FBR0EsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsU0FBU0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQzFDQSxHQUFHQSxHQUFHQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxTQUFTQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQTtvQkFDM0NBLEdBQUdBLEdBQUdBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLFNBQVNBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBO29CQUMzQ0EsRUFBRUEsSUFBSUEsTUFBTUEsR0FBQ0EsQ0FBQ0EsR0FBR0EsR0FBQ0EsS0FBS0EsR0FBR0EsR0FBR0EsR0FBQ0EsS0FBS0EsR0FBR0EsR0FBR0EsR0FBQ0EsS0FBS0EsR0FBR0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7b0JBQ3ZEQSxFQUFFQSxJQUFJQSxNQUFNQSxHQUFDQSxDQUFDQSxHQUFHQSxHQUFDQSxLQUFLQSxHQUFHQSxHQUFHQSxHQUFDQSxLQUFLQSxHQUFHQSxHQUFHQSxHQUFDQSxLQUFLQSxHQUFHQSxHQUFHQSxDQUFDQSxDQUFDQTtvQkFDdkRBLEVBQUVBLElBQUlBLE1BQU1BLEdBQUNBLENBQUNBLEdBQUdBLEdBQUNBLEtBQUtBLEdBQUdBLEdBQUdBLEdBQUNBLEtBQUtBLEdBQUdBLEdBQUdBLEdBQUNBLEtBQUtBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBO29CQUN2REEsRUFBRUEsSUFBSUEsTUFBTUEsR0FBQ0EsQ0FBQ0EsR0FBR0EsR0FBQ0EsS0FBS0EsR0FBR0EsR0FBR0EsR0FBQ0EsS0FBS0EsR0FBR0EsR0FBR0EsR0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2pEQSxFQUFFQSxJQUFJQSxNQUFNQSxHQUFDQSxDQUFDQSxHQUFHQSxHQUFDQSxLQUFLQSxHQUFHQSxHQUFHQSxHQUFDQSxLQUFLQSxHQUFHQSxHQUFHQSxHQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtvQkFDakRBLEVBQUVBLElBQUlBLE1BQU1BLEdBQUNBLENBQUNBLEdBQUdBLEdBQUNBLEtBQUtBLEdBQUdBLEdBQUdBLEdBQUNBLEtBQUtBLEdBQUdBLEdBQUdBLEdBQUNBLEtBQUtBLENBQUNBLENBQUNBO29CQUNqREEsRUFBRUEsSUFBSUEsTUFBTUEsR0FBQ0EsQ0FBQ0EsR0FBR0EsR0FBQ0EsS0FBS0EsR0FBR0EsR0FBR0EsR0FBQ0EsS0FBS0EsR0FBR0EsR0FBR0EsR0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2pEQSxFQUFFQSxJQUFJQSxNQUFNQSxHQUFDQSxDQUFDQSxHQUFHQSxHQUFDQSxLQUFLQSxHQUFHQSxHQUFHQSxHQUFDQSxLQUFLQSxHQUFHQSxHQUFHQSxHQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtvQkFDakRBLEVBQUVBLElBQUlBLE1BQU1BLEdBQUNBLENBQUNBLEdBQUdBLEdBQUNBLEtBQUtBLEdBQUdBLEdBQUdBLEdBQUNBLEtBQUtBLEdBQUdBLEdBQUdBLEdBQUNBLEtBQUtBLENBQUNBLENBQUNBO29CQUNqREEsRUFBRUEsQ0FBQ0EsQ0FBQ0E7Z0JBQ0xBLENBQUNBO2dCQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtvQkFDUEEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsZ0JBQWdCQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDakNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLGdCQUFnQkEsQ0FBQ0E7Z0JBQzNCQSxDQUFDQTtZQUNGQSxDQUFDQTtZQUVEQSxlQUFlQSxDQUFDQSxLQUFLQSxDQUFD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S0FBS0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDbEJBLFdBQVdBLEdBQUdBLEtBQUtBLENBQUNBLFdBQVdBLENBQUNBO1lBQ2hDQSxJQUFJQSxHQUFHQSxVQUFVQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUVyQkEsQ0FBQ0EsR0FBR0EsZUFBZUEsQ0FBQ0EsV0FBV0EsQ0FBQ0E7WUFDaENBLENBQUNBLEdBQUdBLGVBQWVBLENBQUNBLFdBQVdBLENBQUNBO1lBRWhDQSxFQUFFQSxDQUFDQSxDQUFDQSxXQUFXQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDckJBLEVBQUVBLEdBQUdBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBO2dCQUN0QkEsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0E7Z0JBQ3RCQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDWEEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ1hBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO2dCQUNYQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDWEEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ1hBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO2dCQUNYQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNaQSxDQUFDQTtZQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtnQkFDUEEsQUFDQUEscUJBRHFCQTtnQkFDckJBLFVBQVVBLEdBQUdBLFdBQVdBLENBQUNBLFdBQVdBLENBQUNBLENBQUNBO2dCQUV0Q0EsQUFDQUEsZUFEZUE7Z0JBQ2ZBLEVBQUVBLEdBQUdBLFVBQVVBLENBQUNBLFdBQVdBLENBQUNBO2dCQUM1QkEsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0E7Z0JBQ3RCQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDVkEsRUFBRUEsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ1ZBLEVBQUVBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO2dCQUNWQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDVkEsRUFBRUEsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ1ZBLEVBQUVBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO2dCQUNWQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFFVkEsRUFBRUEsR0FBR0EsQ0FBQ0EsRUFBRUEsR0FBQ0EsRUFBRUEsR0FBR0EsRUFBRUEsR0FBQ0EsRUFBRUEsR0FBR0EsRUFBRUEsR0FBQ0EsRUFBRUEsQ0FBQ0E7Z0JBQzVCQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFDQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFDQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFDQSxFQUFFQSxDQUFDQTtnQkFDM0JBLEVBQUVBLEdBQUdBLEVBQUVBLEdBQUNBLEVBQUVBLEdBQUdBLEVBQUVBLEdBQUNBLEVBQUVBLEdBQUdBLEVBQUVBLEdBQUNBLEVBQUVBLENBQUNBO2dCQUMzQkEsRUFBRUEsR0FBR0EsRUFBRUEsR0FBQ0EsRUFBRUEsR0FBR0EsRUFBRUEsR0FBQ0EsRUFBRUEsR0FBR0EsRUFBRUEsR0FBQ0EsRUFBRUEsQ0FBQ0E7Z0JBRTNCQSxBQUNBQSw0QkFENEJBO2dCQUM1QkEsRUFBRUEsR0FBR0EsVUFBVUEsQ0FBQ0EsV0FBV0EsQ0FBQ0E7Z0JBQzVCQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxHQUFDQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFDQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFDQSxFQUFFQSxHQUFHQSxFQUFFQSxHQUFDQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDNUNBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLEdBQUNBLEVBQUVBLEdBQUdBLEVBQUVBLEdBQUNBLEVBQUVBLEdBQUdBLEVBQUVBLEdBQUNBLEVBQUVBLEdBQUdBLEVBQUVBLEdBQUNBLEVBQUVBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO2dCQUM1Q0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsR0FBQ0EsRUFBRUEsR0FBR0EsRUFBRUEsR0FBQ0EsRUFBRUEsR0FBR0EsRUFBRUEsR0FBQ0EsRUFBRUEsR0FBR0EsRUFBRUEsR0FBQ0EsRUFBRUEsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBRTVDQSxBQUNBQSw0QkFENEJBO2dCQUM1QkEsRUFBRUEsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ1ZBLEVBQUVBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO2dCQUNWQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDVkEsRUFBRUEsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ1ZBLEVBQUVBLEdBQUdBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBO2dCQUN0QkEsRUFBRUEsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ1ZBLEVBQUVBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO2dCQUNWQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDVkEsRUFBRUEsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBRVZBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLEVBQUVBLEdBQUNBLEVBQUVBLEdBQUdBLEVBQUVBLEdBQUNBLEVBQUVBLEdBQUdBLEVBQUVBLEdBQUNBLEVBQUVBLEdBQUdBLEVB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IiwiZmlsZSI6ImFuaW1hdG9ycy9Ta2VsZXRvbkFuaW1hdG9yLmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBRdWF0ZXJuaW9uXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2dlb20vUXVhdGVybmlvblwiKTtcbmltcG9ydCBWZWN0b3IzRFx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2dlb20vVmVjdG9yM0RcIik7XG5cbmltcG9ydCBJU3ViTWVzaFx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2Jhc2UvSVN1Yk1lc2hcIik7XG5pbXBvcnQgVHJpYW5nbGVTdWJHZW9tZXRyeVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2Jhc2UvVHJpYW5nbGVTdWJHZW9tZXRyeVwiKTtcbmltcG9ydCBUcmlhbmdsZVN1Yk1lc2hcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2Jhc2UvVHJpYW5nbGVTdWJNZXNoXCIpO1xuaW1wb3J0IENhbWVyYVx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2VudGl0aWVzL0NhbWVyYVwiKTtcbmltcG9ydCBTdWJHZW9tZXRyeUV2ZW50XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9ldmVudHMvU3ViR2VvbWV0cnlFdmVudFwiKTtcblxuaW1wb3J0IENvbnRleHRHTFByb2dyYW1UeXBlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYmFzZS9Db250ZXh0R0xQcm9ncmFtVHlwZVwiKTtcbmltcG9ydCBTdGFnZVx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2Jhc2UvU3RhZ2VcIik7XG5cbmltcG9ydCBBbmltYXRvckJhc2VcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL0FuaW1hdG9yQmFzZVwiKTtcbmltcG9ydCBTa2VsZXRvbkFuaW1hdGlvblNldFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9Ta2VsZXRvbkFuaW1hdGlvblNldFwiKTtcbmltcG9ydCBKb2ludFBvc2VcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL2RhdGEvSm9pbnRQb3NlXCIpO1xuaW1wb3J0IFNrZWxldG9uXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL2RhdGEvU2tlbGV0b25cIik7XG5pbXBvcnQgU2tlbGV0b25Kb2ludFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL2RhdGEvU2tlbGV0b25Kb2ludFwiKTtcbmltcG9ydCBTa2VsZXRvblBvc2VcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL2RhdGEvU2tlbGV0b25Qb3NlXCIpO1xuaW1wb3J0IElTa2VsZXRvbkFuaW1hdGlvblN0YXRlXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9zdGF0ZXMvSVNrZWxldG9uQW5pbWF0aW9uU3RhdGVcIik7XG5pbXBvcnQgSUFuaW1hdGlvblRyYW5zaXRpb25cdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvdHJhbnNpdGlvbnMvSUFuaW1hdGlvblRyYW5zaXRpb25cIik7XG5pbXBvcnQgQW5pbWF0aW9uU3RhdGVFdmVudFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2V2ZW50cy9BbmltYXRpb25TdGF0ZUV2ZW50XCIpO1xuaW1wb3J0IFNoYWRlck9iamVjdEJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2NvbXBpbGF0aW9uL1NoYWRlck9iamVjdEJhc2VcIik7XG5pbXBvcnQgUmVuZGVyYWJsZUJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL3Bvb2wvUmVuZGVyYWJsZUJhc2VcIik7XG5pbXBvcnQgVHJpYW5nbGVTdWJNZXNoUmVuZGVyYWJsZVx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvcG9vbC9UcmlhbmdsZVN1Yk1lc2hSZW5kZXJhYmxlXCIpO1xuXG4vKipcbiAqIFByb3ZpZGVzIGFuIGludGVyZmFjZSBmb3IgYXNzaWduaW5nIHNrZWxldG9uLWJhc2VkIGFuaW1hdGlvbiBkYXRhIHNldHMgdG8gbWVzaC1iYXNlZCBlbnRpdHkgb2JqZWN0c1xuICogYW5kIGNvbnRyb2xsaW5nIHRoZSB2YXJpb3VzIGF2YWlsYWJsZSBzdGF0ZXMgb2YgYW5pbWF0aW9uIHRocm91Z2ggYW4gaW50ZXJhdGl2ZSBwbGF5aGVhZCB0aGF0IGNhbiBiZVxuICogYXV0b21hdGljYWxseSB1cGRhdGVkIG9yIG1hbnVhbGx5IHRyaWdnZXJlZC5cbiAqL1xuY2xhc3MgU2tlbGV0b25BbmltYXRvciBleHRlbmRzIEFuaW1hdG9yQmFzZVxue1xuXHRwcml2YXRlIF9nbG9iYWxNYXRyaWNlczpBcnJheTxudW1iZXI+O1xuXHRwcml2YXRlIF9nbG9iYWxQb3NlOlNrZWxldG9uUG9zZSA9IG5ldyBTa2VsZXRvblBvc2UoKTtcblx0cHJpdmF0ZSBfZ2xvYmFsUHJvcGVydGllc0RpcnR5OmJvb2xlYW47XG5cdHByaXZhdGUgX251bUpvaW50czpudW1iZXIgLyp1aW50Ki87XG5cdHByaXZhdGUgX21vcnBoZWRTdWJHZW9tZXRyeTpPYmplY3QgPSBuZXcgT2JqZWN0KCk7XG5cdHByaXZhdGUgX21vcnBoZWRTdWJHZW9tZXRyeURpcnR5Ok9iamVjdCA9IG5ldyBPYmplY3QoKTtcblx0cHJpdmF0ZSBfY29uZGVuc2VkTWF0cmljZXM6QXJyYXk8bnVtYmVyPjtcblxuXHRwcml2YXRlIF9za2VsZXRvbjpTa2VsZXRvbjtcblx0cHJpdmF0ZSBfZm9yY2VDUFU6Ym9vbGVhbjtcblx0cHJpdmF0ZSBfdXNlQ29uZGVuc2VkSW5kaWNlczpib29sZWFuO1xuXHRwcml2YXRlIF9qb2ludHNQZXJWZXJ0ZXg6bnVtYmVyIC8qdWludCovO1xuXHRwcml2YXRlIF9hY3RpdmVTa2VsZXRvblN0YXRlOklTa2VsZXRvbkFuaW1hdGlvblN0YXRlO1xuXHRwcml2YXRlIF9vblRyYW5zaXRpb25Db21wbGV0ZURlbGVnYXRlOihldmVudDpBbmltYXRpb25TdGF0ZUV2ZW50KSA9PiB2b2lkO1xuXG5cdHByaXZhdGUgX29uSW5kaWNlc1VwZGF0ZURlbGVnYXRlOihldmVudDpTdWJHZW9tZXRyeUV2ZW50KSA9PiB2b2lkO1xuXHRwcml2YXRlIF9vblZlcnRpY2VzVXBkYXRlRGVsZWdhdGU6KGV2ZW50OlN1Ykdlb21ldHJ5RXZlbnQpID0+IHZvaWQ7XG5cblx0LyoqXG5cdCAqIHJldHVybnMgdGhlIGNhbGN1bGF0ZWQgZ2xvYmFsIG1hdHJpY2VzIG9mIHRoZSBjdXJyZW50IHNrZWxldG9uIHBvc2UuXG5cdCAqXG5cdCAqIEBzZWUgI2dsb2JhbFBvc2Vcblx0ICovXG5cdHB1YmxpYyBnZXQgZ2xvYmFsTWF0cmljZXMoKTpBcnJheTxudW1iZXI+XG5cdHtcblx0XHRpZiAodGhpcy5fZ2xvYmFsUHJvcGVydGllc0RpcnR5KVxuXHRcdFx0dGhpcy51cGRhdGVHbG9iYWxQcm9wZXJ0aWVzKCk7XG5cblx0XHRyZXR1cm4gdGhpcy5fZ2xvYmFsTWF0cmljZXM7XG5cdH1cblxuXHQvKipcblx0ICogcmV0dXJucyB0aGUgY3VycmVudCBza2VsZXRvbiBwb3NlIG91dHB1dCBmcm9tIHRoZSBhbmltYXRvci5cblx0ICpcblx0ICogQHNlZSBhd2F5LmFuaW1hdG9ycy5kYXRhLlNrZWxldG9uUG9zZVxuXHQgKi9cblx0cHVibGljIGdldCBnbG9iYWxQb3NlKCk6U2tlbGV0b25Qb3NlXG5cdHtcblx0XHRpZiAodGhpcy5fZ2xvYmFsUHJvcGVydGllc0RpcnR5KVxuXHRcdFx0dGhpcy51cGRhdGVHbG9iYWxQcm9wZXJ0aWVzKCk7XG5cblx0XHRyZXR1cm4gdGhpcy5fZ2xvYmFsUG9zZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBza2VsZXRvbiBvYmplY3QgaW4gdXNlIGJ5IHRoZSBhbmltYXRvciAtIHRoaXMgZGVmaW5lcyB0aGUgbnVtYmVyIGFuZCBoZWlyYXJjaHkgb2Ygam9pbnRzIHVzZWQgYnkgdGhlXG5cdCAqIHNraW5uZWQgZ2VvZW10cnkgdG8gd2hpY2ggc2tlbGVvbiBhbmltYXRvciBpcyBhcHBsaWVkLlxuXHQgKi9cblx0cHVibGljIGdldCBza2VsZXRvbigpOlNrZWxldG9uXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fc2tlbGV0b247XG5cdH1cblxuXHQvKipcblx0ICogSW5kaWNhdGVzIHdoZXRoZXIgdGhlIHNrZWxldG9uIGFuaW1hdG9yIGlzIGRpc2FibGVkIGJ5IGRlZmF1bHQgZm9yIEdQVSByZW5kZXJpbmcsIHNvbWV0aGluZyB0aGF0IGFsbG93cyB0aGUgYW5pbWF0b3IgdG8gcGVyZm9ybSBjYWxjdWxhdGlvbiBvbiB0aGUgR1BVLlxuXHQgKiBEZWZhdWx0cyB0byBmYWxzZS5cblx0ICovXG5cdHB1YmxpYyBnZXQgZm9yY2VDUFUoKTpib29sZWFuXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fZm9yY2VDUFU7XG5cdH1cblxuXHQvKipcblx0ICogT2ZmZXJzIHRoZSBvcHRpb24gb2YgZW5hYmxpbmcgR1BVIGFjY2VsZXJhdGVkIGFuaW1hdGlvbiBvbiBza2VsZXRvbnMgbGFyZ2VyIHRoYW4gMzIgam9pbnRzXG5cdCAqIGJ5IGNvbmRlbnNpbmcgdGhlIG51bWJlciBvZiBqb2ludCBpbmRleCB2YWx1ZXMgcmVxdWlyZWQgcGVyIG1lc2guIE9ubHkgYXBwbGljYWJsZSB0b1xuXHQgKiBza2VsZXRvbiBhbmltYXRpb25zIHRoYXQgdXRpbGlzZSBtb3JlIHRoYW4gb25lIG1lc2ggb2JqZWN0LiBEZWZhdWx0cyB0byBmYWxzZS5cblx0ICovXG5cdHB1YmxpYyBnZXQgdXNlQ29uZGVuc2VkSW5kaWNlcygpOmJvb2xlYW5cblx0e1xuXHRcdHJldHVybiB0aGlzLl91c2VDb25kZW5zZWRJbmRpY2VzO1xuXHR9XG5cblx0cHVibGljIHNldCB1c2VDb25kZW5zZWRJbmRpY2VzKHZhbHVlOmJvb2xlYW4pXG5cdHtcblx0XHR0aGlzLl91c2VDb25kZW5zZWRJbmRpY2VzID0gdmFsdWU7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyA8Y29kZT5Ta2VsZXRvbkFuaW1hdG9yPC9jb2RlPiBvYmplY3QuXG5cdCAqXG5cdCAqIEBwYXJhbSBza2VsZXRvbkFuaW1hdGlvblNldCBUaGUgYW5pbWF0aW9uIGRhdGEgc2V0IGNvbnRhaW5pbmcgdGhlIHNrZWxldG9uIGFuaW1hdGlvbnMgdXNlZCBieSB0aGUgYW5pbWF0b3IuXG5cdCAqIEBwYXJhbSBza2VsZXRvbiBUaGUgc2tlbGV0b24gb2JqZWN0IHVzZWQgZm9yIGNhbGN1bGF0aW5nIHRoZSByZXN1bHRpbmcgZ2xvYmFsIG1hdHJpY2VzIGZvciB0cmFuc2Zvcm1pbmcgc2tpbm5lZCBtZXNoIGRhdGEuXG5cdCAqIEBwYXJhbSBmb3JjZUNQVSBPcHRpb25hbCB2YWx1ZSB0aGF0IG9ubHkgYWxsb3dzIHRoZSBhbmltYXRvciB0byBwZXJmb3JtIGNhbGN1bGF0aW9uIG9uIHRoZSBDUFUuIERlZmF1bHRzIHRvIGZhbHNlLlxuXHQgKi9cblx0Y29uc3RydWN0b3IoYW5pbWF0aW9uU2V0OlNrZWxldG9uQW5pbWF0aW9uU2V0LCBza2VsZXRvbjpTa2VsZXRvbiwgZm9yY2VDUFU6Ym9vbGVhbiA9IGZhbHNlKVxuXHR7XG5cdFx0c3VwZXIoYW5pbWF0aW9uU2V0KTtcblxuXHRcdHRoaXMuX3NrZWxldG9uID0gc2tlbGV0b247XG5cdFx0dGhpcy5fZm9yY2VDUFUgPSBmb3JjZUNQVTtcblx0XHR0aGlzLl9qb2ludHNQZXJWZXJ0ZXggPSBhbmltYXRpb25TZXQuam9pbnRzUGVyVmVydGV4O1xuXG5cdFx0dGhpcy5fbnVtSm9pbnRzID0gdGhpcy5fc2tlbGV0b24ubnVtSm9pbnRzO1xuXHRcdHRoaXMuX2dsb2JhbE1hdHJpY2VzID0gbmV3IEFycmF5PG51bWJlcj4odGhpcy5fbnVtSm9pbnRzKjEyKTtcblxuXHRcdHZhciBqOm51bWJlciAvKmludCovID0gMDtcblx0XHRmb3IgKHZhciBpOm51bWJlciAvKnVpbnQqLyA9IDA7IGkgPCB0aGlzLl9udW1Kb2ludHM7ICsraSkge1xuXHRcdFx0dGhpcy5fZ2xvYmFsTWF0cmljZXNbaisrXSA9IDE7XG5cdFx0XHR0aGlzLl9nbG9iYWxNYXRyaWNlc1tqKytdID0gMDtcblx0XHRcdHRoaXMuX2dsb2JhbE1hdHJpY2VzW2orK10gPSAwO1xuXHRcdFx0dGhpcy5fZ2xvYmFsTWF0cmljZXNbaisrXSA9IDA7XG5cdFx0XHR0aGlzLl9nbG9iYWxNYXRyaWNlc1tqKytdID0gMDtcblx0XHRcdHRoaXMuX2dsb2JhbE1hdHJpY2VzW2orK10gPSAxO1xuXHRcdFx0dGhpcy5fZ2xvYmFsTWF0cmljZXNbaisrXSA9IDA7XG5cdFx0XHR0aGlzLl9nbG9iYWxNYXRyaWNlc1tqKytdID0gMDtcblx0XHRcdHRoaXMuX2dsb2JhbE1hdHJpY2VzW2orK10gPSAwO1xuXHRcdFx0dGhpcy5fZ2xvYmFsTWF0cmljZXNbaisrXSA9IDA7XG5cdFx0XHR0aGlzLl9nbG9iYWxNYXRyaWNlc1tqKytdID0gMTtcblx0XHRcdHRoaXMuX2dsb2JhbE1hdHJpY2VzW2orK10gPSAwO1xuXHRcdH1cblxuXHRcdHRoaXMuX29uVHJhbnNpdGlvbkNvbXBsZXRlRGVsZWdhdGUgPSAoZXZlbnQ6QW5pbWF0aW9uU3RhdGVFdmVudCkgPT4gdGhpcy5vblRyYW5zaXRpb25Db21wbGV0ZShldmVudCk7XG5cdFx0dGhpcy5fb25JbmRpY2VzVXBkYXRlRGVsZWdhdGUgPSAoZXZlbnQ6U3ViR2VvbWV0cnlFdmVudCkgPT4gdGhpcy5vbkluZGljZXNVcGRhdGUoZXZlbnQpO1xuXHRcdHRoaXMuX29uVmVydGljZXNVcGRhdGVEZWxlZ2F0ZSA9IChldmVudDpTdWJHZW9tZXRyeUV2ZW50KSA9PiB0aGlzLm9uVmVydGljZXNVcGRhdGUoZXZlbnQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgY2xvbmUoKTpBbmltYXRvckJhc2Vcblx0e1xuXHRcdC8qIFRoZSBjYXN0IHRvIFNrZWxldG9uQW5pbWF0aW9uU2V0IHNob3VsZCBuZXZlciBmYWlsLCBhcyBfYW5pbWF0aW9uU2V0IGNhbiBvbmx5IGJlIHNldFxuXHRcdCB0aHJvdWdoIHRoZSBjb25zdHJ1Y3Rvciwgd2hpY2ggd2lsbCBvbmx5IGFjY2VwdCBhIFNrZWxldG9uQW5pbWF0aW9uU2V0LiAqL1xuXHRcdHJldHVybiBuZXcgU2tlbGV0b25BbmltYXRvcig8U2tlbGV0b25BbmltYXRpb25TZXQ+IHRoaXMuX3BBbmltYXRpb25TZXQsIHRoaXMuX3NrZWxldG9uLCB0aGlzLl9mb3JjZUNQVSk7XG5cdH1cblxuXHQvKipcblx0ICogUGxheXMgYW4gYW5pbWF0aW9uIHN0YXRlIHJlZ2lzdGVyZWQgd2l0aCB0aGUgZ2l2ZW4gbmFtZSBpbiB0aGUgYW5pbWF0aW9uIGRhdGEgc2V0LlxuXHQgKlxuXHQgKiBAcGFyYW0gbmFtZSBUaGUgZGF0YSBzZXQgbmFtZSBvZiB0aGUgYW5pbWF0aW9uIHN0YXRlIHRvIGJlIHBsYXllZC5cblx0ICogQHBhcmFtIHRyYW5zaXRpb24gQW4gb3B0aW9uYWwgdHJhbnNpdGlvbiBvYmplY3QgdGhhdCBkZXRlcm1pbmVzIGhvdyB0aGUgYW5pbWF0b3Igd2lsbCB0cmFuc2l0aW9uIGZyb20gdGhlIGN1cnJlbnRseSBhY3RpdmUgYW5pbWF0aW9uIHN0YXRlLlxuXHQgKiBAcGFyYW0gb2Zmc2V0IEFuIG9wdGlvbiBvZmZzZXQgdGltZSAoaW4gbWlsbGlzZWNvbmRzKSB0aGF0IHJlc2V0cyB0aGUgc3RhdGUncyBpbnRlcm5hbCBjbG9jayB0byB0aGUgYWJzb2x1dGUgdGltZSBvZiB0aGUgYW5pbWF0b3IgcGx1cyB0aGUgb2Zmc2V0IHZhbHVlLiBSZXF1aXJlZCBmb3Igbm9uLWxvb3BpbmcgYW5pbWF0aW9uIHN0YXRlcy5cblx0ICovXG5cdHB1YmxpYyBwbGF5KG5hbWU6c3RyaW5nLCB0cmFuc2l0aW9uOklBbmltYXRpb25UcmFuc2l0aW9uID0gbnVsbCwgb2Zmc2V0Om51bWJlciA9IE5hTilcblx0e1xuXHRcdGlmICh0aGlzLl9wQWN0aXZlQW5pbWF0aW9uTmFtZSA9PSBuYW1lKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0dGhpcy5fcEFjdGl2ZUFuaW1hdGlvbk5hbWUgPSBuYW1lO1xuXG5cdFx0aWYgKCF0aGlzLl9wQW5pbWF0aW9uU2V0Lmhhc0FuaW1hdGlvbihuYW1lKSlcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIkFuaW1hdGlvbiByb290IG5vZGUgXCIgKyBuYW1lICsgXCIgbm90IGZvdW5kIVwiKTtcblxuXHRcdGlmICh0cmFuc2l0aW9uICYmIHRoaXMuX3BBY3RpdmVOb2RlKSB7XG5cdFx0XHQvL3NldHVwIHRoZSB0cmFuc2l0aW9uXG5cdFx0XHR0aGlzLl9wQWN0aXZlTm9kZSA9IHRyYW5zaXRpb24uZ2V0QW5pbWF0aW9uTm9kZSh0aGlzLCB0aGlzLl9wQWN0aXZlTm9kZSwgdGhpcy5fcEFuaW1hdGlvblNldC5nZXRBbmltYXRpb24obmFtZSksIHRoaXMuX3BBYnNvbHV0ZVRpbWUpO1xuXHRcdFx0dGhpcy5fcEFjdGl2ZU5vZGUuYWRkRXZlbnRMaXN0ZW5lcihBbmltYXRpb25TdGF0ZUV2ZW50LlRSQU5TSVRJT05fQ09NUExFVEUsIHRoaXMuX29uVHJhbnNpdGlvbkNvbXBsZXRlRGVsZWdhdGUpO1xuXHRcdH0gZWxzZVxuXHRcdFx0dGhpcy5fcEFjdGl2ZU5vZGUgPSB0aGlzLl9wQW5pbWF0aW9uU2V0LmdldEFuaW1hdGlvbihuYW1lKTtcblxuXHRcdHRoaXMuX3BBY3RpdmVTdGF0ZSA9IHRoaXMuZ2V0QW5pbWF0aW9uU3RhdGUodGhpcy5fcEFjdGl2ZU5vZGUpO1xuXG5cdFx0aWYgKHRoaXMudXBkYXRlUG9zaXRpb24pIHtcblx0XHRcdC8vdXBkYXRlIHN0cmFpZ2h0IGF3YXkgdG8gcmVzZXQgcG9zaXRpb24gZGVsdGFzXG5cdFx0XHR0aGlzLl9wQWN0aXZlU3RhdGUudXBkYXRlKHRoaXMuX3BBYnNvbHV0ZVRpbWUpO1xuXHRcdFx0dGhpcy5fcEFjdGl2ZVN0YXRlLnBvc2l0aW9uRGVsdGE7XG5cdFx0fVxuXG5cdFx0dGhpcy5fYWN0aXZlU2tlbGV0b25TdGF0ZSA9IDxJU2tlbGV0b25BbmltYXRpb25TdGF0ZT4gdGhpcy5fcEFjdGl2ZVN0YXRlO1xuXG5cdFx0dGhpcy5zdGFydCgpO1xuXG5cdFx0Ly9hcHBseSBhIHRpbWUgb2Zmc2V0IGlmIHNwZWNpZmllZFxuXHRcdGlmICghaXNOYU4ob2Zmc2V0KSlcblx0XHRcdHRoaXMucmVzZXQobmFtZSwgb2Zmc2V0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIHNldFJlbmRlclN0YXRlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCByZW5kZXJhYmxlOlJlbmRlcmFibGVCYXNlLCBzdGFnZTpTdGFnZSwgY2FtZXJhOkNhbWVyYSwgdmVydGV4Q29uc3RhbnRPZmZzZXQ6bnVtYmVyIC8qaW50Ki8sIHZlcnRleFN0cmVhbU9mZnNldDpudW1iZXIgLyppbnQqLylcblx0e1xuXHRcdC8vIGRvIG9uIHJlcXVlc3Qgb2YgZ2xvYmFsUHJvcGVydGllc1xuXHRcdGlmICh0aGlzLl9nbG9iYWxQcm9wZXJ0aWVzRGlydHkpXG5cdFx0XHR0aGlzLnVwZGF0ZUdsb2JhbFByb3BlcnRpZXMoKTtcblxuXHRcdHZhciBzdWJHZW9tZXRyeTpUcmlhbmdsZVN1Ykdlb21ldHJ5ID0gPFRyaWFuZ2xlU3ViR2VvbWV0cnk+ICg8VHJpYW5nbGVTdWJNZXNoPiAoPFRyaWFuZ2xlU3ViTWVzaFJlbmRlcmFibGU+IHJlbmRlcmFibGUpLnN1Yk1lc2gpLnN1Ykdlb21ldHJ5O1xuXG5cdFx0c3ViR2VvbWV0cnkudXNlQ29uZGVuc2VkSW5kaWNlcyA9IHRoaXMuX3VzZUNvbmRlbnNlZEluZGljZXM7XG5cblx0XHRpZiAodGhpcy5fdXNlQ29uZGVuc2VkSW5kaWNlcykge1xuXHRcdFx0Ly8gdXNpbmcgYSBjb25kZW5zZWQgZGF0YSBzZXRcblx0XHRcdHRoaXMudXBkYXRlQ29uZGVuc2VkTWF0cmljZXMoc3ViR2VvbWV0cnkuY29uZGVuc2VkSW5kZXhMb29rVXAsIHN1Ykdlb21ldHJ5Lm51bUNvbmRlbnNlZEpvaW50cyk7XG5cdFx0XHRzdGFnZS5jb250ZXh0LnNldFByb2dyYW1Db25zdGFudHNGcm9tQXJyYXkoQ29udGV4dEdMUHJvZ3JhbVR5cGUuVkVSVEVYLCB2ZXJ0ZXhDb25zdGFudE9mZnNldCwgdGhpcy5fY29uZGVuc2VkTWF0cmljZXMsIHN1Ykdlb21ldHJ5Lm51bUNvbmRlbnNlZEpvaW50cyozKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKHRoaXMuX3BBbmltYXRpb25TZXQudXNlc0NQVSkge1xuXHRcdFx0XHRpZiAodGhpcy5fbW9ycGhlZFN1Ykdlb21ldHJ5RGlydHlbc3ViR2VvbWV0cnkuaWRdKVxuXHRcdFx0XHRcdHRoaXMubW9ycGhTdWJHZW9tZXRyeSg8VHJpYW5nbGVTdWJNZXNoUmVuZGVyYWJsZT4gcmVuZGVyYWJsZSwgc3ViR2VvbWV0cnkpO1xuXG5cdFx0XHRcdHJldHVyblxuXHRcdFx0fVxuXHRcdFx0c3RhZ2UuY29udGV4dC5zZXRQcm9ncmFtQ29uc3RhbnRzRnJvbUFycmF5KENvbnRleHRHTFByb2dyYW1UeXBlLlZFUlRFWCwgdmVydGV4Q29uc3RhbnRPZmZzZXQsIHRoaXMuX2dsb2JhbE1hdHJpY2VzLCB0aGlzLl9udW1Kb2ludHMqMyk7XG5cdFx0fVxuXG5cdFx0c3RhZ2UuYWN0aXZhdGVCdWZmZXIodmVydGV4U3RyZWFtT2Zmc2V0LCByZW5kZXJhYmxlLmdldFZlcnRleERhdGEoVHJpYW5nbGVTdWJHZW9tZXRyeS5KT0lOVF9JTkRFWF9EQVRBKSwgcmVuZGVyYWJsZS5nZXRWZXJ0ZXhPZmZzZXQoVHJpYW5nbGVTdWJHZW9tZXRyeS5KT0lOVF9JTkRFWF9EQVRBKSwgcmVuZGVyYWJsZS5KT0lOVF9JTkRFWF9GT1JNQVQpO1xuXHRcdHN0YWdlLmFjdGl2YXRlQnVmZmVyKHZlcnRleFN0cmVhbU9mZnNldCArIDEsIHJlbmRlcmFibGUuZ2V0VmVydGV4RGF0YShUcmlhbmdsZVN1Ykdlb21ldHJ5LkpPSU5UX1dFSUdIVF9EQVRBKSwgcmVuZGVyYWJsZS5nZXRWZXJ0ZXhPZmZzZXQoVHJpYW5nbGVTdWJHZW9tZXRyeS5KT0lOVF9XRUlHSFRfREFUQSksIHJlbmRlcmFibGUuSk9JTlRfV0VJR0hUX0ZPUk1BVCk7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyB0ZXN0R1BVQ29tcGF0aWJpbGl0eShzaGFkZXJPYmplY3Q6U2hhZGVyT2JqZWN0QmFzZSlcblx0e1xuXHRcdGlmICghdGhpcy5fdXNlQ29uZGVuc2VkSW5kaWNlcyAmJiAodGhpcy5fZm9yY2VDUFUgfHwgdGhpcy5fam9pbnRzUGVyVmVydGV4ID4gNCB8fCBzaGFkZXJPYmplY3QubnVtVXNlZFZlcnRleENvbnN0YW50cyArIHRoaXMuX251bUpvaW50cyozID4gMTI4KSlcblx0XHRcdHRoaXMuX3BBbmltYXRpb25TZXQuY2FuY2VsR1BVQ29tcGF0aWJpbGl0eSgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEFwcGxpZXMgdGhlIGNhbGN1bGF0ZWQgdGltZSBkZWx0YSB0byB0aGUgYWN0aXZlIGFuaW1hdGlvbiBzdGF0ZSBub2RlIG9yIHN0YXRlIHRyYW5zaXRpb24gb2JqZWN0LlxuXHQgKi9cblx0cHVibGljIF9wVXBkYXRlRGVsdGFUaW1lKGR0Om51bWJlcilcblx0e1xuXHRcdHN1cGVyLl9wVXBkYXRlRGVsdGFUaW1lKGR0KTtcblxuXHRcdC8vaW52YWxpZGF0ZSBwb3NlIG1hdHJpY2VzXG5cdFx0dGhpcy5fZ2xvYmFsUHJvcGVydGllc0RpcnR5ID0gdHJ1ZTtcblxuXHRcdC8vdHJpZ2dlciBnZW9tZXRyeSBpbnZhbGlkYXRpb24gaWYgdXNpbmcgQ1BVIGFuaW1hdGlvblxuXHRcdGlmICh0aGlzLl9wQW5pbWF0aW9uU2V0LnVzZXNDUFUpXG5cdFx0XHRmb3IgKHZhciBrZXkgaW4gdGhpcy5fbW9ycGhlZFN1Ykdlb21ldHJ5RGlydHkpXG5cdFx0XHRcdHRoaXMuX21vcnBoZWRTdWJHZW9tZXRyeURpcnR5W2tleV0gPSB0cnVlO1xuXHR9XG5cblx0cHJpdmF0ZSB1cGRhdGVDb25kZW5zZWRNYXRyaWNlcyhjb25kZW5zZWRJbmRleExvb2tVcDpBcnJheTxudW1iZXI+IC8qdWludCovLCBudW1Kb2ludHM6bnVtYmVyIC8qdWludCovKVxuXHR7XG5cdFx0dmFyIGk6bnVtYmVyIC8qdWludCovID0gMCwgajpudW1iZXIgLyp1aW50Ki8gPSAwO1xuXHRcdHZhciBsZW46bnVtYmVyIC8qdWludCovO1xuXHRcdHZhciBzcmNJbmRleDpudW1iZXIgLyp1aW50Ki87XG5cblx0XHR0aGlzLl9jb25kZW5zZWRNYXRyaWNlcyA9IG5ldyBBcnJheTxudW1iZXI+KCk7XG5cblx0XHRkbyB7XG5cdFx0XHRzcmNJbmRleCA9IGNvbmRlbnNlZEluZGV4TG9va1VwW2ldKjQ7XG5cdFx0XHRsZW4gPSBzcmNJbmRleCArIDEyO1xuXHRcdFx0Ly8gY29weSBpbnRvIGNvbmRlbnNlZFxuXHRcdFx0d2hpbGUgKHNyY0luZGV4IDwgbGVuKVxuXHRcdFx0XHR0aGlzLl9jb25kZW5zZWRNYXRyaWNlc1tqKytdID0gdGhpcy5fZ2xvYmFsTWF0cmljZXNbc3JjSW5kZXgrK107XG5cdFx0fSB3aGlsZSAoKytpIDwgbnVtSm9pbnRzKTtcblx0fVxuXG5cdHByaXZhdGUgdXBkYXRlR2xvYmFsUHJvcGVydGllcygpXG5cdHtcblx0XHR0aGlzLl9nbG9iYWxQcm9wZXJ0aWVzRGlydHkgPSBmYWxzZTtcblxuXHRcdC8vZ2V0IGdsb2JhbCBwb3NlXG5cdFx0dGhpcy5sb2NhbFRvR2xvYmFsUG9zZSh0aGlzLl9hY3RpdmVTa2VsZXRvblN0YXRlLmdldFNrZWxldG9uUG9zZSh0aGlzLl9za2VsZXRvbiksIHRoaXMuX2dsb2JhbFBvc2UsIHRoaXMuX3NrZWxldG9uKTtcblxuXHRcdC8vIGNvbnZlcnQgcG9zZSB0byBtYXRyaXhcblx0XHR2YXIgbXR4T2Zmc2V0Om51bWJlciAvKnVpbnQqLyA9IDA7XG5cdFx0dmFyIGdsb2JhbFBvc2VzOkFycmF5PEpvaW50UG9zZT4gPSB0aGlzLl9nbG9iYWxQb3NlLmpvaW50UG9zZXM7XG5cdFx0dmFyIHJhdzpBcnJheTxudW1iZXI+O1xuXHRcdHZhciBveDpudW1iZXIsIG95Om51bWJlciwgb3o6bnVtYmVyLCBvdzpudW1iZXI7XG5cdFx0dmFyIHh5MjpudW1iZXIsIHh6MjpudW1iZXIsIHh3MjpudW1iZXI7XG5cdFx0dmFyIHl6MjpudW1iZXIsIHl3MjpudW1iZXIsIHp3MjpudW1iZXI7XG5cdFx0dmFyIG4xMTpudW1iZXIsIG4xMjpudW1iZXIsIG4xMzpudW1iZXI7XG5cdFx0dmFyIG4yMTpudW1iZXIsIG4yMjpudW1iZXIsIG4yMzpudW1iZXI7XG5cdFx0dmFyIG4zMTpudW1iZXIsIG4zMjpudW1iZXIsIG4zMzpudW1iZXI7XG5cdFx0dmFyIG0xMTpudW1iZXIsIG0xMjpudW1iZXIsIG0xMzpudW1iZXIsIG0xNDpudW1iZXI7XG5cdFx0dmFyIG0yMTpudW1iZXIsIG0yMjpudW1iZXIsIG0yMzpudW1iZXIsIG0yNDpudW1iZXI7XG5cdFx0dmFyIG0zMTpudW1iZXIsIG0zMjpudW1iZXIsIG0zMzpudW1iZXIsIG0zNDpudW1iZXI7XG5cdFx0dmFyIGpvaW50czpBcnJheTxTa2VsZXRvbkpvaW50PiA9IHRoaXMuX3NrZWxldG9uLmpvaW50cztcblx0XHR2YXIgcG9zZTpKb2ludFBvc2U7XG5cdFx0dmFyIHF1YXQ6UXVhdGVybmlvbjtcblx0XHR2YXIgdmVjOlZlY3RvcjNEO1xuXHRcdHZhciB0Om51bWJlcjtcblxuXHRcdGZvciAodmFyIGk6bnVtYmVyIC8qdWludCovID0gMDsgaSA8IHRoaXMuX251bUpvaW50czsgKytpKSB7XG5cdFx0XHRwb3NlID0gZ2xvYmFsUG9zZXNbaV07XG5cdFx0XHRxdWF0ID0gcG9zZS5vcmllbnRhdGlvbjtcblx0XHRcdHZlYyA9IHBvc2UudHJhbnNsYXRpb247XG5cdFx0XHRveCA9IHF1YXQueDtcblx0XHRcdG95ID0gcXVhdC55O1xuXHRcdFx0b3ogPSBxdWF0Lno7XG5cdFx0XHRvdyA9IHF1YXQudztcblxuXHRcdFx0eHkyID0gKHQgPSAyLjAqb3gpKm95O1xuXHRcdFx0eHoyID0gdCpvejtcblx0XHRcdHh3MiA9IHQqb3c7XG5cdFx0XHR5ejIgPSAodCA9IDIuMCpveSkqb3o7XG5cdFx0XHR5dzIgPSB0Km93O1xuXHRcdFx0encyID0gMi4wKm96Km93O1xuXG5cdFx0XHR5ejIgPSAyLjAqb3kqb3o7XG5cdFx0XHR5dzIgPSAyLjAqb3kqb3c7XG5cdFx0XHR6dzIgPSAyLjAqb3oqb3c7XG5cdFx0XHRveCAqPSBveDtcblx0XHRcdG95ICo9IG95O1xuXHRcdFx0b3ogKj0gb3o7XG5cdFx0XHRvdyAqPSBvdztcblxuXHRcdFx0bjExID0gKHQgPSBveCAtIG95KSAtIG96ICsgb3c7XG5cdFx0XHRuMTIgPSB4eTIgLSB6dzI7XG5cdFx0XHRuMTMgPSB4ejIgKyB5dzI7XG5cdFx0XHRuMjEgPSB4eTIgKyB6dzI7XG5cdFx0XHRuMjIgPSAtdCAtIG96ICsgb3c7XG5cdFx0XHRuMjMgPSB5ejIgLSB4dzI7XG5cdFx0XHRuMzEgPSB4ejIgLSB5dzI7XG5cdFx0XHRuMzIgPSB5ejIgKyB4dzI7XG5cdFx0XHRuMzMgPSAtb3ggLSBveSArIG96ICsgb3c7XG5cblx0XHRcdC8vIHByZXBlbmQgaW52ZXJzZSBiaW5kIHBvc2Vcblx0XHRcdHJhdyA9IGpvaW50c1tpXS5pbnZlcnNlQmluZFBvc2U7XG5cdFx0XHRtMTEgPSByYXdbMF07XG5cdFx0XHRtMTIgPSByYXdbNF07XG5cdFx0XHRtMTMgPSByYXdbOF07XG5cdFx0XHRtMTQgPSByYXdbMTJdO1xuXHRcdFx0bTIxID0gcmF3WzFdO1xuXHRcdFx0bTIyID0gcmF3WzVdO1xuXHRcdFx0bTIzID0gcmF3WzldO1xuXHRcdFx0bTI0ID0gcmF3WzEzXTtcblx0XHRcdG0zMSA9IHJhd1syXTtcblx0XHRcdG0zMiA9IHJhd1s2XTtcblx0XHRcdG0zMyA9IHJhd1sxMF07XG5cdFx0XHRtMzQgPSByYXdbMTRdO1xuXG5cdFx0XHR0aGlzLl9nbG9iYWxNYXRyaWNlc1ttdHhPZmZzZXRdID0gbjExKm0xMSArIG4xMiptMjEgKyBuMTMqbTMxO1xuXHRcdFx0dGhpcy5fZ2xvYmFsTWF0cmljZXNbbXR4T2Zmc2V0ICsgMV0gPSBuMTEqbTEyICsgbjEyKm0yMiArIG4xMyptMzI7XG5cdFx0XHR0aGlzLl9nbG9iYWxNYXRyaWNlc1ttdHhPZmZzZXQgKyAyXSA9IG4xMSptMTMgKyBuMTIqbTIzICsgbjEzKm0zMztcblx0XHRcdHRoaXMuX2dsb2JhbE1hdHJpY2VzW210eE9mZnNldCArIDNdID0gbjExKm0xNCArIG4xMiptMjQgKyBuMTMqbTM0ICsgdmVjLng7XG5cdFx0XHR0aGlzLl9nbG9iYWxNYXRyaWNlc1ttdHhPZmZzZXQgKyA0XSA9IG4yMSptMTEgKyBuMjIqbTIxICsgbjIzKm0zMTtcblx0XHRcdHRoaXMuX2dsb2JhbE1hdHJpY2VzW210eE9mZnNldCArIDVdID0gbjIxKm0xMiArIG4yMiptMjIgKyBuMjMqbTMyO1xuXHRcdFx0dGhpcy5fZ2xvYmFsTWF0cmljZXNbbXR4T2Zmc2V0ICsgNl0gPSBuMjEqbTEzICsgbjIyKm0yMyArIG4yMyptMzM7XG5cdFx0XHR0aGlzLl9nbG9iYWxNYXRyaWNlc1ttdHhPZmZzZXQgKyA3XSA9IG4yMSptMTQgKyBuMjIqbTI0ICsgbjIzKm0zNCArIHZlYy55O1xuXHRcdFx0dGhpcy5fZ2xvYmFsTWF0cmljZXNbbXR4T2Zmc2V0ICsgOF0gPSBuMzEqbTExICsgbjMyKm0yMSArIG4zMyptMzE7XG5cdFx0XHR0aGlzLl9nbG9iYWxNYXRyaWNlc1ttdHhPZmZzZXQgKyA5XSA9IG4zMSptMTIgKyBuMzIqbTIyICsgbjMzKm0zMjtcblx0XHRcdHRoaXMuX2dsb2JhbE1hdHJpY2VzW210eE9mZnNldCArIDEwXSA9IG4zMSptMTMgKyBuMzIqbTIzICsgbjMzKm0zMztcblx0XHRcdHRoaXMuX2dsb2JhbE1hdHJpY2VzW210eE9mZnNldCArIDExXSA9IG4zMSptMTQgKyBuMzIqbTI0ICsgbjMzKm0zNCArIHZlYy56O1xuXG5cdFx0XHRtdHhPZmZzZXQgPSBtdHhPZmZzZXQgKyAxMjtcblx0XHR9XG5cdH1cblxuXG5cdHB1YmxpYyBnZXRSZW5kZXJhYmxlU3ViR2VvbWV0cnkocmVuZGVyYWJsZTpUcmlhbmdsZVN1Yk1lc2hSZW5kZXJhYmxlLCBzb3VyY2VTdWJHZW9tZXRyeTpUcmlhbmdsZVN1Ykdlb21ldHJ5KTpUcmlhbmdsZVN1Ykdlb21ldHJ5XG5cdHtcblx0XHR0aGlzLl9tb3JwaGVkU3ViR2VvbWV0cnlEaXJ0eVtzb3VyY2VTdWJHZW9tZXRyeS5pZF0gPSB0cnVlO1xuXG5cdFx0Ly9lYXJseSBvdXQgZm9yIEdQVSBhbmltYXRpb25zXG5cdFx0aWYgKCF0aGlzLl9wQW5pbWF0aW9uU2V0LnVzZXNDUFUpXG5cdFx0XHRyZXR1cm4gc291cmNlU3ViR2VvbWV0cnk7XG5cblx0XHR2YXIgdGFyZ2V0U3ViR2VvbWV0cnk6VHJpYW5nbGVTdWJHZW9tZXRyeTtcblxuXHRcdGlmICghKHRhcmdldFN1Ykdlb21ldHJ5ID0gdGhpcy5fbW9ycGhlZFN1Ykdlb21ldHJ5W3NvdXJjZVN1Ykdlb21ldHJ5LmlkXSkpIHtcblx0XHRcdC8vbm90IHlldCBzdG9yZWRcblx0XHRcdHRhcmdldFN1Ykdlb21ldHJ5ID0gdGhpcy5fbW9ycGhlZFN1Ykdlb21ldHJ5W3NvdXJjZVN1Ykdlb21ldHJ5LmlkXSA9IHNvdXJjZVN1Ykdlb21ldHJ5LmNsb25lKCk7XG5cdFx0XHQvL3R1cm4gb2ZmIGF1dG8gY2FsY3VsYXRpb25zIG9uIHRoZSBtb3JwaGVkIGdlb21ldHJ5XG5cdFx0XHR0YXJnZXRTdWJHZW9tZXRyeS5hdXRvRGVyaXZlTm9ybWFscyA9IGZhbHNlO1xuXHRcdFx0dGFyZ2V0U3ViR2VvbWV0cnkuYXV0b0Rlcml2ZVRhbmdlbnRzID0gZmFsc2U7XG5cdFx0XHR0YXJnZXRTdWJHZW9tZXRyeS5hdXRvRGVyaXZlVVZzID0gZmFsc2U7XG5cdFx0XHQvL2FkZCBldmVudCBsaXN0ZW5lcnMgZm9yIGFueSBjaGFuZ2VzIGluIFVWIHZhbHVlcyBvbiB0aGUgc291cmNlIGdlb21ldHJ5XG5cdFx0XHRzb3VyY2VTdWJHZW9tZXRyeS5hZGRFdmVudExpc3RlbmVyKFN1Ykdlb21ldHJ5RXZlbnQuSU5ESUNFU19VUERBVEVELCB0aGlzLl9vbkluZGljZXNVcGRhdGVEZWxlZ2F0ZSk7XG5cdFx0XHRzb3VyY2VTdWJHZW9tZXRyeS5hZGRFdmVudExpc3RlbmVyKFN1Ykdlb21ldHJ5RXZlbnQuVkVSVElDRVNfVVBEQVRFRCwgdGhpcy5fb25WZXJ0aWNlc1VwZGF0ZURlbGVnYXRlKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGFyZ2V0U3ViR2VvbWV0cnk7XG5cdH1cblxuXHQvKipcblx0ICogSWYgdGhlIGFuaW1hdGlvbiBjYW4ndCBiZSBwZXJmb3JtZWQgb24gR1BVLCB0cmFuc2Zvcm0gdmVydGljZXMgbWFudWFsbHlcblx0ICogQHBhcmFtIHN1Ykdlb20gVGhlIHN1Ymdlb21ldHJ5IGNvbnRhaW5pbmcgdGhlIHdlaWdodHMgYW5kIGpvaW50IGluZGV4IGRhdGEgcGVyIHZlcnRleC5cblx0ICogQHBhcmFtIHBhc3MgVGhlIG1hdGVyaWFsIHBhc3MgZm9yIHdoaWNoIHdlIG5lZWQgdG8gdHJhbnNmb3JtIHRoZSB2ZXJ0aWNlc1xuXHQgKi9cblx0cHVibGljIG1vcnBoU3ViR2VvbWV0cnkocmVuZGVyYWJsZTpUcmlhbmdsZVN1Yk1lc2hSZW5kZXJhYmxlLCBzb3VyY2VTdWJHZW9tZXRyeTpUcmlhbmdsZVN1Ykdlb21ldHJ5KVxuXHR7XG5cdFx0dGhpcy5fbW9ycGhlZFN1Ykdlb21ldHJ5RGlydHlbc291cmNlU3ViR2VvbWV0cnkuaWRdID0gZmFsc2U7XG5cblx0XHR2YXIgc291cmNlUG9zaXRpb25zOkFycmF5PG51bWJlcj4gPSBzb3VyY2VTdWJHZW9tZXRyeS5wb3NpdGlvbnM7XG5cdFx0dmFyIHNvdXJjZU5vcm1hbHM6QXJyYXk8bnVtYmVyPiA9IHNvdXJjZVN1Ykdlb21ldHJ5LnZlcnRleE5vcm1hbHM7XG5cdFx0dmFyIHNvdXJjZVRhbmdlbnRzOkFycmF5PG51bWJlcj4gPSBzb3VyY2VTdWJHZW9tZXRyeS52ZXJ0ZXhUYW5nZW50cztcblxuXHRcdHZhciBqb2ludEluZGljZXM6QXJyYXk8bnVtYmVyPiA9IHNvdXJjZVN1Ykdlb21ldHJ5LmpvaW50SW5kaWNlcztcblx0XHR2YXIgam9pbnRXZWlnaHRzOkFycmF5PG51bWJlcj4gPSBzb3VyY2VTdWJHZW9tZXRyeS5qb2ludFdlaWdodHM7XG5cblx0XHR2YXIgdGFyZ2V0U3ViR2VvbWV0cnkgPSB0aGlzLl9tb3JwaGVkU3ViR2VvbWV0cnlbc291cmNlU3ViR2VvbWV0cnkuaWRdO1xuXG5cdFx0dmFyIHRhcmdldFBvc2l0aW9uczpBcnJheTxudW1iZXI+ID0gdGFyZ2V0U3ViR2VvbWV0cnkucG9zaXRpb25zO1xuXHRcdHZhciB0YXJnZXROb3JtYWxzOkFycmF5PG51bWJlcj4gPSB0YXJnZXRTdWJHZW9tZXRyeS52ZXJ0ZXhOb3JtYWxzO1xuXHRcdHZhciB0YXJnZXRUYW5nZW50czpBcnJheTxudW1iZXI+ID0gdGFyZ2V0U3ViR2VvbWV0cnkudmVydGV4VGFuZ2VudHM7XG5cblx0XHR2YXIgaW5kZXg6bnVtYmVyIC8qdWludCovID0gMDtcblx0XHR2YXIgajpudW1iZXIgLyp1aW50Ki8gPSAwO1xuXHRcdHZhciBrOm51bWJlciAvKnVpbnQqLztcblx0XHR2YXIgdng6bnVtYmVyLCB2eTpudW1iZXIsIHZ6Om51bWJlcjtcblx0XHR2YXIgbng6bnVtYmVyLCBueTpudW1iZXIsIG56Om51bWJlcjtcblx0XHR2YXIgdHg6bnVtYmVyLCB0eTpudW1iZXIsIHR6Om51bWJlcjtcblx0XHR2YXIgbGVuOm51bWJlciAvKmludCovID0gc291cmNlUG9zaXRpb25zLmxlbmd0aDtcblx0XHR2YXIgd2VpZ2h0Om51bWJlcjtcblx0XHR2YXIgdmVydFg6bnVtYmVyLCB2ZXJ0WTpudW1iZXIsIHZlcnRaOm51bWJlcjtcblx0XHR2YXIgbm9ybVg6bnVtYmVyLCBub3JtWTpudW1iZXIsIG5vcm1aOm51bWJlcjtcblx0XHR2YXIgdGFuZ1g6bnVtYmVyLCB0YW5nWTpudW1iZXIsIHRhbmdaOm51bWJlcjtcblx0XHR2YXIgbTExOm51bWJlciwgbTEyOm51bWJlciwgbTEzOm51bWJlciwgbTE0Om51bWJlcjtcblx0XHR2YXIgbTIxOm51bWJlciwgbTIyOm51bWJlciwgbTIzOm51bWJlciwgbTI0Om51bWJlcjtcblx0XHR2YXIgbTMxOm51bWJlciwgbTMyOm51bWJlciwgbTMzOm51bWJlciwgbTM0Om51bWJlcjtcblxuXHRcdHdoaWxlIChpbmRleCA8IGxlbikge1xuXHRcdFx0dmVydFggPSBzb3VyY2VQb3NpdGlvbnNbaW5kZXhdO1xuXHRcdFx0dmVydFkgPSBzb3VyY2VQb3NpdGlvbnNbaW5kZXggKyAxXTtcblx0XHRcdHZlcnRaID0gc291cmNlUG9zaXRpb25zW2luZGV4ICsgMl07XG5cdFx0XHRub3JtWCA9IHNvdXJjZU5vcm1hbHNbaW5kZXhdO1xuXHRcdFx0bm9ybVkgPSBzb3VyY2VOb3JtYWxzW2luZGV4ICsgMV07XG5cdFx0XHRub3JtWiA9IHNvdXJjZU5vcm1hbHNbaW5kZXggKyAyXTtcblx0XHRcdHRhbmdYID0gc291cmNlVGFuZ2VudHNbaW5kZXhdO1xuXHRcdFx0dGFuZ1kgPSBzb3VyY2VUYW5nZW50c1tpbmRleCArIDFdO1xuXHRcdFx0dGFuZ1ogPSBzb3VyY2VUYW5nZW50c1tpbmRleCArIDJdO1xuXHRcdFx0dnggPSAwO1xuXHRcdFx0dnkgPSAwO1xuXHRcdFx0dnogPSAwO1xuXHRcdFx0bnggPSAwO1xuXHRcdFx0bnkgPSAwO1xuXHRcdFx0bnogPSAwO1xuXHRcdFx0dHggPSAwO1xuXHRcdFx0dHkgPSAwO1xuXHRcdFx0dHogPSAwO1xuXHRcdFx0ayA9IDA7XG5cdFx0XHR3aGlsZSAoayA8IHRoaXMuX2pvaW50c1BlclZlcnRleCkge1xuXHRcdFx0XHR3ZWlnaHQgPSBqb2ludFdlaWdodHNbal07XG5cdFx0XHRcdGlmICh3ZWlnaHQgPiAwKSB7XG5cdFx0XHRcdFx0Ly8gaW1wbGljaXQgLzMqMTIgKC8zIGJlY2F1c2UgaW5kaWNlcyBhcmUgbXVsdGlwbGllZCBieSAzIGZvciBncHUgbWF0cml4IGFjY2VzcywgKjEyIGJlY2F1c2UgaXQncyB0aGUgbWF0cml4IHNpemUpXG5cdFx0XHRcdFx0dmFyIG10eE9mZnNldDpudW1iZXIgLyp1aW50Ki8gPSBqb2ludEluZGljZXNbaisrXSA8PCAyO1xuXHRcdFx0XHRcdG0xMSA9IHRoaXMuX2dsb2JhbE1hdHJpY2VzW210eE9mZnNldF07XG5cdFx0XHRcdFx0bTEyID0gdGhpcy5fZ2xvYmFsTWF0cmljZXNbbXR4T2Zmc2V0ICsgMV07XG5cdFx0XHRcdFx0bTEzID0gdGhpcy5fZ2xvYmFsTWF0cmljZXNbbXR4T2Zmc2V0ICsgMl07XG5cdFx0XHRcdFx0bTE0ID0gdGhpcy5fZ2xvYmFsTWF0cmljZXNbbXR4T2Zmc2V0ICsgM107XG5cdFx0XHRcdFx0bTIxID0gdGhpcy5fZ2xvYmFsTWF0cmljZXNbbXR4T2Zmc2V0ICsgNF07XG5cdFx0XHRcdFx0bTIyID0gdGhpcy5fZ2xvYmFsTWF0cmljZXNbbXR4T2Zmc2V0ICsgNV07XG5cdFx0XHRcdFx0bTIzID0gdGhpcy5fZ2xvYmFsTWF0cmljZXNbbXR4T2Zmc2V0ICsgNl07XG5cdFx0XHRcdFx0bTI0ID0gdGhpcy5fZ2xvYmFsTWF0cmljZXNbbXR4T2Zmc2V0ICsgN107XG5cdFx0XHRcdFx0bTMxID0gdGhpcy5fZ2xvYmFsTWF0cmljZXNbbXR4T2Zmc2V0ICsgOF07XG5cdFx0XHRcdFx0bTMyID0gdGhpcy5fZ2xvYmFsTWF0cmljZXNbbXR4T2Zmc2V0ICsgOV07XG5cdFx0XHRcdFx0bTMzID0gdGhpcy5fZ2xvYmFsTWF0cmljZXNbbXR4T2Zmc2V0ICsgMTBdO1xuXHRcdFx0XHRcdG0zNCA9IHRoaXMuX2dsb2JhbE1hdHJpY2VzW210eE9mZnNldCArIDExXTtcblx0XHRcdFx0XHR2eCArPSB3ZWlnaHQqKG0xMSp2ZXJ0WCArIG0xMip2ZXJ0WSArIG0xMyp2ZXJ0WiArIG0xNCk7XG5cdFx0XHRcdFx0dnkgKz0gd2VpZ2h0KihtMjEqdmVydFggKyBtMjIqdmVydFkgKyBtMjMqdmVydFogKyBtMjQpO1xuXHRcdFx0XHRcdHZ6ICs9IHdlaWdodCoobTMxKnZlcnRYICsgbTMyKnZlcnRZICsgbTMzKnZlcnRaICsgbTM0KTtcblx0XHRcdFx0XHRueCArPSB3ZWlnaHQqKG0xMSpub3JtWCArIG0xMipub3JtWSArIG0xMypub3JtWik7XG5cdFx0XHRcdFx0bnkgKz0gd2VpZ2h0KihtMjEqbm9ybVggKyBtMjIqbm9ybVkgKyBtMjMqbm9ybVopO1xuXHRcdFx0XHRcdG56ICs9IHdlaWdodCoobTMxKm5vcm1YICsgbTMyKm5vcm1ZICsgbTMzKm5vcm1aKTtcblx0XHRcdFx0XHR0eCArPSB3ZWlnaHQqKG0xMSp0YW5nWCArIG0xMip0YW5nWSArIG0xMyp0YW5nWik7XG5cdFx0XHRcdFx0dHkgKz0gd2VpZ2h0KihtMjEqdGFuZ1ggKyBtMjIqdGFuZ1kgKyBtMjMqdGFuZ1opO1xuXHRcdFx0XHRcdHR6ICs9IHdlaWdodCoobTMxKnRhbmdYICsgbTMyKnRhbmdZICsgbTMzKnRhbmdaKTtcblx0XHRcdFx0XHQrK2s7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0aiArPSAodGhpcy5fam9pbnRzUGVyVmVydGV4IC0gayk7XG5cdFx0XHRcdFx0ayA9IHRoaXMuX2pvaW50c1BlclZlcnRleDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHR0YXJnZXRQb3NpdGlvbnNbaW5kZXhdID0gdng7XG5cdFx0XHR0YXJnZXRQb3NpdGlvbnNbaW5kZXggKyAxXSA9IHZ5O1xuXHRcdFx0dGFyZ2V0UG9zaXRpb25zW2luZGV4ICsgMl0gPSB2ejtcblx0XHRcdHRhcmdldE5vcm1hbHNbaW5kZXhdID0gbng7XG5cdFx0XHR0YXJnZXROb3JtYWxzW2luZGV4ICsgMV0gPSBueTtcblx0XHRcdHRhcmdldE5vcm1hbHNbaW5kZXggKyAyXSA9IG56O1xuXHRcdFx0dGFyZ2V0VGFuZ2VudHNbaW5kZXhdID0gdHg7XG5cdFx0XHR0YXJnZXRUYW5nZW50c1tpbmRleCArIDFdID0gdHk7XG5cdFx0XHR0YXJnZXRUYW5nZW50c1tpbmRleCArIDJdID0gdHo7XG5cblx0XHRcdGluZGV4ICs9IDM7XG5cdFx0fVxuXG5cdFx0dGFyZ2V0U3ViR2VvbWV0cnkudXBkYXRlUG9zaXRpb25zKHRhcmdldFBvc2l0aW9ucyk7XG5cdFx0dGFyZ2V0U3ViR2VvbWV0cnkudXBkYXRlVmVydGV4Tm9ybWFscyh0YXJnZXROb3JtYWxzKTtcblx0XHR0YXJnZXRTdWJHZW9tZXRyeS51cGRhdGVWZXJ0ZXhUYW5nZW50cyh0YXJnZXRUYW5nZW50cyk7XG5cdH1cblxuXHQvKipcblx0ICogQ29udmVydHMgYSBsb2NhbCBoaWVyYXJjaGljYWwgc2tlbGV0b24gcG9zZSB0byBhIGdsb2JhbCBwb3NlXG5cdCAqIEBwYXJhbSB0YXJnZXRQb3NlIFRoZSBTa2VsZXRvblBvc2Ugb2JqZWN0IHRoYXQgd2lsbCBjb250YWluIHRoZSBnbG9iYWwgcG9zZS5cblx0ICogQHBhcmFtIHNrZWxldG9uIFRoZSBza2VsZXRvbiBjb250YWluaW5nIHRoZSBqb2ludHMsIGFuZCBhcyBzdWNoLCB0aGUgaGllcmFyY2hpY2FsIGRhdGEgdG8gdHJhbnNmb3JtIHRvIGdsb2JhbCBwb3Nlcy5cblx0ICovXG5cdHByaXZhdGUgbG9jYWxUb0dsb2JhbFBvc2Uoc291cmNlUG9zZTpTa2VsZXRvblBvc2UsIHRhcmdldFBvc2U6U2tlbGV0b25Qb3NlLCBza2VsZXRvbjpTa2VsZXRvbilcblx0e1xuXHRcdHZhciBnbG9iYWxQb3NlczpBcnJheTxKb2ludFBvc2U+ID0gdGFyZ2V0UG9zZS5qb2ludFBvc2VzO1xuXHRcdHZhciBnbG9iYWxKb2ludFBvc2U6Sm9pbnRQb3NlO1xuXHRcdHZhciBqb2ludHM6QXJyYXk8U2tlbGV0b25Kb2ludD4gPSBza2VsZXRvbi5qb2ludHM7XG5cdFx0dmFyIGxlbjpudW1iZXIgLyp1aW50Ki8gPSBzb3VyY2VQb3NlLm51bUpvaW50UG9zZXM7XG5cdFx0dmFyIGpvaW50UG9zZXM6QXJyYXk8Sm9pbnRQb3NlPiA9IHNvdXJjZVBvc2Uuam9pbnRQb3Nlcztcblx0XHR2YXIgcGFyZW50SW5kZXg6bnVtYmVyIC8qaW50Ki87XG5cdFx0dmFyIGpvaW50OlNrZWxldG9uSm9pbnQ7XG5cdFx0dmFyIHBhcmVudFBvc2U6Sm9pbnRQb3NlO1xuXHRcdHZhciBwb3NlOkpvaW50UG9zZTtcblx0XHR2YXIgb3I6UXVhdGVybmlvbjtcblx0XHR2YXIgdHI6VmVjdG9yM0Q7XG5cdFx0dmFyIHQ6VmVjdG9yM0Q7XG5cdFx0dmFyIHE6UXVhdGVybmlvbjtcblxuXHRcdHZhciB4MTpudW1iZXIsIHkxOm51bWJlciwgejE6bnVtYmVyLCB3MTpudW1iZXI7XG5cdFx0dmFyIHgyOm51bWJlciwgeTI6bnVtYmVyLCB6MjpudW1iZXIsIHcyOm51bWJlcjtcblx0XHR2YXIgeDM6bnVtYmVyLCB5MzpudW1iZXIsIHozOm51bWJlcjtcblxuXHRcdC8vIDpzXG5cdFx0aWYgKGdsb2JhbFBvc2VzLmxlbmd0aCAhPSBsZW4pXG5cdFx0XHRnbG9iYWxQb3Nlcy5sZW5ndGggPSBsZW47XG5cblx0XHRmb3IgKHZhciBpOm51bWJlciAvKnVpbnQqLyA9IDA7IGkgPCBsZW47ICsraSkge1xuXHRcdFx0Z2xvYmFsSm9pbnRQb3NlID0gZ2xvYmFsUG9zZXNbaV07XG5cblx0XHRcdGlmIChnbG9iYWxKb2ludFBvc2UgPT0gbnVsbClcblx0XHRcdFx0Z2xvYmFsSm9pbnRQb3NlID0gZ2xvYmFsUG9zZXNbaV0gPSBuZXcgSm9pbnRQb3NlKCk7XG5cblx0XHRcdGpvaW50ID0gam9pbnRzW2ldO1xuXHRcdFx0cGFyZW50SW5kZXggPSBqb2ludC5wYXJlbnRJbmRleDtcblx0XHRcdHBvc2UgPSBqb2ludFBvc2VzW2ldO1xuXG5cdFx0XHRxID0gZ2xvYmFsSm9pbnRQb3NlLm9yaWVudGF0aW9uO1xuXHRcdFx0dCA9IGdsb2JhbEpvaW50UG9zZS50cmFuc2xhdGlvbjtcblxuXHRcdFx0aWYgKHBhcmVudEluZGV4IDwgMCkge1xuXHRcdFx0XHR0ciA9IHBvc2UudHJhbnNsYXRpb247XG5cdFx0XHRcdG9yID0gcG9zZS5vcmllbnRhdGlvbjtcblx0XHRcdFx0cS54ID0gb3IueDtcblx0XHRcdFx0cS55ID0gb3IueTtcblx0XHRcdFx0cS56ID0gb3Iuejtcblx0XHRcdFx0cS53ID0gb3Iudztcblx0XHRcdFx0dC54ID0gdHIueDtcblx0XHRcdFx0dC55ID0gdHIueTtcblx0XHRcdFx0dC56ID0gdHIuejtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIGFwcGVuZCBwYXJlbnQgcG9zZVxuXHRcdFx0XHRwYXJlbnRQb3NlID0gZ2xvYmFsUG9zZXNbcGFyZW50SW5kZXhdO1xuXG5cdFx0XHRcdC8vIHJvdGF0ZSBwb2ludFxuXHRcdFx0XHRvciA9IHBhcmVudFBvc2Uub3JpZW50YXRpb247XG5cdFx0XHRcdHRyID0gcG9zZS50cmFuc2xhdGlvbjtcblx0XHRcdFx0eDIgPSBvci54O1xuXHRcdFx0XHR5MiA9IG9yLnk7XG5cdFx0XHRcdHoyID0gb3Iuejtcblx0XHRcdFx0dzIgPSBvci53O1xuXHRcdFx0XHR4MyA9IHRyLng7XG5cdFx0XHRcdHkzID0gdHIueTtcblx0XHRcdFx0ejMgPSB0ci56O1xuXG5cdFx0XHRcdHcxID0gLXgyKngzIC0geTIqeTMgLSB6Mip6Mztcblx0XHRcdFx0eDEgPSB3Mip4MyArIHkyKnozIC0gejIqeTM7XG5cdFx0XHRcdHkxID0gdzIqeTMgLSB4Mip6MyArIHoyKngzO1xuXHRcdFx0XHR6MSA9IHcyKnozICsgeDIqeTMgLSB5Mip4MztcblxuXHRcdFx0XHQvLyBhcHBlbmQgcGFyZW50IHRyYW5zbGF0aW9uXG5cdFx0XHRcdHRyID0gcGFyZW50UG9zZS50cmFuc2xhdGlvbjtcblx0XHRcdFx0dC54ID0gLXcxKngyICsgeDEqdzIgLSB5MSp6MiArIHoxKnkyICsgdHIueDtcblx0XHRcdFx0dC55ID0gLXcxKnkyICsgeDEqejIgKyB5MSp3MiAtIHoxKngyICsgdHIueTtcblx0XHRcdFx0dC56ID0gLXcxKnoyIC0geDEqeTIgKyB5MSp4MiArIHoxKncyICsgdHIuejtcblxuXHRcdFx0XHQvLyBhcHBlbmQgcGFyZW50IG9yaWVudGF0aW9uXG5cdFx0XHRcdHgxID0gb3IueDtcblx0XHRcdFx0eTEgPSBvci55O1xuXHRcdFx0XHR6MSA9IG9yLno7XG5cdFx0XHRcdHcxID0gb3Iudztcblx0XHRcdFx0b3IgPSBwb3NlLm9yaWVudGF0aW9uO1xuXHRcdFx0XHR4MiA9IG9yLng7XG5cdFx0XHRcdHkyID0gb3IueTtcblx0XHRcdFx0ejIgPSBvci56O1xuXHRcdFx0XHR3MiA9IG9yLnc7XG5cblx0XHRcdFx0cS53ID0gdzEqdzIgLSB4MSp4MiAtIHkxKnkyIC0gejEqejI7XG5cdFx0XHRcdHEueCA9IHcxKngyICsgeDEqdzIgKyB5MSp6MiAtIHoxKnkyO1xuXHRcdFx0XHRxLnkgPSB3MSp5MiAtIHgxKnoyICsgeTEqdzIgKyB6MSp4Mjtcblx0XHRcdFx0cS56ID0gdzEqejIgKyB4MSp5MiAtIHkxKngyICsgejEqdzI7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cHJpdmF0ZSBvblRyYW5zaXRpb25Db21wbGV0ZShldmVudDpBbmltYXRpb25TdGF0ZUV2ZW50KVxuXHR7XG5cdFx0aWYgKGV2ZW50LnR5cGUgPT0gQW5pbWF0aW9uU3RhdGVFdmVudC5UUkFOU0lUSU9OX0NPTVBMRVRFKSB7XG5cdFx0XHRldmVudC5hbmltYXRpb25Ob2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIoQW5pbWF0aW9uU3RhdGVFdmVudC5UUkFOU0lUSU9OX0NPTVBMRVRFLCB0aGlzLl9vblRyYW5zaXRpb25Db21wbGV0ZURlbGVnYXRlKTtcblx0XHRcdC8vaWYgdGhpcyBpcyB0aGUgY3VycmVudCBhY3RpdmUgc3RhdGUgdHJhbnNpdGlvbiwgcmV2ZXJ0IGNvbnRyb2wgdG8gdGhlIGFjdGl2ZSBub2RlXG5cdFx0XHRpZiAodGhpcy5fcEFjdGl2ZVN0YXRlID09IGV2ZW50LmFuaW1hdGlvblN0YXRlKSB7XG5cdFx0XHRcdHRoaXMuX3BBY3RpdmVOb2RlID0gdGhpcy5fcEFuaW1hdGlvblNldC5nZXRBbmltYXRpb24odGhpcy5fcEFjdGl2ZUFuaW1hdGlvbk5hbWUpO1xuXHRcdFx0XHR0aGlzLl9wQWN0aXZlU3RhdGUgPSB0aGlzLmdldEFuaW1hdGlvblN0YXRlKHRoaXMuX3BBY3RpdmVOb2RlKTtcblx0XHRcdFx0dGhpcy5fYWN0aXZlU2tlbGV0b25TdGF0ZSA9IDxJU2tlbGV0b25BbmltYXRpb25TdGF0ZT4gdGhpcy5fcEFjdGl2ZVN0YXRlO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgb25JbmRpY2VzVXBkYXRlKGV2ZW50OlN1Ykdlb21ldHJ5RXZlbnQpXG5cdHtcblx0XHR2YXIgc3ViR2VvbWV0cnk6VHJpYW5nbGVTdWJHZW9tZXRyeSA9IDxUcmlhbmdsZVN1Ykdlb21ldHJ5PiBldmVudC50YXJnZXQ7XG5cblx0XHQoPFRyaWFuZ2xlU3ViR2VvbWV0cnk+IHRoaXMuX21vcnBoZWRTdWJHZW9tZXRyeVtzdWJHZW9tZXRyeS5pZF0pLnVwZGF0ZUluZGljZXMoc3ViR2VvbWV0cnkuaW5kaWNlcyk7XG5cdH1cblxuXHRwcml2YXRlIG9uVmVydGljZXNVcGRhdGUoZXZlbnQ6U3ViR2VvbWV0cnlFdmVudClcblx0e1xuXHRcdHZhciBzdWJHZW9tZXRyeTpUcmlhbmdsZVN1Ykdlb21ldHJ5ID0gPFRyaWFuZ2xlU3ViR2VvbWV0cnk+IGV2ZW50LnRhcmdldDtcblx0XHR2YXIgbW9ycGhHZW9tZXRyeTpUcmlhbmdsZVN1Ykdlb21ldHJ5ID0gPFRyaWFuZ2xlU3ViR2VvbWV0cnk+IHRoaXMuX21vcnBoZWRTdWJHZW9tZXRyeVtzdWJHZW9tZXRyeS5pZF07XG5cblx0XHRzd2l0Y2goZXZlbnQuZGF0YVR5cGUpIHtcblx0XHRcdGNhc2UgVHJpYW5nbGVTdWJHZW9tZXRyeS5VVl9EQVRBOlxuXHRcdFx0XHRtb3JwaEdlb21ldHJ5LnVwZGF0ZVVWcyhzdWJHZW9tZXRyeS51dnMpO1xuXHRcdFx0Y2FzZSBUcmlhbmdsZVN1Ykdlb21ldHJ5LlNFQ09OREFSWV9VVl9EQVRBOlxuXHRcdFx0XHRtb3JwaEdlb21ldHJ5LnVwZGF0ZVVWcyhzdWJHZW9tZXRyeS5zZWNvbmRhcnlVVnMpO1xuXHRcdH1cblx0fVxufVxuXG5leHBvcnQgPSBTa2VsZXRvbkFuaW1hdG9yOyJdfQ==