var Vector3D = require("awayjs-core/lib/geom/Vector3D");
var URLLoader = require("awayjs-core/lib/net/URLLoader");
var URLLoaderDataFormat = require("awayjs-core/lib/net/URLLoaderDataFormat");
var URLRequest = require("awayjs-core/lib/net/URLRequest");
var Event = require("awayjs-core/lib/events/Event");
var ParserUtils = require("awayjs-core/lib/parsers/ParserUtils");
var PerspectiveProjection = require("awayjs-core/lib/projections/PerspectiveProjection");
var ImageTexture = require("awayjs-core/lib/textures/ImageTexture");
var RequestAnimationFrame = require("awayjs-core/lib/utils/RequestAnimationFrame");
var Debug = require("awayjs-core/lib/utils/Debug");
var View = require("awayjs-display/lib/containers/View");
var BlendMode = require("awayjs-display/lib/base/BlendMode");
var PrimitiveCubePrefab = require("awayjs-display/lib/prefabs/PrimitiveCubePrefab");
var PrimitiveTorusPrefab = require("awayjs-display/lib/prefabs/PrimitiveTorusPrefab");
var DefaultRenderer = require("awayjs-renderergl/lib/render/DefaultRenderer");
var TriangleMethodMaterial = require("awayjs-renderergl/lib/materials/TriangleMethodMaterial");
var TorusVortex = (function () {
    function TorusVortex() {
        Debug.THROW_ERRORS = false;
        this._view = new View(new DefaultRenderer());
        this._view.backgroundColor = 0x000000;
        this._view.camera.x = 130;
        this._view.camera.y = 0;
        this._view.camera.z = 0;
        this._cameraAxis = new Vector3D(0, 0, 1);
        this._view.camera.projection = new PerspectiveProjection(120);
        this._view.camera.projection.near = 0.1;
        this._cube = new PrimitiveCubePrefab(20.0, 20.0, 20.0);
        this._torus = new PrimitiveTorusPrefab(150, 80, 32, 16, true);
        this.loadResources();
    }
    TorusVortex.prototype.loadResources = function () {
        var _this = this;
        var urlRequest = new URLRequest("assets/130909wall_big.png");
        var urlLoader = new URLLoader();
        urlLoader.dataFormat = URLLoaderDataFormat.BLOB;
        urlLoader.addEventListener(Event.COMPLETE, function (event) { return _this.imageCompleteHandler(event); });
        urlLoader.load(urlRequest);
    };
    TorusVortex.prototype.imageCompleteHandler = function (event) {
        var _this = this;
        var imageLoader = event.target;
        this._image = ParserUtils.blobToImage(imageLoader.data);
        this._image.onload = function (event) { return _this.onLoadComplete(event); };
    };
    TorusVortex.prototype.onLoadComplete = function (event) {
        var _this = this;
        var matTx = new TriangleMethodMaterial(new ImageTexture(this._image, false), true, true, false);
        matTx.blendMode = BlendMode.ADD;
        matTx.bothSides = true;
        this._torus.material = matTx;
        this._cube.material = matTx;
        this._mesh = this._torus.getNewObject();
        this._mesh2 = this._cube.getNewObject();
        this._mesh2.x = 130;
        this._mesh2.z = 40;
        this._view.scene.addChild(this._mesh);
        this._view.scene.addChild(this._mesh2);
        this._raf = new RequestAnimationFrame(this.render, this);
        this._raf.start();
        window.onresize = function (event) { return _this.onResize(event); };
        this.onResize();
    };
    TorusVortex.prototype.render = function (dt) {
        if (dt === void 0) { dt = null; }
        this._view.camera.rotate(this._cameraAxis, 1);
        this._mesh.rotationY += 1;
        this._mesh2.rotationX += 0.4;
        this._mesh2.rotationY += 0.4;
        this._view.render();
    };
    TorusVortex.prototype.onResize = function (event) {
        if (event === void 0) { event = null; }
        this._view.y = 0;
        this._view.x = 0;
        this._view.width = window.innerWidth;
        this._view.height = window.innerHeight;
    };
    return TorusVortex;
})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9iamVjdDNkL3RvcnVzdm9ydGV4LnRzIl0sIm5hbWVzIjpbIlRvcnVzVm9ydGV4IiwiVG9ydXNWb3J0ZXguY29uc3RydWN0b3IiLCJUb3J1c1ZvcnRleC5sb2FkUmVzb3VyY2VzIiwiVG9ydXNWb3J0ZXguaW1hZ2VDb21wbGV0ZUhhbmRsZXIiLCJUb3J1c1ZvcnRleC5vbkxvYWRDb21wbGV0ZSIsIlRvcnVzVm9ydGV4LnJlbmRlciIsIlRvcnVzVm9ydGV4Lm9uUmVzaXplIl0sIm1hcHBpbmdzIjoiQUFBQSxJQUFPLFFBQVEsV0FBZ0IsK0JBQStCLENBQUMsQ0FBQztBQUNoRSxJQUFPLFNBQVMsV0FBZSwrQkFBK0IsQ0FBQyxDQUFDO0FBQ2hFLElBQU8sbUJBQW1CLFdBQWEseUNBQXlDLENBQUMsQ0FBQztBQUNsRixJQUFPLFVBQVUsV0FBZSxnQ0FBZ0MsQ0FBQyxDQUFDO0FBQ2xFLElBQU8sS0FBSyxXQUFnQiw4QkFBOEIsQ0FBQyxDQUFDO0FBQzVELElBQU8sV0FBVyxXQUFlLHFDQUFxQyxDQUFDLENBQUM7QUFDeEUsSUFBTyxxQkFBcUIsV0FBWSxtREFBbUQsQ0FBQyxDQUFDO0FBQzdGLElBQU8sWUFBWSxXQUFlLHVDQUF1QyxDQUFDLENBQUM7QUFDM0UsSUFBTyxxQkFBcUIsV0FBWSw2Q0FBNkMsQ0FBQyxDQUFDO0FBQ3ZGLElBQU8sS0FBSyxXQUFnQiw2QkFBNkIsQ0FBQyxDQUFDO0FBRTNELElBQU8sSUFBSSxXQUFpQixvQ0FBb0MsQ0FBQyxDQUFDO0FBQ2xFLElBQU8sU0FBUyxXQUFlLG1DQUFtQyxDQUFDLENBQUM7QUFFcEUsSUFBTyxtQkFBbUIsV0FBYSxnREFBZ0QsQ0FBQyxDQUFDO0FBQ3pGLElBQU8sb0JBQW9CLFdBQWEsaURBQWlELENBQUMsQ0FBQztBQUUzRixJQUFPLGVBQWUsV0FBYyw4Q0FBOEMsQ0FBQyxDQUFDO0FBQ3BGLElBQU8sc0JBQXNCLFdBQVksd0RBQXdELENBQUMsQ0FBQztBQUVuRyxJQUFNLFdBQVc7SUFhaEJBLFNBYktBLFdBQVdBO1FBZWZDLEtBQUtBLENBQUNBLFlBQVlBLEdBQUdBLEtBQUtBLENBQUNBO1FBRTNCQSxJQUFJQSxDQUFDQSxLQUFLQSxHQUFHQSxJQUFJQSxJQUFJQSxDQUFDQSxJQUFJQSxlQUFlQSxFQUFFQSxDQUFDQSxDQUFDQTtRQUU3Q0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsZUFBZUEsR0FBR0EsUUFBUUEsQ0FBQ0E7UUFDdENBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLEdBQUdBLEdBQUdBLENBQUNBO1FBQzFCQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtRQUN4QkEsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFDeEJBLElBQUlBLENBQUNBLFdBQVdBLEdBQUdBLElBQUlBLFFBQVFBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO1FBRXpDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxNQUFNQSxDQUFDQSxVQUFVQSxHQUFHQSxJQUFJQSxxQkFBcUJBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1FBQzlEQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxNQUFNQSxDQUFDQSxVQUFVQSxDQUFDQSxJQUFJQSxHQUFHQSxHQUFHQSxDQUFDQTtRQUV4Q0EsSUFBSUEsQ0FBQ0EsS0FBS0EsR0FBR0EsSUFBSUEsbUJBQW1CQSxDQUFDQSxJQUFJQSxFQUFFQSxJQUFJQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQTtRQUN2REEsSUFBSUEsQ0FBQ0EsTUFBTUEsR0FBR0EsSUFBSUEsb0JBQW9CQSxDQUFDQSxHQUFHQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQTtRQUU5REEsSUFBSUEsQ0FBQ0EsYUFBYUEsRUFBRUEsQ0FBQ0E7SUFDdEJBLENBQUNBO0lBRU9ELG1DQUFhQSxHQUFyQkE7UUFBQUUsaUJBT0NBO1FBTEFBLElBQUlBLFVBQVVBLEdBQWNBLElBQUlBLFVBQVVBLENBQUVBLDJCQUEyQkEsQ0FBRUEsQ0FBQ0E7UUFDMUVBLElBQUlBLFNBQVNBLEdBQWFBLElBQUlBLFNBQVNBLEVBQUVBLENBQUNBO1FBQzFDQSxTQUFTQSxDQUFDQSxVQUFVQSxHQUFHQSxtQkFBbUJBLENBQUNBLElBQUlBLENBQUNBO1FBQ2hEQSxTQUFTQSxDQUFDQSxnQkFBZ0JBLENBQUNBLEtBQUtBLENBQUNBLFFBQVFBLEVBQUVBLFVBQUNBLEtBQVdBLElBQUtBLE9BQUFBLEtBQUlBLENBQUNBLG9CQUFvQkEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsRUFBaENBLENBQWdDQSxDQUFDQSxDQUFDQTtRQUM5RkEsU0FBU0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0E7SUFDNUJBLENBQUNBO0lBRU9GLDBDQUFvQkEsR0FBNUJBLFVBQTZCQSxLQUFXQTtRQUF4Q0csaUJBS0NBO1FBSEFBLElBQUlBLFdBQVdBLEdBQXlCQSxLQUFLQSxDQUFDQSxNQUFNQSxDQUFDQTtRQUNyREEsSUFBSUEsQ0FBQ0EsTUFBTUEsR0FBR0EsV0FBV0EsQ0FBQ0EsV0FBV0EsQ0FBQ0EsV0FBV0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7UUFDeERBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLE1BQU1BLEdBQUdBLFVBQUNBLEtBQUtBLElBQUtBLE9BQUFBLEtBQUlBLENBQUNBLGNBQWNBLENBQUNBLEtBQUtBLENBQUNBLEVBQTFCQSxDQUEwQkEsQ0FBQ0E7SUFDNURBLENBQUNBO0lBRU9ILG9DQUFjQSxHQUF0QkEsVUFBdUJBLEtBQUtBO1FBQTVCSSxpQkF3QkNBO1FBdEJBQSxJQUFJQSxLQUFLQSxHQUEwQkEsSUFBSUEsc0JBQXNCQSxDQUFDQSxJQUFJQSxZQUFZQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxFQUFFQSxLQUFLQSxDQUFDQSxFQUFFQSxJQUFJQSxFQUFFQSxJQUFJQSxFQUFFQSxLQUFLQSxDQUFDQSxDQUFDQTtRQUV2SEEsS0FBS0EsQ0FBQ0EsU0FBU0EsR0FBR0EsU0FBU0EsQ0FBQ0EsR0FBR0EsQ0FBQ0E7UUFDaENBLEtBQUtBLENBQUNBLFNBQVNBLEdBQUdBLElBQUlBLENBQUNBO1FBRXZCQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxRQUFRQSxHQUFHQSxLQUFLQSxDQUFDQTtRQUM3QkEsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsUUFBUUEsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFFNUJBLElBQUlBLENBQUNBLEtBQUtBLEdBQVVBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLFlBQVlBLEVBQUVBLENBQUNBO1FBQy9DQSxJQUFJQSxDQUFDQSxNQUFNQSxHQUFVQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxZQUFZQSxFQUFFQSxDQUFDQTtRQUMvQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsR0FBR0EsQ0FBQ0E7UUFDcEJBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBO1FBRW5CQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxLQUFLQSxDQUFDQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtRQUN0Q0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7UUFFdkNBLElBQUlBLENBQUNBLElBQUlBLEdBQUdBLElBQUlBLHFCQUFxQkEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7UUFDekRBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLEVBQUVBLENBQUNBO1FBRWxCQSxNQUFNQSxDQUFDQSxRQUFRQSxHQUFHQSxVQUFDQSxLQUFhQSxJQUFLQSxPQUFBQSxLQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxLQUFLQSxDQUFDQSxFQUFwQkEsQ0FBb0JBLENBQUNBO1FBRTFEQSxJQUFJQSxDQUFDQSxRQUFRQSxFQUFFQSxDQUFDQTtJQUNqQkEsQ0FBQ0E7SUFFTUosNEJBQU1BLEdBQWJBLFVBQWNBLEVBQWdCQTtRQUFoQkssa0JBQWdCQSxHQUFoQkEsU0FBZ0JBO1FBRzdCQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxXQUFXQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUM5Q0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsU0FBU0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7UUFDMUJBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLFNBQVNBLElBQUlBLEdBQUdBLENBQUNBO1FBQzdCQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxTQUFTQSxJQUFJQSxHQUFHQSxDQUFDQTtRQUM3QkEsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0E7SUFDckJBLENBQUNBO0lBRU1MLDhCQUFRQSxHQUFmQSxVQUFnQkEsS0FBb0JBO1FBQXBCTSxxQkFBb0JBLEdBQXBCQSxZQUFvQkE7UUFFbkNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1FBQ2pCQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtRQUVqQkEsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsS0FBS0EsR0FBR0EsTUFBTUEsQ0FBQ0EsVUFBVUEsQ0FBQ0E7UUFDckNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLEdBQUdBLE1BQU1BLENBQUNBLFdBQVdBLENBQUNBO0lBQ3hDQSxDQUFDQTtJQUNGTixrQkFBQ0E7QUFBREEsQ0E5RkEsQUE4RkNBLElBQUEiLCJmaWxlIjoib2JqZWN0M2QvVG9ydXNWb3J0ZXguanMiLCJzb3VyY2VSb290IjoiLi90ZXN0cyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBWZWN0b3IzRFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9nZW9tL1ZlY3RvcjNEXCIpO1xuaW1wb3J0IFVSTExvYWRlclx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvbmV0L1VSTExvYWRlclwiKTtcbmltcG9ydCBVUkxMb2FkZXJEYXRhRm9ybWF0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL25ldC9VUkxMb2FkZXJEYXRhRm9ybWF0XCIpO1xuaW1wb3J0IFVSTFJlcXVlc3RcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL25ldC9VUkxSZXF1ZXN0XCIpO1xuaW1wb3J0IEV2ZW50XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2V2ZW50cy9FdmVudFwiKTtcbmltcG9ydCBQYXJzZXJVdGlsc1x0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvcGFyc2Vycy9QYXJzZXJVdGlsc1wiKTtcbmltcG9ydCBQZXJzcGVjdGl2ZVByb2plY3Rpb25cdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL3Byb2plY3Rpb25zL1BlcnNwZWN0aXZlUHJvamVjdGlvblwiKTtcbmltcG9ydCBJbWFnZVRleHR1cmVcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL3RleHR1cmVzL0ltYWdlVGV4dHVyZVwiKTtcbmltcG9ydCBSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL3V0aWxzL1JlcXVlc3RBbmltYXRpb25GcmFtZVwiKTtcbmltcG9ydCBEZWJ1Z1x0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi91dGlscy9EZWJ1Z1wiKTtcblxuaW1wb3J0IFZpZXdcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9jb250YWluZXJzL1ZpZXdcIik7XG5pbXBvcnQgQmxlbmRNb2RlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9iYXNlL0JsZW5kTW9kZVwiKTtcbmltcG9ydCBNZXNoXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvZW50aXRpZXMvTWVzaFwiKTtcbmltcG9ydCBQcmltaXRpdmVDdWJlUHJlZmFiXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL3ByZWZhYnMvUHJpbWl0aXZlQ3ViZVByZWZhYlwiKTtcbmltcG9ydCBQcmltaXRpdmVUb3J1c1ByZWZhYlx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9wcmVmYWJzL1ByaW1pdGl2ZVRvcnVzUHJlZmFiXCIpO1xuXG5pbXBvcnQgRGVmYXVsdFJlbmRlcmVyXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvcmVuZGVyL0RlZmF1bHRSZW5kZXJlclwiKTtcbmltcG9ydCBUcmlhbmdsZU1ldGhvZE1hdGVyaWFsXHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvVHJpYW5nbGVNZXRob2RNYXRlcmlhbFwiKTtcblxuY2xhc3MgVG9ydXNWb3J0ZXhcbntcblx0cHJpdmF0ZSBfdmlldzpWaWV3O1xuXG5cdHByaXZhdGUgX2N1YmU6UHJpbWl0aXZlQ3ViZVByZWZhYjtcblx0cHJpdmF0ZSBfdG9ydXM6UHJpbWl0aXZlVG9ydXNQcmVmYWI7XG5cdHByaXZhdGUgX21lc2g6TWVzaDtcblx0cHJpdmF0ZSBfbWVzaDI6TWVzaDtcblxuXHRwcml2YXRlIF9yYWY6UmVxdWVzdEFuaW1hdGlvbkZyYW1lO1xuXHRwcml2YXRlIF9pbWFnZTpIVE1MSW1hZ2VFbGVtZW50O1xuXHRwcml2YXRlIF9jYW1lcmFBeGlzOlZlY3RvcjNEO1xuXG5cdGNvbnN0cnVjdG9yKClcblx0e1xuXHRcdERlYnVnLlRIUk9XX0VSUk9SUyA9IGZhbHNlO1xuXG5cdFx0dGhpcy5fdmlldyA9IG5ldyBWaWV3KG5ldyBEZWZhdWx0UmVuZGVyZXIoKSk7XG5cblx0XHR0aGlzLl92aWV3LmJhY2tncm91bmRDb2xvciA9IDB4MDAwMDAwO1xuXHRcdHRoaXMuX3ZpZXcuY2FtZXJhLnggPSAxMzA7XG5cdFx0dGhpcy5fdmlldy5jYW1lcmEueSA9IDA7XG5cdFx0dGhpcy5fdmlldy5jYW1lcmEueiA9IDA7XG5cdFx0dGhpcy5fY2FtZXJhQXhpcyA9IG5ldyBWZWN0b3IzRCgwLCAwLCAxKTtcblxuXHRcdHRoaXMuX3ZpZXcuY2FtZXJhLnByb2plY3Rpb24gPSBuZXcgUGVyc3BlY3RpdmVQcm9qZWN0aW9uKDEyMCk7XG5cdFx0dGhpcy5fdmlldy5jYW1lcmEucHJvamVjdGlvbi5uZWFyID0gMC4xO1xuXG5cdFx0dGhpcy5fY3ViZSA9IG5ldyBQcmltaXRpdmVDdWJlUHJlZmFiKDIwLjAsIDIwLjAsIDIwLjApO1xuXHRcdHRoaXMuX3RvcnVzID0gbmV3IFByaW1pdGl2ZVRvcnVzUHJlZmFiKDE1MCwgODAsIDMyLCAxNiwgdHJ1ZSk7XG5cblx0XHR0aGlzLmxvYWRSZXNvdXJjZXMoKTtcblx0fVxuXG5cdHByaXZhdGUgbG9hZFJlc291cmNlcygpXG5cdHtcblx0XHR2YXIgdXJsUmVxdWVzdDpVUkxSZXF1ZXN0ID0gbmV3IFVSTFJlcXVlc3QoIFwiYXNzZXRzLzEzMDkwOXdhbGxfYmlnLnBuZ1wiICk7XG5cdFx0dmFyIHVybExvYWRlcjpVUkxMb2FkZXIgPSBuZXcgVVJMTG9hZGVyKCk7XG5cdFx0dXJsTG9hZGVyLmRhdGFGb3JtYXQgPSBVUkxMb2FkZXJEYXRhRm9ybWF0LkJMT0I7XG5cdFx0dXJsTG9hZGVyLmFkZEV2ZW50TGlzdGVuZXIoRXZlbnQuQ09NUExFVEUsIChldmVudDpFdmVudCkgPT4gdGhpcy5pbWFnZUNvbXBsZXRlSGFuZGxlcihldmVudCkpO1xuXHRcdHVybExvYWRlci5sb2FkKHVybFJlcXVlc3QpO1xuXHR9XG5cblx0cHJpdmF0ZSBpbWFnZUNvbXBsZXRlSGFuZGxlcihldmVudDpFdmVudClcblx0e1xuXHRcdHZhciBpbWFnZUxvYWRlcjpVUkxMb2FkZXIgPSA8VVJMTG9hZGVyPiBldmVudC50YXJnZXQ7XG5cdFx0dGhpcy5faW1hZ2UgPSBQYXJzZXJVdGlscy5ibG9iVG9JbWFnZShpbWFnZUxvYWRlci5kYXRhKTtcblx0XHR0aGlzLl9pbWFnZS5vbmxvYWQgPSAoZXZlbnQpID0+IHRoaXMub25Mb2FkQ29tcGxldGUoZXZlbnQpO1xuXHR9XG5cblx0cHJpdmF0ZSBvbkxvYWRDb21wbGV0ZShldmVudClcblx0e1xuXHRcdHZhciBtYXRUeDpUcmlhbmdsZU1ldGhvZE1hdGVyaWFsID0gbmV3IFRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWwobmV3IEltYWdlVGV4dHVyZSh0aGlzLl9pbWFnZSwgZmFsc2UpLCB0cnVlLCB0cnVlLCBmYWxzZSk7XG5cblx0XHRtYXRUeC5ibGVuZE1vZGUgPSBCbGVuZE1vZGUuQUREO1xuXHRcdG1hdFR4LmJvdGhTaWRlcyA9IHRydWU7XG5cblx0XHR0aGlzLl90b3J1cy5tYXRlcmlhbCA9IG1hdFR4O1xuXHRcdHRoaXMuX2N1YmUubWF0ZXJpYWwgPSBtYXRUeDtcblxuXHRcdHRoaXMuX21lc2ggPSA8TWVzaD4gdGhpcy5fdG9ydXMuZ2V0TmV3T2JqZWN0KCk7XG5cdFx0dGhpcy5fbWVzaDIgPSA8TWVzaD4gdGhpcy5fY3ViZS5nZXROZXdPYmplY3QoKTtcblx0XHR0aGlzLl9tZXNoMi54ID0gMTMwO1xuXHRcdHRoaXMuX21lc2gyLnogPSA0MDtcblxuXHRcdHRoaXMuX3ZpZXcuc2NlbmUuYWRkQ2hpbGQodGhpcy5fbWVzaCk7XG5cdFx0dGhpcy5fdmlldy5zY2VuZS5hZGRDaGlsZCh0aGlzLl9tZXNoMik7XG5cblx0XHR0aGlzLl9yYWYgPSBuZXcgUmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMucmVuZGVyLCB0aGlzKTtcblx0XHR0aGlzLl9yYWYuc3RhcnQoKTtcblxuXHRcdHdpbmRvdy5vbnJlc2l6ZSA9IChldmVudDpVSUV2ZW50KSA9PiB0aGlzLm9uUmVzaXplKGV2ZW50KTtcblxuXHRcdHRoaXMub25SZXNpemUoKTtcblx0fVxuXG5cdHB1YmxpYyByZW5kZXIoZHQ6bnVtYmVyID0gbnVsbCk6dm9pZFxuXHR7XG5cblx0XHR0aGlzLl92aWV3LmNhbWVyYS5yb3RhdGUodGhpcy5fY2FtZXJhQXhpcywgMSk7XG5cdFx0dGhpcy5fbWVzaC5yb3RhdGlvblkgKz0gMTtcblx0XHR0aGlzLl9tZXNoMi5yb3RhdGlvblggKz0gMC40O1xuXHRcdHRoaXMuX21lc2gyLnJvdGF0aW9uWSArPSAwLjQ7XG5cdFx0dGhpcy5fdmlldy5yZW5kZXIoKTtcblx0fVxuXG5cdHB1YmxpYyBvblJlc2l6ZShldmVudDpVSUV2ZW50ID0gbnVsbClcblx0e1xuXHRcdHRoaXMuX3ZpZXcueSA9IDA7XG5cdFx0dGhpcy5fdmlldy54ID0gMDtcblxuXHRcdHRoaXMuX3ZpZXcud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcblx0XHR0aGlzLl92aWV3LmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcblx0fVxufSJdfQ==