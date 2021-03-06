var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AnimationClipNodeBase = require("awayjs-renderergl/lib/animators/nodes/AnimationClipNodeBase");
var SkeletonClipState = require("awayjs-renderergl/lib/animators/states/SkeletonClipState");
/**
 * A skeleton animation node containing time-based animation data as individual skeleton poses.
 */
var SkeletonClipNode = (function (_super) {
    __extends(SkeletonClipNode, _super);
    /**
     * Creates a new <code>SkeletonClipNode</code> object.
     */
    function SkeletonClipNode() {
        _super.call(this);
        this._frames = new Array();
        /**
         * Determines whether to use SLERP equations (true) or LERP equations (false) in the calculation
         * of the output skeleton pose. Defaults to false.
         */
        this.highQuality = false;
        this._pStateClass = SkeletonClipState;
    }
    Object.defineProperty(SkeletonClipNode.prototype, "frames", {
        /**
         * Returns a vector of skeleton poses representing the pose of each animation frame in the clip.
         */
        get: function () {
            return this._frames;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Adds a skeleton pose frame to the internal timeline of the animation node.
     *
     * @param skeletonPose The skeleton pose object to add to the timeline of the node.
     * @param duration The specified duration of the frame in milliseconds.
     */
    SkeletonClipNode.prototype.addFrame = function (skeletonPose, duration /*number /*uint*/) {
        this._frames.push(skeletonPose);
        this._pDurations.push(duration);
        this._pNumFrames = this._pDurations.length;
        this._pStitchDirty = true;
    };
    /**
     * @inheritDoc
     */
    SkeletonClipNode.prototype.getAnimationState = function (animator) {
        return animator.getAnimationState(this);
    };
    /**
     * @inheritDoc
     */
    SkeletonClipNode.prototype._pUpdateStitch = function () {
        _super.prototype._pUpdateStitch.call(this);
        var i = this._pNumFrames - 1;
        var p1, p2, delta;
        while (i--) {
            this._pTotalDuration += this._pDurations[i];
            p1 = this._frames[i].jointPoses[0].translation;
            p2 = this._frames[i + 1].jointPoses[0].translation;
            delta = p2.subtract(p1);
            this._pTotalDelta.x += delta.x;
            this._pTotalDelta.y += delta.y;
            this._pTotalDelta.z += delta.z;
        }
        if (this._pStitchFinalFrame || !this._pLooping) {
            this._pTotalDuration += this._pDurations[this._pNumFrames - 1];
            p1 = this._frames[0].jointPoses[0].translation;
            p2 = this._frames[1].jointPoses[0].translation;
            delta = p2.subtract(p1);
            this._pTotalDelta.x += delta.x;
            this._pTotalDelta.y += delta.y;
            this._pTotalDelta.z += delta.z;
        }
    };
    return SkeletonClipNode;
})(AnimationClipNodeBase);
module.exports = SkeletonClipNode;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvbm9kZXMvc2tlbGV0b25jbGlwbm9kZS50cyJdLCJuYW1lcyI6WyJTa2VsZXRvbkNsaXBOb2RlIiwiU2tlbGV0b25DbGlwTm9kZS5jb25zdHJ1Y3RvciIsIlNrZWxldG9uQ2xpcE5vZGUuZnJhbWVzIiwiU2tlbGV0b25DbGlwTm9kZS5hZGRGcmFtZSIsIlNrZWxldG9uQ2xpcE5vZGUuZ2V0QW5pbWF0aW9uU3RhdGUiLCJTa2VsZXRvbkNsaXBOb2RlLl9wVXBkYXRlU3RpdGNoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFLQSxJQUFPLHFCQUFxQixXQUFhLDZEQUE2RCxDQUFDLENBQUM7QUFDeEcsSUFBTyxpQkFBaUIsV0FBYywwREFBMEQsQ0FBQyxDQUFDO0FBRWxHLEFBR0E7O0dBREc7SUFDRyxnQkFBZ0I7SUFBU0EsVUFBekJBLGdCQUFnQkEsVUFBOEJBO0lBa0JuREE7O09BRUdBO0lBQ0hBLFNBckJLQSxnQkFBZ0JBO1FBdUJwQkMsaUJBQU9BLENBQUNBO1FBckJEQSxZQUFPQSxHQUF1QkEsSUFBSUEsS0FBS0EsRUFBZ0JBLENBQUNBO1FBRWhFQTs7O1dBR0dBO1FBQ0lBLGdCQUFXQSxHQUFXQSxLQUFLQSxDQUFDQTtRQWlCbENBLElBQUlBLENBQUNBLFlBQVlBLEdBQUdBLGlCQUFpQkEsQ0FBQ0E7SUFDdkNBLENBQUNBO0lBYkRELHNCQUFXQSxvQ0FBTUE7UUFIakJBOztXQUVHQTthQUNIQTtZQUVDRSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQTtRQUNyQkEsQ0FBQ0E7OztPQUFBRjtJQVlEQTs7Ozs7T0FLR0E7SUFDSUEsbUNBQVFBLEdBQWZBLFVBQWdCQSxZQUF5QkEsRUFBRUEsUUFBUUEsQ0FBUUEsaUJBQURBLEFBQWtCQTtRQUUzRUcsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsQ0FBQ0E7UUFDaENBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBO1FBRWhDQSxJQUFJQSxDQUFDQSxXQUFXQSxHQUFHQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxNQUFNQSxDQUFDQTtRQUUzQ0EsSUFBSUEsQ0FBQ0EsYUFBYUEsR0FBR0EsSUFBSUEsQ0FBQ0E7SUFDM0JBLENBQUNBO0lBRURIOztPQUVHQTtJQUNJQSw0Q0FBaUJBLEdBQXhCQSxVQUF5QkEsUUFBcUJBO1FBRTdDSSxNQUFNQSxDQUFxQkEsUUFBUUEsQ0FBQ0EsaUJBQWlCQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtJQUM3REEsQ0FBQ0E7SUFFREo7O09BRUdBO0lBQ0lBLHlDQUFjQSxHQUFyQkE7UUFFQ0ssZ0JBQUtBLENBQUNBLGNBQWNBLFdBQUVBLENBQUNBO1FBRXZCQSxJQUFJQSxDQUFDQSxHQUFtQkEsSUFBSUEsQ0FBQ0EsV0FBV0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFDN0NBLElBQUlBLEVBQVdBLEVBQUVBLEVBQVdBLEVBQUVBLEtBQWNBLENBQUNBO1FBQzdDQSxPQUFPQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtZQUNaQSxJQUFJQSxDQUFDQSxlQUFlQSxJQUFJQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUM1Q0EsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsV0FBV0EsQ0FBQ0E7WUFDL0NBLEVBQUVBLEdBQUdBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLFdBQVdBLENBQUNBO1lBQ25EQSxLQUFLQSxHQUFHQSxFQUFFQSxDQUFDQSxRQUFRQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQTtZQUN4QkEsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDL0JBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLENBQUNBLElBQUlBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBO1lBQy9CQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxDQUFDQSxJQUFJQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUNoQ0EsQ0FBQ0E7UUFFREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0Esa0JBQWtCQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNoREEsSUFBSUEsQ0FBQ0EsZUFBZUEsSUFBSUEsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsV0FBV0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDL0RBLEVBQUVBLEdBQUdBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLFdBQVdBLENBQUNBO1lBQy9DQSxFQUFFQSxHQUFHQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxXQUFXQSxDQUFDQTtZQUMvQ0EsS0FBS0EsR0FBR0EsRUFBRUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0E7WUFDeEJBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLENBQUNBLElBQUlBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBO1lBQy9CQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxDQUFDQSxJQUFJQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUMvQkEsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDaENBLENBQUNBO0lBQ0ZBLENBQUNBO0lBQ0ZMLHVCQUFDQTtBQUFEQSxDQWpGQSxBQWlGQ0EsRUFqRjhCLHFCQUFxQixFQWlGbkQ7QUFFRCxBQUEwQixpQkFBakIsZ0JBQWdCLENBQUMiLCJmaWxlIjoiYW5pbWF0b3JzL25vZGVzL1NrZWxldG9uQ2xpcE5vZGUuanMiLCJzb3VyY2VSb290IjoiLi4vIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFZlY3RvcjNEXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9WZWN0b3IzRFwiKTtcblxuaW1wb3J0IEFuaW1hdG9yQmFzZVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9hbmltYXRvcnMvQW5pbWF0b3JCYXNlXCIpO1xuXG5pbXBvcnQgU2tlbGV0b25Qb3NlXHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9kYXRhL1NrZWxldG9uUG9zZVwiKTtcbmltcG9ydCBBbmltYXRpb25DbGlwTm9kZUJhc2VcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvYW5pbWF0b3JzL25vZGVzL0FuaW1hdGlvbkNsaXBOb2RlQmFzZVwiKTtcbmltcG9ydCBTa2VsZXRvbkNsaXBTdGF0ZVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL2FuaW1hdG9ycy9zdGF0ZXMvU2tlbGV0b25DbGlwU3RhdGVcIik7XG5cbi8qKlxuICogQSBza2VsZXRvbiBhbmltYXRpb24gbm9kZSBjb250YWluaW5nIHRpbWUtYmFzZWQgYW5pbWF0aW9uIGRhdGEgYXMgaW5kaXZpZHVhbCBza2VsZXRvbiBwb3Nlcy5cbiAqL1xuY2xhc3MgU2tlbGV0b25DbGlwTm9kZSBleHRlbmRzIEFuaW1hdGlvbkNsaXBOb2RlQmFzZVxue1xuXHRwcml2YXRlIF9mcmFtZXM6QXJyYXk8U2tlbGV0b25Qb3NlPiA9IG5ldyBBcnJheTxTa2VsZXRvblBvc2U+KCk7XG5cblx0LyoqXG5cdCAqIERldGVybWluZXMgd2hldGhlciB0byB1c2UgU0xFUlAgZXF1YXRpb25zICh0cnVlKSBvciBMRVJQIGVxdWF0aW9ucyAoZmFsc2UpIGluIHRoZSBjYWxjdWxhdGlvblxuXHQgKiBvZiB0aGUgb3V0cHV0IHNrZWxldG9uIHBvc2UuIERlZmF1bHRzIHRvIGZhbHNlLlxuXHQgKi9cblx0cHVibGljIGhpZ2hRdWFsaXR5OmJvb2xlYW4gPSBmYWxzZTtcblxuXHQvKipcblx0ICogUmV0dXJucyBhIHZlY3RvciBvZiBza2VsZXRvbiBwb3NlcyByZXByZXNlbnRpbmcgdGhlIHBvc2Ugb2YgZWFjaCBhbmltYXRpb24gZnJhbWUgaW4gdGhlIGNsaXAuXG5cdCAqL1xuXHRwdWJsaWMgZ2V0IGZyYW1lcygpOkFycmF5PFNrZWxldG9uUG9zZT5cblx0e1xuXHRcdHJldHVybiB0aGlzLl9mcmFtZXM7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyA8Y29kZT5Ta2VsZXRvbkNsaXBOb2RlPC9jb2RlPiBvYmplY3QuXG5cdCAqL1xuXHRjb25zdHJ1Y3RvcigpXG5cdHtcblx0XHRzdXBlcigpO1xuXG5cdFx0dGhpcy5fcFN0YXRlQ2xhc3MgPSBTa2VsZXRvbkNsaXBTdGF0ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBBZGRzIGEgc2tlbGV0b24gcG9zZSBmcmFtZSB0byB0aGUgaW50ZXJuYWwgdGltZWxpbmUgb2YgdGhlIGFuaW1hdGlvbiBub2RlLlxuXHQgKlxuXHQgKiBAcGFyYW0gc2tlbGV0b25Qb3NlIFRoZSBza2VsZXRvbiBwb3NlIG9iamVjdCB0byBhZGQgdG8gdGhlIHRpbWVsaW5lIG9mIHRoZSBub2RlLlxuXHQgKiBAcGFyYW0gZHVyYXRpb24gVGhlIHNwZWNpZmllZCBkdXJhdGlvbiBvZiB0aGUgZnJhbWUgaW4gbWlsbGlzZWNvbmRzLlxuXHQgKi9cblx0cHVibGljIGFkZEZyYW1lKHNrZWxldG9uUG9zZTpTa2VsZXRvblBvc2UsIGR1cmF0aW9uOm51bWJlciAvKm51bWJlciAvKnVpbnQqLylcblx0e1xuXHRcdHRoaXMuX2ZyYW1lcy5wdXNoKHNrZWxldG9uUG9zZSk7XG5cdFx0dGhpcy5fcER1cmF0aW9ucy5wdXNoKGR1cmF0aW9uKTtcblxuXHRcdHRoaXMuX3BOdW1GcmFtZXMgPSB0aGlzLl9wRHVyYXRpb25zLmxlbmd0aDtcblxuXHRcdHRoaXMuX3BTdGl0Y2hEaXJ0eSA9IHRydWU7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBnZXRBbmltYXRpb25TdGF0ZShhbmltYXRvcjpBbmltYXRvckJhc2UpOlNrZWxldG9uQ2xpcFN0YXRlXG5cdHtcblx0XHRyZXR1cm4gPFNrZWxldG9uQ2xpcFN0YXRlPiBhbmltYXRvci5nZXRBbmltYXRpb25TdGF0ZSh0aGlzKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIF9wVXBkYXRlU3RpdGNoKClcblx0e1xuXHRcdHN1cGVyLl9wVXBkYXRlU3RpdGNoKCk7XG5cblx0XHR2YXIgaTpudW1iZXIgLyp1aW50Ki8gPSB0aGlzLl9wTnVtRnJhbWVzIC0gMTtcblx0XHR2YXIgcDE6VmVjdG9yM0QsIHAyOlZlY3RvcjNELCBkZWx0YTpWZWN0b3IzRDtcblx0XHR3aGlsZSAoaS0tKSB7XG5cdFx0XHR0aGlzLl9wVG90YWxEdXJhdGlvbiArPSB0aGlzLl9wRHVyYXRpb25zW2ldO1xuXHRcdFx0cDEgPSB0aGlzLl9mcmFtZXNbaV0uam9pbnRQb3Nlc1swXS50cmFuc2xhdGlvbjtcblx0XHRcdHAyID0gdGhpcy5fZnJhbWVzW2kgKyAxXS5qb2ludFBvc2VzWzBdLnRyYW5zbGF0aW9uO1xuXHRcdFx0ZGVsdGEgPSBwMi5zdWJ0cmFjdChwMSk7XG5cdFx0XHR0aGlzLl9wVG90YWxEZWx0YS54ICs9IGRlbHRhLng7XG5cdFx0XHR0aGlzLl9wVG90YWxEZWx0YS55ICs9IGRlbHRhLnk7XG5cdFx0XHR0aGlzLl9wVG90YWxEZWx0YS56ICs9IGRlbHRhLno7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuX3BTdGl0Y2hGaW5hbEZyYW1lIHx8ICF0aGlzLl9wTG9vcGluZykge1xuXHRcdFx0dGhpcy5fcFRvdGFsRHVyYXRpb24gKz0gdGhpcy5fcER1cmF0aW9uc1t0aGlzLl9wTnVtRnJhbWVzIC0gMV07XG5cdFx0XHRwMSA9IHRoaXMuX2ZyYW1lc1swXS5qb2ludFBvc2VzWzBdLnRyYW5zbGF0aW9uO1xuXHRcdFx0cDIgPSB0aGlzLl9mcmFtZXNbMV0uam9pbnRQb3Nlc1swXS50cmFuc2xhdGlvbjtcblx0XHRcdGRlbHRhID0gcDIuc3VidHJhY3QocDEpO1xuXHRcdFx0dGhpcy5fcFRvdGFsRGVsdGEueCArPSBkZWx0YS54O1xuXHRcdFx0dGhpcy5fcFRvdGFsRGVsdGEueSArPSBkZWx0YS55O1xuXHRcdFx0dGhpcy5fcFRvdGFsRGVsdGEueiArPSBkZWx0YS56O1xuXHRcdH1cblx0fVxufVxuXG5leHBvcnQgPSBTa2VsZXRvbkNsaXBOb2RlOyJdfQ==