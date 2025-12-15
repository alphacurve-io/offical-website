// 这是一个改进版的人物创建示例
// 使用更圆润的几何体和更好的材质

// 辅助函数：创建圆角立方体
function createRoundedBox(width, height, depth, radius = 0.1) {
    const shape = new THREE.Shape();
    const w = width / 2 - radius;
    const h = height / 2 - radius;
    
    shape.moveTo(-w, -h);
    shape.lineTo(w, -h);
    shape.quadraticCurveTo(w + radius, -h, w + radius, -h + radius);
    shape.lineTo(w + radius, h - radius);
    shape.quadraticCurveTo(w + radius, h, w, h);
    shape.lineTo(-w, h);
    shape.quadraticCurveTo(-w - radius, h, -w - radius, h - radius);
    shape.lineTo(-w - radius, -h + radius);
    shape.quadraticCurveTo(-w - radius, -h, -w, -h);
    shape.closePath();
    
    const extrudeSettings = {
        depth: depth - radius * 2,
        bevelEnabled: true,
        bevelThickness: radius,
        bevelSize: radius,
        bevelSegments: 8
    };
    
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
}

// 改进版：创建更精致的人物
function createImprovedPerson(bodyColor, hairColor, expression = 'neutral') {
    const person = new THREE.Group();

    // 1. 身体 - 使用圆角立方体，更自然
    const bodyGeometry = createRoundedBox(0.8, 1.2, 0.6, 0.15);
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
        color: bodyColor,
        roughness: 0.5,
        metalness: 0.1,
        flatShading: false
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.6;
    body.castShadow = true;
    body.receiveShadow = true;
    person.add(body);

    // 2. 头部 - 使用球体或圆角立方体
    const headGeometry = new THREE.SphereGeometry(0.35, 32, 32);
    // 或者使用圆角立方体：createRoundedBox(0.7, 0.8, 0.7, 0.1)
    const headMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffd700,
        roughness: 0.3,
        metalness: 0.05
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.5;
    head.castShadow = true;
    person.add(head);

    // 3. 头发 - 使用更自然的形状
    const hairGroup = new THREE.Group();
    
    // 主头发块
    const mainHairGeometry = createRoundedBox(0.75, 0.25, 0.75, 0.1);
    const hairMaterial = new THREE.MeshStandardMaterial({ 
        color: hairColor,
        roughness: 0.7,
        metalness: 0.0
    });
    const mainHair = new THREE.Mesh(mainHairGeometry, hairMaterial);
    mainHair.position.y = 0.1;
    hairGroup.add(mainHair);
    
    // 添加一些头发细节（可选）
    for (let i = 0; i < 3; i++) {
        const strandGeometry = new THREE.BoxGeometry(0.1, 0.15, 0.05);
        const strand = new THREE.Mesh(strandGeometry, hairMaterial);
        strand.position.set(
            (Math.random() - 0.5) * 0.5,
            0.2 + Math.random() * 0.1,
            (Math.random() - 0.5) * 0.3
        );
        strand.rotation.z = (Math.random() - 0.5) * 0.3;
        hairGroup.add(strand);
    }
    
    hairGroup.position.y = 1.85;
    hairGroup.castShadow = true;
    person.add(hairGroup);

    // 4. 眼睛 - 更立体的设计
    const eyesGroup = new THREE.Group();
    eyesGroup.position.set(0, 1.6, 0.36);

    function createImprovedEye() {
        const eyeGroup = new THREE.Group();
        
        // 眼白 - 使用球体的一部分
        const whiteGeometry = new THREE.SphereGeometry(0.12, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        const whiteMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xffffff,
            roughness: 0.2
        });
        const white = new THREE.Mesh(whiteGeometry, whiteMaterial);
        eyeGroup.add(white);
        
        // 眼珠 - 更立体
        const pupilGeometry = new THREE.SphereGeometry(0.06, 16, 16);
        const pupilMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x000000,
            roughness: 0.1
        });
        const pupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
        pupil.position.z = 0.08;
        eyeGroup.add(pupil);
        
        // 高光
        const highlightGeometry = new THREE.SphereGeometry(0.02, 8, 8);
        const highlightMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xffffff,
            emissive: 0xffffff,
            emissiveIntensity: 0.5
        });
        const highlight = new THREE.Mesh(highlightGeometry, highlightMaterial);
        highlight.position.set(0.03, 0.03, 0.1);
        eyeGroup.add(highlight);
        
        eyeGroup.userData.pupil = pupil;
        return eyeGroup;
    }

    const leftEye = createImprovedEye();
    leftEye.position.x = -0.2;
    eyesGroup.add(leftEye);

    const rightEye = createImprovedEye();
    rightEye.position.x = 0.2;
    eyesGroup.add(rightEye);

    person.add(eyesGroup);
    person.userData.eyes = [leftEye, rightEye];

    // 5. 嘴巴 - 保持现有逻辑，但可以添加更多细节
    // ... (保持原有的表情逻辑)

    // 6. 手臂 - 使用圆角圆柱体
    const armGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 16);
    const armMaterial = new THREE.MeshStandardMaterial({ 
        color: bodyColor,
        roughness: 0.5,
        metalness: 0.1
    });

    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.5, 0.8, 0);
    leftArm.rotation.z = 0.3;
    leftArm.castShadow = true;
    person.add(leftArm);

    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.5, 0.8, 0);
    rightArm.rotation.z = -0.3;
    rightArm.castShadow = true;
    person.add(rightArm);

    // 7. 添加细节：领带、口袋等（可选）
    const tieGeometry = new THREE.BoxGeometry(0.15, 0.4, 0.05);
    const tieMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
    const tie = new THREE.Mesh(tieGeometry, tieMaterial);
    tie.position.set(0, 1.0, 0.31);
    person.add(tie);

    person.userData.leftArm = leftArm;
    person.userData.rightArm = rightArm;
    person.userData.armAnimation = {
        leftArm: 'none',
        rightArm: 'none',
        time: 0
    };

    return person;
}

