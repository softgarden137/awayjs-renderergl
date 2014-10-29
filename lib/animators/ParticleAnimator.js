var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AnimatorBase = require("awayjs-stagegl/lib/animators/AnimatorBase");
var ContextGLProgramType = require("awayjs-stagegl/lib/base/ContextGLProgramType");
var AnimationSubGeometry = require("awayjs-renderergl/lib/animators/data/AnimationSubGeometry");
var ParticlePropertiesMode = require("awayjs-renderergl/lib/animators/data/ParticlePropertiesMode");
/**
 * Provides an interface for assigning paricle-based animation data sets to mesh-based entity objects
 * and controlling the various available states of animation through an interative playhead that can be
 * automatically updated or manually triggered.
 *
 * Requires that the containing geometry of the parent mesh is particle geometry
 *
 * @see away.base.ParticleGeometry
 */
var ParticleAnimator = (function (_super) {
    __extends(ParticleAnimator, _super);
    /**
     * Creates a new <code>ParticleAnimator</code> object.
     *
     * @param particleAnimationSet The animation data set containing the particle animations used by the animator.
     */
    function ParticleAnimator(particleAnimationSet) {
        _super.call(this, particleAnimationSet);
        this._animationParticleStates = new Array();
        this._animatorParticleStates = new Array();
        this._timeParticleStates = new Array();
        this._totalLenOfOneVertex = 0;
        this._animatorSubGeometries = new Object();
        this._particleAnimationSet = particleAnimationSet;
        var state;
        var node;
        for (var i = 0; i < this._particleAnimationSet.particleNodes.length; i++) {
            node = this._particleAnimationSet.particleNodes[i];
            state = this.getAnimationState(node);
            if (node.mode == ParticlePropertiesMode.LOCAL_DYNAMIC) {
                this._animatorParticleStates.push(state);
                node._iDataOffset = this._totalLenOfOneVertex;
                this._totalLenOfOneVertex += node.dataLength;
            }
            else {
                this._animationParticleStates.push(state);
            }
            if (state.needUpdateTime)
                this._timeParticleStates.push(state);
        }
    }
    /**
     * @inheritDoc
     */
    ParticleAnimator.prototype.clone = function () {
        return new ParticleAnimator(this._particleAnimationSet);
    };
    /**
     * @inheritDoc
     */
    ParticleAnimator.prototype.setRenderState = function (shaderObject, renderable, stage, camera, vertexConstantOffset /*int*/, vertexStreamOffset /*int*/) {
        var animationRegisterCache = this._particleAnimationSet._iAnimationRegisterCache;
        var subMesh = renderable.subMesh;
        var state;
        var i;
        if (!subMesh)
            throw (new Error("Must be subMesh"));
        //process animation sub geometries
        var animationSubGeometry = this._particleAnimationSet.getAnimationSubGeometry(subMesh);
        for (i = 0; i < this._animationParticleStates.length; i++)
            this._animationParticleStates[i].setRenderState(stage, renderable, animationSubGeometry, animationRegisterCache, camera);
        //process animator subgeometries
        var animatorSubGeometry = this.getAnimatorSubGeometry(subMesh);
        for (i = 0; i < this._animatorParticleStates.length; i++)
            this._animatorParticleStates[i].setRenderState(stage, renderable, animatorSubGeometry, animationRegisterCache, camera);
        stage.context.setProgramConstantsFromArray(ContextGLProgramType.VERTEX, animationRegisterCache.vertexConstantOffset, animationRegisterCache.vertexConstantData, animationRegisterCache.numVertexConstant);
        if (animationRegisterCache.numFragmentConstant > 0)
            stage.context.setProgramConstantsFromArray(ContextGLProgramType.FRAGMENT, animationRegisterCache.fragmentConstantOffset, animationRegisterCache.fragmentConstantData, animationRegisterCache.numFragmentConstant);
    };
    /**
     * @inheritDoc
     */
    ParticleAnimator.prototype.testGPUCompatibility = function (shaderObject) {
    };
    /**
     * @inheritDoc
     */
    ParticleAnimator.prototype.start = function () {
        _super.prototype.start.call(this);
        for (var i = 0; i < this._timeParticleStates.length; i++)
            this._timeParticleStates[i].offset(this._pAbsoluteTime);
    };
    /**
     * @inheritDoc
     */
    ParticleAnimator.prototype._pUpdateDeltaTime = function (dt) {
        this._pAbsoluteTime += dt;
        for (var i = 0; i < this._timeParticleStates.length; i++)
            this._timeParticleStates[i].update(this._pAbsoluteTime);
    };
    /**
     * @inheritDoc
     */
    ParticleAnimator.prototype.resetTime = function (offset) {
        if (offset === void 0) { offset = 0; }
        for (var i = 0; i < this._timeParticleStates.length; i++)
            this._timeParticleStates[i].offset(this._pAbsoluteTime + offset);
        this.update(this.time);
    };
    ParticleAnimator.prototype.dispose = function () {
        for (var key in this._animatorSubGeometries)
            this._animatorSubGeometries[key].dispose();
    };
    ParticleAnimator.prototype.getAnimatorSubGeometry = function (subMesh) {
        if (!this._animatorParticleStates.length)
            return;
        var subGeometry = subMesh.subGeometry;
        var animatorSubGeometry = this._animatorSubGeometries[subGeometry.id] = new AnimationSubGeometry();
        //create the vertexData vector that will be used for local state data
        animatorSubGeometry.createVertexData(subGeometry.numVertices, this._totalLenOfOneVertex);
        //pass the particles data to the animator subGeometry
        animatorSubGeometry.animationParticles = this._particleAnimationSet.getAnimationSubGeometry(subMesh).animationParticles;
    };
    return ParticleAnimator;
})(AnimatorBase);
module.exports = ParticleAnimator;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvcGFydGljbGVhbmltYXRvci50cyJdLCJuYW1lcyI6WyJQYXJ0aWNsZUFuaW1hdG9yIiwiUGFydGljbGVBbmltYXRvci5jb25zdHJ1Y3RvciIsIlBhcnRpY2xlQW5pbWF0b3IuY2xvbmUiLCJQYXJ0aWNsZUFuaW1hdG9yLnNldFJlbmRlclN0YXRlIiwiUGFydGljbGVBbmltYXRvci50ZXN0R1BVQ29tcGF0aWJpbGl0eSIsIlBhcnRpY2xlQW5pbWF0b3Iuc3RhcnQiLCJQYXJ0aWNsZUFuaW1hdG9yLl9wVXBkYXRlRGVsdGFUaW1lIiwiUGFydGljbGVBbmltYXRvci5yZXNldFRpbWUiLCJQYXJ0aWNsZUFuaW1hdG9yLmRpc3Bvc2UiLCJQYXJ0aWNsZUFuaW1hdG9yLmdldEFuaW1hdG9yU3ViR2VvbWV0cnkiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUlBLElBQU8sWUFBWSxXQUFnQiwyQ0FBMkMsQ0FBQyxDQUFDO0FBS2hGLElBQU8sb0JBQW9CLFdBQWMsOENBQThDLENBQUMsQ0FBQztBQUt6RixJQUFPLG9CQUFvQixXQUFjLDJEQUEyRCxDQUFDLENBQUM7QUFFdEcsSUFBTyxzQkFBc0IsV0FBYSw2REFBNkQsQ0FBQyxDQUFDO0FBSXpHLEFBU0E7Ozs7Ozs7O0dBREc7SUFDRyxnQkFBZ0I7SUFBU0EsVUFBekJBLGdCQUFnQkEsVUFBcUJBO0lBVTFDQTs7OztPQUlHQTtJQUNIQSxTQWZLQSxnQkFBZ0JBLENBZVRBLG9CQUF5Q0E7UUFFcERDLGtCQUFNQSxvQkFBb0JBLENBQUNBLENBQUNBO1FBYnJCQSw2QkFBd0JBLEdBQTRCQSxJQUFJQSxLQUFLQSxFQUFxQkEsQ0FBQ0E7UUFDbkZBLDRCQUF1QkEsR0FBNEJBLElBQUlBLEtBQUtBLEVBQXFCQSxDQUFDQTtRQUNsRkEsd0JBQW1CQSxHQUE0QkEsSUFBSUEsS0FBS0EsRUFBcUJBLENBQUNBO1FBQzlFQSx5QkFBb0JBLEdBQW1CQSxDQUFDQSxDQUFDQTtRQUN6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eEJBLENBQUNBO0lBRU1QLGtDQUFPQSxHQUFkQTtRQUVDUSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxJQUFJQSxJQUFJQSxDQUFDQSxzQkFBc0JBLENBQUNBO1lBQ25CQSxJQUFJQSxDQUFDQSxzQkFBc0JBLENBQUNBLEdBQUdBLENBQUVBLENBQUNBLE9BQU9BLEVBQUVBLENBQUNBO0lBQ3RFQSxDQUFDQTtJQUVPUixpREFBc0JBLEdBQTlCQSxVQUErQkEsT0FBZ0JBO1FBRTlDUyxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSx1QkFBdUJBLENBQUNBLE1BQU1BLENBQUNBO1lBQ3hDQSxNQUFNQSxDQUFDQTtRQUVSQSxJQUFJQSxXQUFXQSxHQUFtQkEsT0FBT0EsQ0FBQ0EsV0FBV0EsQ0FBQ0E7UUFDdERBLElBQUlBLG1CQUFtQkEsR0FBd0JBLElBQUlBLENBQUNBLHNCQUFzQkEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsSUFBSUEsb0JBQW9CQSxFQUFFQSxDQUFDQTtRQUV4SEEsQUFDQUEscUVBRHFFQTtRQUNyRUEsbUJBQW1CQSxDQUFDQSxnQkFBZ0JBLENBQUNBLFdBQVdBLENBQUNBLFdBQVdBLEVBQUVBLElBQUlBLENBQUNBLG9CQUFvQkEsQ0FBQ0EsQ0FBQ0E7UUFFekZBLEFBQ0FBLHFEQURxREE7UUFDckRBLG1CQUFtQkEsQ0FBQ0Esa0JBQWtCQSxHQUFHQSxJQUFJQSxDQUFDQSxxQkFBcUJBLENBQUNBLHVCQUF1QkEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0Esa0JBQWtCQSxDQUFDQTtJQUN6SEEsQ0FBQ0E7SUFDRlQsdUJBQUNBO0FBQURBLENBMUlBLEFBMElDQSxFQTFJOEIsWUFBWSxFQTBJMUM7QUFFRCxBQUEwQixpQkFBakIsZ0JBQWdCLENBQUMiLCJmaWxlIjoiYW5pbWF0b3JzL1BhcnRpY2xlQW5pbWF0b3IuanMiLCJzb3VyY2VSb290IjoiLi4vIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IElTdWJNZXNoXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvYmFzZS9JU3ViTWVzaFwiKTtcbmltcG9ydCBTdWJHZW9tZXRyeUJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2Jhc2UvU3ViR2VvbWV0cnlCYXNlXCIpO1xuaW1wb3J0IENhbWVyYVx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2VudGl0aWVzL0NhbWVyYVwiKTtcblxuaW1wb3J0IEFuaW1hdG9yQmFzZVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9hbmltYXRvcnMvQW5pbWF0b3JCYXNlXCIpO1xuaW1wb3J0IEFuaW1hdGlvblJlZ2lzdGVyQ2FjaGVcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYW5pbWF0b3JzL2RhdGEvQW5pbWF0aW9uUmVnaXN0ZXJDYWNoZVwiKTtcbmltcG9ydCBTdGFnZVx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2Jhc2UvU3RhZ2VcIik7XG5pbXBvcnQgUmVuZGVyYWJsZUJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL3Bvb2wvUmVuZGVyYWJsZUJhc2VcIik7XG5pbXBvcnQgVHJpYW5nbGVTdWJNZXNoUmVuZGVyYWJsZVx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvcG9vbC9UcmlhbmdsZVN1Yk1lc2hSZW5kZXJhYmxlXCIpO1xuaW1wb3J0IENvbnRleHRHTFByb2dyYW1UeXBlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYmFzZS9Db250ZXh0R0xQcm9ncmFtVHlwZVwiKTtcbmltcG9ydCBJQ29udGV4dFN0YWdlR0xcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL2Jhc2UvSUNvbnRleHRTdGFnZUdMXCIpO1xuaW1wb3J0IFNoYWRlck9iamVjdEJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXN0YWdlZ2wvbGliL21hdGVyaWFscy9jb21waWxhdGlvbi9TaGFkZXJPYmplY3RCYXNlXCIpO1xuXG5pbXBvcnQgUGFydGljbGVBbmltYXRpb25TZXRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvUGFydGljbGVBbmltYXRpb25TZXRcIik7XG5pbXBvcnQgQW5pbWF0aW9uU3ViR2VvbWV0cnlcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvZGF0YS9BbmltYXRpb25TdWJHZW9tZXRyeVwiKTtcbmltcG9ydCBQYXJ0aWNsZUFuaW1hdGlvbkRhdGFcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL2RhdGEvUGFydGljbGVBbmltYXRpb25EYXRhXCIpO1xuaW1wb3J0IFBhcnRpY2xlUHJvcGVydGllc01vZGVcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL2RhdGEvUGFydGljbGVQcm9wZXJ0aWVzTW9kZVwiKTtcbmltcG9ydCBQYXJ0aWNsZU5vZGVCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvbm9kZXMvUGFydGljbGVOb2RlQmFzZVwiKTtcbmltcG9ydCBQYXJ0aWNsZVN0YXRlQmFzZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9zdGF0ZXMvUGFydGljbGVTdGF0ZUJhc2VcIik7XG5cbi8qKlxuICogUHJvdmlkZXMgYW4gaW50ZXJmYWNlIGZvciBhc3NpZ25pbmcgcGFyaWNsZS1iYXNlZCBhbmltYXRpb24gZGF0YSBzZXRzIHRvIG1lc2gtYmFzZWQgZW50aXR5IG9iamVjdHNcbiAqIGFuZCBjb250cm9sbGluZyB0aGUgdmFyaW91cyBhdmFpbGFibGUgc3RhdGVzIG9mIGFuaW1hdGlvbiB0aHJvdWdoIGFuIGludGVyYXRpdmUgcGxheWhlYWQgdGhhdCBjYW4gYmVcbiAqIGF1dG9tYXRpY2FsbHkgdXBkYXRlZCBvciBtYW51YWxseSB0cmlnZ2VyZWQuXG4gKlxuICogUmVxdWlyZXMgdGhhdCB0aGUgY29udGFpbmluZyBnZW9tZXRyeSBvZiB0aGUgcGFyZW50IG1lc2ggaXMgcGFydGljbGUgZ2VvbWV0cnlcbiAqXG4gKiBAc2VlIGF3YXkuYmFzZS5QYXJ0aWNsZUdlb21ldHJ5XG4gKi9cbmNsYXNzIFBhcnRpY2xlQW5pbWF0b3IgZXh0ZW5kcyBBbmltYXRvckJhc2VcbntcblxuXHRwcml2YXRlIF9wYXJ0aWNsZUFuaW1hdGlvblNldDpQYXJ0aWNsZUFuaW1hdGlvblNldDtcblx0cHJpdmF0ZSBfYW5pbWF0aW9uUGFydGljbGVTdGF0ZXM6QXJyYXk8UGFydGljbGVTdGF0ZUJhc2U+ID0gbmV3IEFycmF5PFBhcnRpY2xlU3RhdGVCYXNlPigpO1xuXHRwcml2YXRlIF9hbmltYXRvclBhcnRpY2xlU3RhdGVzOkFycmF5PFBhcnRpY2xlU3RhdGVCYXNlPiA9IG5ldyBBcnJheTxQYXJ0aWNsZVN0YXRlQmFzZT4oKTtcblx0cHJpdmF0ZSBfdGltZVBhcnRpY2xlU3RhdGVzOkFycmF5PFBhcnRpY2xlU3RhdGVCYXNlPiA9IG5ldyBBcnJheTxQYXJ0aWNsZVN0YXRlQmFzZT4oKTtcblx0cHJpdmF0ZSBfdG90YWxMZW5PZk9uZVZlcnRleDpudW1iZXIgLyp1aW50Ki8gPSAwO1xuXHRwcml2YXRlIF9hbmltYXRvclN1Ykdlb21ldHJpZXM6T2JqZWN0ID0gbmV3IE9iamVjdCgpO1xuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IDxjb2RlPlBhcnRpY2xlQW5pbWF0b3I8L2NvZGU+IG9iamVjdC5cblx0ICpcblx0ICogQHBhcmFtIHBhcnRpY2xlQW5pbWF0aW9uU2V0IFRoZSBhbmltYXRpb24gZGF0YSBzZXQgY29udGFpbmluZyB0aGUgcGFydGljbGUgYW5pbWF0aW9ucyB1c2VkIGJ5IHRoZSBhbmltYXRvci5cblx0ICovXG5cdGNvbnN0cnVjdG9yKHBhcnRpY2xlQW5pbWF0aW9uU2V0OlBhcnRpY2xlQW5pbWF0aW9uU2V0KVxuXHR7XG5cdFx0c3VwZXIocGFydGljbGVBbmltYXRpb25TZXQpO1xuXHRcdHRoaXMuX3BhcnRpY2xlQW5pbWF0aW9uU2V0ID0gcGFydGljbGVBbmltYXRpb25TZXQ7XG5cblx0XHR2YXIgc3RhdGU6UGFydGljbGVTdGF0ZUJhc2U7XG5cdFx0dmFyIG5vZGU6UGFydGljbGVOb2RlQmFzZTtcblxuXHRcdGZvciAodmFyIGk6bnVtYmVyID0gMDsgaSA8IHRoaXMuX3BhcnRpY2xlQW5pbWF0aW9uU2V0LnBhcnRpY2xlTm9kZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdG5vZGUgPSB0aGlzLl9wYXJ0aWNsZUFuaW1hdGlvblNldC5wYXJ0aWNsZU5vZGVzW2ldO1xuXHRcdFx0c3RhdGUgPSA8UGFydGljbGVTdGF0ZUJhc2U+IHRoaXMuZ2V0QW5pbWF0aW9uU3RhdGUobm9kZSk7XG5cdFx0XHRpZiAobm9kZS5tb2RlID09IFBhcnRpY2xlUHJvcGVydGllc01vZGUuTE9DQUxfRFlOQU1JQykge1xuXHRcdFx0XHR0aGlzLl9hbmltYXRvclBhcnRpY2xlU3RhdGVzLnB1c2goc3RhdGUpO1xuXHRcdFx0XHRub2RlLl9pRGF0YU9mZnNldCA9IHRoaXMuX3RvdGFsTGVuT2ZPbmVWZXJ0ZXg7XG5cdFx0XHRcdHRoaXMuX3RvdGFsTGVuT2ZPbmVWZXJ0ZXggKz0gbm9kZS5kYXRhTGVuZ3RoO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5fYW5pbWF0aW9uUGFydGljbGVTdGF0ZXMucHVzaChzdGF0ZSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoc3RhdGUubmVlZFVwZGF0ZVRpbWUpXG5cdFx0XHRcdHRoaXMuX3RpbWVQYXJ0aWNsZVN0YXRlcy5wdXNoKHN0YXRlKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBjbG9uZSgpOkFuaW1hdG9yQmFzZVxuXHR7XG5cdFx0cmV0dXJuIG5ldyBQYXJ0aWNsZUFuaW1hdG9yKHRoaXMuX3BhcnRpY2xlQW5pbWF0aW9uU2V0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIHNldFJlbmRlclN0YXRlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCByZW5kZXJhYmxlOlJlbmRlcmFibGVCYXNlLCBzdGFnZTpTdGFnZSwgY2FtZXJhOkNhbWVyYSwgdmVydGV4Q29uc3RhbnRPZmZzZXQ6bnVtYmVyIC8qaW50Ki8sIHZlcnRleFN0cmVhbU9mZnNldDpudW1iZXIgLyppbnQqLylcblx0e1xuXHRcdHZhciBhbmltYXRpb25SZWdpc3RlckNhY2hlOkFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUgPSB0aGlzLl9wYXJ0aWNsZUFuaW1hdGlvblNldC5faUFuaW1hdGlvblJlZ2lzdGVyQ2FjaGU7XG5cblx0XHR2YXIgc3ViTWVzaDpJU3ViTWVzaCA9ICg8VHJpYW5nbGVTdWJNZXNoUmVuZGVyYWJsZT4gcmVuZGVyYWJsZSkuc3ViTWVzaDtcblx0XHR2YXIgc3RhdGU6UGFydGljbGVTdGF0ZUJhc2U7XG5cdFx0dmFyIGk6bnVtYmVyO1xuXG5cdFx0aWYgKCFzdWJNZXNoKVxuXHRcdFx0dGhyb3cobmV3IEVycm9yKFwiTXVzdCBiZSBzdWJNZXNoXCIpKTtcblxuXHRcdC8vcHJvY2VzcyBhbmltYXRpb24gc3ViIGdlb21ldHJpZXNcblx0XHR2YXIgYW5pbWF0aW9uU3ViR2VvbWV0cnk6QW5pbWF0aW9uU3ViR2VvbWV0cnkgPSB0aGlzLl9wYXJ0aWNsZUFuaW1hdGlvblNldC5nZXRBbmltYXRpb25TdWJHZW9tZXRyeShzdWJNZXNoKTtcblxuXHRcdGZvciAoaSA9IDA7IGkgPCB0aGlzLl9hbmltYXRpb25QYXJ0aWNsZVN0YXRlcy5sZW5ndGg7IGkrKylcblx0XHRcdHRoaXMuX2FuaW1hdGlvblBhcnRpY2xlU3RhdGVzW2ldLnNldFJlbmRlclN0YXRlKHN0YWdlLCByZW5kZXJhYmxlLCBhbmltYXRpb25TdWJHZW9tZXRyeSwgYW5pbWF0aW9uUmVnaXN0ZXJDYWNoZSwgY2FtZXJhKTtcblxuXHRcdC8vcHJvY2VzcyBhbmltYXRvciBzdWJnZW9tZXRyaWVzXG5cdFx0dmFyIGFuaW1hdG9yU3ViR2VvbWV0cnk6QW5pbWF0aW9uU3ViR2VvbWV0cnkgPSB0aGlzLmdldEFuaW1hdG9yU3ViR2VvbWV0cnkoc3ViTWVzaCk7XG5cblx0XHRmb3IgKGkgPSAwOyBpIDwgdGhpcy5fYW5pbWF0b3JQYXJ0aWNsZVN0YXRlcy5sZW5ndGg7IGkrKylcblx0XHRcdHRoaXMuX2FuaW1hdG9yUGFydGljbGVTdGF0ZXNbaV0uc2V0UmVuZGVyU3RhdGUoc3RhZ2UsIHJlbmRlcmFibGUsIGFuaW1hdG9yU3ViR2VvbWV0cnksIGFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUsIGNhbWVyYSk7XG5cblx0XHQoPElDb250ZXh0U3RhZ2VHTD4gc3RhZ2UuY29udGV4dCkuc2V0UHJvZ3JhbUNvbnN0YW50c0Zyb21BcnJheShDb250ZXh0R0xQcm9ncmFtVHlwZS5WRVJURVgsIGFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUudmVydGV4Q29uc3RhbnRPZmZzZXQsIGFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUudmVydGV4Q29uc3RhbnREYXRhLCBhbmltYXRpb25SZWdpc3RlckNhY2hlLm51bVZlcnRleENvbnN0YW50KTtcblxuXHRcdGlmIChhbmltYXRpb25SZWdpc3RlckNhY2hlLm51bUZyYWdtZW50Q29uc3RhbnQgPiAwKVxuXHRcdFx0KDxJQ29udGV4dFN0YWdlR0w+IHN0YWdlLmNvbnRleHQpLnNldFByb2dyYW1Db25zdGFudHNGcm9tQXJyYXkoQ29udGV4dEdMUHJvZ3JhbVR5cGUuRlJBR01FTlQsIGFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUuZnJhZ21lbnRDb25zdGFudE9mZnNldCwgYW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS5mcmFnbWVudENvbnN0YW50RGF0YSwgYW5pbWF0aW9uUmVnaXN0ZXJDYWNoZS5udW1GcmFnbWVudENvbnN0YW50KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIHRlc3RHUFVDb21wYXRpYmlsaXR5KHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlKVxuXHR7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIHN0YXJ0KClcblx0e1xuXHRcdHN1cGVyLnN0YXJ0KCk7XG5cblx0XHRmb3IgKHZhciBpOm51bWJlciA9IDA7IGkgPCB0aGlzLl90aW1lUGFydGljbGVTdGF0ZXMubGVuZ3RoOyBpKyspXG5cdFx0XHR0aGlzLl90aW1lUGFydGljbGVTdGF0ZXNbaV0ub2Zmc2V0KHRoaXMuX3BBYnNvbHV0ZVRpbWUpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgX3BVcGRhdGVEZWx0YVRpbWUoZHQ6bnVtYmVyKVxuXHR7XG5cdFx0dGhpcy5fcEFic29sdXRlVGltZSArPSBkdDtcblxuXHRcdGZvciAodmFyIGk6bnVtYmVyID0gMDsgaSA8IHRoaXMuX3RpbWVQYXJ0aWNsZVN0YXRlcy5sZW5ndGg7IGkrKylcblx0XHRcdHRoaXMuX3RpbWVQYXJ0aWNsZVN0YXRlc1tpXS51cGRhdGUodGhpcy5fcEFic29sdXRlVGltZSk7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyByZXNldFRpbWUob2Zmc2V0Om51bWJlciAvKmludCovID0gMClcblx0e1xuXHRcdGZvciAodmFyIGk6bnVtYmVyID0gMDsgaSA8IHRoaXMuX3RpbWVQYXJ0aWNsZVN0YXRlcy5sZW5ndGg7IGkrKylcblx0XHRcdHRoaXMuX3RpbWVQYXJ0aWNsZVN0YXRlc1tpXS5vZmZzZXQodGhpcy5fcEFic29sdXRlVGltZSArIG9mZnNldCk7XG5cdFx0dGhpcy51cGRhdGUodGhpcy50aW1lKTtcblx0fVxuXG5cdHB1YmxpYyBkaXNwb3NlKClcblx0e1xuXHRcdGZvciAodmFyIGtleSBpbiB0aGlzLl9hbmltYXRvclN1Ykdlb21ldHJpZXMpXG5cdFx0XHQoPEFuaW1hdGlvblN1Ykdlb21ldHJ5PiB0aGlzLl9hbmltYXRvclN1Ykdlb21ldHJpZXNba2V5XSkuZGlzcG9zZSgpO1xuXHR9XG5cblx0cHJpdmF0ZSBnZXRBbmltYXRvclN1Ykdlb21ldHJ5KHN1Yk1lc2g6SVN1Yk1lc2gpOkFuaW1hdGlvblN1Ykdlb21ldHJ5XG5cdHtcblx0XHRpZiAoIXRoaXMuX2FuaW1hdG9yUGFydGljbGVTdGF0ZXMubGVuZ3RoKVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0dmFyIHN1Ykdlb21ldHJ5OlN1Ykdlb21ldHJ5QmFzZSA9IHN1Yk1lc2guc3ViR2VvbWV0cnk7XG5cdFx0dmFyIGFuaW1hdG9yU3ViR2VvbWV0cnk6QW5pbWF0aW9uU3ViR2VvbWV0cnkgPSB0aGlzLl9hbmltYXRvclN1Ykdlb21ldHJpZXNbc3ViR2VvbWV0cnkuaWRdID0gbmV3IEFuaW1hdGlvblN1Ykdlb21ldHJ5KCk7XG5cblx0XHQvL2NyZWF0ZSB0aGUgdmVydGV4RGF0YSB2ZWN0b3IgdGhhdCB3aWxsIGJlIHVzZWQgZm9yIGxvY2FsIHN0YXRlIGRhdGFcblx0XHRhbmltYXRvclN1Ykdlb21ldHJ5LmNyZWF0ZVZlcnRleERhdGEoc3ViR2VvbWV0cnkubnVtVmVydGljZXMsIHRoaXMuX3RvdGFsTGVuT2ZPbmVWZXJ0ZXgpO1xuXG5cdFx0Ly9wYXNzIHRoZSBwYXJ0aWNsZXMgZGF0YSB0byB0aGUgYW5pbWF0b3Igc3ViR2VvbWV0cnlcblx0XHRhbmltYXRvclN1Ykdlb21ldHJ5LmFuaW1hdGlvblBhcnRpY2xlcyA9IHRoaXMuX3BhcnRpY2xlQW5pbWF0aW9uU2V0LmdldEFuaW1hdGlvblN1Ykdlb21ldHJ5KHN1Yk1lc2gpLmFuaW1hdGlvblBhcnRpY2xlcztcblx0fVxufVxuXG5leHBvcnQgPSBQYXJ0aWNsZUFuaW1hdG9yOyJdfQ==