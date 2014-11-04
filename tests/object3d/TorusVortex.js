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
var TriangleBasicMaterial = require("awayjs-renderergl/lib/materials/TriangleBasicMaterial");
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
        var matTx = new TriangleBasicMaterial(new ImageTexture(this._image, false), true, true, false);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9iamVjdDNkL3RvcnVzdm9ydGV4LnRzIl0sIm5hbWVzIjpbIlRvcnVzVm9ydGV4IiwiVG9ydXNWb3J0ZXguY29uc3RydWN0b3IiLCJUb3J1c1ZvcnRleC5sb2FkUmVzb3VyY2VzIiwiVG9ydXNWb3J0ZXguaW1hZ2VDb21wbGV0ZUhhbmRsZXIiLCJUb3J1c1ZvcnRleC5vbkxvYWRDb21wbGV0ZSIsIlRvcnVzVm9ydGV4LnJlbmRlciIsIlRvcnVzVm9ydGV4Lm9uUmVzaXplIl0sIm1hcHBpbmdzIjoiQUFBQSxJQUFPLFFBQVEsV0FBZ0IsK0JBQStCLENBQUMsQ0FBQztBQUNoRSxJQUFPLFNBQVMsV0FBZSwrQkFBK0IsQ0FBQyxDQUFDO0FBQ2hFLElBQU8sbUJBQW1CLFdBQWEseUNBQXlDLENBQUMsQ0FBQztBQUNsRixJQUFPLFVBQVUsV0FBZSxnQ0FBZ0MsQ0FBQyxDQUFDO0FBQ2xFLElBQU8sS0FBSyxXQUFnQiw4QkFBOEIsQ0FBQyxDQUFDO0FBQzVELElBQU8sV0FBVyxXQUFlLHFDQUFxQyxDQUFDLENBQUM7QUFDeEUsSUFBTyxxQkFBcUIsV0FBWSxtREFBbUQsQ0FBQyxDQUFDO0FBQzdGLElBQU8sWUFBWSxXQUFlLHVDQUF1QyxDQUFDLENBQUM7QUFDM0UsSUFBTyxxQkFBcUIsV0FBWSw2Q0FBNkMsQ0FBQyxDQUFDO0FBQ3ZGLElBQU8sS0FBSyxXQUFnQiw2QkFBNkIsQ0FBQyxDQUFDO0FBRTNELElBQU8sSUFBSSxXQUFpQixvQ0FBb0MsQ0FBQyxDQUFDO0FBQ2xFLElBQU8sU0FBUyxXQUFlLG1DQUFtQyxDQUFDLENBQUM7QUFFcEUsSUFBTyxtQkFBbUIsV0FBYSxnREFBZ0QsQ0FBQyxDQUFDO0FBQ3pGLElBQU8sb0JBQW9CLFdBQWEsaURBQWlELENBQUMsQ0FBQztBQUUzRixJQUFPLGVBQWUsV0FBYyw4Q0FBOEMsQ0FBQyxDQUFDO0FBQ3BGLElBQU8scUJBQXFCLFdBQVksdURBQXVELENBQUMsQ0FBQztBQUVqRyxJQUFNLFdBQVc7SUFhaEJBLFNBYktBLFdBQVdBO1FBZWZDLEtBQUtBLENBQUNBLFlBQVlBLEdBQUdBLEtBQUtBLENBQUNBO1FBRTNCQSxJQUFJQSxDQUFDQSxLQUFLQSxHQUFHQSxJQUFJQSxJQUFJQSxDQUFDQSxJQUFJQSxlQUFlQSxFQUFFQSxDQUFDQSxDQUFDQTtRQUU3Q0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsZUFBZUEsR0FBR0EsUUFBUUEsQ0FBQ0E7UUFDdENBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLEdBQUdBLEdBQUdBLENBQUNBO1FBQzFCQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtRQUN4QkEsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFDeEJBLElBQUlBLENBQUNBLFdBQVdBLEdBQUdBLElBQUlBLFFBQVFBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO1FBRXpDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxNQUFNQSxDQUFDQSxVQUFVQSxHQUFHQSxJQUFJQSxxQkFBcUJBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1FBQzlEQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxNQUFNQSxDQUFDQSxVQUFVQSxDQUFDQSxJQUFJQSxHQUFHQSxHQUFHQSxDQUFDQTtRQUV4Q0EsSUFBSUEsQ0FBQ0EsS0FBS0EsR0FBR0EsSUFBSUEsbUJBQW1CQSxDQUFDQSxJQUFJQSxFQUFFQSxJQUFJQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQTtRQUN2REEsSUFBSUEsQ0FBQ0EsTUFBTUEsR0FBR0EsSUFBSUEsb0JBQW9CQSxDQUFDQSxHQUFHQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQTtRQUU5REEsSUFBSUEsQ0FBQ0EsYUFBYUEsRUFBRUEsQ0FBQ0E7SUFDdEJBLENBQUNBO0lBRU9ELG1DQUFhQSxHQUFyQkE7UUFBQUUsaUJBT0NBO1FBTEFBLElBQUlBLFVBQVVBLEdBQWNBLElBQUlBLFVBQVVBLENBQUVBLDJCQUEyQkEsQ0FBRUEsQ0FBQ0E7UUFDMUVBLElBQUlBLFNBQVNBLEdBQWFBLElBQUlBLFNBQVNBLEVBQUVBLENBQUNBO1FBQzFDQSxTQUFTQSxDQUFDQSxVQUFVQSxHQUFHQSxtQkFBbUJBLENBQUNBLElBQUlBLENBQUNBO1FBQ2hEQSxTQUFTQSxDQUFDQSxnQkFBZ0JBLENBQUNBLEtBQUtBLENBQUNBLFFBQVFBLEVBQUVBLFVBQUNBLEtBQVdBLElBQUtBLE9BQUFBLEtBQUlBLENBQUNBLG9CQUFvQkEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsRUFBaENBLENBQWdDQSxDQUFDQSxDQUFDQTtRQUM5RkEsU0FBU0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0E7SUFDNUJBLENBQUNBO0lBRU9GLDBDQUFvQkEsR0FBNUJBLFVBQTZCQSxLQUFXQTtRQUF4Q0csaUJBS0NBO1FBSEFBLElBQUlBLFdBQVdBLEdBQXlCQSxLQUFLQSxDQUFDQSxNQUFNQSxDQUFDQTtRQUNyREEsSUFBSUEsQ0FBQ0EsTUFBTUEsR0FBR0EsV0FBV0EsQ0FBQ0EsV0FBV0EsQ0FBQ0EsV0FBV0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7UUFDeERBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLE1BQU1BLEdBQUdBLFVBQUNBLEtBQUtBLElBQUtBLE9BQUFBLEtBQUlBLENBQUNBLGNBQWNBLENBQUNBLEtBQUtBLENBQUNBLEVBQTFCQSxDQUEwQkEsQ0FBQ0E7SUFDNURBLENBQUNBO0lBRU9ILG9DQUFjQSxHQUF0QkEsVUFBdUJBLEtBQUtBO1FBQTVCSSxpQkF3QkNBO1FBdEJBQSxJQUFJQSxLQUFLQSxHQUF5QkEsSUFBSUEscUJBQXFCQSxDQUFDQSxJQUFJQSxZQUFZQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxFQUFFQSxLQUFLQSxDQUFDQSxFQUFFQSxJQUFJQSxFQUFFQSxJQUFJQSxFQUFFQSxLQUFLQSxDQUFDQSxDQUFDQTtRQUVySEEsS0FBS0EsQ0FBQ0EsU0FBU0EsR0FBR0EsU0FBU0EsQ0FBQ0EsR0FBR0EsQ0FBQ0E7UUFDaENBLEtBQUtBLENBQUNBLFNBQVNBLEdBQUdBLElBQUlBLENBQUNBO1FBRXZCQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxRQUFRQSxHQUFHQSxLQUFLQSxDQUFDQTtRQUM3QkEsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsUUFBUUEsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFFNUJBLElBQUlBLENBQUNBLEtBQUtBLEdBQVVBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLFlBQVlBLEVBQUVBLENBQUNBO1FBQy9DQSxJQUFJQSxDQUFDQSxNQUFNQSxHQUFVQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxZQUFZQSxFQUFFQSxDQUFDQTtRQUMvQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsR0FBR0EsQ0FBQ0E7UUFDcEJBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBO1FBRW5CQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxLQUFLQSxDQUFDQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtRQUN0Q0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7UUFFdkNBLElBQUlBLENBQUNBLElBQUlBLEdBQUdBLElBQUlBLHFCQUFxQkEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7UUFDekRBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLEVBQUVBLENBQUNBO1FBRWxCQSxNQUFNQSxDQUFDQSxRQUFRQSxHQUFHQSxVQUFDQSxLQUFhQSxJQUFLQSxPQUFBQSxLQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxLQUFLQSxDQUFDQSxFQUFwQkEsQ0FBb0JBLENBQUNBO1FBRTFEQSxJQUFJQSxDQUFDQSxRQUFRQSxFQUFFQSxDQUFDQTtJQUNqQkEsQ0FBQ0E7SUFFTUosNEJBQU1BLEdBQWJBLFVBQWNBLEVBQWdCQTtRQUFoQkssa0JBQWdCQSxHQUFoQkEsU0FBZ0JBO1FBRzdCQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxXQUFXQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUM5Q0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsU0FBU0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7UUFDMUJBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLFNBQVNBLElBQUlBLEdBQUdBLENBQUNBO1FBQzdCQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxTQUFTQSxJQUFJQSxHQUFHQSxDQUFDQTtRQUM3QkEsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0E7SUFDckJBLENBQUNBO0lBRU1MLDhCQUFRQSxHQUFmQSxVQUFnQkEsS0FBb0JBO1FBQXBCTSxxQkFBb0JBLEdBQXBCQSxZQUFvQkE7UUFFbkNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1FBQ2pCQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtRQUVqQkEsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsS0FBS0EsR0FBR0EsTUFBTUEsQ0FBQ0EsVUFBVUEsQ0FBQ0E7UUFDckNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLEdBQUdBLE1BQU1BLENBQUNBLFdBQVdBLENBQUNBO0lBQ3hDQSxDQUFDQTtJQUNGTixrQkFBQ0E7QUFBREEsQ0E5RkEsQUE4RkNBLElBQUEiLCJmaWxlIjoib2JqZWN0M2QvVG9ydXNWb3J0ZXguanMiLCJzb3VyY2VSb290IjoiLi90ZXN0cyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBWZWN0b3IzRFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9nZW9tL1ZlY3RvcjNEXCIpO1xuaW1wb3J0IFVSTExvYWRlclx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvbmV0L1VSTExvYWRlclwiKTtcbmltcG9ydCBVUkxMb2FkZXJEYXRhRm9ybWF0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL25ldC9VUkxMb2FkZXJEYXRhRm9ybWF0XCIpO1xuaW1wb3J0IFVSTFJlcXVlc3RcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL25ldC9VUkxSZXF1ZXN0XCIpO1xuaW1wb3J0IEV2ZW50XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2V2ZW50cy9FdmVudFwiKTtcbmltcG9ydCBQYXJzZXJVdGlsc1x0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvcGFyc2Vycy9QYXJzZXJVdGlsc1wiKTtcbmltcG9ydCBQZXJzcGVjdGl2ZVByb2plY3Rpb25cdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL3Byb2plY3Rpb25zL1BlcnNwZWN0aXZlUHJvamVjdGlvblwiKTtcbmltcG9ydCBJbWFnZVRleHR1cmVcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL3RleHR1cmVzL0ltYWdlVGV4dHVyZVwiKTtcbmltcG9ydCBSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL3V0aWxzL1JlcXVlc3RBbmltYXRpb25GcmFtZVwiKTtcbmltcG9ydCBEZWJ1Z1x0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi91dGlscy9EZWJ1Z1wiKTtcblxuaW1wb3J0IFZpZXdcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9jb250YWluZXJzL1ZpZXdcIik7XG5pbXBvcnQgQmxlbmRNb2RlXHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9iYXNlL0JsZW5kTW9kZVwiKTtcbmltcG9ydCBNZXNoXHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvZW50aXRpZXMvTWVzaFwiKTtcbmltcG9ydCBQcmltaXRpdmVDdWJlUHJlZmFiXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL3ByZWZhYnMvUHJpbWl0aXZlQ3ViZVByZWZhYlwiKTtcbmltcG9ydCBQcmltaXRpdmVUb3J1c1ByZWZhYlx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9wcmVmYWJzL1ByaW1pdGl2ZVRvcnVzUHJlZmFiXCIpO1xuXG5pbXBvcnQgRGVmYXVsdFJlbmRlcmVyXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtcmVuZGVyZXJnbC9saWIvcmVuZGVyL0RlZmF1bHRSZW5kZXJlclwiKTtcbmltcG9ydCBUcmlhbmdsZUJhc2ljTWF0ZXJpYWxcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9UcmlhbmdsZUJhc2ljTWF0ZXJpYWxcIik7XG5cbmNsYXNzIFRvcnVzVm9ydGV4XG57XG5cdHByaXZhdGUgX3ZpZXc6VmlldztcblxuXHRwcml2YXRlIF9jdWJlOlByaW1pdGl2ZUN1YmVQcmVmYWI7XG5cdHByaXZhdGUgX3RvcnVzOlByaW1pdGl2ZVRvcnVzUHJlZmFiO1xuXHRwcml2YXRlIF9tZXNoOk1lc2g7XG5cdHByaXZhdGUgX21lc2gyOk1lc2g7XG5cblx0cHJpdmF0ZSBfcmFmOlJlcXVlc3RBbmltYXRpb25GcmFtZTtcblx0cHJpdmF0ZSBfaW1hZ2U6SFRNTEltYWdlRWxlbWVudDtcblx0cHJpdmF0ZSBfY2FtZXJhQXhpczpWZWN0b3IzRDtcblxuXHRjb25zdHJ1Y3RvcigpXG5cdHtcblx0XHREZWJ1Zy5USFJPV19FUlJPUlMgPSBmYWxzZTtcblxuXHRcdHRoaXMuX3ZpZXcgPSBuZXcgVmlldyhuZXcgRGVmYXVsdFJlbmRlcmVyKCkpO1xuXG5cdFx0dGhpcy5fdmlldy5iYWNrZ3JvdW5kQ29sb3IgPSAweDAwMDAwMDtcblx0XHR0aGlzLl92aWV3LmNhbWVyYS54ID0gMTMwO1xuXHRcdHRoaXMuX3ZpZXcuY2FtZXJhLnkgPSAwO1xuXHRcdHRoaXMuX3ZpZXcuY2FtZXJhLnogPSAwO1xuXHRcdHRoaXMuX2NhbWVyYUF4aXMgPSBuZXcgVmVjdG9yM0QoMCwgMCwgMSk7XG5cblx0XHR0aGlzLl92aWV3LmNhbWVyYS5wcm9qZWN0aW9uID0gbmV3IFBlcnNwZWN0aXZlUHJvamVjdGlvbigxMjApO1xuXHRcdHRoaXMuX3ZpZXcuY2FtZXJhLnByb2plY3Rpb24ubmVhciA9IDAuMTtcblxuXHRcdHRoaXMuX2N1YmUgPSBuZXcgUHJpbWl0aXZlQ3ViZVByZWZhYigyMC4wLCAyMC4wLCAyMC4wKTtcblx0XHR0aGlzLl90b3J1cyA9IG5ldyBQcmltaXRpdmVUb3J1c1ByZWZhYigxNTAsIDgwLCAzMiwgMTYsIHRydWUpO1xuXG5cdFx0dGhpcy5sb2FkUmVzb3VyY2VzKCk7XG5cdH1cblxuXHRwcml2YXRlIGxvYWRSZXNvdXJjZXMoKVxuXHR7XG5cdFx0dmFyIHVybFJlcXVlc3Q6VVJMUmVxdWVzdCA9IG5ldyBVUkxSZXF1ZXN0KCBcImFzc2V0cy8xMzA5MDl3YWxsX2JpZy5wbmdcIiApO1xuXHRcdHZhciB1cmxMb2FkZXI6VVJMTG9hZGVyID0gbmV3IFVSTExvYWRlcigpO1xuXHRcdHVybExvYWRlci5kYXRhRm9ybWF0ID0gVVJMTG9hZGVyRGF0YUZvcm1hdC5CTE9CO1xuXHRcdHVybExvYWRlci5hZGRFdmVudExpc3RlbmVyKEV2ZW50LkNPTVBMRVRFLCAoZXZlbnQ6RXZlbnQpID0+IHRoaXMuaW1hZ2VDb21wbGV0ZUhhbmRsZXIoZXZlbnQpKTtcblx0XHR1cmxMb2FkZXIubG9hZCh1cmxSZXF1ZXN0KTtcblx0fVxuXG5cdHByaXZhdGUgaW1hZ2VDb21wbGV0ZUhhbmRsZXIoZXZlbnQ6RXZlbnQpXG5cdHtcblx0XHR2YXIgaW1hZ2VMb2FkZXI6VVJMTG9hZGVyID0gPFVSTExvYWRlcj4gZXZlbnQudGFyZ2V0O1xuXHRcdHRoaXMuX2ltYWdlID0gUGFyc2VyVXRpbHMuYmxvYlRvSW1hZ2UoaW1hZ2VMb2FkZXIuZGF0YSk7XG5cdFx0dGhpcy5faW1hZ2Uub25sb2FkID0gKGV2ZW50KSA9PiB0aGlzLm9uTG9hZENvbXBsZXRlKGV2ZW50KTtcblx0fVxuXG5cdHByaXZhdGUgb25Mb2FkQ29tcGxldGUoZXZlbnQpXG5cdHtcblx0XHR2YXIgbWF0VHg6VHJpYW5nbGVCYXNpY01hdGVyaWFsID0gbmV3IFRyaWFuZ2xlQmFzaWNNYXRlcmlhbChuZXcgSW1hZ2VUZXh0dXJlKHRoaXMuX2ltYWdlLCBmYWxzZSksIHRydWUsIHRydWUsIGZhbHNlKTtcblxuXHRcdG1hdFR4LmJsZW5kTW9kZSA9IEJsZW5kTW9kZS5BREQ7XG5cdFx0bWF0VHguYm90aFNpZGVzID0gdHJ1ZTtcblxuXHRcdHRoaXMuX3RvcnVzLm1hdGVyaWFsID0gbWF0VHg7XG5cdFx0dGhpcy5fY3ViZS5tYXRlcmlhbCA9IG1hdFR4O1xuXG5cdFx0dGhpcy5fbWVzaCA9IDxNZXNoPiB0aGlzLl90b3J1cy5nZXROZXdPYmplY3QoKTtcblx0XHR0aGlzLl9tZXNoMiA9IDxNZXNoPiB0aGlzLl9jdWJlLmdldE5ld09iamVjdCgpO1xuXHRcdHRoaXMuX21lc2gyLnggPSAxMzA7XG5cdFx0dGhpcy5fbWVzaDIueiA9IDQwO1xuXG5cdFx0dGhpcy5fdmlldy5zY2VuZS5hZGRDaGlsZCh0aGlzLl9tZXNoKTtcblx0XHR0aGlzLl92aWV3LnNjZW5lLmFkZENoaWxkKHRoaXMuX21lc2gyKTtcblxuXHRcdHRoaXMuX3JhZiA9IG5ldyBSZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5yZW5kZXIsIHRoaXMpO1xuXHRcdHRoaXMuX3JhZi5zdGFydCgpO1xuXG5cdFx0d2luZG93Lm9ucmVzaXplID0gKGV2ZW50OlVJRXZlbnQpID0+IHRoaXMub25SZXNpemUoZXZlbnQpO1xuXG5cdFx0dGhpcy5vblJlc2l6ZSgpO1xuXHR9XG5cblx0cHVibGljIHJlbmRlcihkdDpudW1iZXIgPSBudWxsKTp2b2lkXG5cdHtcblxuXHRcdHRoaXMuX3ZpZXcuY2FtZXJhLnJvdGF0ZSh0aGlzLl9jYW1lcmFBeGlzLCAxKTtcblx0XHR0aGlzLl9tZXNoLnJvdGF0aW9uWSArPSAxO1xuXHRcdHRoaXMuX21lc2gyLnJvdGF0aW9uWCArPSAwLjQ7XG5cdFx0dGhpcy5fbWVzaDIucm90YXRpb25ZICs9IDAuNDtcblx0XHR0aGlzLl92aWV3LnJlbmRlcigpO1xuXHR9XG5cblx0cHVibGljIG9uUmVzaXplKGV2ZW50OlVJRXZlbnQgPSBudWxsKVxuXHR7XG5cdFx0dGhpcy5fdmlldy55ID0gMDtcblx0XHR0aGlzLl92aWV3LnggPSAwO1xuXG5cdFx0dGhpcy5fdmlldy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuXHRcdHRoaXMuX3ZpZXcuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuXHR9XG59Il19