
(function() {
"use strict";

    var width = 640;
    var height = 360;
    var aspectRatio = width/height;

    var scene = new THREE.Scene();
    var camera = new THREE.OrthographicCamera(0, width, height, 0, 0, 1);

    function fit(width, height, aspectRatio) {
        var a = [width, width / aspectRatio];
        var b = [height * aspectRatio, height];
        return a[0] < b[0] ? a : b;
    }

    var renderer = new THREE.CanvasRenderer();
    renderer.setSize.apply(renderer, fit(window.innerWidth, window.innerHeight, aspectRatio));
    $(renderer.domElement).css("margin-right", "auto");
    $(renderer.domElement).css("margin-left", "auto");
    $(renderer.domElement).css("display", "block");
    document.body.appendChild(renderer.domElement);

    function buildPlane() {
        var geometry = new THREE.CircleGeometry(10, 100);
        var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
        var plane = new THREE.Mesh(geometry, material);
        plane.position.set(50 + (Math.random() * 400), 50 + (Math.random() * 100), 0);
        plane.speed = [(Math.random() * 2 > 1 ? 1 : -1) * (10 + (Math.random() * 50)),
            (Math.random() * 2 > 1 ? 1 : -1) * (10 + (Math.random() * 50))];
        scene.add(plane);
        return plane;
    }
    var planes = _.map(_.range(50), function() {return buildPlane()});

    //camera.position.z = 5;
    var last = new Date().getTime();
    var render = function () {
        requestAnimationFrame(render);
        var current = new Date().getTime();
        var deltat = (current - last) / 1000;
        deltat = deltat > 0.1 ? 0.1 : deltat;

        _.each(planes, function(plane) {

            var speed = plane.speed;

            var w = plane.geometry.parameters.radius * 2;
            var h = plane.geometry.parameters.radius * 2;

            plane.position.x += speed[0] * deltat;
            if (plane.position.x - (w / 2) < 0) {
                plane.position.x = w / 2;
                speed[0] = - speed[0];
            } else if (plane.position.x + (w / 2) > width) {
                plane.position.x = width - w / 2;
                speed[0] = - speed[0];
            }

            plane.position.y += speed[1] * deltat;
            if (plane.position.y - (h / 2) < 0) {
                plane.position.y = (h / 2);
                speed[1] = - speed[1];
            } else if (plane.position.y + (h / 2) > height) {
                plane.position.y = height - (h / 2);
                speed[1] = - speed[1];
            }
        });

        renderer.render(scene, camera);
        last = current;
    };

    render();

})();