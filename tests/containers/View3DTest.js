var RequestAnimationFrame = require("awayjs-core/lib/utils/RequestAnimationFrame");
var Debug = require("awayjs-core/lib/utils/Debug");
var View = require("awayjs-display/lib/containers/View");
var PointLight = require("awayjs-display/lib/entities/PointLight");
var PrimitiveTorusPrefab = require("awayjs-display/lib/prefabs/PrimitiveTorusPrefab");
var DefaultRenderer = require("awayjs-renderergl/lib/render/DefaultRenderer");
var TriangleBasicMaterial = require("awayjs-renderergl/lib/materials/TriangleBasicMaterial");
var View3DTest = (function () {
    function View3DTest() {
        var _this = this;
        Debug.THROW_ERRORS = false;
        Debug.LOG_PI_ERRORS = false;
        this.meshes = new Array();
        this.light = new PointLight();
        this.view = new View(new DefaultRenderer());
        this.view.camera.z = 0;
        this.view.backgroundColor = 0x776655;
        this.torus = new PrimitiveTorusPrefab(150, 50, 32, 32, false);
        var l = 10;
        var radius = 1000;
        var matB = new TriangleBasicMaterial();
        this.torus.material = matB;
        for (var c = 0; c < l; c++) {
            var t = Math.PI * 2 * c / l;
            var mesh = this.torus.getNewObject();
            mesh.x = Math.cos(t) * radius;
            mesh.y = 0;
            mesh.z = Math.sin(t) * radius;
            this.view.scene.addChild(mesh);
            this.meshes.push(mesh);
        }
        this.view.scene.addChild(this.light);
        this.raf = new RequestAnimationFrame(this.tick, this);
        this.raf.start();
        this.resize(null);
        window.onresize = function (e) { return _this.resize(null); };
    }
    View3DTest.prototype.tick = function (e) {
        for (var c = 0; c < this.meshes.length; c++)
            this.meshes[c].rotationY += 2;
        this.view.camera.rotationY += .5;
        this.view.render();
    };
    View3DTest.prototype.resize = function (e) {
        this.view.y = 0;
        this.view.x = 0;
        this.view.width = window.innerWidth;
        this.view.height = window.innerHeight;
    };
    return View3DTest;
})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRhaW5lcnMvdmlldzNkdGVzdC50cyJdLCJuYW1lcyI6WyJWaWV3M0RUZXN0IiwiVmlldzNEVGVzdC5jb25zdHJ1Y3RvciIsIlZpZXczRFRlc3QudGljayIsIlZpZXczRFRlc3QucmVzaXplIl0sIm1hcHBpbmdzIjoiQUFBQSxJQUFPLHFCQUFxQixXQUFZLDZDQUE2QyxDQUFDLENBQUM7QUFDdkYsSUFBTyxLQUFLLFdBQWdCLDZCQUE2QixDQUFDLENBQUM7QUFFM0QsSUFBTyxJQUFJLFdBQWlCLG9DQUFvQyxDQUFDLENBQUM7QUFFbEUsSUFBTyxVQUFVLFdBQWUsd0NBQXdDLENBQUMsQ0FBQztBQUMxRSxJQUFPLG9CQUFvQixXQUFhLGlEQUFpRCxDQUFDLENBQUM7QUFFM0YsSUFBTyxlQUFlLFdBQWMsOENBQThDLENBQUMsQ0FBQztBQUNwRixJQUFPLHFCQUFxQixXQUFZLHVEQUF1RCxDQUFDLENBQUM7QUFFakcsSUFBTSxVQUFVO0lBVWZBLFNBVktBLFVBQVVBO1FBQWhCQyxpQkF1RUNBO1FBMURDQSxLQUFLQSxDQUFDQSxZQUFZQSxHQUFHQSxLQUFLQSxDQUFDQTtRQUMzQkEsS0FBS0EsQ0FBQ0EsYUFBYUEsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFFNUJBLElBQUlBLENBQUNBLE1BQU1BLEdBQUdBLElBQUlBLEtBQUtBLEVBQVFBLENBQUNBO1FBQ2hDQSxJQUFJQSxDQUFDQSxLQUFLQSxHQUFHQSxJQUFJQSxVQUFVQSxFQUFFQSxDQUFDQTtRQUM5QkEsSUFBSUEsQ0FBQ0EsSUFBSUEsR0FBR0EsSUFBSUEsSUFBSUEsQ0FBQ0EsSUFBSUEsZUFBZUEsRUFBRUEsQ0FBQ0EsQ0FBQUE7UUFDM0NBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1FBQ3ZCQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxlQUFlQSxHQUFHQSxRQUFRQSxDQUFDQTtRQUNyQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsR0FBR0Es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SUFBSUEsQ0FBQ0EsS0FBS0EsR0FBR0EsTUFBTUEsQ0FBQ0EsVUFBVUEsQ0FBQ0E7UUFDcENBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLEdBQUdBLE1BQU1BLENBQUNBLFdBQVdBLENBQUNBO0lBQ3ZDQSxDQUFDQTtJQUNGSCxpQkFBQ0E7QUFBREEsQ0F2RUEsQUF1RUNBLElBQUEiLCJmaWxlIjoiY29udGFpbmVycy9WaWV3M0RUZXN0LmpzIiwic291cmNlUm9vdCI6Ii4vdGVzdHMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVxdWVzdEFuaW1hdGlvbkZyYW1lXHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi91dGlscy9SZXF1ZXN0QW5pbWF0aW9uRnJhbWVcIik7XG5pbXBvcnQgRGVidWdcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvdXRpbHMvRGVidWdcIik7XG5cbmltcG9ydCBWaWV3XHRcdFx0XHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvY29udGFpbmVycy9WaWV3XCIpO1xuaW1wb3J0IE1lc2hcdFx0XHRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1kaXNwbGF5L2xpYi9lbnRpdGllcy9NZXNoXCIpO1xuaW1wb3J0IFBvaW50TGlnaHRcdFx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWRpc3BsYXkvbGliL2VudGl0aWVzL1BvaW50TGlnaHRcIik7XG5pbXBvcnQgUHJpbWl0aXZlVG9ydXNQcmVmYWJcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtZGlzcGxheS9saWIvcHJlZmFicy9QcmltaXRpdmVUb3J1c1ByZWZhYlwiKTtcblxuaW1wb3J0IERlZmF1bHRSZW5kZXJlclx0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLXJlbmRlcmVyZ2wvbGliL3JlbmRlci9EZWZhdWx0UmVuZGVyZXJcIik7XG5pbXBvcnQgVHJpYW5nbGVCYXNpY01hdGVyaWFsXHRcdD0gcmVxdWlyZShcImF3YXlqcy1yZW5kZXJlcmdsL2xpYi9tYXRlcmlhbHMvVHJpYW5nbGVCYXNpY01hdGVyaWFsXCIpO1xuXG5jbGFzcyBWaWV3M0RUZXN0XG57XG5cblx0cHJpdmF0ZSB2aWV3OlZpZXc7XG5cdHByaXZhdGUgdG9ydXM6UHJpbWl0aXZlVG9ydXNQcmVmYWI7XG5cblx0cHJpdmF0ZSBsaWdodDpQb2ludExpZ2h0O1xuXHRwcml2YXRlIHJhZjpSZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XG5cdHByaXZhdGUgbWVzaGVzOkFycmF5PE1lc2g+O1xuXG5cdGNvbnN0cnVjdG9yKClcblx0e1xuXG5cdFx0RGVidWcuVEhST1dfRVJST1JTID0gZmFsc2U7XG5cdFx0RGVidWcuTE9HX1BJX0VSUk9SUyA9IGZhbHNlO1xuXG5cdFx0dGhpcy5tZXNoZXMgPSBuZXcgQXJyYXk8TWVzaD4oKTtcblx0XHR0aGlzLmxpZ2h0ID0gbmV3IFBvaW50TGlnaHQoKTtcblx0XHR0aGlzLnZpZXcgPSBuZXcgVmlldyhuZXcgRGVmYXVsdFJlbmRlcmVyKCkpXG5cdFx0dGhpcy52aWV3LmNhbWVyYS56ID0gMDtcblx0XHR0aGlzLnZpZXcuYmFja2dyb3VuZENvbG9yID0gMHg3NzY2NTU7XG5cdFx0dGhpcy50b3J1cyA9IG5ldyBQcmltaXRpdmVUb3J1c1ByZWZhYigxNTAgLCA1MCAsIDMyICwgMzIgLCBmYWxzZSk7XG5cblx0XHR2YXIgbDpudW1iZXIgICAgICAgID0gMTA7XG5cdFx0dmFyIHJhZGl1czpudW1iZXIgICAgICAgID0gMTAwMDtcblx0XHR2YXIgbWF0QjpUcmlhbmdsZUJhc2ljTWF0ZXJpYWwgPSBuZXcgVHJpYW5nbGVCYXNpY01hdGVyaWFsKCk7XG5cblx0XHR0aGlzLnRvcnVzLm1hdGVyaWFsID0gbWF0QjtcblxuXHRcdGZvciAodmFyIGM6bnVtYmVyID0gMDsgYyA8IGw7IGMrKykge1xuXG5cdFx0XHR2YXIgdDpudW1iZXI9TWF0aC5QSSAqIDIgKiBjIC8gbDtcblxuXHRcdFx0dmFyIG1lc2g6TWVzaCA9IDxNZXNoPiB0aGlzLnRvcnVzLmdldE5ld09iamVjdCgpO1xuXHRcdFx0bWVzaC54ID0gTWF0aC5jb3ModCkqcmFkaXVzO1xuXHRcdFx0bWVzaC55ID0gMDtcblx0XHRcdG1lc2gueiA9IE1hdGguc2luKHQpKnJhZGl1cztcblxuXHRcdFx0dGhpcy52aWV3LnNjZW5lLmFkZENoaWxkKG1lc2gpO1xuXHRcdFx0dGhpcy5tZXNoZXMucHVzaChtZXNoKTtcblxuXHRcdH1cblxuXHRcdHRoaXMudmlldy5zY2VuZS5hZGRDaGlsZCh0aGlzLmxpZ2h0KTtcblxuXHRcdHRoaXMucmFmID0gbmV3IFJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnRpY2sgLCB0aGlzKTtcblx0XHR0aGlzLnJhZi5zdGFydCgpO1xuXHRcdHRoaXMucmVzaXplKCBudWxsICk7XG5cblx0XHR3aW5kb3cub25yZXNpemUgPSAoZSkgPT4gdGhpcy5yZXNpemUobnVsbCk7XG5cblx0fVxuXG5cdHByaXZhdGUgdGljayhlKVxuXHR7XG5cblx0XHRmb3IgKHZhciBjOm51bWJlciA9IDA7IGMgPCB0aGlzLm1lc2hlcy5sZW5ndGg7IGMrKylcblx0XHRcdHRoaXMubWVzaGVzW2NdLnJvdGF0aW9uWSArPSAyO1xuXG5cdFx0dGhpcy52aWV3LmNhbWVyYS5yb3RhdGlvblkgKz0gLjU7XG5cdFx0dGhpcy52aWV3LnJlbmRlcigpO1xuXHR9XG5cblx0cHVibGljIHJlc2l6ZShlKVxuXHR7XG5cdFx0dGhpcy52aWV3LnkgPSAwO1xuXHRcdHRoaXMudmlldy54ID0gMDtcblxuXHRcdHRoaXMudmlldy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuXHRcdHRoaXMudmlldy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cdH1cbn0iXX0=