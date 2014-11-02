var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var EffectMethodBase = require("awayjs-renderergl/lib/materials/methods/EffectMethodBase");
/**
 * EffectColorTransformMethod provides a shading method that changes the colour of a material analogous to a
 * ColorTransform object.
 */
var EffectColorTransformMethod = (function (_super) {
    __extends(EffectColorTransformMethod, _super);
    /**
     * Creates a new EffectColorTransformMethod.
     */
    function EffectColorTransformMethod() {
        _super.call(this);
    }
    Object.defineProperty(EffectColorTransformMethod.prototype, "colorTransform", {
        /**
         * The ColorTransform object to transform the colour of the material with.
         */
        get: function () {
            return this._colorTransform;
        },
        set: function (value) {
            this._colorTransform = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    EffectColorTransformMethod.prototype.iGetFragmentCode = function (shaderObject, methodVO, targetReg, registerCache, sharedRegisters) {
        var code = "";
        var colorMultReg = registerCache.getFreeFragmentConstant();
        var colorOffsReg = registerCache.getFreeFragmentConstant();
        methodVO.fragmentConstantsIndex = colorMultReg.index * 4;
        //TODO: AGAL <> GLSL
        code += "mul " + targetReg + ", " + targetReg + ", " + colorMultReg + "\n" + "add " + targetReg + ", " + targetReg + ", " + colorOffsReg + "\n";
        return code;
    };
    /**
     * @inheritDoc
     */
    EffectColorTransformMethod.prototype.iActivate = function (shaderObject, methodVO, stage) {
        var inv = 1 / 0xff;
        var index = methodVO.fragmentConstantsIndex;
        var data = shaderObject.fragmentConstantData;
        data[index] = this._colorTransform.redMultiplier;
        data[index + 1] = this._colorTransform.greenMultiplier;
        data[index + 2] = this._colorTransform.blueMultiplier;
        data[index + 3] = this._colorTransform.alphaMultiplier;
        data[index + 4] = this._colorTransform.redOffset * inv;
        data[index + 5] = this._colorTransform.greenOffset * inv;
        data[index + 6] = this._colorTransform.blueOffset * inv;
        data[index + 7] = this._colorTransform.alphaOffset * inv;
    };
    return EffectColorTransformMethod;
})(EffectMethodBase);
module.exports = EffectColorTransformMethod;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvbWV0aG9kcy9lZmZlY3Rjb2xvcnRyYW5zZm9ybW1ldGhvZC50cyJdLCJuYW1lcyI6WyJFZmZlY3RDb2xvclRyYW5zZm9ybU1ldGhvZCIsIkVmZmVjdENvbG9yVHJhbnNmb3JtTWV0aG9kLmNvbnN0cnVjdG9yIiwiRWZmZWN0Q29sb3JUcmFuc2Zvcm1NZXRob2QuY29sb3JUcmFuc2Zvcm0iLCJFZmZlY3RDb2xvclRyYW5zZm9ybU1ldGhvZC5pR2V0RnJhZ21lbnRDb2RlIiwiRWZmZWN0Q29sb3JUcmFuc2Zvcm1NZXRob2QuaUFjdGl2YXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFTQSxJQUFPLGdCQUFnQixXQUFjLDBEQUEwRCxDQUFDLENBQUM7QUFFakcsQUFJQTs7O0dBREc7SUFDRywwQkFBMEI7SUFBU0EsVUFBbkNBLDBCQUEwQkEsVUFBeUJBO0lBSXhEQTs7T0FFR0E7SUFDSEEsU0FQS0EsMEJBQTBCQTtRQVM5QkMsaUJBQU9BLENBQUNBO0lBQ1RBLENBQUNBO0lBS0RELHNCQUFXQSxzREFBY0E7UUFIekJBOztXQUVHQTthQUNIQTtZQUVDRSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQTtRQUM3QkEsQ0FBQ0E7YUFFREYsVUFBMEJBLEtBQW9CQTtZQUU3Q0UsSUFBSUEsQ0FBQ0EsZUFBZUEsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFDOUJBLENBQUNBOzs7T0FMQUY7SUFPREE7O09BRUdBO0lBQ0lBLHFEQUFnQkEsR0FBdkJBLFVBQXdCQSxZQUE2QkEsRUFBRUEsUUFBaUJBLEVBQUVBLFNBQStCQSxFQUFFQSxhQUFpQ0EsRUFBRUEsZUFBa0NBO1FBRS9LRyxJQUFJQSxJQUFJQSxHQUFVQSxFQUFFQSxDQUFDQTtRQUNyQkEsSUFBSUEsWUFBWUEsR0FBeUJBLGFBQWFBLENBQUNBLHVCQUF1QkEsRUFBRUEsQ0FBQ0E7UUFDakZBLElBQUlBLFlBQVlBLEdBQXlCQSxhQUFhQSxDQUFDQSx1QkFBdUJBLEVBQUVBLENBQUNBO1FBRWpGQSxRQUFRQSxDQUFDQSxzQkFBc0JBLEdBQUdBLFlBQVlBLENBQUNBLEtBQUtBLEdBQUNBLENBQUNBLENBQUNBO1FBRXZEQSxBQUVBQSxvQkFGb0JBO1FBRXBCQSxJQUFJQSxJQUFJQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxJQUFJQSxHQUFHQSxTQUFTQSxHQUFHQSxJQUFJQSxHQUFHQSxZQUFZQSxHQUFHQSxJQUFJQSxHQUFHQSxNQUFNQSxHQUFHQSxTQUFTQSxHQUFHQSxJQUFJQSxHQUFHQSxTQUFTQSxHQUFHQSxJQUFJQSxHQUFHQSxZQUFZQSxHQUFHQSxJQUFJQSxDQUFDQTtRQUVoSkEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7SUFDYkEsQ0FBQ0E7SUFFREg7O09BRUdBO0lBQ0lBLDhDQUFTQSxHQUFoQkEsVUFBaUJBLFlBQTZCQSxFQUFFQSxRQUFpQkEsRUFBRUEsS0FBV0E7UUFFN0VJLElBQUlBLEdBQUdBLEdBQVVBLENBQUNBLEdBQUNBLElBQUlBLENBQUNBO1FBQ3hCQSxJQUFJQSxLQUFLQSxHQUFVQSxRQUFRQSxDQUFDQSxzQkFBc0JBLENBQUNBO1FBQ25EQSxJQUFJQSxJQUFJQSxHQUFpQkEsWUFBWUEsQ0FBQ0Esb0JBQW9CQSxDQUFDQTtRQUUzREEsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsYUFBYUEsQ0FBQ0E7UUFDakRBLElBQUlBLENBQUNBLEtBQUtBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLGVBQWVBLENBQUNBO1FBQ3ZEQSxJQUFJQSxDQUFDQSxLQUFLQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxjQUFjQSxDQUFDQTtRQUN0REEsSUFBSUEsQ0FBQ0EsS0FBS0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsZUFBZUEsQ0FBQ0E7UUFDdkRBLElBQUlBLENBQUNBLEtBQUtBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLFNBQVNBLEdBQUNBLEdBQUdBLENBQUNBO1FBQ3JEQSxJQUFJQSxDQUFDQSxLQUFLQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxXQUFXQSxHQUFDQSxHQUFHQSxDQUFDQTtRQUN2REEsSUFBSUEsQ0FBQ0EsS0FBS0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsVUFBVUEsR0FBQ0EsR0FBR0EsQ0FBQ0E7UUFDdERBLElBQUlBLENBQUNBLEtBQUtBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLFdBQVdBLEdBQUNBLEdBQUdBLENBQUNBO0lBRXhEQSxDQUFDQTtJQUNGSixpQ0FBQ0E7QUFBREEsQ0E5REEsQUE4RENBLEVBOUR3QyxnQkFBZ0IsRUE4RHhEO0FBRUQsQUFBb0MsaUJBQTNCLDBCQUEwQixDQUFDIiwiZmlsZSI6Im1hdGVyaWFscy9tZXRob2RzL0VmZmVjdENvbG9yVHJhbnNmb3JtTWV0aG9kLmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDb2xvclRyYW5zZm9ybVx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2dlb20vQ29sb3JUcmFuc2Zvcm1cIik7XG5cbmltcG9ydCBTdGFnZVx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1zdGFnZWdsL2xpYi9iYXNlL1N0YWdlXCIpO1xuXG5pbXBvcnQgTWV0aG9kVk9cdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL2NvbXBpbGF0aW9uL01ldGhvZFZPXCIpO1xuaW1wb3J0IFNoYWRlck9iamVjdEJhc2VcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvY29tcGlsYXRpb24vU2hhZGVyT2JqZWN0QmFzZVwiKTtcbmltcG9ydCBTaGFkZXJSZWdpc3RlckNhY2hlXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9jb21waWxhdGlvbi9TaGFkZXJSZWdpc3RlckNhY2hlXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyRGF0YVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJEYXRhXCIpO1xuaW1wb3J0IFNoYWRlclJlZ2lzdGVyRWxlbWVudFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL2NvbXBpbGF0aW9uL1NoYWRlclJlZ2lzdGVyRWxlbWVudFwiKTtcbmltcG9ydCBFZmZlY3RNZXRob2RCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL21ldGhvZHMvRWZmZWN0TWV0aG9kQmFzZVwiKTtcblxuLyoqXG4gKiBFZmZlY3RDb2xvclRyYW5zZm9ybU1ldGhvZCBwcm92aWRlcyBhIHNoYWRpbmcgbWV0aG9kIHRoYXQgY2hhbmdlcyB0aGUgY29sb3VyIG9mIGEgbWF0ZXJpYWwgYW5hbG9nb3VzIHRvIGFcbiAqIENvbG9yVHJhbnNmb3JtIG9iamVjdC5cbiAqL1xuY2xhc3MgRWZmZWN0Q29sb3JUcmFuc2Zvcm1NZXRob2QgZXh0ZW5kcyBFZmZlY3RNZXRob2RCYXNlXG57XG5cdHByaXZhdGUgX2NvbG9yVHJhbnNmb3JtOkNvbG9yVHJhbnNmb3JtO1xuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgbmV3IEVmZmVjdENvbG9yVHJhbnNmb3JtTWV0aG9kLlxuXHQgKi9cblx0Y29uc3RydWN0b3IoKVxuXHR7XG5cdFx0c3VwZXIoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgQ29sb3JUcmFuc2Zvcm0gb2JqZWN0IHRvIHRyYW5zZm9ybSB0aGUgY29sb3VyIG9mIHRoZSBtYXRlcmlhbCB3aXRoLlxuXHQgKi9cblx0cHVibGljIGdldCBjb2xvclRyYW5zZm9ybSgpOkNvbG9yVHJhbnNmb3JtXG5cdHtcblx0XHRyZXR1cm4gdGhpcy5fY29sb3JUcmFuc2Zvcm07XG5cdH1cblxuXHRwdWJsaWMgc2V0IGNvbG9yVHJhbnNmb3JtKHZhbHVlOkNvbG9yVHJhbnNmb3JtKVxuXHR7XG5cdFx0dGhpcy5fY29sb3JUcmFuc2Zvcm0gPSB2YWx1ZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIGlHZXRGcmFnbWVudENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIG1ldGhvZFZPOk1ldGhvZFZPLCB0YXJnZXRSZWc6U2hhZGVyUmVnaXN0ZXJFbGVtZW50LCByZWdpc3RlckNhY2hlOlNoYWRlclJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVyczpTaGFkZXJSZWdpc3RlckRhdGEpOnN0cmluZ1xuXHR7XG5cdFx0dmFyIGNvZGU6c3RyaW5nID0gXCJcIjtcblx0XHR2YXIgY29sb3JNdWx0UmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudCA9IHJlZ2lzdGVyQ2FjaGUuZ2V0RnJlZUZyYWdtZW50Q29uc3RhbnQoKTtcblx0XHR2YXIgY29sb3JPZmZzUmVnOlNoYWRlclJlZ2lzdGVyRWxlbWVudCA9IHJlZ2lzdGVyQ2FjaGUuZ2V0RnJlZUZyYWdtZW50Q29uc3RhbnQoKTtcblxuXHRcdG1ldGhvZFZPLmZyYWdtZW50Q29uc3RhbnRzSW5kZXggPSBjb2xvck11bHRSZWcuaW5kZXgqNDtcblxuXHRcdC8vVE9ETzogQUdBTCA8PiBHTFNMXG5cblx0XHRjb2RlICs9IFwibXVsIFwiICsgdGFyZ2V0UmVnICsgXCIsIFwiICsgdGFyZ2V0UmVnICsgXCIsIFwiICsgY29sb3JNdWx0UmVnICsgXCJcXG5cIiArIFwiYWRkIFwiICsgdGFyZ2V0UmVnICsgXCIsIFwiICsgdGFyZ2V0UmVnICsgXCIsIFwiICsgY29sb3JPZmZzUmVnICsgXCJcXG5cIjtcblxuXHRcdHJldHVybiBjb2RlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgaUFjdGl2YXRlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCBtZXRob2RWTzpNZXRob2RWTywgc3RhZ2U6U3RhZ2UpXG5cdHtcblx0XHR2YXIgaW52Om51bWJlciA9IDEvMHhmZjtcblx0XHR2YXIgaW5kZXg6bnVtYmVyID0gbWV0aG9kVk8uZnJhZ21lbnRDb25zdGFudHNJbmRleDtcblx0XHR2YXIgZGF0YTpBcnJheTxudW1iZXI+ID0gc2hhZGVyT2JqZWN0LmZyYWdtZW50Q29uc3RhbnREYXRhO1xuXG5cdFx0ZGF0YVtpbmRleF0gPSB0aGlzLl9jb2xvclRyYW5zZm9ybS5yZWRNdWx0aXBsaWVyO1xuXHRcdGRhdGFbaW5kZXggKyAxXSA9IHRoaXMuX2NvbG9yVHJhbnNmb3JtLmdyZWVuTXVsdGlwbGllcjtcblx0XHRkYXRhW2luZGV4ICsgMl0gPSB0aGlzLl9jb2xvclRyYW5zZm9ybS5ibHVlTXVsdGlwbGllcjtcblx0XHRkYXRhW2luZGV4ICsgM10gPSB0aGlzLl9jb2xvclRyYW5zZm9ybS5hbHBoYU11bHRpcGxpZXI7XG5cdFx0ZGF0YVtpbmRleCArIDRdID0gdGhpcy5fY29sb3JUcmFuc2Zvcm0ucmVkT2Zmc2V0Kmludjtcblx0XHRkYXRhW2luZGV4ICsgNV0gPSB0aGlzLl9jb2xvclRyYW5zZm9ybS5ncmVlbk9mZnNldCppbnY7XG5cdFx0ZGF0YVtpbmRleCArIDZdID0gdGhpcy5fY29sb3JUcmFuc2Zvcm0uYmx1ZU9mZnNldCppbnY7XG5cdFx0ZGF0YVtpbmRleCArIDddID0gdGhpcy5fY29sb3JUcmFuc2Zvcm0uYWxwaGFPZmZzZXQqaW52O1xuXG5cdH1cbn1cblxuZXhwb3J0ID0gRWZmZWN0Q29sb3JUcmFuc2Zvcm1NZXRob2Q7Il19