
$(function() {
"use strict";

    var width;
    var height;
    var aspectRatio;

    var scene = new THREE.Scene();
    var camera = new THREE.OrthographicCamera(0, 1, 1, 0, 0, 1);
    var renderer;
    if (window.WebGLRenderingContext)
        renderer = new THREE.WebGLRenderer({ alpha: true });
    else
        renderer = new THREE.CanvasRenderer({ alpha: true });

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

    var image = document.createElement("canvas");
    image.width = 64;
    image.height = 64;

    (function() {
        var context = image.getContext('2d');
        var centerX = image.width / 2;
        var centerY = image.height / 2;
        var radius = image.width / 2;

        var iterations = 100;

        _.each(_.range(iterations), function(el) {
            el = el + 1;
            context.beginPath();
            context.arc(centerX, centerY, radius * (1 - (el / iterations)), 0, 2 * Math.PI, false);
            context.fillStyle = 'rgba(255, 255, 255, ' + ((el / iterations) * 0.05) + ')';
            context.fill();
        });
    })();

    function buildPlane() {
        var size = 10 + (Math.random() * 25);
        var geometry = new THREE.PlaneGeometry(size, size);
        var map = new THREE.Texture(image);
        map.needsUpdate = true;
        var material = new THREE.MeshBasicMaterial( { map: map, transparent: true} );
        var plane = new THREE.Mesh(geometry, material);
        plane.position.set(-(width / 2) + (Math.random() * width * 2), height + size + (Math.random() * height), 0);

        plane.gravity = new THREE.Vector3(0, -1 * (30 + (Math.random() * 30)), 0);
        plane.force1 = new THREE.Vector3((Math.random() * 2 > 1 ? 1 : -1) * (20 + (Math.random() * 30)), 0, 0);
        plane.force2 = new THREE.Vector3((plane.force1.x < 0 ? 1 : -1) * (20 + (Math.random() * 30)), 0, 0);
        plane.lastChange = new Date().getTime();
        plane.nextChange = (new Date().getTime() / 1000) + 1 + Math.random() * 3;
        scene.add(plane);
        return plane;
    }
    var planes = _.map(_.range(200), function() {return buildPlane()});

    var last = new Date().getTime();
    var render = function () {
        requestAnimationFrame(render);
        var current = new Date().getTime();
        var deltat = (current - last) / 1000;
        deltat = deltat > 0.1 ? 0.1 : deltat;

        _.each(_.clone(planes), function(plane) {

            var c = new Date().getTime() / 1000;

            plane.position.add(plane.gravity.clone().multiplyScalar(deltat));
            plane.position.add(plane.force1.clone().multiplyScalar((c - plane.lastChange) / (plane.nextChange - plane.lastChange)).multiplyScalar(deltat));
            plane.position.add(plane.force2.clone().multiplyScalar((plane.nextChange - c) / (plane.nextChange - plane.lastChange)).multiplyScalar(deltat));
            if (c > plane.nextChange) {
                plane.lastChange = c;
                plane.nextChange = c + 1 + Math.random() * 3;
                plane.force1 = plane.force2;
                plane.force2 = new THREE.Vector3((plane.force1.x < 0 ? 1 : -1) * (20 + (Math.random() * 30)), 0, 0);
            }

            if (plane.position.y + plane.geometry.parameters.height < 0) {
                planes = _.without(planes, plane);
                planes.push(buildPlane());
            }
        });

        renderer.render(scene, camera);
        last = current;
    };

    render();

});