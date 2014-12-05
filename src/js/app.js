
$(function() {
"use strict";

    var width;
    var height;
    var aspectRatio;

    var scene = new THREE.Scene();
    var camera = new THREE.OrthographicCamera(0, 1, 1, 0, 0, 1);
    var renderer = new THREE.CanvasRenderer({ alpha: true });

    var setSizes = function() {
        width = window.innerWidth;
        height = window.innerHeight;
        aspectRatio = width/height;
        camera.right = width;
        camera.top = height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    };

    $(window).resize(setSizes);
    setSizes();

    $(renderer.domElement).css("display", "block");
    $(renderer.domElement).css("position", "fixed");
    $(renderer.domElement).css("margin", "0");
    $(renderer.domElement).css("padding", "0");
    $(renderer.domElement).css("left", "0");
    $(renderer.domElement).css("top", "0");
    $(renderer.domElement).css("pointer-events", "none");
    $("body").append($(renderer.domElement));

    function buildPlane() {
        var size = 10 + (Math.random() * 25);
        var geometry = new THREE.PlaneGeometry(size, size);
        var map = THREE.ImageUtils.loadTexture("ParticleSmoke.png");
        var material = new THREE.MeshBasicMaterial( { map: map, transparent: true} );
        var plane = new THREE.Mesh(geometry, material);
        plane.position.set(size + (Math.random() * width * 2), height + size + (Math.random() * height), 0);
        plane.speed = [-1 * (20 + (Math.random() * 30)),
            -1 * (30 + (Math.random() * 30))];
        scene.add(plane);
        return plane;
    }
    var planes = _.map(_.range(200), function() {return buildPlane()});

    //camera.position.z = 5;
    var last = new Date().getTime();
    var render = function () {
        requestAnimationFrame(render);
        var current = new Date().getTime();
        var deltat = (current - last) / 1000;
        deltat = deltat > 0.1 ? 0.1 : deltat;

        _.each(_.clone(planes), function(plane) {

            var speed = plane.speed;

            var w = plane.geometry.parameters.width;
            var h = plane.geometry.parameters.height;

            plane.position.x += speed[0] * deltat;
            plane.position.y += speed[1] * deltat;
            if (plane.position.x + w < 0) {
                planes = _.without(planes, plane);
                planes.push(buildPlane());
            }
        });

        renderer.render(scene, camera);
        last = current;
    };

    render();

});