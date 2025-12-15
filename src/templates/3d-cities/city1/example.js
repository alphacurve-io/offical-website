(() => {
  // 等待DOM加载完成
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    const container = document.getElementById('meetingScene');
    if (!container) {
      console.warn('meetingScene element not found');
      return;
    }

    // 场景
    const scene = new THREE.Scene();
    scene.background = null; // 透明背景

    // 相机 - 等角视角
    const width = container.clientWidth;
    const height = container.clientHeight || 500;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    
    // 设置等角视角
    const isometricAngle = Math.PI / 6; // 30度
    camera.position.set(80, 80, 80);
    camera.lookAt(0, 0, 0);

    // 渲染器
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // 灯光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(50, 50, 50);
    directionalLight1.castShadow = true;
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight2.position.set(-50, 30, -50);
    scene.add(directionalLight2);

    // 创建乐高材质
    function createLegoMaterial(color) {
      return new THREE.MeshPhongMaterial({
        color: color,
        shininess: 30,
        flatShading: true
      });
    }

    // 创建圆角盒子（简化版，使用普通盒子）
    function createRoundedBox(width, height, depth, radius) {
      // 使用普通盒子，Three.js 没有内置圆角盒子
      // 可以通过修改边缘或使用更复杂的几何体实现
      // 这里使用普通盒子，通过材质和光照模拟圆角效果
      return new THREE.BoxGeometry(width, height, depth, 2, 2, 2);
    }

    // 创建桌子
    function createTable() {
      const tableGroup = new THREE.Group();

      // 桌面 - 白色圆角矩形
      const tableTopGeometry = createRoundedBox(10, 6, 0.5, 0.3);
      const tableTopMaterial = createLegoMaterial(0xffffff);
      const tableTop = new THREE.Mesh(tableTopGeometry, tableTopMaterial);
      tableTop.position.y = 1.5;
      tableTop.rotation.x = Math.PI / 2;
      tableTop.castShadow = true;
      tableTop.receiveShadow = true;
      tableGroup.add(tableTop);

      // 桌脚
      const legPositions = [
        [-4, 0, -2.5],
        [4, 0, -2.5],
        [-4, 0, 2.5],
        [4, 0, 2.5]
      ];

      legPositions.forEach(pos => {
        const legGeometry = new THREE.BoxGeometry(0.4, 1.5, 0.4);
        const legMaterial = createLegoMaterial(0xd0d0d0);
        const leg = new THREE.Mesh(legGeometry, legMaterial);
        leg.position.set(pos[0], pos[1], pos[2]);
        leg.castShadow = true;
        tableGroup.add(leg);
      });

      return tableGroup;
    }

    // 创建乐高人物
    function createLegoPerson(config) {
      const personGroup = new THREE.Group();
      const { bodyColor, tieColor, hairColor, hairType, hasLaptop, laptopColor, hasDocument, hasPhone, hasHand } = config;

      // 头部 - 球体
      const headGeometry = new THREE.SphereGeometry(0.5, 16, 16);
      const headMaterial = createLegoMaterial(0xffdbac);
      const head = new THREE.Mesh(headGeometry, headMaterial);
      head.position.y = 2.2;
      head.castShadow = true;
      personGroup.add(head);

      // 脸部 - 眼睛和嘴巴
      const eyeGeometry = new THREE.SphereGeometry(0.06, 8, 8);
      const eyeMaterial = createLegoMaterial(0x000000);
      
      const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
      leftEye.position.set(-0.15, 2.3, 0.45);
      personGroup.add(leftEye);

      const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
      rightEye.position.set(0.15, 2.3, 0.45);
      personGroup.add(rightEye);

      // 嘴巴 - 红色弧形（使用简单盒子模拟）
      const mouthGeometry = new THREE.BoxGeometry(0.4, 0.2, 0.02);
      const mouthMaterial = createLegoMaterial(0xe63946);
      const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
      mouth.position.set(0, 2.05, 0.45);
      mouth.scale.y = 0.5;
      personGroup.add(mouth);

      // 头发
      if (hairType === 'brown') {
        const hairGeometry = new THREE.SphereGeometry(0.48, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
        const hairMaterial = createLegoMaterial(0x8b4513);
        const hair = new THREE.Mesh(hairGeometry, hairMaterial);
        hair.position.y = 2.35;
        hair.rotation.x = Math.PI;
        personGroup.add(hair);
      } else if (hairType === 'blonde') {
        const hairGeometry = new THREE.SphereGeometry(0.48, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
        const hairMaterial = createLegoMaterial(0xf4d03f);
        const hair = new THREE.Mesh(hairGeometry, hairMaterial);
        hair.position.y = 2.35;
        hair.rotation.x = Math.PI;
        personGroup.add(hair);
      } else if (hairType === 'black') {
        const hairGeometry = new THREE.SphereGeometry(0.48, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
        const hairMaterial = createLegoMaterial(0x1a1a1a);
        const hair = new THREE.Mesh(hairGeometry, hairMaterial);
        hair.position.y = 2.35;
        hair.rotation.x = Math.PI;
        personGroup.add(hair);
      }

      // 身体 - 块状
      const bodyGeometry = new THREE.BoxGeometry(0.9, 1.1, 0.7);
      const bodyMaterial = createLegoMaterial(bodyColor);
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.position.y = 1.1;
      body.castShadow = true;
      personGroup.add(body);

      // 领带
      const tieGeometry = new THREE.BoxGeometry(0.15, 0.5, 0.1);
      const tieMaterial = createLegoMaterial(tieColor);
      const tie = new THREE.Mesh(tieGeometry, tieMaterial);
      tie.position.set(0, 1.3, 0.36);
      personGroup.add(tie);

      // 笔记本电脑
      if (hasLaptop) {
        const laptopGeometry = new THREE.BoxGeometry(0.7, 0.05, 0.5);
        const laptopMaterial = createLegoMaterial(laptopColor);
        const laptop = new THREE.Mesh(laptopGeometry, laptopMaterial);
        laptop.position.set(0, 0.6, 0.5);
        laptop.rotation.x = -Math.PI / 12;
        personGroup.add(laptop);
      }

      // 文件
      if (hasDocument) {
        const docGeometry = new THREE.BoxGeometry(0.6, 0.7, 0.05);
        const docMaterial = createLegoMaterial(0xffffff);
        const document = new THREE.Mesh(docGeometry, docMaterial);
        document.position.set(0, 0.7, 0.5);
        document.rotation.z = -0.1;
        personGroup.add(document);
      }

      // 手机
      if (hasPhone) {
        const phoneGeometry = new THREE.BoxGeometry(0.3, 0.5, 0.05);
        const phoneMaterial = createLegoMaterial(0x1a1a1a);
        const phone = new THREE.Mesh(phoneGeometry, phoneMaterial);
        phone.position.set(0.2, 1.1, 0.4);
        phone.rotation.z = -0.3;
        personGroup.add(phone);
      }

      // 手势
      if (hasHand) {
        const handGeometry = new THREE.BoxGeometry(0.2, 0.4, 0.15);
        const handMaterial = createLegoMaterial(0xffdbac);
        const hand = new THREE.Mesh(handGeometry, handMaterial);
        hand.position.set(0.6, 1.2, 0.3);
        hand.rotation.z = 0.3;
        personGroup.add(hand);
      }

      return personGroup;
    }

    // 创建桌子
    const table = createTable();
    scene.add(table);

    // 创建6个人物
    const peopleConfigs = [
      { bodyColor: 0x2d5016, tieColor: 0xe63946, hairColor: 0x8b4513, hairType: 'brown', hasLaptop: true, laptopColor: 0xc0c0c0 }, // P1 左上
      { bodyColor: 0x1a1a1a, tieColor: 0x0066cc, hairColor: 0xf4d03f, hairType: 'blonde', hasDocument: true }, // P2 上中
      { bodyColor: 0x003d7a, tieColor: 0xe63946, hairColor: 0x8b4513, hairType: 'brown' }, // P3 右上
      { bodyColor: 0x1a1a1a, tieColor: 0x1a1a1a, hairColor: 0x1a1a1a, hairType: 'black', hasLaptop: true, laptopColor: 0x1a1a1a }, // P4 右下
      { bodyColor: 0x2d5016, tieColor: 0x2d5016, hairColor: 0xf4d03f, hairType: 'blonde', hasHand: true }, // P5 下中
      { bodyColor: 0x003d7a, tieColor: 0x0066cc, hairColor: 0x1a1a1a, hairType: 'black', hasPhone: true } // P6 左下
    ];

    const peoplePositions = [
      [-3.6, 0, -1.2], // P1 左上
      [0, 0, -1.6],     // P2 上中
      [3.6, 0, -1.2],   // P3 右上
      [3.6, 0, 1.2],    // P4 右下
      [0, 0, 1.6],      // P5 下中
      [-3.6, 0, 1.2]    // P6 左下
    ];

    const people = [];
    peopleConfigs.forEach((config, index) => {
      const person = createLegoPerson(config);
      person.position.set(peoplePositions[index][0], peoplePositions[index][1], peoplePositions[index][2]);
      scene.add(person);
      people.push(person);
    });

    // 鼠标交互
    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
    let targetRotationX = 55 * Math.PI / 180;
    let targetRotationY = -45 * Math.PI / 180;
    let currentRotationX = targetRotationX;
    let currentRotationY = targetRotationY;

    const updateCamera = (clientX, clientY) => {
      const rect = container.getBoundingClientRect();
      const nx = (clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const ny = (clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

      targetRotationY = (-45 + clamp(nx * 8, -8, 8)) * Math.PI / 180;
      targetRotationX = (55 + clamp(ny * 6, -6, 6)) * Math.PI / 180;

      // 更新人物头部注视
      const gazeX = clamp(nx * 18, -18, 18) * Math.PI / 180;
      const gazeY = clamp(-ny * 12, -12, 12) * Math.PI / 180;
      
      people.forEach(person => {
        const head = person.children.find(child => child.geometry instanceof THREE.SphereGeometry);
        if (head) {
          head.rotation.y = gazeX;
          head.rotation.x = gazeY;
        }
      });
    };

    container.addEventListener('mousemove', (e) => updateCamera(e.clientX, e.clientY));
    container.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        updateCamera(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    container.addEventListener('mouseleave', () => {
      targetRotationX = 55 * Math.PI / 180;
      targetRotationY = -45 * Math.PI / 180;
      people.forEach(person => {
        const head = person.children.find(child => child.geometry instanceof THREE.SphereGeometry);
        if (head) {
          head.rotation.y = 0;
          head.rotation.x = 0;
        }
      });
    });

    // 动画循环
    function animate() {
      requestAnimationFrame(animate);

      // 平滑相机旋转
      currentRotationX += (targetRotationX - currentRotationX) * 0.1;
      currentRotationY += (targetRotationY - currentRotationY) * 0.1;

      const distance = 120;
      camera.position.x = Math.sin(currentRotationY) * Math.cos(currentRotationX) * distance;
      camera.position.y = Math.sin(currentRotationX) * distance;
      camera.position.z = Math.cos(currentRotationY) * Math.cos(currentRotationX) * distance;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }

    // 响应式
    function handleResize() {
      const width = container.clientWidth;
      const height = container.clientHeight || 500;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }

    window.addEventListener('resize', handleResize);
    animate();
  }
})();
