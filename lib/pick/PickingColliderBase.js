var Point = require("awayjs-core/lib/geom/Point");
var Vector3D = require("awayjs-core/lib/geom/Vector3D");
var AbstractMethodError = require("awayjs-core/lib/errors/AbstractMethodError");
var BillboardRenderable = require("awayjs-renderergl/lib/pool/BillboardRenderable");
var TriangleSubMeshRenderable = require("awayjs-renderergl/lib/pool/TriangleSubMeshRenderable");
var RenderablePoolBase = require("awayjs-renderergl/lib/pool/RenderablePoolBase");
/**
 * An abstract base class for all picking collider classes. It should not be instantiated directly.
 *
 * @class away.pick.PickingColliderBase
 */
var PickingColliderBase = (function () {
    function PickingColliderBase(stage) {
        //TODO
        this._billboardRenderablePool = RenderablePoolBase.getPool(BillboardRenderable, stage);
        this._subMeshRenderablePool = RenderablePoolBase.getPool(TriangleSubMeshRenderable, stage);
    }
    PickingColliderBase.prototype._pPetCollisionNormal = function (indexData /*uint*/, vertexData, triangleIndex) {
        var normal = new Vector3D();
        var i0 = indexData[triangleIndex] * 3;
        var i1 = indexData[triangleIndex + 1] * 3;
        var i2 = indexData[triangleIndex + 2] * 3;
        var p0 = new Vector3D(vertexData[i0], vertexData[i0 + 1], vertexData[i0 + 2]);
        var p1 = new Vector3D(vertexData[i1], vertexData[i1 + 1], vertexData[i1 + 2]);
        var p2 = new Vector3D(vertexData[i2], vertexData[i2 + 1], vertexData[i2 + 2]);
        var side0 = p1.subtract(p0);
        var side1 = p2.subtract(p0);
        normal = side0.crossProduct(side1);
        normal.normalize();
        return normal;
    };
    PickingColliderBase.prototype._pGetCollisionUV = function (indexData /*uint*/, uvData, triangleIndex, v, w, u, uvOffset, uvStride) {
        var uv = new Point();
        var uIndex = indexData[triangleIndex] * uvStride + uvOffset;
        var uv0 = new Vector3D(uvData[uIndex], uvData[uIndex + 1]);
        uIndex = indexData[triangleIndex + 1] * uvStride + uvOffset;
        var uv1 = new Vector3D(uvData[uIndex], uvData[uIndex + 1]);
        uIndex = indexData[triangleIndex + 2] * uvStride + uvOffset;
        var uv2 = new Vector3D(uvData[uIndex], uvData[uIndex + 1]);
        uv.x = u * uv0.x + v * uv1.x + w * uv2.x;
        uv.y = u * uv0.y + v * uv1.y + w * uv2.y;
        return uv;
    };
    /**
     * @inheritDoc
     */
    PickingColliderBase.prototype._pTestRenderableCollision = function (renderable, pickingCollisionVO, shortestCollisionDistance) {
        throw new AbstractMethodError();
    };
    /**
     * @inheritDoc
     */
    PickingColliderBase.prototype.setLocalRay = function (localPosition, localDirection) {
        this.rayPosition = localPosition;
        this.rayDirection = localDirection;
    };
    /**
     * Tests a <code>Billboard</code> object for a collision with the picking ray.
     *
     * @param billboard The billboard instance to be tested.
     * @param pickingCollisionVO The collision object used to store the collision results
     * @param shortestCollisionDistance The current value of the shortest distance to a detected collision along the ray.
     * @param findClosest
     */
    PickingColliderBase.prototype.testBillboardCollision = function (billboard, pickingCollisionVO, shortestCollisionDistance) {
        this.setLocalRay(pickingCollisionVO.localRayPosition, pickingCollisionVO.localRayDirection);
        pickingCollisionVO.renderableOwner = null;
        if (this._pTestRenderableCollision(this._billboardRenderablePool.getItem(billboard), pickingCollisionVO, shortestCollisionDistance)) {
            shortestCollisionDistance = pickingCollisionVO.rayEntryDistance;
            pickingCollisionVO.renderableOwner = billboard;
            return true;
        }
        return false;
    };
    /**
     * Tests a <code>Mesh</code> object for a collision with the picking ray.
     *
     * @param mesh The mesh instance to be tested.
     * @param pickingCollisionVO The collision object used to store the collision results
     * @param shortestCollisionDistance The current value of the shortest distance to a detected collision along the ray.
     * @param findClosest
     */
    PickingColliderBase.prototype.testMeshCollision = function (mesh, pickingCollisionVO, shortestCollisionDistance, findClosest) {
        this.setLocalRay(pickingCollisionVO.localRayPosition, pickingCollisionVO.localRayDirection);
        pickingCollisionVO.renderableOwner = null;
        var subMesh;
        var len = mesh.subMeshes.length;
        for (var i = 0; i < len; ++i) {
            subMesh = mesh.subMeshes[i];
            if (this._pTestRenderableCollision(this._subMeshRenderablePool.getItem(subMesh), pickingCollisionVO, shortestCollisionDistance)) {
                shortestCollisionDistance = pickingCollisionVO.rayEntryDistance;
                pickingCollisionVO.renderableOwner = subMesh;
                if (!findClosest)
                    return true;
            }
        }
        return pickingCollisionVO.renderableOwner != null;
    };
    return PickingColliderBase;
})();
module.exports = PickingColliderBase;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9waWNrL3BpY2tpbmdjb2xsaWRlcmJhc2UudHMiXSwibmFtZXMiOlsiUGlja2luZ0NvbGxpZGVyQmFzZSIsIlBpY2tpbmdDb2xsaWRlckJhc2UuY29uc3RydWN0b3IiLCJQaWNraW5nQ29sbGlkZXJCYXNlLl9wUGV0Q29sbGlzaW9uTm9ybWFsIiwiUGlja2luZ0NvbGxpZGVyQmFzZS5fcEdldENvbGxpc2lvblVWIiwiUGlja2luZ0NvbGxpZGVyQmFzZS5fcFRlc3RSZW5kZXJhYmxlQ29sbGlzaW9uIiwiUGlja2luZ0NvbGxpZGVyQmFzZS5zZXRMb2NhbFJheSIsIlBpY2tpbmdDb2xsaWRlckJhc2UudGVzdEJpbGxib2FyZENvbGxpc2lvbiIsIlBpY2tpbmdDb2xsaWRlckJhc2UudGVzdE1lc2hDb2xsaXNpb24iXSwibWFwcGluZ3MiOiJBQUFBLElBQU8sS0FBSyxXQUFpQiw0QkFBNEIsQ0FBQyxDQUFDO0FBQzNELElBQU8sUUFBUSxXQUFpQiwrQkFBK0IsQ0FBQyxDQUFDO0FBQ2pFLElBQU8sbUJBQW1CLFdBQWMsNENBQTRDLENBQUMsQ0FBQztBQVN0RixJQUFPLG1CQUFtQixXQUFjLGdEQUFnRCxDQUFDLENBQUM7QUFFMUYsSUFBTyx5QkFBeUIsV0FBWSxzREFBc0QsQ0FBQyxDQUFDO0FBQ3BHLElBQU8sa0JBQWtCLFdBQWUsK0NBQStDLENBQUMsQ0FBQztBQUV6RixBQUtBOzs7O0dBREc7SUFDRyxtQkFBbUI7SUFReEJBLFNBUktBLG1CQUFtQkEsQ0FRWkEsS0FBV0E7UUFFdEJDLEFBQ0FBLE1BRE1BO1FBQ05BLElBQUlBLENBQUNBLHdCQUF3QkEsR0FBR0Esa0JBQWtCQSxDQUFDQSxPQUFPQSxDQUFDQSxtQkFBbUJBLEVBQUVBLEtBQUtBLENBQUNBLENBQUNBO1FBQ3ZGQSxJQUFJQSxDQUFDQSxzQkFBc0JBLEdBQUdBLGtCQUFrQkEsQ0FBQ0EsT0FBT0EsQ0FBQ0EseUJBQXlCQSxFQUFFQSxLQUFLQSxDQUFDQSxDQUFDQTtJQUM1RkEsQ0FBQ0E7SUFFTUQsa0RBQW9CQSxHQUEzQkEsVUFBNEJBLFNBQVNBLENBQWVBLFFBQURBLEFBQVNBLEVBQUVBLFVBQXdCQSxFQUFFQSxhQUFvQkE7UUFFM0dFLElBQUlBLE1BQU1BLEdBQVlBLElBQUlBLFFBQVFBLEVBQUVBLENBQUNBO1FBQ3JDQSxJQUFJQSxFQUFFQSxHQUFVQSxTQUFTQSxDQUFFQSxhQUFhQSxDQUFFQSxHQUFDQSxDQUFDQSxDQUFDQTtRQUM3Q0EsSUFBSUEsRUFBRUEsR0FBVUEsU0FBU0EsQ0FBRUEsYUFBYUEsR0FBR0EsQ0FBQ0EsQ0FBRUEsR0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDakRBLElBQUlBLEVBQUVBLEdBQVVBLFNBQVNBLENBQUVBLGFBQWFBLEdBQUdBLENBQUNBLENBQUVBLEdBQUNBLENBQUNBLENBQUNBO1FBQ2pEQSxJQUFJQSxFQUFFQSxHQUFZQSxJQUFJQSxRQUFRQSxDQUFDQSxVQUFVQSxDQUFFQSxFQUFFQSxDQUFFQSxFQUFFQSxVQUFVQSxDQUFFQSxFQUFFQSxHQUFHQSxDQUFDQSxDQUFFQSxFQUFFQSxVQUFVQSxDQUFFQSxFQUFFQSxHQUFHQSxDQUFDQSxDQUFFQSxDQUFDQSxDQUFDQTtRQUM3RkEsSUFBSUEsRUFBRUEsR0FBWUEsSUFBSUEsUUFBUUEsQ0FBQ0EsVUFBVUEsQ0FBRUEsRUFBRUEsQ0FBRUEsRUFBRUEsVUFBVUEsQ0FBRUEsRUFBRUEsR0FBR0EsQ0FBQ0EsQ0FBRUEsRUFBRUEsVUFBVUEsQ0FBRUEsRUFBRUEsR0FBR0EsQ0FBQ0EsQ0FBRUEsQ0FBQ0EsQ0FBQ0E7UUFDN0ZBLElBQUlBLEVBQUVBLEdBQVlBLElBQUlBLFFBQVFBLENBQUNBLFVBQVVBLENBQUVBLEVBQUVBLENBQUVBLEVBQUVBLFVBQVVBLENBQUVBLEVBQUVBLEdBQUdBLENBQUNBLENBQUVBLEVBQUVBLFVBQVVBLENBQUVBLEVBQUVBLEdBQUdBLENBQUNBLENBQUVBLENBQUNBLENBQUNBO1FBQzdGQSxJQUFJQSxLQUFLQSxHQUFZQSxFQUFFQSxDQUFDQSxRQUFR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Q0FBQ0EsSUFBSUEsQ0FBQ0EseUJBQXlCQSxDQUFrQkEsSUFBSUEsQ0FBQ0Esc0JBQXNCQSxDQUFDQSxPQUFPQSxDQUFDQSxPQUFPQSxDQUFDQSxFQUFFQSxrQkFBa0JBLEVBQUVBLHlCQUF5QkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ2xKQSx5QkFBeUJBLEdBQUdBLGtCQUFrQkEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQTtnQkFFaEVBLGtCQUFrQkEsQ0FBQ0EsZUFBZUEsR0FBR0EsT0FBT0EsQ0FBQ0E7Z0JBRTdDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxXQUFXQSxDQUFDQTtvQkFDaEJBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBO1lBQ2RBLENBQUNBO1FBQ0ZBLENBQUNBO1FBRURBLE1BQU1BLENBQUNBLGtCQUFrQkEsQ0FBQ0EsZUFBZUEsSUFBSUEsSUFBSUEsQ0FBQ0E7SUFDbkRBLENBQUNBO0lBQ0ZQLDBCQUFDQTtBQUFEQSxDQXJIQSxBQXFIQ0EsSUFBQTtBQUVELEFBQTZCLGlCQUFwQixtQkFBbUIsQ0FBQyIsImZpbGUiOiJwaWNrL1BpY2tpbmdDb2xsaWRlckJhc2UuanMiLCJzb3VyY2VSb290IjoiLi4vIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFBvaW50XHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZ2VvbS9Qb2ludFwiKTtcbmltcG9ydCBWZWN0b3IzRFx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2dlb20vVmVjdG9yM0RcIik7XG5pbXBvcnQgQWJzdHJhY3RNZXRob2RFcnJvclx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2Vycm9ycy9BYnN0cmFjdE1ldGhvZEVycm9yXCIpO1xuXG5pbXBvcnQgSVN1Yk1lc2hcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9iYXNlL0lTdWJNZXNoXCIpO1xuaW1wb3J0IFBpY2tpbmdDb2xsaXNpb25WT1x0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL3BpY2svUGlja2luZ0NvbGxpc2lvblZPXCIpO1xuaW1wb3J0IEJpbGxib2FyZFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9lbnRpdGllcy9CaWxsYm9hcmRcIik7XG5pbXBvcnQgTWVzaFx0XHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvZW50aXRpZXMvTWVzaFwiKTtcblxuaW1wb3J0IFN0YWdlXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtc3RhZ2VnbC9saWIvYmFzZS9TdGFnZVwiKTtcblxuaW1wb3J0IEJpbGxib2FyZFJlbmRlcmFibGVcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9wb29sL0JpbGxib2FyZFJlbmRlcmFibGVcIik7XG5pbXBvcnQgUmVuZGVyYWJsZUJhc2VcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL3Bvb2wvUmVuZGVyYWJsZUJhc2VcIik7XG5pbXBvcnQgVHJpYW5nbGVTdWJNZXNoUmVuZGVyYWJsZVx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvcG9vbC9UcmlhbmdsZVN1Yk1lc2hSZW5kZXJhYmxlXCIpO1xuaW1wb3J0IFJlbmRlcmFibGVQb29sQmFzZVx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvcG9vbC9SZW5kZXJhYmxlUG9vbEJhc2VcIik7XG5cbi8qKlxuICogQW4gYWJzdHJhY3QgYmFzZSBjbGFzcyBmb3IgYWxsIHBpY2tpbmcgY29sbGlkZXIgY2xhc3Nlcy4gSXQgc2hvdWxkIG5vdCBiZSBpbnN0YW50aWF0ZWQgZGlyZWN0bHkuXG4gKlxuICogQGNsYXNzIGF3YXkucGljay5QaWNraW5nQ29sbGlkZXJCYXNlXG4gKi9cbmNsYXNzIFBpY2tpbmdDb2xsaWRlckJhc2Vcbntcblx0cHJpdmF0ZSBfYmlsbGJvYXJkUmVuZGVyYWJsZVBvb2w6UmVuZGVyYWJsZVBvb2xCYXNlO1xuXHRwcml2YXRlIF9zdWJNZXNoUmVuZGVyYWJsZVBvb2w6UmVuZGVyYWJsZVBvb2xCYXNlO1xuXG5cdHB1YmxpYyByYXlQb3NpdGlvbjpWZWN0b3IzRDtcblx0cHVibGljIHJheURpcmVjdGlvbjpWZWN0b3IzRDtcblxuXHRjb25zdHJ1Y3RvcihzdGFnZTpTdGFnZSlcblx0e1xuXHRcdC8vVE9ET1xuXHRcdHRoaXMuX2JpbGxib2FyZFJlbmRlcmFibGVQb29sID0gUmVuZGVyYWJsZVBvb2xCYXNlLmdldFBvb2woQmlsbGJvYXJkUmVuZGVyYWJsZSwgc3RhZ2UpO1xuXHRcdHRoaXMuX3N1Yk1lc2hSZW5kZXJhYmxlUG9vbCA9IFJlbmRlcmFibGVQb29sQmFzZS5nZXRQb29sKFRyaWFuZ2xlU3ViTWVzaFJlbmRlcmFibGUsIHN0YWdlKTtcblx0fVxuXG5cdHB1YmxpYyBfcFBldENvbGxpc2lvbk5vcm1hbChpbmRleERhdGE6QXJyYXk8bnVtYmVyPiAvKnVpbnQqLywgdmVydGV4RGF0YTpBcnJheTxudW1iZXI+LCB0cmlhbmdsZUluZGV4Om51bWJlcik6VmVjdG9yM0QgLy8gUFJPVEVDVEVEXG5cdHtcblx0XHR2YXIgbm9ybWFsOlZlY3RvcjNEID0gbmV3IFZlY3RvcjNEKCk7XG5cdFx0dmFyIGkwOm51bWJlciA9IGluZGV4RGF0YVsgdHJpYW5nbGVJbmRleCBdKjM7XG5cdFx0dmFyIGkxOm51bWJlciA9IGluZGV4RGF0YVsgdHJpYW5nbGVJbmRleCArIDEgXSozO1xuXHRcdHZhciBpMjpudW1iZXIgPSBpbmRleERhdGFbIHRyaWFuZ2xlSW5kZXggKyAyIF0qMztcblx0XHR2YXIgcDA6VmVjdG9yM0QgPSBuZXcgVmVjdG9yM0QodmVydGV4RGF0YVsgaTAgXSwgdmVydGV4RGF0YVsgaTAgKyAxIF0sIHZlcnRleERhdGFbIGkwICsgMiBdKTtcblx0XHR2YXIgcDE6VmVjdG9yM0QgPSBuZXcgVmVjdG9yM0QodmVydGV4RGF0YVsgaTEgXSwgdmVydGV4RGF0YVsgaTEgKyAxIF0sIHZlcnRleERhdGFbIGkxICsgMiBdKTtcblx0XHR2YXIgcDI6VmVjdG9yM0QgPSBuZXcgVmVjdG9yM0QodmVydGV4RGF0YVsgaTIgXSwgdmVydGV4RGF0YVsgaTIgKyAxIF0sIHZlcnRleERhdGFbIGkyICsgMiBdKTtcblx0XHR2YXIgc2lkZTA6VmVjdG9yM0QgPSBwMS5zdWJ0cmFjdChwMCk7XG5cdFx0dmFyIHNpZGUxOlZlY3RvcjNEID0gcDIuc3VidHJhY3QocDApO1xuXHRcdG5vcm1hbCA9IHNpZGUwLmNyb3NzUHJvZHVjdChzaWRlMSk7XG5cdFx0bm9ybWFsLm5vcm1hbGl6ZSgpO1xuXHRcdHJldHVybiBub3JtYWw7XG5cdH1cblxuXHRwdWJsaWMgX3BHZXRDb2xsaXNpb25VVihpbmRleERhdGE6QXJyYXk8bnVtYmVyPiAvKnVpbnQqLywgdXZEYXRhOkFycmF5PG51bWJlcj4sIHRyaWFuZ2xlSW5kZXg6bnVtYmVyLCB2Om51bWJlciwgdzpudW1iZXIsIHU6bnVtYmVyLCB1dk9mZnNldDpudW1iZXIsIHV2U3RyaWRlOm51bWJlcik6UG9pbnQgLy8gUFJPVEVDVEVEXG5cdHtcblx0XHR2YXIgdXY6UG9pbnQgPSBuZXcgUG9pbnQoKTtcblx0XHR2YXIgdUluZGV4Om51bWJlciA9IGluZGV4RGF0YVsgdHJpYW5nbGVJbmRleCBdKnV2U3RyaWRlICsgdXZPZmZzZXQ7XG5cdFx0dmFyIHV2MDpWZWN0b3IzRCA9IG5ldyBWZWN0b3IzRCh1dkRhdGFbIHVJbmRleCBdLCB1dkRhdGFbIHVJbmRleCArIDEgXSk7XG5cdFx0dUluZGV4ID0gaW5kZXhEYXRhWyB0cmlhbmdsZUluZGV4ICsgMSBdKnV2U3RyaWRlICsgdXZPZmZzZXQ7XG5cdFx0dmFyIHV2MTpWZWN0b3IzRCA9IG5ldyBWZWN0b3IzRCh1dkRhdGFbIHVJbmRleCBdLCB1dkRhdGFbIHVJbmRleCArIDEgXSk7XG5cdFx0dUluZGV4ID0gaW5kZXhEYXRhWyB0cmlhbmdsZUluZGV4ICsgMiBdKnV2U3RyaWRlICsgdXZPZmZzZXQ7XG5cdFx0dmFyIHV2MjpWZWN0b3IzRCA9IG5ldyBWZWN0b3IzRCh1dkRhdGFbIHVJbmRleCBdLCB1dkRhdGFbIHVJbmRleCArIDEgXSk7XG5cdFx0dXYueCA9IHUqdXYwLnggKyB2KnV2MS54ICsgdyp1djIueDtcblx0XHR1di55ID0gdSp1djAueSArIHYqdXYxLnkgKyB3KnV2Mi55O1xuXHRcdHJldHVybiB1djtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIF9wVGVzdFJlbmRlcmFibGVDb2xsaXNpb24ocmVuZGVyYWJsZTpSZW5kZXJhYmxlQmFzZSwgcGlja2luZ0NvbGxpc2lvblZPOlBpY2tpbmdDb2xsaXNpb25WTywgc2hvcnRlc3RDb2xsaXNpb25EaXN0YW5jZTpudW1iZXIpOmJvb2xlYW5cblx0e1xuXHRcdHRocm93IG5ldyBBYnN0cmFjdE1ldGhvZEVycm9yKCk7XG5cdH1cblxuXHQvKipcblx0ICogQGluaGVyaXREb2Ncblx0ICovXG5cdHB1YmxpYyBzZXRMb2NhbFJheShsb2NhbFBvc2l0aW9uOlZlY3RvcjNELCBsb2NhbERpcmVjdGlvbjpWZWN0b3IzRClcblx0e1xuXHRcdHRoaXMucmF5UG9zaXRpb24gPSBsb2NhbFBvc2l0aW9uO1xuXHRcdHRoaXMucmF5RGlyZWN0aW9uID0gbG9jYWxEaXJlY3Rpb247XG5cdH1cblxuXHQvKipcblx0ICogVGVzdHMgYSA8Y29kZT5CaWxsYm9hcmQ8L2NvZGU+IG9iamVjdCBmb3IgYSBjb2xsaXNpb24gd2l0aCB0aGUgcGlja2luZyByYXkuXG5cdCAqXG5cdCAqIEBwYXJhbSBiaWxsYm9hcmQgVGhlIGJpbGxib2FyZCBpbnN0YW5jZSB0byBiZSB0ZXN0ZWQuXG5cdCAqIEBwYXJhbSBwaWNraW5nQ29sbGlzaW9uVk8gVGhlIGNvbGxpc2lvbiBvYmplY3QgdXNlZCB0byBzdG9yZSB0aGUgY29sbGlzaW9uIHJlc3VsdHNcblx0ICogQHBhcmFtIHNob3J0ZXN0Q29sbGlzaW9uRGlzdGFuY2UgVGhlIGN1cnJlbnQgdmFsdWUgb2YgdGhlIHNob3J0ZXN0IGRpc3RhbmNlIHRvIGEgZGV0ZWN0ZWQgY29sbGlzaW9uIGFsb25nIHRoZSByYXkuXG5cdCAqIEBwYXJhbSBmaW5kQ2xvc2VzdFxuXHQgKi9cblx0cHVibGljIHRlc3RCaWxsYm9hcmRDb2xsaXNpb24oYmlsbGJvYXJkOkJpbGxib2FyZCwgcGlja2luZ0NvbGxpc2lvblZPOlBpY2tpbmdDb2xsaXNpb25WTywgc2hvcnRlc3RDb2xsaXNpb25EaXN0YW5jZTpudW1iZXIpXG5cdHtcblx0XHR0aGlzLnNldExvY2FsUmF5KHBpY2tpbmdDb2xsaXNpb25WTy5sb2NhbFJheVBvc2l0aW9uLCBwaWNraW5nQ29sbGlzaW9uVk8ubG9jYWxSYXlEaXJlY3Rpb24pO1xuXHRcdHBpY2tpbmdDb2xsaXNpb25WTy5yZW5kZXJhYmxlT3duZXIgPSBudWxsO1xuXG5cdFx0aWYgKHRoaXMuX3BUZXN0UmVuZGVyYWJsZUNvbGxpc2lvbig8UmVuZGVyYWJsZUJhc2U+IHRoaXMuX2JpbGxib2FyZFJlbmRlcmFibGVQb29sLmdldEl0ZW0oYmlsbGJvYXJkKSwgcGlja2luZ0NvbGxpc2lvblZPLCBzaG9ydGVzdENvbGxpc2lvbkRpc3RhbmNlKSkge1xuXHRcdFx0c2hvcnRlc3RDb2xsaXNpb25EaXN0YW5jZSA9IHBpY2tpbmdDb2xsaXNpb25WTy5yYXlFbnRyeURpc3RhbmNlO1xuXG5cdFx0XHRwaWNraW5nQ29sbGlzaW9uVk8ucmVuZGVyYWJsZU93bmVyID0gYmlsbGJvYXJkO1xuXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHQvKipcblx0ICogVGVzdHMgYSA8Y29kZT5NZXNoPC9jb2RlPiBvYmplY3QgZm9yIGEgY29sbGlzaW9uIHdpdGggdGhlIHBpY2tpbmcgcmF5LlxuXHQgKlxuXHQgKiBAcGFyYW0gbWVzaCBUaGUgbWVzaCBpbnN0YW5jZSB0byBiZSB0ZXN0ZWQuXG5cdCAqIEBwYXJhbSBwaWNraW5nQ29sbGlzaW9uVk8gVGhlIGNvbGxpc2lvbiBvYmplY3QgdXNlZCB0byBzdG9yZSB0aGUgY29sbGlzaW9uIHJlc3VsdHNcblx0ICogQHBhcmFtIHNob3J0ZXN0Q29sbGlzaW9uRGlzdGFuY2UgVGhlIGN1cnJlbnQgdmFsdWUgb2YgdGhlIHNob3J0ZXN0IGRpc3RhbmNlIHRvIGEgZGV0ZWN0ZWQgY29sbGlzaW9uIGFsb25nIHRoZSByYXkuXG5cdCAqIEBwYXJhbSBmaW5kQ2xvc2VzdFxuXHQgKi9cblx0cHVibGljIHRlc3RNZXNoQ29sbGlzaW9uKG1lc2g6TWVzaCwgcGlja2luZ0NvbGxpc2lvblZPOlBpY2tpbmdDb2xsaXNpb25WTywgc2hvcnRlc3RDb2xsaXNpb25EaXN0YW5jZTpudW1iZXIsIGZpbmRDbG9zZXN0OmJvb2xlYW4pOmJvb2xlYW5cblx0e1xuXHRcdHRoaXMuc2V0TG9jYWxSYXkocGlja2luZ0NvbGxpc2lvblZPLmxvY2FsUmF5UG9zaXRpb24sIHBpY2tpbmdDb2xsaXNpb25WTy5sb2NhbFJheURpcmVjdGlvbik7XG5cdFx0cGlja2luZ0NvbGxpc2lvblZPLnJlbmRlcmFibGVPd25lciA9IG51bGw7XG5cblx0XHR2YXIgc3ViTWVzaDpJU3ViTWVzaDtcblxuXHRcdHZhciBsZW46bnVtYmVyID0gbWVzaC5zdWJNZXNoZXMubGVuZ3RoO1xuXHRcdGZvciAodmFyIGk6bnVtYmVyID0gMDsgaSA8IGxlbjsgKytpKSB7XG5cdFx0XHRzdWJNZXNoID0gbWVzaC5zdWJNZXNoZXNbaV07XG5cblx0XHRcdGlmICh0aGlzLl9wVGVzdFJlbmRlcmFibGVDb2xsaXNpb24oPFJlbmRlcmFibGVCYXNlPiB0aGlzLl9zdWJNZXNoUmVuZGVyYWJsZVBvb2wuZ2V0SXRlbShzdWJNZXNoKSwgcGlja2luZ0NvbGxpc2lvblZPLCBzaG9ydGVzdENvbGxpc2lvbkRpc3RhbmNlKSkge1xuXHRcdFx0XHRzaG9ydGVzdENvbGxpc2lvbkRpc3RhbmNlID0gcGlja2luZ0NvbGxpc2lvblZPLnJheUVudHJ5RGlzdGFuY2U7XG5cblx0XHRcdFx0cGlja2luZ0NvbGxpc2lvblZPLnJlbmRlcmFibGVPd25lciA9IHN1Yk1lc2g7XG5cblx0XHRcdFx0aWYgKCFmaW5kQ2xvc2VzdClcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gcGlja2luZ0NvbGxpc2lvblZPLnJlbmRlcmFibGVPd25lciAhPSBudWxsO1xuXHR9XG59XG5cbmV4cG9ydCA9IFBpY2tpbmdDb2xsaWRlckJhc2U7Il19