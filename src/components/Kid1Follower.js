import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useLanguage } from '../contexts/LanguageContext';
import './Kid1Follower.css';

const Kid1Follower = () => {
  const { content } = useLanguage();
  const kid1FollowerConfig = content.kid1Follower;
  
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const kid1Ref = useRef(null);
  const animationFrameRef = useRef(null);
  const bubbleRef = useRef(null);
  
  const [currentSection, setCurrentSection] = useState(null);
  const [isMovingToDestination, setIsMovingToDestination] = useState(false);
  const [destinationReached, setDestinationReached] = useState(false);
  const [bubbleMessage, setBubbleMessage] = useState('');
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [isReady, setIsReady] = useState(false); // 控制是否显示 kid1
  const [isDelayed, setIsDelayed] = useState(false); // 控制是否已延迟 5 秒
  const [isRoom2Open, setIsRoom2Open] = useState(false); // 控制 room2 是否打开
  const [isMapPinLoading, setIsMapPinLoading] = useState(false); // 控制 map-pin 是否在 loading
  
  const targetPositionRef = useRef(new THREE.Vector3(0, 0, 0));
  const bubbleTimerRef = useRef(null);
  const configRef = useRef(kid1FollowerConfig); // 使用 ref 存储最新配置
  const bubbleVisibleRef = useRef(false); // 使用 ref 存储气泡可见状态
  const destinationElementRef = useRef(null); // 存储当前的 destination element
  const destinationReachedRef = useRef(false); // 使用 ref 存储是否到达 destination
  const isMovingToDestinationRef = useRef(false); // 使用 ref 存储是否正在移动到 destination
  const currentSectionRef = useRef(null); // 使用 ref 存储当前 section，用于动画循环
  const isReadyRef = useRef(isReady); // 使用 ref 存储 isReady 状态
  const isDelayedRef = useRef(isDelayed); // 使用 ref 存储 isDelayed 状态
  const isRoom2OpenRef = useRef(isRoom2Open); // 使用 ref 存储 isRoom2Open 状态
  const isMapPinLoadingRef = useRef(isMapPinLoading); // 使用 ref 存储 isMapPinLoading 状态
  const kid1StartTimeRef = useRef(null); // 存储 kid1 开始显示的时间
  const initialPositionSetRef = useRef(false); // 标记是否已设置初始位置（固定在右边）
  
  // 更新 ref 中的配置值
  useEffect(() => {
    configRef.current = kid1FollowerConfig;
  }, [kid1FollowerConfig]);
  
  // 更新气泡可见状态的 ref
  useEffect(() => {
    bubbleVisibleRef.current = bubbleVisible;
  }, [bubbleVisible]);
  
  // 更新 destinationReached 的 ref
  useEffect(() => {
    destinationReachedRef.current = destinationReached;
  }, [destinationReached]);
  
  // 更新 isMovingToDestination 的 ref
  useEffect(() => {
    isMovingToDestinationRef.current = isMovingToDestination;
  }, [isMovingToDestination]);
  
  // 更新 currentSection 的 ref
  useEffect(() => {
    currentSectionRef.current = currentSection;
  }, [currentSection]);
  
  // 更新 isReady 的 ref
  useEffect(() => {
    isReadyRef.current = isReady;
  }, [isReady]);
  
  // 更新 isDelayed 的 ref
  useEffect(() => {
    isDelayedRef.current = isDelayed;
  }, [isDelayed]);
  
  // 更新 isRoom2Open 的 ref
  useEffect(() => {
    isRoom2OpenRef.current = isRoom2Open;
  }, [isRoom2Open]);
  
  // 更新 isMapPinLoading 的 ref
  useEffect(() => {
    isMapPinLoadingRef.current = isMapPinLoading;
  }, [isMapPinLoading]);
  
  // 从 content 中获取 section 配置
  const sectionConfigs = useMemo(() => {
    return kid1FollowerConfig?.sections || [];
  }, [kid1FollowerConfig]);
  
  // 检查页面是否加载完成
  const checkPageReady = useCallback(() => {
    // 检查所有配置的 section 元素是否存在
    if (!sectionConfigs || sectionConfigs.length === 0) {
      return false;
    }
    
    // 检查至少一个 section 元素是否存在
    let hasAnySection = false;
    for (const section of sectionConfigs) {
      const element = document.querySelector(section.selector);
      if (element) {
        hasAnySection = true;
        break;
      }
    }
    
    // 检查页面加载状态
    const isDocumentReady = document.readyState === 'complete' || document.readyState === 'interactive';
    
    return hasAnySection && isDocumentReady;
  }, [sectionConfigs]);
  
  // 延迟加载：等待页面内容加载完成
  useEffect(() => {
    const checkReady = () => {
      if (checkPageReady()) {
        // 延迟一小段时间确保所有内容都已渲染
        setTimeout(() => {
          setIsReady(true);
          // 再延迟 5 秒才真正显示 kid1，避免加载时快速移动鼠标产生残影
          setTimeout(() => {
            setIsDelayed(true);
            console.log('✅ 延迟 5 秒后，kid1 现在可以显示了');
          }, 5000);
        }, 500);
      }
    };
    
    // 如果页面已经加载完成，立即检查
    if (document.readyState === 'complete') {
      checkReady();
    } else {
      // 等待页面加载完成
      window.addEventListener('load', checkReady);
      // 也监听 DOMContentLoaded
      document.addEventListener('DOMContentLoaded', checkReady);
    }
    
    // 使用 MutationObserver 监听 DOM 变化，确保 section 元素已渲染
    const observer = new MutationObserver(() => {
      if (!isReady && checkPageReady()) {
        setTimeout(() => {
          setIsReady(true);
          // 再延迟 5 秒才真正显示 kid1
          setTimeout(() => {
            setIsDelayed(true);
            console.log('✅ 延迟 5 秒后，kid1 现在可以显示了');
          }, 5000);
        }, 500);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
    
    // 定期检查（作为备用方案）
    const intervalId = setInterval(() => {
      if (!isReady && checkPageReady()) {
        setIsReady(true);
        // 再延迟 5 秒才真正显示 kid1
        setTimeout(() => {
          setIsDelayed(true);
          console.log('✅ 延迟 5 秒后，kid1 现在可以显示了');
        }, 5000);
        clearInterval(intervalId);
      }
    }, 1000);
    
    return () => {
      window.removeEventListener('load', checkReady);
      document.removeEventListener('DOMContentLoaded', checkReady);
      observer.disconnect();
      clearInterval(intervalId);
    };
  }, [checkPageReady, isReady]);
  
  // 检测当前 section（基于滚动位置）
  const detectCurrentSection = useCallback(() => {
    if (!sectionConfigs || sectionConfigs.length === 0) {
      return null;
    }
    
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const viewportCenter = scrollY + windowHeight / 2;
    
    let closestSection = null;
    let closestDistance = Infinity;
    
    for (const section of sectionConfigs) {
      const element = document.querySelector(section.selector);
      if (element) {
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + scrollY;
        const elementCenter = elementTop + rect.height / 2;
        const distance = Math.abs(viewportCenter - elementCenter);
        
        // 如果元素在视口中
        if (rect.top < windowHeight && rect.bottom > 0) {
          if (distance < closestDistance) {
            closestDistance = distance;
            closestSection = section;
          }
        }
      }
    }
    
    // 如果没有找到任何 section，返回 null（kid1 会消失）
    return closestSection;
  }, [sectionConfigs]);
  
  // 将鼠标位置转换为 3D 空间位置
  const mouseToWorldPosition = useCallback((mouseX, mouseY, camera, distance = 5) => {
    // 将屏幕坐标转换为 NDC 坐标 (-1 到 1)
    const x = (mouseX / window.innerWidth) * 2 - 1;
    const y = -(mouseY / window.innerHeight) * 2 + 1;
    
    // 创建一个射线
    const vector = new THREE.Vector3(x, y, 0.5);
    vector.unproject(camera);
    
    // 计算方向
    const dir = vector.sub(camera.position).normalize();
    
    // 计算在指定距离处的点
    const pos = camera.position.clone().add(dir.multiplyScalar(distance));
    
    // 限制在合理的高度范围内（地面上方）
    pos.y = Math.max(0, Math.min(2, pos.y));
    
    return pos;
  }, []);
  
  // 显示对话气泡
  const showBubble = useCallback((message) => {
    setBubbleMessage(message);
    setBubbleVisible(true);
  }, []);
  
  // 隐藏对话气泡
  const hideBubble = useCallback(() => {
    setBubbleVisible(false);
  }, []);
  
  // 开始 section 对话气泡循环
  const startSectionBubbleCycle = useCallback((section) => {
    // 清除之前的计时器
    if (bubbleTimerRef.current) {
      clearTimeout(bubbleTimerRef.current);
    }
    
    if (!section || !section.messages || section.messages.length === 0) {
      return;
    }
    
    // 立即显示第一个消息
    const randomMessage = section.messages[Math.floor(Math.random() * section.messages.length)];
    showBubble(randomMessage);
    
    // 设置循环
    const cycle = () => {
      // 隐藏气泡
      hideBubble();
      
      // 等待隐藏时间后显示下一个消息
      bubbleTimerRef.current = setTimeout(() => {
        const nextMessage = section.messages[Math.floor(Math.random() * section.messages.length)];
        showBubble(nextMessage);
        
        // 等待显示时间后继续循环
        bubbleTimerRef.current = setTimeout(() => {
          cycle();
        }, section.bubbleShowDuration);
      }, section.bubbleHideDuration);
    };
    
    // 第一次显示后开始循环
    bubbleTimerRef.current = setTimeout(() => {
      cycle();
    }, section.bubbleShowDuration);
  }, [showBubble, hideBubble]);
  
  // 更新 destination 位置
  const updateDestinationPosition = useCallback(() => {
    if (!destinationElementRef.current || !cameraRef.current) return;
    
    const rect = destinationElementRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // 将屏幕坐标转换为 3D 空间坐标
    const worldPos = mouseToWorldPosition(centerX, centerY, cameraRef.current, 5);
    targetPositionRef.current.copy(worldPos);
  }, [mouseToWorldPosition]);
  
  // 移动到 destination
  const moveToDestination = useCallback((destinationElement) => {
    console.log('🎯 开始移动到 destination:', destinationElement);
    if (!destinationElement || !kid1Ref.current || !cameraRef.current) return;
    
    setIsMovingToDestination(true);
    isMovingToDestinationRef.current = true; // 更新 ref
    setDestinationReached(false);
    destinationReachedRef.current = false; // 更新 ref
    destinationElementRef.current = destinationElement; // 存储 destination element
    
    // 立即更新一次位置
    updateDestinationPosition();
    
    // 检查是否到达 destination（在动画循环中检查）
    // 注意：位置更新依赖动画循环的每帧更新，这里只用于检查是否到达
    let checkCount = 0;
    const maxChecks = 200; // 最多检查 20 秒（200 * 100ms），给更多时间
    
    const checkInterval = setInterval(() => {
      checkCount++;
      
      if (!kid1Ref.current || !destinationElementRef.current || checkCount >= maxChecks) {
        clearInterval(checkInterval);
        if (checkCount >= maxChecks) {
          // 超时后强制标记为到达
          console.log('⏰ 移动到 destination 超时，强制标记为到达');
          setDestinationReached(true);
          destinationReachedRef.current = true;
          setIsMovingToDestination(false);
          isMovingToDestinationRef.current = false; // 更新 ref
        }
        return;
      }
      
      // 检查距离（位置更新由动画循环每帧处理，这里只检查）
      const distance = kid1Ref.current.position.distanceTo(targetPositionRef.current);
      if (distance < 0.3) {
        console.log('✅ 到达 destination，距离:', distance);
        setDestinationReached(true);
        destinationReachedRef.current = true;
        setIsMovingToDestination(false);
        isMovingToDestinationRef.current = false; // 更新 ref
        clearInterval(checkInterval);
      }
    }, 100);
  }, [updateDestinationPosition]);
  
  // 初始化 Three.js 场景
  useEffect(() => {
    if (!containerRef.current) return;
    
    // 创建场景
    const scene = new THREE.Scene();
    // 不设置背景，保持透明
    sceneRef.current = scene;
    
    // 创建相机
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;
    
    // 检测是否为移动设备
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || 
                    (window.innerWidth <= 768);
    
    // 创建渲染器（移动端优化）
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: !isMobile, // 移动端关闭抗锯齿以提高性能
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false, // 不保留绘制缓冲区，避免残影
      depth: true,
      stencil: false
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    // 移动端限制像素比以提高性能
    const pixelRatio = isMobile ? Math.min(window.devicePixelRatio, 1.5) : Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(pixelRatio);
    // 设置清除颜色为透明，并启用自动清除
    renderer.setClearColor(0x000000, 0);
    renderer.autoClear = true; // 启用自动清除
    
    // 立即清除画布，确保初始状态是干净的
    renderer.clear();
    const gl = renderer.getContext();
    if (gl) {
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
    }
    
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // 添加光源
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);
    
    // 加载 kid1_running.glb
    const loader = new GLTFLoader();
    loader.load(
      '/assets/3d-models/kid1_running.glb',
      (gltf) => {
        const kid1 = gltf.scene;
        
        // 启用阴影
        kid1.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        
        // 计算模型的边界框以进行缩放
        const box = new THREE.Box3().setFromObject(kid1);
        const size = box.getSize(new THREE.Vector3());
        const maxDimension = Math.max(size.x, size.y, size.z);
        
        // 将模型缩放到合适的大小
        const targetHeight = configRef.current?.modelSize || 1.5;
        const scale = targetHeight / maxDimension;
        kid1.scale.set(scale, scale, scale);
        
        // 调整模型位置，使其底部在地面上
        const center = box.getCenter(new THREE.Vector3());
        kid1.position.y = -center.y * scale;
        kid1.position.set(0, 0, 0);
        
        // 如果有动画，设置动画混合器
        if (gltf.animations && gltf.animations.length > 0) {
          const mixer = new THREE.AnimationMixer(kid1);
          const actions = [];
          gltf.animations.forEach((clip) => {
            const action = mixer.clipAction(clip);
            action.setLoop(THREE.LoopRepeat); // 设置为循环播放
            action.play();
            actions.push(action); // 存储 action 以便后续检查
          });
          kid1.userData.mixer = mixer;
          kid1.userData.animationActions = actions; // 存储 actions 数组
          console.log('✅ kid1 动画已设置为循环播放，共', actions.length, '个动画');
        }
        
        // 只有在 isReady 时才添加到场景
        if (isReady) {
          scene.add(kid1);
          kid1Ref.current = kid1;
          
          // 加载时先将 kid1 固定在画面最右边（避免残影）
          if (cameraRef.current) {
            const rightEdgeX = window.innerWidth + 50; // 稍微在屏幕内，但靠近右边
            const centerY = window.innerHeight / 2;
            const worldPos = mouseToWorldPosition(rightEdgeX, centerY, cameraRef.current, 5);
            kid1.position.copy(worldPos); // 立即设置位置
            targetPositionRef.current.copy(worldPos); // 目标位置也设置为相同位置，保持静止
            initialPositionSetRef.current = true;
            console.log('✅ kid1_running.glb 加载成功，固定在画面右边，等待 5 秒后启动');
          }
        } else {
          // 如果还没准备好，先存储 kid1，等准备好后再添加
          kid1Ref.current = kid1;
          // 初始位置设置为屏幕右侧外
          if (cameraRef.current) {
            const rightEdgeX = window.innerWidth + 50;
            const centerY = window.innerHeight / 2;
            const worldPos = mouseToWorldPosition(rightEdgeX, centerY, cameraRef.current, 5);
            kid1.position.copy(worldPos);
            targetPositionRef.current.copy(worldPos);
            initialPositionSetRef.current = true;
          } else {
            // 如果相机还没准备好，先设置为屏幕右侧外的默认位置
            targetPositionRef.current.set(100, 0, 0);
          }
          console.log('✅ kid1_running.glb 加载成功，等待页面准备完成');
        }
      },
      undefined,
      (error) => {
        console.error('❌ kid1_running.glb 加载失败:', error);
      }
    );
    
    // 动画循环
    const clock = new THREE.Clock();
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      
      const deltaTime = clock.getDelta();
      
      // 检查 room2 是否打开或 map-pin 是否在 loading
      // 使用 ref 获取最新的状态值，避免闭包问题
      const shouldHide = isRoom2OpenRef.current || isMapPinLoadingRef.current;
      // 需要 isReady 和 isDelayed 都为 true 才显示
      const shouldShowKid1 = isReadyRef.current && isDelayedRef.current && !isRoom2OpenRef.current && !isMapPinLoadingRef.current;
      
      // 如果还没延迟 5 秒，kid1 应该固定在画面右边，不跟随鼠标
      const isStillDelaying = isReadyRef.current && !isDelayedRef.current;
      
      // 检查当前是否有配置的 section（通过 ref 获取最新的 currentSection）
      const hasConfiguredSection = currentSectionRef.current !== null;
      
      if (!hasConfiguredSection || shouldHide) {
        // 如果没有配置的 section 或需要隐藏，让 kid1 移动到屏幕右侧外（消失）
        if (cameraRef.current && kid1Ref.current) {
          // 计算屏幕右侧外的位置
          const rightEdgeX = window.innerWidth + 200;
          const centerY = window.innerHeight / 2;
          const worldPos = mouseToWorldPosition(rightEdgeX, centerY, cameraRef.current, 5);
          targetPositionRef.current.copy(worldPos);
          
          // 如果距离目标位置很远，立即设置位置（避免卡在中间）
          const distance = kid1Ref.current.position.distanceTo(worldPos);
          if (distance > 5) {
            kid1Ref.current.position.copy(worldPos);
          }
        }
      } else if (isStillDelaying) {
        // 如果还在延迟期间，将 kid1 固定在画面右边
        if (cameraRef.current && kid1Ref.current) {
          const rightEdgeX = window.innerWidth + 50; // 稍微在屏幕内，但靠近右边
          const centerY = window.innerHeight / 2;
          const worldPos = mouseToWorldPosition(rightEdgeX, centerY, cameraRef.current, 5);
          // 立即设置位置和目标位置，保持静止
          kid1Ref.current.position.copy(worldPos);
          targetPositionRef.current.copy(worldPos);
        }
      } else {
        // 如果有 destination element，持续更新 destination 位置（覆盖鼠标位置）
        // 这个更新必须在动画循环中，确保每帧都更新，优先级高于鼠标移动事件
        // 注意：即使已经到达 destination，也要持续更新位置，以应对页面滚动
        if (destinationElementRef.current && cameraRef.current) {
          const rect = destinationElementRef.current.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const worldPos = mouseToWorldPosition(centerX, centerY, cameraRef.current, 5);
          targetPositionRef.current.copy(worldPos);
          // 确保目标位置是 destination，而不是鼠标位置
        }
      }
      
      // 更新 kid1 位置（平滑移动到目标位置）
      if (kid1Ref.current) {
        // 如果还在延迟期间，kid1 应该固定在画面右边，不移动
        if (isStillDelaying && cameraRef.current) {
          const rightEdgeX = window.innerWidth + 50;
          const centerY = window.innerHeight / 2;
          const worldPos = mouseToWorldPosition(rightEdgeX, centerY, cameraRef.current, 5);
          // 立即设置位置和目标位置，保持静止
          kid1Ref.current.position.copy(worldPos);
          targetPositionRef.current.copy(worldPos);
        } else if (shouldShowKid1) {
          // 只有在延迟结束后才允许移动
          const currentPos = kid1Ref.current.position;
          const targetPos = targetPositionRef.current;
          
          // 计算当前应该使用的移动速度
          // 如果 kid1 刚开始显示，使用初始速度；否则使用正常速度
          let moveSpeed = configRef.current?.moveSpeed || 0.1;
          const initialMoveSpeed = configRef.current?.initialMoveSpeed || 0.02;
          const initialSpeedDuration = configRef.current?.initialSpeedDuration || 3000;
          
          if (kid1StartTimeRef.current !== null) {
            const elapsed = Date.now() - kid1StartTimeRef.current;
            if (elapsed < initialSpeedDuration) {
              // 在初始速度持续时间内，使用初始速度
              moveSpeed = initialMoveSpeed;
            }
          }
          
          currentPos.lerp(targetPos, moveSpeed);
          
          // 让 kid1 面向移动方向（即使到达目标也保持朝向）
          const distance = currentPos.distanceTo(targetPos);
          const isMoving = distance > 0.1; // 距离大于 0.1 时认为在移动
          
          if (isMoving) {
            const direction = new THREE.Vector3()
              .subVectors(targetPos, currentPos)
              .normalize();
            kid1Ref.current.lookAt(
              currentPos.x + direction.x,
              currentPos.y,
              currentPos.z + direction.z
            );
          }
          
          // 根据是否在移动来控制动画
          if (kid1Ref.current.userData.mixer) {
            const mixer = kid1Ref.current.userData.mixer;
            mixer.update(deltaTime);
            
            if (kid1Ref.current.userData.animationActions) {
              // 检查是否有 destination 且已到达
              const hasDestination = currentSectionRef.current?.destination !== null && currentSectionRef.current?.destination !== undefined;
              const isDestinationReached = destinationReachedRef.current;
              
              // 如果到达了 destination，应该停止动画
              const shouldPlayAnimation = isMoving && !(hasDestination && isDestinationReached);
              
              kid1Ref.current.userData.animationActions.forEach((action) => {
                if (shouldPlayAnimation) {
                  // 正在移动且未到达 destination：播放动画
                  if (!action.isRunning()) {
                    action.reset().fadeIn(0.2).play();
                  }
                  // 确保循环播放
                  if (action.loop !== THREE.LoopRepeat) {
                    action.setLoop(THREE.LoopRepeat);
                  }
                } else {
                  // 已到达目标或不在移动：停止动画（淡出）
                  if (action.isRunning()) {
                    action.fadeOut(0.2);
                  }
                }
              });
            }
          }
        } else if (isStillDelaying) {
          // 在延迟期间，停止动画
          if (kid1Ref.current.userData.mixer) {
            const mixer = kid1Ref.current.userData.mixer;
            mixer.update(deltaTime);
            
            if (kid1Ref.current.userData.animationActions) {
              kid1Ref.current.userData.animationActions.forEach((action) => {
                if (action.isRunning()) {
                  action.fadeOut(0.2);
                }
              });
            }
          }
        }
        
        // 更新对话气泡位置（只有在可见时才更新）
        if (shouldShowKid1 && bubbleRef.current && kid1Ref.current) {
          const worldPos = new THREE.Vector3();
          kid1Ref.current.getWorldPosition(worldPos);
          
          // 根据模型大小调整气泡高度偏移
          const modelSize = configRef.current?.modelSize || 1.5;
          const bubbleOffsetY = modelSize * 1.2; // 气泡在头顶上方，根据模型大小动态调整
          worldPos.y += bubbleOffsetY;
          
          const projected = worldPos.clone().project(camera);
          const x = (projected.x * 0.5 + 0.5) * window.innerWidth;
          const y = (-projected.y * 0.5 + 0.5) * window.innerHeight;
          
          // 使用 transform 来居中气泡，并设置位置
          bubbleRef.current.style.left = `${x}px`;
          bubbleRef.current.style.top = `${y}px`;
        }
      }
      
      // 只有在 shouldShowKid1 为 true 时才渲染
      // 如果不可见，立即清除画布避免残影（特别是在快速移动鼠标时）
      if (shouldShowKid1) {
        // 在渲染前先清除，确保没有残影
        renderer.clear(true, true, true);
        renderer.render(scene, camera);
      } else {
        // 立即清除画布，避免残影
        // 使用 clearColor 和 clear 来确保完全清除
        renderer.clear(true, true, true); // 清除颜色、深度和模板缓冲区
        // 额外确保画布被清除
        const gl = renderer.getContext();
        if (gl) {
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
        }
      }
    };
    
    animate();
    
    // 清理函数
    // 在 effect 开始时复制 containerRef.current 到局部变量，避免在清理函数中使用可能已改变的 ref
    const currentContainer = containerRef.current;
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (currentContainer && renderer.domElement) {
        currentContainer.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isMapPinLoading, isReady, isRoom2Open, mouseToWorldPosition]);
  
  // 鼠标/触摸移动事件：主要用于跟随鼠标或触摸
  useEffect(() => {
    // 检测是否为移动设备
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || 
                    (window.innerWidth <= 768);
    
    const handlePointerMove = (event) => {
      // 如果还在延迟期间（5秒内），不处理鼠标移动，kid1 保持固定在右边
      if (!isDelayedRef.current) {
        return;
      }
      
      const clientX = event.clientX || (event.touches && event.touches[0]?.clientX) || 0;
      const clientY = event.clientY || (event.touches && event.touches[0]?.clientY) || 0;
      
      // 更新鼠标/触摸位置（虽然不直接使用，但保留以便将来扩展）
      
      if (kid1Ref.current && cameraRef.current && currentSection) {
        // 使用 ref 来检查，确保实时性
        const hasDestination = currentSection.destination !== null && currentSection.destination !== undefined;
        const isReached = destinationReachedRef.current;
        const isMoving = isMovingToDestinationRef.current;
        
        // 如果有 destination，完全忽略鼠标/触摸移动（无论是否到达）
        // 到达 destination 后保持静止，直到切换到其他 section
        if (hasDestination) {
          // 如果还没有开始移动且未到达，立即开始移动到 destination
          if (!isReached && !isMoving && !destinationElementRef.current) {
            const destinationElement = document.querySelector(currentSection.destination);
            if (destinationElement) {
              moveToDestination(destinationElement);
            }
          }
          // 完全忽略鼠标/触摸移动，不更新目标位置
          return;
        }
        
        // 只有在没有 destination 时才跟随鼠标/触摸
        if (!hasDestination) {
          const worldPos = mouseToWorldPosition(
            clientX,
            clientY,
            cameraRef.current,
            5
          );
          targetPositionRef.current.copy(worldPos);
        }
      }
    };
    
    // 添加鼠标和触摸事件监听
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    
    // 移动端：也监听 touchstart，让 kid1 立即响应触摸
    if (isMobile) {
      const handleTouchStart = (event) => {
        const touch = event.touches[0];
        if (touch) {
          handlePointerMove({
            clientX: touch.clientX,
            clientY: touch.clientY,
            touches: event.touches
          });
        }
      };
      window.addEventListener('touchstart', handleTouchStart, { passive: true });
      
      return () => {
        window.removeEventListener('mousemove', handlePointerMove);
        window.removeEventListener('touchmove', handlePointerMove);
        window.removeEventListener('touchstart', handleTouchStart);
      };
    }
    
    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
    };
  }, [currentSection, destinationReached, moveToDestination, isDelayed, mouseToWorldPosition]);
  
  // 滚动事件：检测 section 变化
  useEffect(() => {
    let scrollTimeout = null;
    
    const handleScroll = () => {
      // 如果 room2 打开或 map-pin 在 loading，不处理滚动事件
      if (isRoom2Open || isMapPinLoading) {
        return;
      }
      
      // 如果 kid1 正在移动向 destination，立即更新 destination 位置（应对滚动）
      // 这必须在检测 section 变化之前执行，确保滚动时位置及时更新
      if (destinationElementRef.current && isMovingToDestinationRef.current && !destinationReachedRef.current) {
        updateDestinationPosition();
      }
      
      // 使用 requestAnimationFrame 节流，避免频繁检测 section 变化
      if (scrollTimeout) {
        cancelAnimationFrame(scrollTimeout);
      }
      
      scrollTimeout = requestAnimationFrame(() => {
        const newSection = detectCurrentSection();
        const newSectionId = newSection?.id;
        const currentSectionId = currentSection?.id;
        
        if (newSectionId !== currentSectionId) {
          // 先保存旧的 destination element，等新的设置后再清除
          const oldDestinationElement = destinationElementRef.current;
          
          setCurrentSection(newSection);
          setIsMovingToDestination(false);
          isMovingToDestinationRef.current = false; // 更新 ref
          setDestinationReached(false);
          destinationReachedRef.current = false; // 更新 ref
          
          // 清除之前的计时器
          if (bubbleTimerRef.current) {
            clearTimeout(bubbleTimerRef.current);
          }
          
          // 如果没有配置的 section，隐藏气泡，kid1 会移动到右侧外
          if (!newSection) {
            // 清除 destination element
            destinationElementRef.current = null;
            hideBubble();
            return;
          }
          
          // 如果从 null 切换到有配置的 section，让 kid1 从右侧进入
          if (!currentSection && newSection && kid1Ref.current && cameraRef.current) {
            // 设置初始位置在屏幕右侧外
            const rightEdgeX = window.innerWidth + 200;
            const centerY = window.innerHeight / 2;
            const worldPos = mouseToWorldPosition(rightEdgeX, centerY, cameraRef.current, 5);
            kid1Ref.current.position.copy(worldPos);
            targetPositionRef.current.copy(worldPos);
          }
          
          // 如果有 destination，移动到 destination
          if (newSection.destination) {
            const destinationElement = document.querySelector(newSection.destination);
            if (destinationElement) {
              // 只有在找到新的 destination element 后才清除旧的
              if (oldDestinationElement && oldDestinationElement !== destinationElement) {
                destinationElementRef.current = null;
              }
              moveToDestination(destinationElement);
              // 显示默认对话（移动中）
              showBubble(kid1FollowerConfig?.movingMessage || '讓我帶你去看看...');
            } else {
              // destination 元素不存在，清除旧的 destination element
              destinationElementRef.current = null;
              // 直接开始显示对话气泡
              startSectionBubbleCycle(newSection);
            }
          } else {
            // 没有 destination，清除旧的 destination element
            destinationElementRef.current = null;
            // 直接开始显示对话气泡
            startSectionBubbleCycle(newSection);
          }
        } else if (newSection && newSection.destination && !destinationReachedRef.current) {
          // 在同一 section 中，如果有 destination 且未到达，持续更新 destination 位置
          // 使用 ref 而不是 state，确保实时性
          const destinationElement = document.querySelector(newSection.destination);
          if (destinationElement && destinationElement !== destinationElementRef.current) {
            moveToDestination(destinationElement);
          } else if (destinationElement === destinationElementRef.current) {
            // 持续更新 destination 位置（应对滚动）
            updateDestinationPosition();
          }
        }
      });
    };
    
    // 初始检测一次
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) {
        cancelAnimationFrame(scrollTimeout);
      }
    };
      }, [currentSection, detectCurrentSection, moveToDestination, showBubble, startSectionBubbleCycle, kid1FollowerConfig, isRoom2Open, isMapPinLoading, destinationReached, hideBubble, updateDestinationPosition, mouseToWorldPosition]);
  
  // 当到达 destination 时显示对话气泡
  useEffect(() => {
    if (destinationReached && currentSection) {
      startSectionBubbleCycle(currentSection);
    }
  }, [destinationReached, currentSection, startSectionBubbleCycle]);
  
  // 窗口大小改变
  useEffect(() => {
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // 当 isReady 变为 true 时，将 kid1 添加到场景
  useEffect(() => {
    if (isReady && kid1Ref.current && sceneRef.current && !sceneRef.current.children.includes(kid1Ref.current)) {
      sceneRef.current.add(kid1Ref.current);
      
      // 加载时先将 kid1 固定在画面最右边（避免残影）
      if (cameraRef.current) {
        const rightEdgeX = window.innerWidth + 50; // 稍微在屏幕内，但靠近右边
        const centerY = window.innerHeight / 2;
        const worldPos = mouseToWorldPosition(rightEdgeX, centerY, cameraRef.current, 5);
        kid1Ref.current.position.copy(worldPos); // 立即设置位置
        targetPositionRef.current.copy(worldPos); // 目标位置也设置为相同位置，保持静止
        initialPositionSetRef.current = true;
        console.log('✅ kid1 已添加到场景，固定在画面右边，等待 5 秒后启动');
      }
    }
  }, [isReady, mouseToWorldPosition]);
  
  // 检测 room2.html 是否打开（通过监听 DOM 变化）
  useEffect(() => {
    const checkRoom2Status = () => {
      // 检查 room2 modal 是否存在且可见
      const room2Modal = document.querySelector('.room2-modal-overlay');
      const room2Iframe = document.querySelector('.room2-iframe');
      
      // 检查 modal 是否可见（通过计算样式，因为 React 可能使用内联样式）
      let modalVisible = false;
      if (room2Modal) {
        const computedStyle = window.getComputedStyle(room2Modal);
        modalVisible = computedStyle.display !== 'none' && 
                      computedStyle.visibility !== 'hidden' && 
                      computedStyle.opacity !== '0';
      }
      
      if (modalVisible && room2Modal) {
        // room2 modal 存在且可见
        if (!isRoom2Open) {
          setIsRoom2Open(true);
          console.log('🚪 room2.html 已打开，kid1 将消失');
        }
        
        // 检查 iframe 是否在加载中
        if (room2Iframe) {
          try {
            // 尝试访问 iframe 内容（可能因为跨域而失败）
            const iframeDoc = room2Iframe.contentDocument || room2Iframe.contentWindow?.document;
            if (!iframeDoc || iframeDoc.readyState !== 'complete') {
              // iframe 正在加载中
              if (!isMapPinLoading) {
                setIsMapPinLoading(true);
                console.log('⏳ map-pin iframe 正在加载，kid1 将消失');
              }
            } else {
              // iframe 已加载完成
              if (isMapPinLoading) {
                setIsMapPinLoading(false);
                console.log('✅ map-pin iframe 加载完成');
              }
            }
          } catch (e) {
            // 跨域访问失败，假设 iframe 正在加载
            if (!isMapPinLoading) {
              setIsMapPinLoading(true);
              console.log('⏳ map-pin iframe 正在加载（跨域检测）');
            }
          }
        } else {
          // iframe 不存在，但 modal 存在，说明正在准备加载
          if (!isMapPinLoading) {
            setIsMapPinLoading(true);
            console.log('⏳ map-pin iframe 准备加载');
          }
        }
      } else {
        // room2 modal 不存在或不可见
        if (isRoom2Open) {
          setIsRoom2Open(false);
          console.log('🚪 room2.html 已关闭，kid1 将重新出现');
        }
        if (isMapPinLoading) {
          setIsMapPinLoading(false);
        }
      }
    };
    
    // 初始检查
    checkRoom2Status();
    
    // 使用 MutationObserver 监听 DOM 变化
    const observer = new MutationObserver(checkRoom2Status);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
    
    // 监听 iframe 的 load 事件
    const handleIframeLoad = () => {
      setIsMapPinLoading(false);
      console.log('✅ room2 iframe 加载完成');
    };
    
    // 定期检查 iframe 状态（因为 iframe 可能动态添加）
    const checkInterval = setInterval(() => {
      const iframe = document.querySelector('.room2-iframe');
      if (iframe && !iframe.hasAttribute('data-load-listener')) {
        iframe.setAttribute('data-load-listener', 'true');
        iframe.addEventListener('load', handleIframeLoad);
        // 延迟检查，因为 iframe 可能需要时间加载
        setTimeout(() => {
          try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
            if (iframeDoc && iframeDoc.readyState === 'complete') {
              handleIframeLoad();
            }
          } catch (e) {
            // 跨域访问失败，等待 load 事件
          }
        }, 100);
      }
      checkRoom2Status();
    }, 200);
    
    return () => {
      observer.disconnect();
      clearInterval(checkInterval);
      const iframe = document.querySelector('.room2-iframe');
      if (iframe) {
        iframe.removeEventListener('load', handleIframeLoad);
      }
    };
  }, [isRoom2Open, isMapPinLoading]);
  
  // 计算是否应该显示 kid1（需要页面准备好 + 延迟 5 秒 + room2 未打开 + map-pin 未加载）
  const shouldShowKid1 = isReady && isDelayed && !isRoom2Open && !isMapPinLoading;
  
  // 当不可见时，立即清除渲染器（特别是在快速移动鼠标时）
  // 当可见时，记录开始时间用于初始速度计算，并先清除残影
  useEffect(() => {
    if (!shouldShowKid1 && rendererRef.current) {
      // 立即清除画布，避免残影
      rendererRef.current.clear(true, true, true);
      const gl = rendererRef.current.getContext();
      if (gl) {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
      }
      // 重置开始时间
      kid1StartTimeRef.current = null;
    } else if (shouldShowKid1 && kid1StartTimeRef.current === null) {
      // 当 kid1 开始显示时（延迟 5 秒后），先清除画布确保没有残影
      if (rendererRef.current) {
        rendererRef.current.clear(true, true, true);
        const gl = rendererRef.current.getContext();
        if (gl) {
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
        }
      }
      // 记录开始时间
      kid1StartTimeRef.current = Date.now();
      console.log('✅ kid1 延迟 5 秒后启动，已清除残影，将使用初始速度');
    } else if (!isDelayed && isReady && kid1Ref.current && cameraRef.current) {
      // 在延迟期间，确保 kid1 固定在画面右边
      const rightEdgeX = window.innerWidth + 50;
      const centerY = window.innerHeight / 2;
      const worldPos = mouseToWorldPosition(rightEdgeX, centerY, cameraRef.current, 5);
      kid1Ref.current.position.copy(worldPos);
      targetPositionRef.current.copy(worldPos);
    }
  }, [shouldShowKid1, isDelayed, isReady, mouseToWorldPosition]);
  
  // 在延迟期间持续清除画布，避免残影
  useEffect(() => {
    if (!isDelayed && rendererRef.current) {
      // 在延迟期间，定期清除画布
      const clearCanvasInterval = setInterval(() => {
        if (rendererRef.current && !isDelayedRef.current) {
          rendererRef.current.clear(true, true, true);
          const gl = rendererRef.current.getContext();
          if (gl) {
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
          }
        }
      }, 100); // 每 100ms 清除一次
      
      return () => {
        clearInterval(clearCanvasInterval);
      };
    }
  }, [isDelayed]);
  
  return (
    <>
      <div 
        ref={containerRef} 
        className="kid1-follower-container" 
        style={{ 
          opacity: shouldShowKid1 ? 1 : 0, 
          pointerEvents: 'none',
          transition: 'opacity 0.1s ease-in-out' // 缩短过渡时间，更快隐藏
        }} 
      />
      {bubbleVisible && shouldShowKid1 && (
        <div ref={bubbleRef} className="kid1-bubble">
          {bubbleMessage}
        </div>
      )}
    </>
  );
};

export default Kid1Follower;

