var MaterialPassData = require("awayjs-renderergl/lib/pool/MaterialPassData");
/**
 * @class away.pool.MaterialPassDataPool
 */
var MaterialPassDataPool = (function () {
    /**
     * //TODO
     *
     * @param textureDataClass
     */
    function MaterialPassDataPool(material) {
        this._pool = new Object();
        this._material = material;
    }
    /**
     * //TODO
     *
     * @param materialOwner
     * @returns ITexture
     */
    MaterialPassDataPool.prototype.getItem = function (materialPass) {
        return (this._pool[materialPass.id] || (this._pool[materialPass.id] = this._material._iAddMaterialPassData(materialPass._iAddMaterialPassData(new MaterialPassData(this, this._material, materialPass)))));
    };
    /**
     * //TODO
     *
     * @param materialOwner
     */
    MaterialPassDataPool.prototype.disposeItem = function (materialPass) {
        materialPass._iRemoveMaterialPassData(this._pool[materialPass.id]);
        delete this._pool[materialPass.id];
    };
    MaterialPassDataPool.prototype.disposePool = function () {
        for (var id in this._pool)
            this._pool[id].materialPass._iRemoveMaterialPassData(this._pool[id]);
        delete this._pool;
    };
    return MaterialPassDataPool;
})();
module.exports = MaterialPassDataPool;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9wb29sL21hdGVyaWFscGFzc2RhdGFwb29sLnRzIl0sIm5hbWVzIjpbIk1hdGVyaWFsUGFzc0RhdGFQb29sIiwiTWF0ZXJpYWxQYXNzRGF0YVBvb2wuY29uc3RydWN0b3IiLCJNYXRlcmlhbFBhc3NEYXRhUG9vbC5nZXRJdGVtIiwiTWF0ZXJpYWxQYXNzRGF0YVBvb2wuZGlzcG9zZUl0ZW0iLCJNYXRlcmlhbFBhc3NEYXRhUG9vbC5kaXNwb3NlUG9vbCJdLCJtYXBwaW5ncyI6IkFBQUEsSUFBTyxnQkFBZ0IsV0FBYyw2Q0FBNkMsQ0FBQyxDQUFDO0FBSXBGLEFBR0E7O0dBREc7SUFDRyxvQkFBb0I7SUFLekJBOzs7O09BSUdBO0lBQ0hBLFNBVktBLG9CQUFvQkEsQ0FVYkEsUUFBNEJBO1FBUmhDQyxVQUFLQSxHQUFVQSxJQUFJQSxNQUFNQSxFQUFFQSxDQUFDQTtRQVVuQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsR0FBR0EsUUFBUUEsQ0FBQ0E7SUFDM0JBLENBQUNBO0lBRUREOzs7OztPQUtHQTtJQUNJQSxzQ0FBT0EsR0FBZEEsVUFBZUEsWUFBNkJBO1FBRTNDRSxNQUFNQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxZQUFZQSxDQUFDQSxFQUFFQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxZQUFZQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxxQkFBcUJBLENBQUNBLFlBQVlBLENBQUNBLHFCQUFxQkEsQ0FBQ0EsSUFBSUEsZ0JBQWdCQSxDQUFDQSxJQUFJQSxFQUFFQSxJQUFJQSxDQUFDQSxTQUFTQSxFQUFFQSxZQUFZQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtJQUM1TUEsQ0FBQ0E7SUFFREY7Ozs7T0FJR0E7SUFDSUEsMENBQVdBLEdBQWxCQSxVQUFtQkEsWUFBNkJBO1FBRS9DRyxZQUFZQSxDQUFDQSx3QkFBd0JBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLFlBQVlBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO1FBRW5FQSxPQUFPQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxZQUFZQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQTtJQUNwQ0EsQ0FBQ0E7SUFFTUgsMENBQVdBLEdBQWxCQTtRQUVDSSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxJQUFJQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQTtZQUNMQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxFQUFFQSxDQUFFQSxDQUFDQSxZQUFZQSxDQUFDQSx3QkFBd0JBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO1FBRTNGQSxPQUFPQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQTtJQUNuQkEsQ0FBQ0E7SUFDRkosMkJBQUNBO0FBQURBLENBN0NBLEFBNkNDQSxJQUFBO0FBRUQsQUFBOEIsaUJBQXJCLG9CQUFvQixDQUFDIiwiZmlsZSI6InBvb2wvTWF0ZXJpYWxQYXNzRGF0YVBvb2wuanMiLCJzb3VyY2VSb290IjoiLi4vIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE1hdGVyaWFsUGFzc0RhdGFcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9wb29sL01hdGVyaWFsUGFzc0RhdGFcIik7XG5pbXBvcnQgU3RhZ2VHTE1hdGVyaWFsQmFzZVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvU3RhZ2VHTE1hdGVyaWFsQmFzZVwiKTtcbmltcG9ydCBNYXRlcmlhbFBhc3NCYXNlXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvbWF0ZXJpYWxzL3Bhc3Nlcy9NYXRlcmlhbFBhc3NCYXNlXCIpO1xuXG4vKipcbiAqIEBjbGFzcyBhd2F5LnBvb2wuTWF0ZXJpYWxQYXNzRGF0YVBvb2xcbiAqL1xuY2xhc3MgTWF0ZXJpYWxQYXNzRGF0YVBvb2xcbntcblx0cHJpdmF0ZSBfcG9vbDpPYmplY3QgPSBuZXcgT2JqZWN0KCk7XG5cdHByaXZhdGUgX21hdGVyaWFsOlN0YWdlR0xNYXRlcmlhbEJhc2U7XG5cblx0LyoqXG5cdCAqIC8vVE9ET1xuXHQgKlxuXHQgKiBAcGFyYW0gdGV4dHVyZURhdGFDbGFzc1xuXHQgKi9cblx0Y29uc3RydWN0b3IobWF0ZXJpYWw6U3RhZ2VHTE1hdGVyaWFsQmFzZSlcblx0e1xuXHRcdHRoaXMuX21hdGVyaWFsID0gbWF0ZXJpYWw7XG5cdH1cblxuXHQvKipcblx0ICogLy9UT0RPXG5cdCAqXG5cdCAqIEBwYXJhbSBtYXRlcmlhbE93bmVyXG5cdCAqIEByZXR1cm5zIElUZXh0dXJlXG5cdCAqL1xuXHRwdWJsaWMgZ2V0SXRlbShtYXRlcmlhbFBhc3M6TWF0ZXJpYWxQYXNzQmFzZSk6TWF0ZXJpYWxQYXNzRGF0YVxuXHR7XG5cdFx0cmV0dXJuICh0aGlzLl9wb29sW21hdGVyaWFsUGFzcy5pZF0gfHwgKHRoaXMuX3Bvb2xbbWF0ZXJpYWxQYXNzLmlkXSA9IHRoaXMuX21hdGVyaWFsLl9pQWRkTWF0ZXJpYWxQYXNzRGF0YShtYXRlcmlhbFBhc3MuX2lBZGRNYXRlcmlhbFBhc3NEYXRhKG5ldyBNYXRlcmlhbFBhc3NEYXRhKHRoaXMsIHRoaXMuX21hdGVyaWFsLCBtYXRlcmlhbFBhc3MpKSkpKTtcblx0fVxuXG5cdC8qKlxuXHQgKiAvL1RPRE9cblx0ICpcblx0ICogQHBhcmFtIG1hdGVyaWFsT3duZXJcblx0ICovXG5cdHB1YmxpYyBkaXNwb3NlSXRlbShtYXRlcmlhbFBhc3M6TWF0ZXJpYWxQYXNzQmFzZSlcblx0e1xuXHRcdG1hdGVyaWFsUGFzcy5faVJlbW92ZU1hdGVyaWFsUGFzc0RhdGEodGhpcy5fcG9vbFttYXRlcmlhbFBhc3MuaWRdKTtcblxuXHRcdGRlbGV0ZSB0aGlzLl9wb29sW21hdGVyaWFsUGFzcy5pZF07XG5cdH1cblxuXHRwdWJsaWMgZGlzcG9zZVBvb2woKVxuXHR7XG5cdFx0Zm9yICh2YXIgaWQgaW4gdGhpcy5fcG9vbClcblx0XHRcdCg8TWF0ZXJpYWxQYXNzRGF0YT4gdGhpcy5fcG9vbFtpZF0pLm1hdGVyaWFsUGFzcy5faVJlbW92ZU1hdGVyaWFsUGFzc0RhdGEodGhpcy5fcG9vbFtpZF0pO1xuXG5cdFx0ZGVsZXRlIHRoaXMuX3Bvb2w7XG5cdH1cbn1cblxuZXhwb3J0ID0gTWF0ZXJpYWxQYXNzRGF0YVBvb2w7Il19