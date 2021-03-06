var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Matrix3D = require("awayjs-core/lib/geom/Matrix3D");
var ContextGLVertexBufferFormat = require("awayjs-stagegl/lib/base/ContextGLVertexBufferFormat");
var ParticlePropertiesMode = require("awayjs-renderergl/lib/animators/data/ParticlePropertiesMode");
var ParticleStateBase = require("awayjs-renderergl/lib/animators/states/ParticleStateBase");
/**
 * ...
 */
var ParticleRotateToPositionState = (function (_super) {
    __extends(ParticleRotateToPositionState, _super);
    function ParticleRotateToPositionState(animator, particleRotateToPositionNode) {
        _super.call(this, animator, particleRotateToPositionNode);
        this._matrix = new Matrix3D();
        this._particleRotateToPositionNode = particleRotateToPositionNode;
        this._position = this._particleRotateToPositionNode._iPosition;
    }
    Object.defineProperty(ParticleRotateToPositionState.prototype, "position", {
        /**
         * Defines the position of the point the particle will rotate to face when in global mode. Defaults to 0,0,0.
         */
        get: function () {
            return this._position;
        },
        set: function (value) {
            this._position = value;
        },
        enumerable: true,
        configurable: true
    });
    ParticleRotateToPositionState.prototype.setRenderState = function (stage, renderable, animationSubGeometry, animationRegisterCache, camera) {
        var index = animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleRotateToPositionState.POSITION_INDEX);
        if (animationRegisterCache.hasBillboard) {
            this._matrix.copyFrom(renderable.sourceEntity.sceneTransform);
            this._matrix.append(camera.inverseSceneTransform);
            animationRegisterCache.setVertexConstFromMatrix(animationRegisterCache.getRegisterIndex(this._pAnimationNode, ParticleRotateToPositionState.MATRIX_INDEX), this._matrix);
        }
        if (this._particleRotateToPositionNode.mode == ParticlePropertiesMode.GLOBAL) {
            this._offset = renderable.sourceEntity.inverseSceneTransform.transformVector(this._position);
            animationRegisterCache.setVertexConst(index, this._offset.x, this._offset.y, this._offset.z);
        }
        else
            animationSubGeometry.activateVertexBuffer(index, this._particleRotateToPositionNode._iDataOffset, stage, ContextGLVertexBufferFormat.FLOAT_3);
    };
    /** @private */
    ParticleRotateToPositionState.MATRIX_INDEX = 0;
    /** @private */
    ParticleRotateToPositionState.POSITION_INDEX = 1;
    return ParticleRotateToPositionState;
})(ParticleStateBase);
module.exports = ParticleRotateToPositionState;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvc3RhdGVzL3BhcnRpY2xlcm90YXRldG9wb3NpdGlvbnN0YXRlLnRzIl0sIm5hbWVzIjpbIlBhcnRpY2xlUm90YXRlVG9Qb3NpdGlvblN0YXRlIiwiUGFydGljbGVSb3RhdGVUb1Bvc2l0aW9uU3RhdGUuY29uc3RydWN0b3IiLCJQYXJ0aWNsZVJvdGF0ZVRvUG9zaXRpb25TdGF0ZS5wb3NpdGlvbiIsIlBhcnRpY2xlUm90YXRlVG9Qb3NpdGlvblN0YXRlLnNldFJlbmRlclN0YXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFPLFFBQVEsV0FBaUIsK0JBQStCLENBQUMsQ0FBQztBQU1qRSxJQUFPLDJCQUEyQixXQUFZLHFEQUFxRCxDQUFDLENBQUM7QUFLckcsSUFBTyxzQkFBc0IsV0FBYSw2REFBNkQsQ0FBQyxDQUFDO0FBRXpHLElBQU8saUJBQWlCLFdBQWMsMERBQTBELENBQUMsQ0FBQztBQUdsRyxBQUdBOztHQURHO0lBQ0csNkJBQTZCO0lBQVNBLFVBQXRDQSw2QkFBNkJBLFVBQTBCQTtJQXlCNURBLFNBekJLQSw2QkFBNkJBLENBeUJ0QkEsUUFBeUJBLEVBQUVBLDRCQUF5REE7UUFFL0ZDLGtCQUFNQSxRQUFRQSxFQUFFQSw0QkFBNEJBLENBQUNBLENBQUNBO1FBbEJ2Q0EsWUFBT0EsR0FBWUEsSUFBSUEsUUFBUUEsRUFBRUEsQ0FBQ0E7UUFvQnpDQSxJQUFJQSxDQUFDQSw2QkFBNkJBLEdBQUdBLDRCQUE0QkEsQ0FBQ0E7UUFDbEVBLElBQUlBLENBQUNBLFNBQVNBLEdBQUdBLElBQUlBLENBQUNBLDZCQUE2QkEsQ0FBQ0EsVUFBVUEsQ0FBQ0E7SUFDaEVBLENBQUNBO0lBaEJERCxzQkFBV0EsbURBQVFBO1FBSG5CQTs7V0FFR0E7YUFDSEE7WUFFQ0UsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0E7UUFDdkJBLENBQUNBO2FBRURGLFVBQW9CQSxLQUFjQTtZQUVqQ0UsSUFBSUEsQ0FBQ0EsU0FBU0EsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFDeEJBLENBQUNBOzs7T0FMQUY7SUFlTUEsc0RBQWNBLEdBQXJCQSxVQUFzQkEsS0FBV0EsRUFBRUEsVUFBeUJBLEVBQUVBLG9CQUF5Q0EsRUFBRUEsc0JBQTZDQSxFQUFFQSxNQUFhQTtRQUVwS0csSUFBSUEsS0FBS0EsR0FBa0JBLHNCQUFzQkEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQSxJQUFJQSxDQUFDQSxlQUFlQSxFQUFFQSw2QkFBNkJBLENBQUNBLGNBQWNBLENBQUNBLENBQUNBO1FBRXZJQSxFQUFFQSxDQUFDQSxDQUFDQSxzQkFBc0JBLENBQUNBLFlBQVlBLENBQUNBLENBQUNBLENBQUNBO1lBQ3pDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxRQUFRQSxDQUFDQSxVQUFVQSxDQUFDQSxZQUFZQSxDQUFDQSxjQUFjQSxDQUFDQSxDQUFDQTtZQUM5REEsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EscUJBQXFCQSxDQUFDQSxDQUFDQTtZQUNsREEsc0JBQXNCQSxDQUFDQSx3QkFBd0JBLENBQUNBLHNCQUFzQkEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQSxJQUFJQSxDQUFDQSxlQUFlQSxFQUFFQSw2QkFBNkJBLENBQUNBLFlBQVlBLENBQUNBLEVBQUVBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBO1FBQzFLQSxDQUFDQTtRQUVEQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSw2QkFBNkJBLENBQUNBLElBQUlBLElBQUlBLHNCQUFzQkEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDOUVBLElBQUlBLENBQUNBLE9BQU9BLEdBQUdBLFVBQVVBLENBQUNBLFlBQVlBLENBQUNBLHFCQUFxQkEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0E7WUFDN0ZBLHNCQUFzQkEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsS0FBS0EsRUFBRUEsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDOUZBLENBQUNBO1FBQUNBLElBQUlBO1lBQ0xBLG9CQUFvQkEsQ0FBQ0Esb0JBQW9CQSxDQUFDQSxLQUFLQSxFQUFFQSxJQUFJQSxDQUFDQSw2QkFBNkJBLENBQUNBLFlBQVlBLEVBQUVBLEtBQUtBLEVBQUVBLDJCQUEyQkEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0E7SUFFaEpBLENBQUNBO0lBL0NESCxlQUFlQTtJQUNEQSwwQ0FBWUEsR0FBa0JBLENBQUNBLENBQUNBO0lBQzlDQSxlQUFlQTtJQUNEQSw0Q0FBY0EsR0FBa0JBLENBQUNBLENBQUNBO0lBOENqREEsb0NBQUNBO0FBQURBLENBbkRBLEFBbURDQSxFQW5EMkMsaUJBQWlCLEVBbUQ1RDtBQUVELEFBQXVDLGlCQUE5Qiw2QkFBNkIsQ0FBQyIsImZpbGUiOiJhbmltYXRvcnMvc3RhdGVzL1BhcnRpY2xlUm90YXRlVG9Qb3NpdGlvblN0YXRlLmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBNYXRyaXgzRFx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2dlb20vTWF0cml4M0RcIik7XG5pbXBvcnQgVmVjdG9yM0RcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9nZW9tL1ZlY3RvcjNEXCIpO1xuXG5pbXBvcnQgQ2FtZXJhXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvZW50aXRpZXMvQ2FtZXJhXCIpO1xuXG5pbXBvcnQgU3RhZ2VcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9iYXNlL1N0YWdlXCIpO1xuaW1wb3J0IENvbnRleHRHTFZlcnRleEJ1ZmZlckZvcm1hdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYmFzZS9Db250ZXh0R0xWZXJ0ZXhCdWZmZXJGb3JtYXRcIik7XG5cbmltcG9ydCBQYXJ0aWNsZUFuaW1hdG9yXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvUGFydGljbGVBbmltYXRvclwiKTtcbmltcG9ydCBBbmltYXRpb25SZWdpc3RlckNhY2hlXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9kYXRhL0FuaW1hdGlvblJlZ2lzdGVyQ2FjaGVcIik7XG5pbXBvcnQgQW5pbWF0aW9uU3ViR2VvbWV0cnlcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvZGF0YS9BbmltYXRpb25TdWJHZW9tZXRyeVwiKTtcbmltcG9ydCBQYXJ0aWNsZVByb3BlcnRpZXNNb2RlXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9kYXRhL1BhcnRpY2xlUHJvcGVydGllc01vZGVcIik7XG5pbXBvcnQgUGFydGljbGVSb3RhdGVUb1Bvc2l0aW9uTm9kZVx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL25vZGVzL1BhcnRpY2xlUm90YXRlVG9Qb3NpdGlvbk5vZGVcIik7XG5pbXBvcnQgUGFydGljbGVTdGF0ZUJhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvc3RhdGVzL1BhcnRpY2xlU3RhdGVCYXNlXCIpO1xuaW1wb3J0IFJlbmRlcmFibGVCYXNlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9wb29sL1JlbmRlcmFibGVCYXNlXCIpO1xuXG4vKipcbiAqIC4uLlxuICovXG5jbGFzcyBQYXJ0aWNsZVJvdGF0ZVRvUG9zaXRpb25TdGF0ZSBleHRlbmRzIFBhcnRpY2xlU3RhdGVCYXNlXG57XG5cdC8qKiBAcHJpdmF0ZSAqL1xuXHRwdWJsaWMgc3RhdGljIE1BVFJJWF9JTkRFWDpudW1iZXIgLyppbnQqLyA9IDA7XG5cdC8qKiBAcHJpdmF0ZSAqL1xuXHRwdWJsaWMgc3RhdGljIFBPU0lUSU9OX0lOREVYOm51bWJlciAvKmludCovID0gMTtcblxuXHRwcml2YXRlIF9wYXJ0aWNsZVJvdGF0ZVRvUG9zaXRpb25Ob2RlOlBhcnRpY2xlUm90YXRlVG9Qb3NpdGlvbk5vZGU7XG5cdHByaXZhdGUgX3Bvc2l0aW9uOlZlY3RvcjNEO1xuXHRwcml2YXRlIF9tYXRyaXg6TWF0cml4M0QgPSBuZXcgTWF0cml4M0QoKTtcblx0cHJpdmF0ZSBfb2Zmc2V0OlZlY3RvcjNEO1xuXG5cdC8qKlxuXHQgKiBEZWZpbmVzIHRoZSBwb3NpdGlvbiBvZiB0aGUgcG9pbnQgdGhlIHBhcnRpY2xlIHdpbGwgcm90YXRlIHRvIGZhY2Ugd2hlbiBpbiBnbG9iYWwgbW9kZS4gRGVmYXVsdHMgdG8gMCwwLDAuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IHBvc2l0aW9uKCk6VmVjdG9yM0Rcblx0e1xuXHRcdHJldHVybiB0aGlzLl9wb3NpdGlvbjtcblx0fVxuXG5cdHB1YmxpYyBzZXQgcG9zaXRpb24odmFsdWU6VmVjdG9yM0QpXG5cdHtcblx0XHR0aGlzLl9wb3NpdGlvbiA9IHZhbHVlO1xuXHR9XG5cblx0Y29uc3RydWN0b3IoYW5pbWF0b3I6UGFydGljbGVBbmltYXRvciwgcGFydGljbGVSb3RhdGVUb1Bvc2l0aW9uTm9kZTpQYXJ0aWNsZVJvdGF0ZVRvUG9zaXRpb25Ob2RlKVxuXHR7XG5cdFx0c3VwZXIoYW5pbWF0b3IsIHBhcnRpY2xlUm90YXRlVG9Qb3NpdGlvbk5vZGUpO1xuXG5cdFx0dGhpcy5fcGFydGljbGVSb3RhdGVUb1Bvc2l0aW9uTm9kZSA9IHBhcnRpY2xlUm90YXRlVG9Qb3NpdGlvbk5vZGU7XG5cdFx0dGhpcy5fcG9zaXRpb24gPSB0aGlzLl9wYXJ0aWNsZVJvdGF0ZVRvUG9zaXRpb25Ob2RlLl9pUG9zaXRpb247XG5cdH1cblxuXHRwdWJsaWMgc2V0UmVuZGVyU3RhdGUoc3RhZ2U6U3RhZ2UsIHJlbmRlcmFibGU6UmVuZGVyYWJsZUJhc2UsIGFuaW1hdGlvblN1Ykdlb21ldHJ5OkFuaW1hdGlvblN1Ykdlb21ldHJ5LCBhbmltYXRpb25SZWdpc3RlckNhY2hlOkFuaW1hdGlvblJlZ2lzdGVyQ2FjaGUsIGNhbWVyYTpDYW1lcmEpXG5cdHtcblx0XHR2YXIgaW5kZXg6bnVtYmVyIC8qaW50Ki8gPSBhbmltYXRpb25SZWdpc3RlckNhY2hlLmdldFJlZ2lzdGVySW5kZXgodGhpcy5fcEFuaW1hdGlvbk5vZGUsIFBhcnRpY2xlUm90YXRlVG9Qb3NpdGlvblN0YXRlLlBPU0lUSU9OX0lOREVYKTtcblxuXHRcdGlmIChhbmltYXRpb25SZWdpc3RlckNhY2hlLmhhc0JpbGxib2FyZCkge1xuXHRcdFx0dGhpcy5fbWF0cml4LmNvcHlGcm9tKHJlbmRlcmFibGUuc291cmNlRW50aXR5LnNjZW5lVHJhbnNmb3JtKTtcblx0XHRcdHRoaXMuX21hdHJpeC5hcHBlbmQoY2FtZXJhLmludmVyc2VTY2VuZVRyYW5zZm9ybSk7XG5cdFx0XHRhbmltYXRpb25SZWdpc3RlckNhY2hlLnNldFZlcnRleENvbnN0RnJvbU1hdHJpeChhbmltYXRpb25SZWdpc3RlckNhY2hlLmdldFJlZ2lzdGVySW5kZXgodGhpcy5fcEFuaW1hdGlvbk5vZGUsIFBhcnRpY2xlUm90YXRlVG9Qb3NpdGlvblN0YXRlLk1BVFJJWF9JTkRFWCksIHRoaXMuX21hdHJpeCk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuX3BhcnRpY2xlUm90YXRlVG9Qb3NpdGlvbk5vZGUubW9kZSA9PSBQYXJ0aWNsZVByb3BlcnRpZXNNb2RlLkdMT0JBTCkge1xuXHRcdFx0dGhpcy5fb2Zmc2V0ID0gcmVuZGVyYWJsZS5zb3VyY2VFbnRpdHkuaW52ZXJzZVNjZW5lVHJhbnNmb3JtLnRyYW5zZm9ybVZlY3Rvcih0aGlzLl9wb3NpdGlvbik7XG5cdFx0XHRhbmltYXRpb25SZWdpc3RlckNhY2hlLnNldFZlcnRleENvbnN0KGluZGV4LCB0aGlzLl9vZmZzZXQueCwgdGhpcy5fb2Zmc2V0LnksIHRoaXMuX29mZnNldC56KTtcblx0XHR9IGVsc2Vcblx0XHRcdGFuaW1hdGlvblN1Ykdlb21ldHJ5LmFjdGl2YXRlVmVydGV4QnVmZmVyKGluZGV4LCB0aGlzLl9wYXJ0aWNsZVJvdGF0ZVRvUG9zaXRpb25Ob2RlLl9pRGF0YU9mZnNldCwgc3RhZ2UsIENvbnRleHRHTFZlcnRleEJ1ZmZlckZvcm1hdC5GTE9BVF8zKTtcblxuXHR9XG5cbn1cblxuZXhwb3J0ID0gUGFydGljbGVSb3RhdGVUb1Bvc2l0aW9uU3RhdGU7Il19