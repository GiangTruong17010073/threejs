var app = function() {
    // init scene, camera, objects and renderer
    var scene, camera, renderer, domElement;
    var donuts = [];
    var create_crate = function() {
        // texture
        var crate_texture = new THREE.TextureLoader().load("./data/textures/crate/crate0_diffuse.png");
        var bump_map_texture = new THREE.TextureLoader().load("./data/textures/crate/crate0_bump.png");
        var normal_map_texture = new THREE.TextureLoader().load("./data/textures/crate/crate0_normal.png");

        // geometry
        const geometryCube = new THREE.CubeGeometry(1, 1, 1);

        // material
        const material = new THREE.MeshPhongMaterial({map: crate_texture, bumpMap: bump_map_texture, normalMap: normal_map_texture});

        // object
        cube = new THREE.Mesh(geometryCube, material);

        scene.add(cube);
    };

    var load_car_model = function(){
        var gltfLoader = new THREE.GLTFLoader();
        gltfLoader.load(
            //resource URL
            "./data/models/car/scene.gltf",
            //onload callback
            function (result){
                //get model
                car = result.scene.children[0];
                car.scale.setScalar(3);
                scene.add(car);
                car.position.y = 28;
                car.position.x = +13;
                car.position.z = -15;
            },
            // onProcess callback
            function (xhr){
                console.log( ("The car model is: " +xhr.loaded / xhr.total * 100) + ' % loaded');

            },

            // onError callback
            function (error){
                console.log ("An error happened" + error);
            }
        );
    }
    var randomInRange = function(min,max){
        return Math.random()*(max - min) + min;
        //Math.random() returns a floating - point in the range (0-1)
    }

    var create_donuts = function(){
        // each donut has torus geomatry. Its radius: 1; Its tube: 0.5; its radialSegments: 5 and tubularSegment: 30.
        var geometry = new THREE.TorusGeometry(1,0.5,20,50);
        // the donut's color is random
        var material = new THREE.MeshBasicMaterial({color:Math.random()*0xffffff});
        // the position of each donut is random
        var donut = new THREE.Mesh(geometry,material);
        donut.position.x = randomInRange(-20,20); //donut are everywhere on scene
        donut.position.y = -3; //randomInRange(5,5); // each donut is on the top of the scene
        donut.position.z = randomInRange(50,20); // create different sizes
        donut.name = "donut";
        // add each donut to scene
        scene.add(donut);
        donuts.push(donut);

    }

    var update_donut = function(donut, index){
        // the donut moves along the z axis to the end of the ground
        if(donut.position.z < 50)
        {
            donut.position.z += 0.05;
        }
        else
        {
        // remove the donut if the camera cant see it
            if(donut.position.y < -10){
                donuts.splice(index, 1);
                scene.remove(donut);
            }
            else
            // the donut moves along the y axis
            donut.position.y += -0.05
        }
    }

    var create_skybox = function(){
        var geometry = new THREE.BoxGeometry(100,100,100);
        var front_texture = new THREE.TextureLoader().load("./data/textures/skybox/arid2_ft.jpg");
        var back_texture = new THREE.TextureLoader().load("./data/textures/skybox/arid2_bk.jpg");
        var up_texture = new THREE.TextureLoader().load("./data/textures/skybox/arid2_up.jpg");
        var down_texture = new THREE.TextureLoader().load("./data/textures/skybox/arid2_dn.jpg");
        var right_texture = new THREE.TextureLoader().load("./data/textures/skybox/arid2_rt.jpg");
        var left_texture = new THREE.TextureLoader().load("./data/textures/skybox/arid2_lf.jpg"); 
        
       
       

        var materials = [];
        materials.push(new THREE.MeshBasicMaterial({map:front_texture}));
        materials.push(new THREE.MeshBasicMaterial({map:back_texture}));
        materials.push(new THREE.MeshBasicMaterial({map:up_texture}));
        materials.push(new THREE.MeshBasicMaterial({map:down_texture}));
        materials.push(new THREE.MeshBasicMaterial({map:right_texture}));
        materials.push(new THREE.MeshBasicMaterial({map:left_texture}));


        //for loop
        for(var i=0; i<6; i++){
            materials[i].side = THREE.BackSide;
        }
        skybox = new THREE.Mesh(geometry,materials);
        scene.add(skybox);
        

    }
    var init_app = function() {
        // 1. Create the scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);

        // 2. Create and locate the camera
        var fieldOfViewY = 60, aspectRatio = window.innerWidth / window.innerHeight, near = 0.1, far = 100.0;
        camera = new THREE.PerspectiveCamera(fieldOfViewY, aspectRatio, near, far);
        camera.position.z = 5;

        // 3. Create and locate the objects on the scene

        // light
        var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        var pointLight = new THREE.PointLight(0xffffff, 1, 100);
        pointLight.position.set(3, 1, 3);

        scene.add(ambientLight);
        scene.add(pointLight);

        //three directional lights

        const keyLight = new THREE.DirectionalLight( 0xffffff, 1);
        keyLight.position.set(50,0,-50);

        const fillLight = new THREE.DirectionalLight( 0xffffff, 1);
        fillLight.position.set(50,0,50);

        const backLight = new THREE.DirectionalLight( 0xffffff, 1);
        backLight.position.set(-50,0,50);

        scene.add(keyLight);
        scene.add(fillLight);
        scene.add(backLight);

        // var controls = new THREE.OrbitControls(camera, renderer, domElement);
        // controls.enableDamping = true;
        // controls.campingFactor = 0.25;
        // controls.enableZoom = true;

        
        // load_car_model();
        create_donuts();

        create_crate();
        create_skybox();

        // 4. Create the renderer
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        // control camera
        var controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.campingFactor = 0.25;
        controls.enableZoom = true;
    };
    // main animation loop - calls every 50-60ms
    var mainLoop = function() {
        requestAnimationFrame(mainLoop);
        cube.rotation.x +=0.01;
        // cube.rotation.y +=0.1;
        // camera.rotation.y += 0.01;
        // renderer.render(scene, camera);

        let rand = Math.random();
        if(rand < 0.02)
        {
            create_donuts();
        }
        // crate.rotation.y += 0.05;
        donuts.forEach(update_donut);
        renderer.render(scene, camera);
        requestAnimationFrame(mainLoop);
    

    };
    init_app();
    mainLoop();
}



