var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var MaterialBase = require("awayjs-display/lib/materials/MaterialBase");
var StageGLMaterialBase = (function (_super) {
    __extends(StageGLMaterialBase, _super);
    function StageGLMaterialBase() {
        _super.apply(this, arguments);
    }
    StageGLMaterialBase.prototype._iGetVertexCode = function (shaderObject, registerCache, sharedRegisters) {
        return "";
    };
    StageGLMaterialBase.prototype._iGetFragmentCode = function (shaderObject, registerCache, sharedRegisters) {
        return "";
    };
    return StageGLMaterialBase;
})(MaterialBase);
module.exports = StageGLMaterialBase;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvc3RhZ2VnbG1hdGVyaWFsYmFzZS50cyJdLCJuYW1lcyI6WyJTdGFnZUdMTWF0ZXJpYWxCYXNlIiwiU3RhZ2VHTE1hdGVyaWFsQmFzZS5jb25zdHJ1Y3RvciIsIlN0YWdlR0xNYXRlcmlhbEJhc2UuX2lHZXRWZXJ0ZXhDb2RlIiwiU3RhZ2VHTE1hdGVyaWFsQmFzZS5faUdldEZyYWdtZW50Q29kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBTyxZQUFZLFdBQWUsMkNBQTJDLENBQUMsQ0FBQztBQU0vRSxJQUFNLG1CQUFtQjtJQUFTQSxVQUE1QkEsbUJBQW1CQSxVQUFxQkE7SUFBOUNBLFNBQU1BLG1CQUFtQkE7UUFBU0MsOEJBQVlBO0lBVzlDQSxDQUFDQTtJQVRPRCw2Q0FBZUEsR0FBdEJBLFVBQXVCQSxZQUE2QkEsRUFBRUEsYUFBaUNBLEVBQUVBLGVBQWtDQTtRQUUxSEUsTUFBTUEsQ0FBQ0EsRUFBRUEsQ0FBQ0E7SUFDWEEsQ0FBQ0E7SUFFTUYsK0NBQWlCQSxHQUF4QkEsVUFBeUJBLFlBQTZCQSxFQUFFQSxhQUFpQ0EsRUFBRUEsZUFBa0NBO1FBRTVIRyxNQUFNQSxDQUFDQSxFQUFFQSxDQUFDQTtJQUNYQSxDQUFDQTtJQUNGSCwwQkFBQ0E7QUFBREEsQ0FYQSxBQVdDQSxFQVhpQyxZQUFZLEVBVzdDO0FBRUQsQUFBNkIsaUJBQXBCLG1CQUFtQixDQUFDIiwiZmlsZSI6Im1hdGVyaWFscy9TdGFnZUdMTWF0ZXJpYWxCYXNlLmpzIiwic291cmNlUm9vdCI6Ii4uLyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBNYXRlcmlhbEJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL21hdGVyaWFscy9NYXRlcmlhbEJhc2VcIik7XG5cbmltcG9ydCBTaGFkZXJPYmplY3RCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL2NvbXBpbGF0aW9uL1NoYWRlck9iamVjdEJhc2VcIik7XG5pbXBvcnQgU2hhZGVyUmVnaXN0ZXJDYWNoZVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvY29tcGlsYXRpb24vU2hhZGVyUmVnaXN0ZXJDYWNoZVwiKTtcbmltcG9ydCBTaGFkZXJSZWdpc3RlckRhdGFcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL2NvbXBpbGF0aW9uL1NoYWRlclJlZ2lzdGVyRGF0YVwiKTtcblxuY2xhc3MgU3RhZ2VHTE1hdGVyaWFsQmFzZSBleHRlbmRzIE1hdGVyaWFsQmFzZVxue1xuXHRwdWJsaWMgX2lHZXRWZXJ0ZXhDb2RlKHNoYWRlck9iamVjdDpTaGFkZXJPYmplY3RCYXNlLCByZWdpc3RlckNhY2hlOlNoYWRlclJlZ2lzdGVyQ2FjaGUsIHNoYXJlZFJlZ2lzdGVyczpTaGFkZXJSZWdpc3RlckRhdGEpOnN0cmluZ1xuXHR7XG5cdFx0cmV0dXJuIFwiXCI7XG5cdH1cblxuXHRwdWJsaWMgX2lHZXRGcmFnbWVudENvZGUoc2hhZGVyT2JqZWN0OlNoYWRlck9iamVjdEJhc2UsIHJlZ2lzdGVyQ2FjaGU6U2hhZGVyUmVnaXN0ZXJDYWNoZSwgc2hhcmVkUmVnaXN0ZXJzOlNoYWRlclJlZ2lzdGVyRGF0YSk6c3RyaW5nXG5cdHtcblx0XHRyZXR1cm4gXCJcIjtcblx0fVxufVxuXG5leHBvcnQgPSBTdGFnZUdMTWF0ZXJpYWxCYXNlOyJdfQ==