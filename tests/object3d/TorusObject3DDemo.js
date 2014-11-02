var URLLoader = require("awayjs-core/lib/net/URLLoader");
var URLLoaderDataFormat = require("awayjs-core/lib/net/URLLoaderDataFormat");
var URLRequest = require("awayjs-core/lib/net/URLRequest");
var AwayEvent = require("awayjs-core/lib/events/Event");
var ParserUtils = require("awayjs-core/lib/parsers/ParserUtils");
var ImageTexture = require("awayjs-core/lib/textures/ImageTexture");
var RequestAnimationFrame = require("awayjs-core/lib/utils/RequestAnimationFrame");
var Debug = require("awayjs-core/lib/utils/Debug");
var View = require("awayjs-display/lib/containers/View");
var PointLight = require("awayjs-display/lib/entities/PointLight");
var StaticLightPicker = require("awayjs-display/lib/materials/lightpickers/StaticLightPicker");
var PrimitiveTorusPrefab = require("awayjs-display/lib/prefabs/PrimitiveTorusPrefab");
var DefaultRenderer = require("awayjs-renderergl/lib/render/DefaultRenderer");
var TriangleMethodMaterial = require("awayjs-renderergl/lib/materials/TriangleMethodMaterial");
var TorusObject3DDemo = (function () {
    function TorusObject3DDemo() {
        var _this = this;
        this.t = 0;
        this.tPos = 0;
        this.radius = 1000;
        this.follow = true;
        Debug.THROW_ERRORS = false;
        Debug.LOG_PI_ERRORS = false;
        this.meshes = new Array();
        this.light = new PointLight();
        this.view = new View(new DefaultRenderer());
        this.pointLight = new PointLight();
        this.lightPicker = new StaticLightPicker([this.pointLight]);
        this.view.scene.addChild(this.pointLight);
        var perspectiveLens = this.view.camera.projection;
        perspectiveLens.fieldOfView = 75;
        this.view.camera.z = 0;
        this.view.backgroundColor = 0x000000;
        this.view.backgroundAlpha = 1;
        this.torus = new PrimitiveTorusPrefab(150, 50, 32, 32, false);
        var l = 10;
        for (var c = 0; c < l; c++) {
            var t = Math.PI * 2 * c / l;
            var mesh = this.torus.getNewObject();
            mesh.x = Math.cos(t) * this.radius;
            mesh.y = 0;
            mesh.z = Math.sin(t) * this.radius;
            this.view.scene.addChild(mesh);
            this.meshes.push(mesh);
        }
        this.view.scene.addChild(this.light);
        this.raf = new RequestAnimationFrame(this.tick, this);
        this.raf.start();
        this.onResize();
        document.onmousedown = function (event) { return _this.followObject(event); };
        window.onresize = function (event) { return _this.onResize(event); };
        this.loadResources();
    }
    TorusObject3DDemo.prototype.loadResources = function () {
        var _this = this;
        var urlRequest = new URLRequest("assets/custom_uv_horizontal.png");
        var urlLoader = new URLLoader();
        urlLoader.dataFormat = URLLoaderDataFormat.BLOB;
        urlLoader.addEventListener(AwayEvent.COMPLETE, function (event) { return _this.imageCompleteHandler(event); });
        urlLoader.load(urlRequest);
    };
    TorusObject3DDemo.prototype.imageCompleteHandler = function (event) {
        var _this = this;
        var urlLoader = event.target;
        this._image = ParserUtils.blobToImage(urlLoader.data);
        this._image.onload = function (event) { return _this.onImageLoadComplete(event); };
    };
    TorusObject3DDemo.prototype.onImageLoadComplete = function (event) {
        var matTx = new TriangleMethodMaterial(new ImageTexture(this._image, false), true, true, false);
        matTx.lightPicker = this.lightPicker;
        for (var c = 0; c < this.meshes.length; c++)
            this.meshes[c].material = matTx;
    };
    TorusObject3DDemo.prototype.tick = function (dt) {
        this.tPos += .02;
        for (var c = 0; c < this.meshes.length; c++) {
            var objPos = Math.PI * 2 * c / this.meshes.length;
            this.t += .005;
            var s = 1.2 + Math.sin(this.t + objPos);
            this.meshes[c].rotationY += 2 * (c / this.meshes.length);
            this.meshes[c].rotationX += 2 * (c / this.meshes.length);
            this.meshes[c].rotationZ += 2 * (c / this.meshes.length);
            this.meshes[c].scaleX = this.meshes[c].scaleY = this.meshes[c].scaleZ = s;
            this.meshes[c].x = Math.cos(objPos + this.tPos) * this.radius;
            this.meshes[c].y = Math.sin(this.t) * 500;
            this.meshes[c].z = Math.sin(objPos + this.tPos) * this.radius;
        }
        //this.view.camera.y = Math.sin( this.tPos ) * 1500;
        if (this.follow)
            this.view.camera.lookAt(this.meshes[0].transform.position);
        this.view.camera.y = Math.sin(this.tPos) * 1500;
        this.view.render();
    };
    TorusObject3DDemo.prototype.onResize = function (event) {
        if (event === void 0) { event = null; }
        this.view.y = 0;
        this.view.x = 0;
        this.view.width = window.innerWidth;
        this.view.height = window.innerHeight;
    };
    TorusObject3DDemo.prototype.followObject = function (e) {
        this.follow = !this.follow;
    };
    return TorusObject3DDemo;
})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9iamVjdDNkL3RvcnVzb2JqZWN0M2RkZW1vLnRzIl0sIm5hbWVzIjpbIlRvcnVzT2JqZWN0M0REZW1vIiwiVG9ydXNPYmplY3QzRERlbW8uY29uc3RydWN0b3IiLCJUb3J1c09iamVjdDNERGVtby5sb2FkUmVzb3VyY2VzIiwiVG9ydXNPYmplY3QzRERlbW8uaW1hZ2VDb21wbGV0ZUhhbmRsZXIiLCJUb3J1c09iamVjdDNERGVtby5vbkltYWdlTG9hZENvbXBsZXRlIiwiVG9ydXNPYmplY3QzRERlbW8udGljayIsIlRvcnVzT2JqZWN0M0REZW1vLm9uUmVzaXplIiwiVG9ydXNPYmplY3QzRERlbW8uZm9sbG93T2JqZWN0Il0sIm1hcHBpbmdzIjoiQUFBQSxJQUFPLFNBQVMsV0FBZSwrQkFBK0IsQ0FBQyxDQUFDO0FBQ2hFLElBQU8sbUJBQW1CLFdBQWEseUNBQXlDLENBQUMsQ0FBQztBQUNsRixJQUFPLFVBQVUsV0FBZSxnQ0FBZ0MsQ0FBQyxDQUFDO0FBQ2xFLElBQU8sU0FBUyxXQUFlLDhCQUE4QixDQUFDLENBQUM7QUFDL0QsSUFBTyxXQUFXLFdBQWUscUNBQXFDLENBQUMsQ0FBQztBQUV4RSxJQUFPLFlBQVksV0FBZSx1Q0FBdUMsQ0FBQyxDQUFDO0FBQzNFLElBQU8scUJBQXFCLFdBQVksNkNBQTZDLENBQUMsQ0FBQztBQUN2RixJQUFPLEtBQUssV0FBZ0IsNkJBQTZCLENBQUMsQ0FBQztBQUUzRCxJQUFPLElBQUksV0FBaUIsb0NBQW9DLENBQUMsQ0FBQztBQUVsRSxJQUFPLFVBQVUsV0FBZSx3Q0FBd0MsQ0FBQyxDQUFDO0FBQzFFLElBQU8saUJBQWlCLFdBQWEsNkRBQTZELENBQUMsQ0FBQztBQUNwRyxJQUFPLG9CQUFvQixXQUFhLGlEQUFpRCxDQUFDLENBQUM7QUFFM0YsSUFBTyxlQUFlLFdBQWMsOENBQThDLENBQUMsQ0FBQztBQUNwRixJQUFPLHNCQUFzQixXQUFZLHdEQUF3RCxDQUFDLENBQUM7QUFFbkcsSUFBTSxpQkFBaUI7SUFtQnRCQSxTQW5CS0EsaUJBQWlCQTtRQUF2QkMsaUJBMklDQTtRQWxJUUEsTUFBQ0EsR0FBVUEsQ0FBQ0EsQ0FBQ0E7UUFDYkEsU0FBSUEsR0FBVUEsQ0FBQ0EsQ0FBQ0E7UUFDaEJBLFdBQU1BLEdBQVVBLElBQUlBLENBQUNBO1FBQ3JCQSxXQUFNQSxHQUFXQSxJQUFJQSxDQUFDQTtRQVM3QkEsS0FBS0EsQ0FBQ0EsWUFBWUEsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFDM0JBLEtBQUtBLENBQUNBLGFBQWFBLEdBQUdBLEtBQUtBLENBQUNBO1FBRTVCQSxJQUFJQSxDQUFDQSxNQUFNQSxHQUFHQSxJQUFJQSxLQUFLQSxFQUFRQSxDQUFDQTtRQUNoQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsR0FBR0EsSUFBSUEsVUFBVUEsRUFBRUEsQ0FBQ0E7UUFDOUJBLElBQUlBLENBQUNBLElBQUlBLEdBQUdBLElBQUlBLElBQUlBLENBQUNBLElBQUlBLGVBQWVBLEVBQUVBLENBQUNBLENBQUNBO1FBQzVDQSxJQUFJQSxDQUFDQSxVQUFVQSxHQUFHQSxJQUFJQSxVQUFVQSxFQUFFQSxDQUFDQTtRQUNuQ0EsSUFBSUEsQ0FBQ0EsV0FBV0EsR0FBR0EsSUFBSUEsaUJBQWlCQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUU1REEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsQ0FBQ0E7UUFFMUNBLElBQUlBLGVBQWVBLEdBQWlEQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxVQUFVQSxDQUFDQTtRQUNoR0EsZUFBZUEsQ0FBQ0EsV0FBV0EsR0FBR0EsRUFBRUEsQ0FBQ0E7UUFFakNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1FBQ3ZCQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxlQUFlQSxHQUFHQSxRQUFRQSxDQUFDQTtRQUNyQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsZUFBZUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFDOUJBLElBQUlBLENBQUNBLEtBQUtBLEdBQUdBLElBQUlBLG9CQUFvQkEsQ0FBQ0EsR0FBR0EsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsRUFBRUEsS0FBS0EsQ0FBQ0EsQ0FBQ0E7UUFFOURBLElBQUlBLENBQUNBLEdBQVVBLEVBQUVBLENBQUNBO1FBR2xCQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFZQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFHQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtZQUV0Q0EsSUFBSUEsQ0FBQ0EsR0FBVUEsSUFBSUEsQ0FBQ0EsRUFBRUEsR0FBR0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFFbkNBLElBQUlBLElBQUlBLEdBQWVBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLFlBQVlBLEVBQUVBLENBQUNBO1lBQ2pEQSxJQUFJQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQTtZQUNqQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFDWEEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7WUFFakNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO1lBQy9CQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtRQUV4QkEsQ0FBQ0E7UUFFREEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsUUFB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QUNBLEdBQUdBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLE1BQU1BLEVBQUdBLENBQUNBLEVBQUdBLEVBQUVBLENBQUNBO1lBQ3ZEQSxJQUFJQSxNQUFNQSxHQUFRQSxJQUFJQSxDQUFDQSxFQUFFQSxHQUFDQSxDQUFDQSxHQUFDQSxDQUFDQSxHQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQTtZQUVqREEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsSUFBSUEsQ0FBQ0E7WUFDZkEsSUFBSUEsQ0FBQ0EsR0FBVUEsR0FBR0EsR0FBR0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7WUFFL0NBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLFNBQVNBLElBQUlBLENBQUNBLEdBQUNBLENBQUNBLENBQUNBLEdBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO1lBQ3JEQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxTQUFTQSxJQUFJQSxDQUFDQSxHQUFDQSxDQUFDQSxDQUFDQSxHQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQTtZQUNyREEsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsU0FBU0EsSUFBSUEsQ0FBQ0EsR0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7WUFDckRBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLE1BQU1BLEdBQUdBLENBQUNBLENBQUNBO1lBQzFFQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxNQUFNQSxHQUFHQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQTtZQUM1REEsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBQ0EsR0FBR0EsQ0FBQ0E7WUFDeENBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEdBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBO1FBQzdEQSxDQUFDQTtRQUVEQSxBQUVBQSxvREFGb0RBO1FBRXBEQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQTtZQUNmQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxTQUFTQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQTtRQUU1REEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0E7UUFFaERBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBO0lBQ3BCQSxDQUFDQTtJQUVNTCxvQ0FBUUEsR0FBZkEsVUFBZ0JBLEtBQW9CQTtRQUFwQk0scUJBQW9CQSxHQUFwQkEsWUFBb0JBO1FBRW5DQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtRQUNoQkEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFFaEJBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLEdBQUdBLE1BQU1BLENBQUNBLFVBQVVBLENBQUNBO1FBQ3BDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxHQUFHQSxNQUFNQSxDQUFDQSxXQUFXQSxDQUFDQTtJQUN2Q0EsQ0FBQ0E7SUFFTU4sd0NBQVlBLEdBQW5CQSxVQUFvQkEsQ0FBQ0E7UUFFcEJPLElBQUlBLENBQUNBLE1BQU1BLEdBQUdBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBO0lBQzVCQSxDQUFDQTtJQUNGUCx3QkFBQ0E7QUFBREEsQ0EzSUEsQUEySUNBLElBQUEiLCJmaWxlIjoib2JqZWN0M2QvVG9ydXNPYmplY3QzRERlbW8uanMiLCJzb3VyY2VSb290IjoiLi90ZXN0cyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBVUkxMb2FkZXJcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL25ldC9VUkxMb2FkZXJcIik7XG5pbXBvcnQgVVJMTG9hZGVyRGF0YUZvcm1hdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9uZXQvVVJMTG9hZGVyRGF0YUZvcm1hdFwiKTtcbmltcG9ydCBVUkxSZXF1ZXN0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9uZXQvVVJMUmVxdWVzdFwiKTtcbmltcG9ydCBBd2F5RXZlbnRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2V2ZW50cy9FdmVudFwiKTtcbmltcG9ydCBQYXJzZXJVdGlsc1x0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvcGFyc2Vycy9QYXJzZXJVdGlsc1wiKTtcbmltcG9ydCBQZXJzcGVjdGl2ZVByb2plY3Rpb25cdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL3Byb2plY3Rpb25zL1BlcnNwZWN0aXZlUHJvamVjdGlvblwiKTtcbmltcG9ydCBJbWFnZVRleHR1cmVcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL3RleHR1cmVzL0ltYWdlVGV4dHVyZVwiKTtcbmltcG9ydCBSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL3V0aWxzL1JlcXVlc3RBbmltYXRpb25GcmFtZVwiKTtcbmltcG9ydCBEZWJ1Z1x0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi91dGlscy9EZWJ1Z1wiKTtcblxuaW1wb3J0IFZpZXdcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9jb250YWluZXJzL1ZpZXdcIik7XG5pbXBvcnQgTWVzaFx0XHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2VudGl0aWVzL01lc2hcIik7XG5pbXBvcnQgUG9pbnRMaWdodFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvZW50aXRpZXMvUG9pbnRMaWdodFwiKTtcbmltcG9ydCBTdGF0aWNMaWdodFBpY2tlclx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9tYXRlcmlhbHMvbGlnaHRwaWNrZXJzL1N0YXRpY0xpZ2h0UGlja2VyXCIpO1xuaW1wb3J0IFByaW1pdGl2ZVRvcnVzUHJlZmFiXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL3ByZWZhYnMvUHJpbWl0aXZlVG9ydXNQcmVmYWJcIik7XG5cbmltcG9ydCBEZWZhdWx0UmVuZGVyZXJcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9yZW5kZXIvRGVmYXVsdFJlbmRlcmVyXCIpO1xuaW1wb3J0IFRyaWFuZ2xlTWV0aG9kTWF0ZXJpYWxcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL21hdGVyaWFscy9UcmlhbmdsZU1ldGhvZE1hdGVyaWFsXCIpO1xuXG5jbGFzcyBUb3J1c09iamVjdDNERGVtb1xue1xuXHRwcml2YXRlIHZpZXc6Vmlldztcblx0cHJpdmF0ZSB0b3J1czpQcmltaXRpdmVUb3J1c1ByZWZhYjtcblxuXHRwcml2YXRlIGxpZ2h0OlBvaW50TGlnaHQ7XG5cdHByaXZhdGUgcmFmOlJlcXVlc3RBbmltYXRpb25GcmFtZTtcblx0cHJpdmF0ZSBtZXNoZXM6QXJyYXk8TWVzaD47XG5cblx0cHJpdmF0ZSB0Om51bWJlciA9IDA7XG5cdHByaXZhdGUgdFBvczpudW1iZXIgPSAwO1xuXHRwcml2YXRlIHJhZGl1czpudW1iZXIgPSAxMDAwO1xuXHRwcml2YXRlIGZvbGxvdzpib29sZWFuID0gdHJ1ZTtcblxuXHRwcml2YXRlIHBvaW50TGlnaHQ6UG9pbnRMaWdodDtcblx0cHJpdmF0ZSBsaWdodFBpY2tlcjpTdGF0aWNMaWdodFBpY2tlcjtcblxuXHRwcml2YXRlIF9pbWFnZTpIVE1MSW1hZ2VFbGVtZW50O1xuXG5cdGNvbnN0cnVjdG9yKClcblx0e1xuXHRcdERlYnVnLlRIUk9XX0VSUk9SUyA9IGZhbHNlO1xuXHRcdERlYnVnLkxPR19QSV9FUlJPUlMgPSBmYWxzZTtcblxuXHRcdHRoaXMubWVzaGVzID0gbmV3IEFycmF5PE1lc2g+KCk7XG5cdFx0dGhpcy5saWdodCA9IG5ldyBQb2ludExpZ2h0KCk7XG5cdFx0dGhpcy52aWV3ID0gbmV3IFZpZXcobmV3IERlZmF1bHRSZW5kZXJlcigpKTtcblx0XHR0aGlzLnBvaW50TGlnaHQgPSBuZXcgUG9pbnRMaWdodCgpO1xuXHRcdHRoaXMubGlnaHRQaWNrZXIgPSBuZXcgU3RhdGljTGlnaHRQaWNrZXIoW3RoaXMucG9pbnRMaWdodF0pO1xuXG5cdFx0dGhpcy52aWV3LnNjZW5lLmFkZENoaWxkKHRoaXMucG9pbnRMaWdodCk7XG5cblx0XHR2YXIgcGVyc3BlY3RpdmVMZW5zOlBlcnNwZWN0aXZlUHJvamVjdGlvbiA9IDxQZXJzcGVjdGl2ZVByb2plY3Rpb24+IHRoaXMudmlldy5jYW1lcmEucHJvamVjdGlvbjtcblx0XHRwZXJzcGVjdGl2ZUxlbnMuZmllbGRPZlZpZXcgPSA3NTtcblxuXHRcdHRoaXMudmlldy5jYW1lcmEueiA9IDA7XG5cdFx0dGhpcy52aWV3LmJhY2tncm91bmRDb2xvciA9IDB4MDAwMDAwO1xuXHRcdHRoaXMudmlldy5iYWNrZ3JvdW5kQWxwaGEgPSAxO1xuXHRcdHRoaXMudG9ydXMgPSBuZXcgUHJpbWl0aXZlVG9ydXNQcmVmYWIoMTUwLCA1MCwgMzIsIDMyLCBmYWxzZSk7XG5cblx0XHR2YXIgbDpudW1iZXIgPSAxMDtcblx0XHQvL3ZhciByYWRpdXM6bnVtYmVyID0gMTAwMDtcblxuXHRcdGZvciAodmFyIGMgOiBudW1iZXIgPSAwOyBjIDwgbCA7IGMrKykge1xuXG5cdFx0XHR2YXIgdCA6IG51bWJlcj1NYXRoLlBJICogMiAqIGMgLyBsO1xuXG5cdFx0XHR2YXIgbWVzaDpNZXNoID0gPE1lc2g+IHRoaXMudG9ydXMuZ2V0TmV3T2JqZWN0KCk7XG5cdFx0XHRtZXNoLnggPSBNYXRoLmNvcyh0KSp0aGlzLnJhZGl1cztcblx0XHRcdG1lc2gueSA9IDA7XG5cdFx0XHRtZXNoLnogPSBNYXRoLnNpbih0KSp0aGlzLnJhZGl1cztcblxuXHRcdFx0dGhpcy52aWV3LnNjZW5lLmFkZENoaWxkKG1lc2gpO1xuXHRcdFx0dGhpcy5tZXNoZXMucHVzaChtZXNoKTtcblxuXHRcdH1cblxuXHRcdHRoaXMudmlldy5zY2VuZS5hZGRDaGlsZCh0aGlzLmxpZ2h0KTtcblxuXHRcdHRoaXMucmFmID0gbmV3IFJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnRpY2ssIHRoaXMpO1xuXHRcdHRoaXMucmFmLnN0YXJ0KCk7XG5cdFx0dGhpcy5vblJlc2l6ZSgpO1xuXG5cdFx0ZG9jdW1lbnQub25tb3VzZWRvd24gPSAoZXZlbnQ6TW91c2VFdmVudCkgPT4gdGhpcy5mb2xsb3dPYmplY3QoZXZlbnQpO1xuXG5cdFx0d2luZG93Lm9ucmVzaXplID0gKGV2ZW50OlVJRXZlbnQpID0+IHRoaXMub25SZXNpemUoZXZlbnQpO1xuXG5cdFx0dGhpcy5sb2FkUmVzb3VyY2VzKCk7XG5cdH1cblxuXHRwcml2YXRlIGxvYWRSZXNvdXJjZXMoKVxuXHR7XG5cdFx0dmFyIHVybFJlcXVlc3Q6VVJMUmVxdWVzdCA9IG5ldyBVUkxSZXF1ZXN0KFwiYXNzZXRzL2N1c3RvbV91dl9ob3Jpem9udGFsLnBuZ1wiKTtcblx0XHR2YXIgdXJsTG9hZGVyOlVSTExvYWRlciA9IG5ldyBVUkxMb2FkZXIoKTtcblx0XHR1cmxMb2FkZXIuZGF0YUZvcm1hdCA9IFVSTExvYWRlckRhdGFGb3JtYXQuQkxPQjtcblx0XHR1cmxMb2FkZXIuYWRkRXZlbnRMaXN0ZW5lcihBd2F5RXZlbnQuQ09NUExFVEUsIChldmVudDpBd2F5RXZlbnQpID0+IHRoaXMuaW1hZ2VDb21wbGV0ZUhhbmRsZXIoZXZlbnQpKTtcblx0XHR1cmxMb2FkZXIubG9hZCh1cmxSZXF1ZXN0KTtcblx0fVxuXG5cdHByaXZhdGUgaW1hZ2VDb21wbGV0ZUhhbmRsZXIoZXZlbnQ6QXdheUV2ZW50KVxuXHR7XG5cdFx0dmFyIHVybExvYWRlcjpVUkxMb2FkZXIgPSA8VVJMTG9hZGVyPiBldmVudC50YXJnZXQ7XG5cblx0XHR0aGlzLl9pbWFnZSA9IFBhcnNlclV0aWxzLmJsb2JUb0ltYWdlKHVybExvYWRlci5kYXRhKTtcblx0XHR0aGlzLl9pbWFnZS5vbmxvYWQgPSAoZXZlbnQ6RXZlbnQpID0+IHRoaXMub25JbWFnZUxvYWRDb21wbGV0ZShldmVudCk7XG5cblx0fVxuXG5cdHByaXZhdGUgb25JbWFnZUxvYWRDb21wbGV0ZShldmVudDpFdmVudClcblx0e1xuXHRcdHZhciBtYXRUeDogVHJpYW5nbGVNZXRob2RNYXRlcmlhbCA9IG5ldyBUcmlhbmdsZU1ldGhvZE1hdGVyaWFsKG5ldyBJbWFnZVRleHR1cmUodGhpcy5faW1hZ2UsIGZhbHNlKSwgdHJ1ZSwgdHJ1ZSwgZmFsc2UpO1xuXHRcdG1hdFR4LmxpZ2h0UGlja2VyID0gIHRoaXMubGlnaHRQaWNrZXI7XG5cblx0XHRmb3IgKHZhciBjOm51bWJlciA9IDA7IGMgPCB0aGlzLm1lc2hlcy5sZW5ndGg7IGMgKyspXG5cdFx0XHR0aGlzLm1lc2hlc1tjXS5tYXRlcmlhbCA9IG1hdFR4O1xuXHR9XG5cblx0cHJpdmF0ZSB0aWNrKGR0Om51bWJlcilcblx0e1xuXHRcdHRoaXMudFBvcyArPSAuMDI7XG5cblx0XHRmb3IgKHZhciBjOm51bWJlciA9IDAgOyBjIDwgdGhpcy5tZXNoZXMubGVuZ3RoIDsgYyArKykge1xuXHRcdFx0dmFyIG9ialBvczpudW1iZXI9TWF0aC5QSSoyKmMvdGhpcy5tZXNoZXMubGVuZ3RoO1xuXG5cdFx0XHR0aGlzLnQgKz0gLjAwNTtcblx0XHRcdHZhciBzOm51bWJlciA9IDEuMiArIE1hdGguc2luKHRoaXMudCArIG9ialBvcyk7XG5cblx0XHRcdHRoaXMubWVzaGVzW2NdLnJvdGF0aW9uWSArPSAyKihjL3RoaXMubWVzaGVzLmxlbmd0aCk7XG5cdFx0XHR0aGlzLm1lc2hlc1tjXS5yb3RhdGlvblggKz0gMiooYy90aGlzLm1lc2hlcy5sZW5ndGgpO1xuXHRcdFx0dGhpcy5tZXNoZXNbY10ucm90YXRpb25aICs9IDIqKGMvdGhpcy5tZXNoZXMubGVuZ3RoKTtcblx0XHRcdHRoaXMubWVzaGVzW2NdLnNjYWxlWCA9IHRoaXMubWVzaGVzW2NdLnNjYWxlWSA9IHRoaXMubWVzaGVzW2NdLnNjYWxlWiA9IHM7XG5cdFx0XHR0aGlzLm1lc2hlc1tjXS54ID0gTWF0aC5jb3Mob2JqUG9zICsgdGhpcy50UG9zKSp0aGlzLnJhZGl1cztcblx0XHRcdHRoaXMubWVzaGVzW2NdLnkgPSBNYXRoLnNpbih0aGlzLnQpKjUwMDtcblx0XHRcdHRoaXMubWVzaGVzW2NdLnogPSBNYXRoLnNpbihvYmpQb3MgKyB0aGlzLnRQb3MpKnRoaXMucmFkaXVzO1xuXHRcdH1cblxuXHRcdC8vdGhpcy52aWV3LmNhbWVyYS55ID0gTWF0aC5zaW4oIHRoaXMudFBvcyApICogMTUwMDtcblxuXHRcdGlmICh0aGlzLmZvbGxvdylcblx0XHRcdHRoaXMudmlldy5jYW1lcmEubG9va0F0KHRoaXMubWVzaGVzWzBdLnRyYW5zZm9ybS5wb3NpdGlvbik7XG5cblx0XHR0aGlzLnZpZXcuY2FtZXJhLnkgPSBNYXRoLnNpbih0aGlzLnRQb3MpICogMTUwMDtcblxuXHRcdHRoaXMudmlldy5yZW5kZXIoKTtcblx0fVxuXG5cdHB1YmxpYyBvblJlc2l6ZShldmVudDpVSUV2ZW50ID0gbnVsbClcblx0e1xuXHRcdHRoaXMudmlldy55ID0gMDtcblx0XHR0aGlzLnZpZXcueCA9IDA7XG5cblx0XHR0aGlzLnZpZXcud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcblx0XHR0aGlzLnZpZXcuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuXHR9XG5cblx0cHVibGljIGZvbGxvd09iamVjdChlKVxuXHR7XG5cdFx0dGhpcy5mb2xsb3cgPSAhdGhpcy5mb2xsb3c7XG5cdH1cbn0iXX0=