var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Quaternion = require("awayjs-core/lib/geom/Quaternion");
var JointPose = require("awayjs-renderergl/lib/animators/data/JointPose");
var SkeletonPose = require("awayjs-renderergl/lib/animators/data/SkeletonPose");
var AnimationStateBase = require("awayjs-renderergl/lib/animators/states/AnimationStateBase");
/**
 *
 */
var SkeletonDifferenceState = (function (_super) {
    __extends(SkeletonDifferenceState, _super);
    function SkeletonDifferenceState(animator, skeletonAnimationNode) {
        _super.call(this, animator, skeletonAnimationNode);
        this._blendWeight = 0;
        this._skeletonPose = new SkeletonPose();
        this._skeletonPoseDirty = true;
        this._skeletonAnimationNode = skeletonAnimationNode;
        this._baseInput = animator.getAnimationState(this._skeletonAnimationNode.baseInput);
        this._differenceInput = animator.getAnimationState(this._skeletonAnimationNode.differenceInput);
    }
    Object.defineProperty(SkeletonDifferenceState.prototype, "blendWeight", {
        /**
         * Defines a fractional value between 0 and 1 representing the blending ratio between the base input (0) and difference input (1),
         * used to produce the skeleton pose output.
         *
         * @see #baseInput
         * @see #differenceInput
         */
        get: function () {
            return this._blendWeight;
        },
        set: function (value) {
            this._blendWeight = value;
            this._pPositionDeltaDirty = true;
            this._skeletonPoseDirty = true;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    SkeletonDifferenceState.prototype.phase = function (value) {
        this._skeletonPoseDirty = true;
        this._pPositionDeltaDirty = true;
        this._baseInput.phase(value);
        this._baseInput.phase(value);
    };
    /**
     * @inheritDoc
     */
    SkeletonDifferenceState.prototype._pUpdateTime = function (time /*int*/) {
        this._skeletonPoseDirty = true;
        this._baseInput.update(time);
        this._differenceInput.update(time);
        _super.prototype._pUpdateTime.call(this, time);
    };
    /**
     * Returns the current skeleton pose of the animation in the clip based on the internal playhead position.
     */
    SkeletonDifferenceState.prototype.getSkeletonPose = function (skeleton) {
        if (this._skeletonPoseDirty)
            this.updateSkeletonPose(skeleton);
        return this._skeletonPose;
    };
    /**
     * @inheritDoc
     */
    SkeletonDifferenceState.prototype._pUpdatePositionDelta = function () {
        this._pPositionDeltaDirty = false;
        var deltA = this._baseInput.positionDelta;
        var deltB = this._differenceInput.positionDelta;
        this.positionDelta.x = deltA.x + this._blendWeight * deltB.x;
        this.positionDelta.y = deltA.y + this._blendWeight * deltB.y;
        this.positionDelta.z = deltA.z + this._blendWeight * deltB.z;
    };
    /**
     * Updates the output skeleton pose of the node based on the blendWeight value between base input and difference input nodes.
     *
     * @param skeleton The skeleton used by the animator requesting the ouput pose.
     */
    SkeletonDifferenceState.prototype.updateSkeletonPose = function (skeleton) {
        this._skeletonPoseDirty = false;
        var endPose;
        var endPoses = this._skeletonPose.jointPoses;
        var basePoses = this._baseInput.getSkeletonPose(skeleton).jointPoses;
        var diffPoses = this._differenceInput.getSkeletonPose(skeleton).jointPoses;
        var base, diff;
        var basePos, diffPos;
        var tr;
        var numJoints = skeleton.numJoints;
        // :s
        if (endPoses.length != numJoints)
            endPoses.length = numJoints;
        for (var i = 0; i < numJoints; ++i) {
            endPose = endPoses[i];
            if (endPose == null)
                endPose = endPoses[i] = new JointPose();
            base = basePoses[i];
            diff = diffPoses[i];
            basePos = base.translation;
            diffPos = diff.translation;
            SkeletonDifferenceState._tempQuat.multiply(diff.orientation, base.orientation);
            endPose.orientation.lerp(base.orientation, SkeletonDifferenceState._tempQuat, this._blendWeight);
            tr = endPose.translation;
            tr.x = basePos.x + this._blendWeight * diffPos.x;
            tr.y = basePos.y + this._blendWeight * diffPos.y;
            tr.z = basePos.z + this._blendWeight * diffPos.z;
        }
    };
    SkeletonDifferenceState._tempQuat = new Quaternion();
    return SkeletonDifferenceState;
})(AnimationStateBase);
module.exports = SkeletonDifferenceState;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvc3RhdGVzL3NrZWxldG9uZGlmZmVyZW5jZXN0YXRlLnRzIl0sIm5hbWVzIjpbIlNrZWxldG9uRGlmZmVyZW5jZVN0YXRlIiwiU2tlbGV0b25EaWZmZXJlbmNlU3RhdGUuY29uc3RydWN0b3IiLCJTa2VsZXRvbkRpZmZlcmVuY2VTdGF0ZS5ibGVuZFdlaWdodCIsIlNrZWxldG9uRGlmZmVyZW5jZVN0YXRlLnBoYXNlIiwiU2tlbGV0b25EaWZmZXJlbmNlU3RhdGUuX3BVcGRhdGVUaW1lIiwiU2tlbGV0b25EaWZmZXJlbmNlU3RhdGUuZ2V0U2tlbGV0b25Qb3NlIiwiU2tlbGV0b25EaWZmZXJlbmNlU3RhdGUuX3BVcGRhdGVQb3NpdGlvbkRlbHRhIiwiU2tlbGV0b25EaWZmZXJlbmNlU3RhdGUudXBkYXRlU2tlbGV0b25Qb3NlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFPLFVBQVUsV0FBZ0IsaUNBQWlDLENBQUMsQ0FBQztBQUlwRSxJQUFPLFNBQVMsV0FBZ0IsZ0RBQWdELENBQUMsQ0FBQztBQUVsRixJQUFPLFlBQVksV0FBZ0IsbURBQW1ELENBQUMsQ0FBQztBQUV4RixJQUFPLGtCQUFrQixXQUFjLDJEQUEyRCxDQUFDLENBQUM7QUFHcEcsQUFHQTs7R0FERztJQUNHLHVCQUF1QjtJQUFTQSxVQUFoQ0EsdUJBQXVCQSxVQUEyQkE7SUE4QnZEQSxTQTlCS0EsdUJBQXVCQSxDQThCaEJBLFFBQXFCQSxFQUFFQSxxQkFBNENBO1FBRTlFQyxrQkFBTUEsUUFBUUEsRUFBRUEscUJBQXFCQSxDQUFDQSxDQUFDQTtRQTlCaENBLGlCQUFZQSxHQUFVQSxDQUFDQSxDQUFDQTtRQUd4QkEsa0JBQWFBLEdBQWdCQSxJQUFJQSxZQUFZQSxFQUFFQSxDQUFDQTtRQUNoREEsdUJBQWtCQSxHQUFXQSxJQUFJQSxDQUFDQTtRQTRCekNBLElBQUlBLENBQUNBLHNCQUFzQkEsR0FBR0EscUJBQXFCQSxDQUFDQTtR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QUFzSUNBLEVBdElxQyxrQkFBa0IsRUFzSXZEO0FBRUQsQUFBaUMsaUJBQXhCLHVCQUF1QixDQUFDIiwiZmlsZSI6ImFuaW1hdG9ycy9zdGF0ZXMvU2tlbGV0b25EaWZmZXJlbmNlU3RhdGUuanMiLCJzb3VyY2VSb290IjoiLi4vIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFF1YXRlcm5pb25cdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9RdWF0ZXJuaW9uXCIpO1xuaW1wb3J0IFZlY3RvcjNEXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9WZWN0b3IzRFwiKTtcblxuaW1wb3J0IEFuaW1hdG9yQmFzZVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvQW5pbWF0b3JCYXNlXCIpO1xuaW1wb3J0IEpvaW50UG9zZVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvZGF0YS9Kb2ludFBvc2VcIik7XG5pbXBvcnQgU2tlbGV0b25cdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvZGF0YS9Ta2VsZXRvblwiKTtcbmltcG9ydCBTa2VsZXRvblBvc2VcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL2RhdGEvU2tlbGV0b25Qb3NlXCIpO1xuaW1wb3J0IFNrZWxldG9uRGlmZmVyZW5jZU5vZGVcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL25vZGVzL1NrZWxldG9uRGlmZmVyZW5jZU5vZGVcIik7XG5pbXBvcnQgQW5pbWF0aW9uU3RhdGVCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL3N0YXRlcy9BbmltYXRpb25TdGF0ZUJhc2VcIik7XG5pbXBvcnQgSVNrZWxldG9uQW5pbWF0aW9uU3RhdGVcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL3N0YXRlcy9JU2tlbGV0b25BbmltYXRpb25TdGF0ZVwiKTtcblxuLyoqXG4gKlxuICovXG5jbGFzcyBTa2VsZXRvbkRpZmZlcmVuY2VTdGF0ZSBleHRlbmRzIEFuaW1hdGlvblN0YXRlQmFzZSBpbXBsZW1lbnRzIElTa2VsZXRvbkFuaW1hdGlvblN0YXRlXG57XG5cdHByaXZhdGUgX2JsZW5kV2VpZ2h0Om51bWJlciA9IDA7XG5cdHByaXZhdGUgc3RhdGljIF90ZW1wUXVhdDpRdWF0ZXJuaW9uID0gbmV3IFF1YXRlcm5pb24oKTtcblx0cHJpdmF0ZSBfc2tlbGV0b25BbmltYXRpb25Ob2RlOlNrZWxldG9uRGlmZmVyZW5jZU5vZGU7XG5cdHByaXZhdGUgX3NrZWxldG9uUG9zZTpTa2VsZXRvblBvc2UgPSBuZXcgU2tlbGV0b25Qb3NlKCk7XG5cdHByaXZhdGUgX3NrZWxldG9uUG9zZURpcnR5OmJvb2xlYW4gPSB0cnVlO1xuXHRwcml2YXRlIF9iYXNlSW5wdXQ6SVNrZWxldG9uQW5pbWF0aW9uU3RhdGU7XG5cdHByaXZhdGUgX2RpZmZlcmVuY2VJbnB1dDpJU2tlbGV0b25BbmltYXRpb25TdGF0ZTtcblxuXHQvKipcblx0ICogRGVmaW5lcyBhIGZyYWN0aW9uYWwgdmFsdWUgYmV0d2VlbiAwIGFuZCAxIHJlcHJlc2VudGluZyB0aGUgYmxlbmRpbmcgcmF0aW8gYmV0d2VlbiB0aGUgYmFzZSBpbnB1dCAoMCkgYW5kIGRpZmZlcmVuY2UgaW5wdXQgKDEpLFxuXHQgKiB1c2VkIHRvIHByb2R1Y2UgdGhlIHNrZWxldG9uIHBvc2Ugb3V0cHV0LlxuXHQgKlxuXHQgKiBAc2VlICNiYXNlSW5wdXRcblx0ICogQHNlZSAjZGlmZmVyZW5jZUlucHV0XG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGJsZW5kV2VpZ2h0KCk6bnVtYmVyXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fYmxlbmRXZWlnaHQ7XG5cdH1cblxuXHRwdWJsaWMgc2V0IGJsZW5kV2VpZ2h0KHZhbHVlOm51bWJlcilcblx0e1xuXHRcdHRoaXMuX2JsZW5kV2VpZ2h0ID0gdmFsdWU7XG5cblx0XHR0aGlzLl9wUG9zaXRpb25EZWx0YURpcnR5ID0gdHJ1ZTtcblx0XHR0aGlzLl9za2VsZXRvblBvc2VEaXJ0eSA9IHRydWU7XG5cdH1cblxuXHRjb25zdHJ1Y3RvcihhbmltYXRvcjpBbmltYXRvckJhc2UsIHNrZWxldG9uQW5pbWF0aW9uTm9kZTpTa2VsZXRvbkRpZmZlcmVuY2VOb2RlKVxuXHR7XG5cdFx0c3VwZXIoYW5pbWF0b3IsIHNrZWxldG9uQW5pbWF0aW9uTm9kZSk7XG5cblx0XHR0aGlzLl9za2VsZXRvbkFuaW1hdGlvbk5vZGUgPSBza2VsZXRvbkFuaW1hdGlvbk5vZGU7XG5cblx0XHR0aGlzLl9iYXNlSW5wdXQgPSA8SVNrZWxldG9uQW5pbWF0aW9uU3RhdGU+IGFuaW1hdG9yLmdldEFuaW1hdGlvblN0YXRlKHRoaXMuX3NrZWxldG9uQW5pbWF0aW9uTm9kZS5iYXNlSW5wdXQpO1xuXHRcdHRoaXMuX2RpZmZlcmVuY2VJbnB1dCA9IDxJU2tlbGV0b25BbmltYXRpb25TdGF0ZT4gYW5pbWF0b3IuZ2V0QW5pbWF0aW9uU3RhdGUodGhpcy5fc2tlbGV0b25BbmltYXRpb25Ob2RlLmRpZmZlcmVuY2VJbnB1dCk7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBwaGFzZSh2YWx1ZTpudW1iZXIpXG5cdHtcblx0XHR0aGlzLl9za2VsZXRvblBvc2VEaXJ0eSA9IHRydWU7XG5cblx0XHR0aGlzLl9wUG9zaXRpb25EZWx0YURpcnR5ID0gdHJ1ZTtcblxuXHRcdHRoaXMuX2Jhc2VJbnB1dC5waGFzZSh2YWx1ZSk7XG5cdFx0dGhpcy5fYmFzZUlucHV0LnBoYXNlKHZhbHVlKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIF9wVXBkYXRlVGltZSh0aW1lOm51bWJlciAvKmludCovKVxuXHR7XG5cdFx0dGhpcy5fc2tlbGV0b25Qb3NlRGlydHkgPSB0cnVlO1xuXG5cdFx0dGhpcy5fYmFzZUlucHV0LnVwZGF0ZSh0aW1lKTtcblx0XHR0aGlzLl9kaWZmZXJlbmNlSW5wdXQudXBkYXRlKHRpbWUpO1xuXG5cdFx0c3VwZXIuX3BVcGRhdGVUaW1lKHRpbWUpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIGN1cnJlbnQgc2tlbGV0b24gcG9zZSBvZiB0aGUgYW5pbWF0aW9uIGluIHRoZSBjbGlwIGJhc2VkIG9uIHRoZSBpbnRlcm5hbCBwbGF5aGVhZCBwb3NpdGlvbi5cblx0ICovXG5cdHB1YmxpYyBnZXRTa2VsZXRvblBvc2Uoc2tlbGV0b246U2tlbGV0b24pOlNrZWxldG9uUG9zZVxuXHR7XG5cdFx0aWYgKHRoaXMuX3NrZWxldG9uUG9zZURpcnR5KVxuXHRcdFx0dGhpcy51cGRhdGVTa2VsZXRvblBvc2Uoc2tlbGV0b24pO1xuXG5cdFx0cmV0dXJuIHRoaXMuX3NrZWxldG9uUG9zZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIF9wVXBkYXRlUG9zaXRpb25EZWx0YSgpXG5cdHtcblx0XHR0aGlzLl9wUG9zaXRpb25EZWx0YURpcnR5ID0gZmFsc2U7XG5cblx0XHR2YXIgZGVsdEE6VmVjdG9yM0QgPSB0aGlzLl9iYXNlSW5wdXQucG9zaXRpb25EZWx0YTtcblx0XHR2YXIgZGVsdEI6VmVjdG9yM0QgPSB0aGlzLl9kaWZmZXJlbmNlSW5wdXQucG9zaXRpb25EZWx0YTtcblxuXHRcdHRoaXMucG9zaXRpb25EZWx0YS54ID0gZGVsdEEueCArIHRoaXMuX2JsZW5kV2VpZ2h0KmRlbHRCLng7XG5cdFx0dGhpcy5wb3NpdGlvbkRlbHRhLnkgPSBkZWx0QS55ICsgdGhpcy5fYmxlbmRXZWlnaHQqZGVsdEIueTtcblx0XHR0aGlzLnBvc2l0aW9uRGVsdGEueiA9IGRlbHRBLnogKyB0aGlzLl9ibGVuZFdlaWdodCpkZWx0Qi56O1xuXHR9XG5cblx0LyoqXG5cdCAqIFVwZGF0ZXMgdGhlIG91dHB1dCBza2VsZXRvbiBwb3NlIG9mIHRoZSBub2RlIGJhc2VkIG9uIHRoZSBibGVuZFdlaWdodCB2YWx1ZSBiZXR3ZWVuIGJhc2UgaW5wdXQgYW5kIGRpZmZlcmVuY2UgaW5wdXQgbm9kZXMuXG5cdCAqXG5cdCAqIEBwYXJhbSBza2VsZXRvbiBUaGUgc2tlbGV0b24gdXNlZCBieSB0aGUgYW5pbWF0b3IgcmVxdWVzdGluZyB0aGUgb3VwdXQgcG9zZS5cblx0ICovXG5cdHByaXZhdGUgdXBkYXRlU2tlbGV0b25Qb3NlKHNrZWxldG9uOlNrZWxldG9uKVxuXHR7XG5cdFx0dGhpcy5fc2tlbGV0b25Qb3NlRGlydHkgPSBmYWxzZTtcblxuXHRcdHZhciBlbmRQb3NlOkpvaW50UG9zZTtcblx0XHR2YXIgZW5kUG9zZXM6QXJyYXk8Sm9pbnRQb3NlPiA9IHRoaXMuX3NrZWxldG9uUG9zZS5qb2ludFBvc2VzO1xuXHRcdHZhciBiYXNlUG9zZXM6QXJyYXk8Sm9pbnRQb3NlPiA9IHRoaXMuX2Jhc2VJbnB1dC5nZXRTa2VsZXRvblBvc2Uoc2tlbGV0b24pLmpvaW50UG9zZXM7XG5cdFx0dmFyIGRpZmZQb3NlczpBcnJheTxKb2ludFBvc2U+ID0gdGhpcy5fZGlmZmVyZW5jZUlucHV0LmdldFNrZWxldG9uUG9zZShza2VsZXRvbikuam9pbnRQb3Nlcztcblx0XHR2YXIgYmFzZTpKb2ludFBvc2UsIGRpZmY6Sm9pbnRQb3NlO1xuXHRcdHZhciBiYXNlUG9zOlZlY3RvcjNELCBkaWZmUG9zOlZlY3RvcjNEO1xuXHRcdHZhciB0cjpWZWN0b3IzRDtcblx0XHR2YXIgbnVtSm9pbnRzOm51bWJlciAvKnVpbnQqLyA9IHNrZWxldG9uLm51bUpvaW50cztcblxuXHRcdC8vIDpzXG5cdFx0aWYgKGVuZFBvc2VzLmxlbmd0aCAhPSBudW1Kb2ludHMpXG5cdFx0XHRlbmRQb3Nlcy5sZW5ndGggPSBudW1Kb2ludHM7XG5cblx0XHRmb3IgKHZhciBpOm51bWJlciAvKnVpbnQqLyA9IDA7IGkgPCBudW1Kb2ludHM7ICsraSkge1xuXHRcdFx0ZW5kUG9zZSA9IGVuZFBvc2VzW2ldO1xuXG5cdFx0XHRpZiAoZW5kUG9zZSA9PSBudWxsKVxuXHRcdFx0XHRlbmRQb3NlID0gZW5kUG9zZXNbaV0gPSBuZXcgSm9pbnRQb3NlKCk7XG5cblx0XHRcdGJhc2UgPSBiYXNlUG9zZXNbaV07XG5cdFx0XHRkaWZmID0gZGlmZlBvc2VzW2ldO1xuXHRcdFx0YmFzZVBvcyA9IGJhc2UudHJhbnNsYXRpb247XG5cdFx0XHRkaWZmUG9zID0gZGlmZi50cmFuc2xhdGlvbjtcblxuXHRcdFx0U2tlbGV0b25EaWZmZXJlbmNlU3RhdGUuX3RlbXBRdWF0Lm11bHRpcGx5KGRpZmYub3JpZW50YXRpb24sIGJhc2Uub3JpZW50YXRpb24pO1xuXHRcdFx0ZW5kUG9zZS5vcmllbnRhdGlvbi5sZXJwKGJhc2Uub3JpZW50YXRpb24sIFNrZWxldG9uRGlmZmVyZW5jZVN0YXRlLl90ZW1wUXVhdCwgdGhpcy5fYmxlbmRXZWlnaHQpO1xuXG5cdFx0XHR0ciA9IGVuZFBvc2UudHJhbnNsYXRpb247XG5cdFx0XHR0ci54ID0gYmFzZVBvcy54ICsgdGhpcy5fYmxlbmRXZWlnaHQqZGlmZlBvcy54O1xuXHRcdFx0dHIueSA9IGJhc2VQb3MueSArIHRoaXMuX2JsZW5kV2VpZ2h0KmRpZmZQb3MueTtcblx0XHRcdHRyLnogPSBiYXNlUG9zLnogKyB0aGlzLl9ibGVuZFdlaWdodCpkaWZmUG9zLno7XG5cdFx0fVxuXHR9XG59XG5cbmV4cG9ydCA9IFNrZWxldG9uRGlmZmVyZW5jZVN0YXRlOyJdfQ==