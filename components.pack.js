export default {"./components/graphics_settings.js": class GraphicsSettings {
	init() {
		
	}
	
	start() {
		
	}
	
	update(dt) {
		
	}
},
"./components/performance_optimizer.js": class PerformanceOptimizer {
	init() {
		this.fpsHistory = [];
		this.maxHistoryLength = 60;
		this.frameCount = 0;
		this.lastTime = performance.now();
		this.lastAdjustmentTime = performance.now();
		this.adjustmentInterval = 1000;
		this.adjustmentStep = 0.5;
	}

	start() {
		this.world3d = this.ORB.getWorld("world3d");
		this.webglRenderer = this.world3d.renderer.webglRenderer;
		this.startFPSMonitoring();
	}




	startFPSMonitoring() {
		this.animator.add("fps_monitor", (progress, time) => {
			const currentTime = performance.now();
			const deltaTime = currentTime - this.lastTime;
			const fps = 1000 / deltaTime;
			
			this.fpsHistory.push(fps);
			if (this.fpsHistory.length > this.maxHistoryLength) {
				this.fpsHistory.shift();
			}
			
			if (currentTime - this.lastAdjustmentTime >= this.adjustmentInterval) {
				this.checkPerformance();
				this.lastAdjustmentTime = currentTime;
			}
			
			this.lastTime = currentTime;
		});
	}

	checkPerformance() {
		if (this.fpsHistory.length < 10) return;
		
		const avgFPS = this.fpsHistory.reduce((sum, fps) => sum + fps, 0) / this.fpsHistory.length;
		const currentPixelRatio = this.webglRenderer.getPixelRatio();
		
		let newPixelRatio;
		
		if (avgFPS < 30 && currentPixelRatio > 1.0) {
			newPixelRatio = Math.max(1.0, currentPixelRatio - this.adjustmentStep);
		} else if (avgFPS < 30 && currentPixelRatio === 1.0) {
			newPixelRatio = Math.max(0.7, currentPixelRatio - 0.1);
		} else if (avgFPS > 45 && currentPixelRatio < 2.0) {
			newPixelRatio = Math.min(2.0, currentPixelRatio + this.adjustmentStep);
		}
		
		if (newPixelRatio && newPixelRatio !== currentPixelRatio) {
			this.webglRenderer.setPixelRatio(newPixelRatio);
		}
	}
},
"./components/swipe_controller.js": class SwipeController {
	init() {
		this.swipeStartX = 0;
		this.swipeThreshold = 50;
		this.isAnimating = false;
		this.animationDuration = 60;
		this.isDragging = false;
		this.dragStartX = 0;
		this.dragStartY = 0;
		this.screenWidth = Math.min(window.innerWidth, window.innerHeight);
		this.pixelRatio = window.devicePixelRatio || 1;
		this.screenThresholdPercent = 1.2;
		this.maxMovement = 1.0;
		this.swipeDistance = 10;
		this.verticalSensitivity = 0.3;
		
		this.currentObjectIndex = 0;
		this.currentObject = null;
		this.objects = [];
		
		this.isShowingBackSide = false;
		this.orbitRadius = 2;
		
		this.swipePosition = {x: 0, y: 0, z: 0};
		this.behindPosition = {x: 0, y: 0, z: -4};
		this.farPosition = {x: 0, y: 0, z: -2};
		
		this.dragPlane = null;
		this.raycaster = null;
		this.mouse = null;
		this.camera = null;
		
		this.targetPosition = {x: 0, y: 0};
		this.currentPosition = {x: 0, y: 0};
		this.interpolationSpeed = 0.15;
		
		this.swipeThreshold = 3.0;
		this.screenBounds = {left: -12, right: 12, top: 10, bottom: -10};
		
		this.isFlying = false;
		this.flightDirection = {x: 0, y: 0};
		this.lookAtTarget = new this.EET.T.Vector3(0, 0, 5);
		this.lastSwipeDirection = 'right';
	}

	start() {
		this.phoneManager = this.ORB.search("phone_manager");
		this.phoneLocator = this.phoneManager.getComponent("phone_locator");
		
		this.domElement = this.ORB.getWorld("world3d").canvas;
		this.camera = this.ORB.search("main_camera").object3d;
		
		this.raycaster = new this.EET.T.Raycaster();
		this.mouse = new this.EET.T.Vector2();
		
		this.lookAtTarget = new this.EET.T.Vector3(0, 0, 5);
		
		this.createDragPlane();
		this.boundHandlePointerMove = this.handlePointerMove.bind(this);
		this.boundOnPointerDown = this.onPointerDown.bind(this);
		this.boundOnPointerUp = this.onPointerUp.bind(this);
		
		this.domElement.addEventListener("pointermove", this.boundHandlePointerMove);
		this.domElement.addEventListener("pointerdown", this.boundOnPointerDown);
		this.domElement.addEventListener("pointerup", this.boundOnPointerUp);
		this.domElement.addEventListener("pointercancel", this.boundOnPointerUp);
		
		
	}
	
	

	createDragPlane() {
		this.dragPlane = new this.EET.T.Mesh(new this.EET.T.PlaneGeometry(100, 100));
		this.dragPlane.position.set(0, 0, 0);
		this.dragPlane.visible = false;
		this.ORB.getWorld("world3d").object3d.add(this.dragPlane);
	}
	
	updateMousePosition(e) {
		const rect = this.domElement.getBoundingClientRect();
		this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
		this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
	}
	showPhones(){
		this.objects = this.phoneLocator.phones;
		if (this.objects.length > 0) {
			this.currentObject = this.objects[0];
			this.objects.forEach((obj)=>{obj.object3d.visible = true;});
		}
	}
	startFirstPhone() {
		if (!this.currentObject) return;
		
		const startZ = this.farPosition.z;
		const endZ = this.swipePosition.z;
		
		this.currentObject.object3d.position.x = 0;
		this.currentObject.object3d.position.y = 0;
		this.currentObject.object3d.rotation.y = 0;
		
		if (this.objects.length > 1) {
			this.teleportPhone(this.objects[1], this.behindPosition);
		}
		
		this.animator.add("first_phone_appearance", (progress) => {
			const smoothProgress = this.EET.U.smooth(progress, 0.9, 1);
			this.currentObject.object3d.position.z = this.EET.U.lerp(startZ, endZ, smoothProgress);
			
			if (progress === 1) {
				this.isAnimating = false;
				this.updateDragPlanePosition();
				this.showCallerName();
			}
		}, this.animationDuration);
	}

	onPointerDown(e) {
		if (this.isAnimating || !this.currentObject || this.isShowingBackSide) return;
		
		this.updateMousePosition(e);
		this.raycaster.setFromCamera(this.mouse, this.camera);
		
		const intersects = this.raycaster.intersectObject(this.dragPlane);
		if (intersects.length > 0) {
			this.dragStartPoint = intersects[0].point.clone();
			this.objectStartPosition = this.currentObject.object3d.position.clone();
			this.currentPosition.x = this.objectStartPosition.x;
			this.currentPosition.y = this.objectStartPosition.y;
			this.targetPosition.x = this.objectStartPosition.x;
			this.targetPosition.y = this.objectStartPosition.y;
			this.isDragging = true;
			this.hasHiddenCallerName = false;
		}
	}

	handlePointerMove(e) {
		if (!this.isDragging || !this.currentObject || this.isAnimating || this.isShowingBackSide) return;
		
		this.updateMousePosition(e);
		this.raycaster.setFromCamera(this.mouse, this.camera);
		
		const intersects = this.raycaster.intersectObject(this.dragPlane);
		if (intersects.length > 0) {
			const currentPoint = intersects[0].point;
			const deltaX = currentPoint.x - this.dragStartPoint.x;
			const deltaY = currentPoint.y - this.dragStartPoint.y;
			
			if (!this.hasHiddenCallerName && (Math.abs(deltaX) > 0.1 || Math.abs(deltaY) > 0.1)) {
				this.hideCallerName();
				this.hasHiddenCallerName = true;
			}
			
			this.targetPosition.x = this.objectStartPosition.x + deltaX;
			this.targetPosition.y = this.objectStartPosition.y + deltaY;
			
			this.currentObject.object3d.lookAt(this.lookAtTarget);
			
			const distanceFromCenter = Math.sqrt(this.targetPosition.x * this.targetPosition.x + this.targetPosition.y * this.targetPosition.y);
			if (distanceFromCenter > this.swipeThreshold && !this.isFlying) {
				this.flightDirection.x = this.targetPosition.x / distanceFromCenter;
				this.flightDirection.y = this.targetPosition.y / distanceFromCenter;
				
				this.lastSwipeDirection = this.targetPosition.x > 0 ? 'right' : 'left';
				
				this.isDragging = false;
				this.isFlying = true;
				this.isAnimating = true;
				this.startInertialFlight();
				return;
			}
		}
	}

	onPointerUp(e) {
		if (!this.isDragging || this.isAnimating) return;
		
		this.isDragging = false;
		
		this.animateObjectReturn();
	}

	startInertialFlight() {
		if (!this.currentObject || !this.isFlying) return;
		
		const flightSpeed = 20;
		
		const startX = this.currentObject.object3d.position.x;
		const startY = this.currentObject.object3d.position.y;
		const startRotationY = this.currentObject.object3d.rotation.y;
		
		const rotationDirection = this.lastSwipeDirection === 'left' ? Math.PI : -Math.PI;
		const targetRotationY = startRotationY + rotationDirection;
		
		const estimatedDistance = Math.max(
			Math.abs(this.screenBounds.left - startX),
			Math.abs(this.screenBounds.right - startX),
			Math.abs(this.screenBounds.top - startY),
			Math.abs(this.screenBounds.bottom - startY)
		);
		
		this.animator.add("inertial_flight", (progress, time) => {
			if (!this.isFlying || !this.currentObject) return;
			
			const newX = this.currentObject.object3d.position.x + this.flightDirection.x * flightSpeed * (16.67 / 1000);
			const newY = this.currentObject.object3d.position.y + this.flightDirection.y * flightSpeed * (16.67 / 1000);
			
			this.currentObject.object3d.position.x = newX;
			this.currentObject.object3d.position.y = newY;
			
			const currentDistance = Math.sqrt((newX - startX) ** 2 + (newY - startY) ** 2);
			const rotationProgress = Math.min(currentDistance / estimatedDistance, 1);
			
			this.currentObject.object3d.rotation.y = this.EET.U.lerp(startRotationY, targetRotationY, rotationProgress);
			
			if (this.isPhoneOutOfBounds(newX, newY)) {
				this.onPhoneExitScreen();
				return;
			}
		}, 99999);
	}

	isPhoneOutOfBounds(x, y) {
		return x < this.screenBounds.left || x > this.screenBounds.right || 
			   y < this.screenBounds.bottom || y > this.screenBounds.top;
	}

	onPhoneExitScreen() {
		this.isFlying = false;
		
		// Отметить телефон как завершенный
		const phoneLocator = this.ORB.search("phone_manager", "phone_locator");
		if (phoneLocator) {
			phoneLocator.markPhoneCompleted();
		}
		
		// Проверяем наличие данных перед вызовом callback
		const speechData = this.currentObject.userArgs?.speechData;
		if (speechData && speechData.audioSrc) {
			const currentAudioFile = speechData.audioSrc;
			this.ORB.userArgs.swipeCallback(currentAudioFile, this.lastSwipeDirection);
		}
	}

	animateObjectReturn() {
		if (!this.currentObject) return;
		
		// Проверяем есть ли данные у телефона - если нет, не возвращаем
		const speechData = this.currentObject.userArgs?.speechData;
		if (!speechData || !speechData.caller || !speechData.audioSrc) {
			return;
		}
		
		this.isAnimating = true;
		const startX = this.currentObject.object3d.position.x;
		const startY = this.currentObject.object3d.position.y;
		const targetX = 0;
		const targetY = 0;
		const returnDuration = 20;
		
		this.animator.add("object_return", (progress) => {
			const smoothProgress = this.EET.U.smooth(progress);
			const newX = this.EET.U.lerp(startX, targetX, smoothProgress);
			const newY = this.EET.U.lerp(startY, targetY, smoothProgress);
			
			this.currentObject.object3d.position.x = newX;
			this.currentObject.object3d.position.y = newY;
			
			this.currentObject.object3d.lookAt(this.lookAtTarget);
			
			if (progress === 1) {
				this.isAnimating = false;
				if (this.hasHiddenCallerName) {
					this.showCallerName();
				}
			}
		}, returnDuration);
	}


	swipeCurrentObject() {
		if (!this.currentObject) return;
		
		const audioVisualizer = this.currentObject.object3d.children.find(child => child.name === "cylinders")?.gameObject?.getComponent("audio_visualizer");
		if (audioVisualizer) {
			audioVisualizer.pauseAudio();
		}
		
		this.hideCallerName();
		
		this.isAnimating = true;
		
		const startX = this.currentObject.object3d.position.x;
		const startY = this.currentObject.object3d.position.y;
		
		const targetX = this.lastSwipeDirection === 'left' ? -this.swipeDistance : this.swipeDistance;
		const targetY = 0;
		this.animator.add("swipe_out", (progress) => {
			const smoothProgress = this.EET.U.smooth(progress);
			
			this.currentObject.object3d.position.x = this.EET.U.lerp(startX, targetX, smoothProgress);
			this.currentObject.object3d.position.y = this.EET.U.lerp(startY, targetY, smoothProgress);
			
			if (progress === 1) {
				const currentAudioFile = this.currentObject.userArgs.speechData.audioSrc;
				this.ORB.userArgs.swipeCallback(currentAudioFile, this.lastSwipeDirection);
			}
		}, this.animationDuration);
	}
	
	startFlipAnimation(title, text) {
		
		const startX = this.lastSwipeDirection === 'left' ? this.screenBounds.left - 2 : this.screenBounds.right + 2;
		
		this.currentObject.object3d.position.x = startX;
		this.currentObject.object3d.position.y = 0;
		this.currentObject.object3d.position.z = 0;
		
		this.currentObject.object3d.rotation.set(0, 0, 0);
		const startRotationY = 0;
		const targetRotationY = Math.PI;
		
		
		const audioVisualizer = this.currentObject.object3d.children.find(child => child.name === "cylinders")?.gameObject?.getComponent("audio_visualizer");
		if (audioVisualizer) {
			audioVisualizer.pauseAudio();
		}
		
		const phoneInputController = this.currentObject.getComponent("phone_input_controller");
		if (phoneInputController) {
			phoneInputController.hasStarted = false;
			phoneInputController.switchToPlay();
		}
		
		this.showBackSide(title, text);

		this.animator.add("flip_animation", (progress) => {
			const smoothProgress = this.EET.U.smooth(progress);
			
			const angle = smoothProgress * Math.PI;
			const z = -Math.sin(angle) * this.orbitRadius;
			
			// Движение от края экрана к центру по X
			const x = this.EET.U.lerp(startX, 0, smoothProgress);
			
			this.currentObject.object3d.position.x = x;
			this.currentObject.object3d.position.z = z;
			// Y остается 0 на протяжении всей анимации
			
			// Поворот на 180°
			this.currentObject.object3d.rotation.y = this.EET.U.lerp(startRotationY, targetRotationY, smoothProgress);
			
			if (progress === 1) {
				// В конце анимации телефон на исходной позиции, но повернут на 180°
				this.currentObject.object3d.position.x = 0;
				this.currentObject.object3d.position.y = 0;
				this.currentObject.object3d.position.z = 0;
				this.isAnimating = false;
				
				// ПОКАЗЫВАЕМ UI ТОЛЬКО ПОСЛЕ ЗАВЕРШЕНИЯ АНИМАЦИИ
				setTimeout(() => {
					const phoneBackUI = this.ORB.search("back_ui_panel", "phone_back_ui_html");
					if (phoneBackUI && this.isShowingBackSide) {
						phoneBackUI.updateElementPositions();
						phoneBackUI.animateTextAppearance();
					}
				}, 50);
				
				// Вызываем callback когда телефон завершил свайп
				if (this.ORB.userArgs.swipeCallback) {
					
					
				}
				
			}
		}, this.animationDuration);
		
	}
	
	showBackSide(title, text) {
		this.isShowingBackSide = true;
		// Находим компонент напрямую
		const phoneBackUI = this.ORB.search("back_ui_panel", "phone_back_ui_html");
		if (phoneBackUI) {
			phoneBackUI.showUI(title, text, this.currentObject);
		}
	}
	
	repeatAudio() {
		if (!this.isShowingBackSide) return;
		
		// Сбрасываем аудио на начало и запускаем
		const audioVisualizer = this.currentObject.object3d.children.find(child => child.name === "cylinders")?.gameObject?.getComponent("audio_visualizer");
		if (audioVisualizer) {
			audioVisualizer.startAudio(); // Сбрасывает currentTime = 0 и запускает
		}
		
		// Обновляем состояние кнопок на pause
		const phoneInputController = this.currentObject.getComponent("phone_input_controller");
		if (phoneInputController) {
			phoneInputController.hasStarted = true;
			phoneInputController.switchToPause();
		}
	}

	repeatRotation() {
		if (!this.isShowingBackSide) return;
		
		// Сбрасываем аудио на начало и запускаем
		const audioVisualizer = this.currentObject.object3d.children.find(child => child.name === "cylinders")?.gameObject?.getComponent("audio_visualizer");
		if (audioVisualizer) {
			audioVisualizer.startAudio(); // Сбрасывает currentTime = 0 и запускает
		}
		
		// Обновляем состояние кнопок на pause
		const phoneInputController = this.currentObject.getComponent("phone_input_controller");
		if (phoneInputController) {
			phoneInputController.hasStarted = true;
			phoneInputController.switchToPause();
		}
		
		this.hideBackSide();
		this.isAnimating = true;
		
		const startRotationY = this.currentObject.object3d.rotation.y;
		const targetRotationY = startRotationY + Math.PI; // Еще один поворот на 180°
		
		this.animator.add("repeat_rotation", (progress) => {
			const smoothProgress = this.EET.U.smooth(progress);
			this.currentObject.object3d.rotation.y = this.EET.U.lerp(startRotationY, targetRotationY, smoothProgress);
			
			if (progress === 1) {
				this.isAnimating = false;
			}
		}, this.animationDuration);
		
	}
	
	proceedToNext(callback = null) {
		if (!this.isShowingBackSide) {
			return;
		}

		// Очищаем данные текущего телефона
		this.currentObject.userArgs.speechData = null;
		this.hideCallerName();
		
		// Сбрасываем флаги состояния
		this.isFlying = false;
		this.isDragging = false;
		
		// Останавливаем и сбрасываем аудио текущего телефона
		const audioVisualizer = this.currentObject.object3d.children.find(child => child.name === "cylinders")?.gameObject?.getComponent("audio_visualizer");
		if (audioVisualizer) {
			audioVisualizer.pauseAudio();
			audioVisualizer.resetAudio();
			audioVisualizer.speechFile = null;
		}
		
		// Скрываем UI сразу при нажатии кнопки
		this.hideBackSide();
		
		this.isAnimating = true;
		
		const startX = this.currentObject.object3d.position.x;
		const targetX = this.lastSwipeDirection === 'left' ? -this.swipeDistance : this.swipeDistance;
		
		// Добавляем поворот на 180° в зависимости от направления свайпа
		const startRotationY = this.currentObject.object3d.rotation.y;
		const rotationDirection = this.lastSwipeDirection === 'left' ? Math.PI : -Math.PI;
		const targetRotationY = startRotationY + rotationDirection;
		
		this.animator.add("proceed_swipe", (progress) => {
			const smoothProgress = this.EET.U.smooth(progress);
			this.currentObject.object3d.position.x = this.EET.U.lerp(startX, targetX, smoothProgress);
			
			// Добавляем поворот синхронно с движением
			this.currentObject.object3d.rotation.y = this.EET.U.lerp(startRotationY, targetRotationY, smoothProgress);
			
			if (progress === 1) {
				this.isAnimating = false;
				
				// Вызываем callback только для уведомления
				if (callback) {
					callback();
				}
			}
		}, this.animationDuration);
	}
	
	hideBackSide() {
		this.isShowingBackSide = false;
		// Находим компонент напрямую
		const phoneBackUI = this.ORB.search("back_ui_panel", "phone_back_ui_html");
		if (phoneBackUI) {
			phoneBackUI.hideUI();
		}
	}

	moveToNextObject() {
		// Отметить телефон как завершенный
		const phoneLocator = this.ORB.search("phone_manager", "phone_locator");
		if (phoneLocator) {
			phoneLocator.markPhoneCompleted();
		}
		
		// Телефон свайпнут
		const swipedPhone = this.currentObject;
		const nextPhone = this.getNextPhone();
		
		// Следующий телефон становится активным
		this.currentObject = nextPhone;
		this.currentObjectIndex = this.currentObjectIndex === 0 ? 1 : 0;
		this.animateNextObjectAppearance();
		
		// Свайпнутый телефон телепортируется за активный
		this.teleportPhone(swipedPhone, this.behindPosition);
	}
	
	getNextPhone() {
		if (this.objects.length < 2) return null;
		return this.currentObjectIndex === 0 ? this.objects[1] : this.objects[0];
	}
	
	teleportPhone(phone, position) {
		phone.object3d.position.set(position.x, position.y, position.z);
		phone.object3d.rotation.set(0, 0, 0);
		
		const phoneInputController = phone.getComponent("phone_input_controller");
		if (phoneInputController) {
			phoneInputController.hasStarted = false;
			phoneInputController.switchToPlay();
		}
	}

	// Новый метод для второй части анимации - вызывается из showNewPhone
	proceedToNextPart2() {
		// Телепортируем улетевший телефон далеко (теперь это происходит только при новых данных)
		this.teleportPhone(this.currentObject, this.farPosition);
		
		// Выполняем смену объекта
		const swipedPhone = this.currentObject;
		const nextPhone = this.getNextPhone();
		
		// Следующий телефон становится активным
		this.currentObject = nextPhone;
		this.currentObjectIndex = this.currentObjectIndex === 0 ? 1 : 0;
		
		// Запускаем анимацию появления нового телефона
		this.animateNextObjectAppearance();
		
		// Старый телефон ставим за новый
		this.teleportPhone(swipedPhone, this.behindPosition);
	}

	animateNextObjectAppearance() {
		if (!this.currentObject) return;
		
		const startZ = this.behindPosition.z;
		const endZ = this.swipePosition.z;
		
		this.currentObject.object3d.position.x = 0;
		this.currentObject.object3d.rotation.y = 0;
		
		this.animator.add("next_object_appearance", (progress) => {
			if (!this.currentObject) return;
			
			const smoothProgress = this.EET.U.smooth(progress, 0.9, 1);
			this.currentObject.object3d.position.z = this.EET.U.lerp(startZ, endZ, smoothProgress);
			this.currentObject.object3d.position.x = 0;
			
			if (progress === 1) {
				this.isAnimating = false;
				this.updateDragPlanePosition();
				// Показываем имя звонящего когда телефон подлетел
				this.showCallerName();
			}
		}, this.animationDuration);
	}
	
	update(dt) {
		if (this.isDragging && this.currentObject && !this.isFlying) {
			this.currentPosition.x = this.EET.U.lerp(this.currentPosition.x, this.targetPosition.x, this.interpolationSpeed);
			this.currentPosition.y = this.EET.U.lerp(this.currentPosition.y, this.targetPosition.y, this.interpolationSpeed);
			
			this.currentObject.object3d.position.x = this.currentPosition.x;
			this.currentObject.object3d.position.y = this.currentPosition.y;
		}
	}

	updateDragPlanePosition() {
		if (this.dragPlane && this.currentObject) {
			this.dragPlane.position.copy(this.currentObject.object3d.position);
		}
	}
	
	showCallerName() {
		const callerDisplay = this.ORB.search("caller_name_display", "caller_display_html");
		if (callerDisplay && this.currentObject) {
			const speechData = this.currentObject.userArgs?.speechData;
			
			// Если нет данных - не показываем имя вообще
			if (!speechData || !speechData.caller || !speechData.audioSrc) {
				callerDisplay.hideCallerName();
				return;
			}
			
			const caller = speechData.caller;
			callerDisplay.showCallerName(caller, this.currentObject);
		}
	}
	
	hideCallerName() {
		const callerDisplay = this.ORB.search("caller_name_display", "caller_display_html");
		if (callerDisplay) {
			callerDisplay.hideCallerName();
		}
	}

	onRemove() {
		if (this.domElement) {
			this.domElement.removeEventListener("pointermove", this.boundHandlePointerMove);
			this.domElement.removeEventListener("pointerdown", this.boundOnPointerDown);
			this.domElement.removeEventListener("pointerup", this.boundOnPointerUp);
			this.domElement.removeEventListener("pointercancel", this.boundOnPointerUp);
		}
	}
},
"./components/camera_gyro_control.js": class CameraGyroControl {
	init() {
		this.sensitivity = 2.0; // увеличена в 4 раза
		this.maxRotation = 15; // градусы
		this.smoothing = 0.1;
		
		this.targetRotation = { x: 0, y: 0 };
		this.currentRotation = { x: 0, y: 0 };
		this.initialRotation = { x: 0, y: 0 };
		
		this.isEnabled = false;
		this.hasPermission = false;
		
		this.lastMoveTime = 0;
		this.idleTimeout = 1000; // 1 секунда
		this.isReturning = false;
	}
	
	start() {
		this.camera = this.object3d;
		this.basePosition = { x: this.camera.position.x, y: this.camera.position.y, z: this.camera.position.z };
		
		this.requestPermission();
	}
	
	async requestPermission() {
		this.startListening();
	}
	
	startListening() {
		this.inputer.add("camera_mouse", "pointermove", this.handleMouseMove.bind(this));
		this.isEnabled = true;
	}
	
	handleMouseMove(event) {
		if (!this.isEnabled) return;
		
		// Обновляем время последнего движения
		this.lastMoveTime = Date.now();
		
		// Останавливаем анимацию возврата если она была запущена
		if (this.isReturning) {
			this.isReturning = false;
		}
		
		// Получаем позицию мыши относительно центра экрана
		const centerX = window.innerWidth / 2;
		const centerY = window.innerHeight / 2;
		
		const mouseX = event.clientX - centerX;
		const mouseY = event.clientY - centerY;
		
		// Нормализация и применение чувствительности
		const posX = (mouseX / centerX) * this.sensitivity;
		const posY = -(mouseY / centerY) * this.sensitivity; // инвертируем Y
		
		// Ограничение смещения (увеличено в 3 раза)
		const maxOffset = this.maxRotation * 10;
		this.targetRotation.x = this.EET.U.clamp(posX, -maxOffset, maxOffset);
		this.targetRotation.y = this.EET.U.clamp(posY, -maxOffset, maxOffset);
	}
	
	update(dt) {
		if (!this.isEnabled) return;
		
		// Проверяем таймер бездействия
		const currentTime = Date.now();
		if (!this.isReturning && this.lastMoveTime > 0 && (currentTime - this.lastMoveTime) > this.idleTimeout) {
			this.startReturnAnimation();
		}
		
		// Если не возвращаемся, выполняем обычную логику следования за указателем
		if (!this.isReturning) {
			// Плавная интерполяция к целевой позиции с сглаживанием
			const smoothedProgress = this.EET.U.smooth(this.smoothing, 0.1, 0.9);
			
			this.currentRotation.x = this.EET.U.lerp(
				this.currentRotation.x,
				this.targetRotation.x,
				smoothedProgress
			);
			
			this.currentRotation.y = this.EET.U.lerp(
				this.currentRotation.y,
				this.targetRotation.y,
				smoothedProgress
			);
			
			// Применение к позиции камеры
			this.camera.position.x = this.basePosition.x + this.currentRotation.x;
			this.camera.position.y = this.basePosition.y + this.currentRotation.y;
		}
		
		// Камера всегда смотрит на центр (0,0,0)
		this.camera.lookAt(0, 0, 0);
	}
	
	startReturnAnimation() {
		this.isReturning = true;
		
		// Запоминаем текущие позиции для анимации
		const startX = this.currentRotation.x;
		const startY = this.currentRotation.y;
		
		// Сбрасываем целевые позиции в 0
		this.targetRotation.x = 0;
		this.targetRotation.y = 0;
		
		// Запускаем анимацию возврата
		this.animator.add("camera_return", (progress) => {
			if (!this.isReturning) return; // Прерываем если пользователь снова двигает указатель
			
			const smoothProgress = this.EET.U.smooth(progress);
			
			this.currentRotation.x = this.EET.U.lerp(startX, 0, smoothProgress);
			this.currentRotation.y = this.EET.U.lerp(startY, 0, smoothProgress);
			
			// Применение к позиции камеры
			this.camera.position.x = this.basePosition.x + this.currentRotation.x;
			this.camera.position.y = this.basePosition.y + this.currentRotation.y;
			
			if (progress === 1) {
				this.isReturning = false;
			}
		}, 60); // 60 кадров для плавной анимации
	}
	
	onRemove() {
		this.inputer.remove("camera_mouse");
	}
},
"./components/phone_locator.js": class PhoneLocator {
	start() {
		this.speechFiles = this.ORB.userArgs.speechFiles || [];
		this.phoneCount = 2;
		this.phones = [];
		this.currentAudioIndex = 0;
		this.completedCount = 0;
		this.camera = this.ORB.search("main_camera").object3d;
		
		// ВСЕГДА создаем телефоны, независимо от speechFiles
		this.createPhones();
		this.preloadPhones();
	}

	preloadPhones() {
		this.originalZ = this.gameObject.object3d.position.z;
		this.gameObject.object3d.visible = true;
		this.gameObject.object3d.position.z = -50;
		this.hiddenObjects = [];
		
		this.gameObject.object3d.traverse(child => {
			child.frustumCulled = false;
			if (!child.visible) {
				this.hiddenObjects.push(child);
				child.visible = true;
			}
		});
		
		this.animator.addTimer("hide_preload", () => {
			this.gameObject.object3d.visible = false;
			this.gameObject.object3d.position.z = this.originalZ;
			
			this.gameObject.object3d.traverse(child => {
				child.frustumCulled = true;
			});
			
			this.hiddenObjects.forEach(child => {
				child.visible = false;
			});
			this.hiddenObjects = [];
		}, "0.1");
	}

	createPhones() {
		for(let i = 0; i < this.phoneCount; i++) {
			let x = 0;
			let y = 0;
			let z = 0;
			
			if (i === 0) {
				// Первый телефон - дальняя позиция (будет анимироваться на активную позицию)
				z = -2;
			} else {
				// Второй телефон - за активной позицией
				z = -4;
			}
			
			let rotationY = 0;

			const phoneData = {
				preset: "smartphone",
				object3d: {
					name: `phone_${i + 1}`,
					position: [x, y, z],
					rotation: [0, rotationY, 0]
				},
				userArgs: {
					speechData: {audioSrc: "", caller: ""}
				}
			};
			
			const phone = new this.EET.GameObject(this.ORB, phoneData);
			
			this.gameObject.add(phone);
			this.phones.push(phone);
		}
		
		this.currentAudioIndex = 0;
	}

	showNewPhone(audioSrc, caller) {
		// Проверяем наличие данных
		if (!audioSrc || !caller) {
			return;
		}
		
		const swipeController = this.ORB.search("main_camera", "swipe_controller");
		
		// Проверяем, был ли уже показан первый телефон
		if (this.currentAudioIndex === 0) {
			// Первый вызов - обновляем данные первого телефона
			if (this.phones.length > 0) {
				const firstPhone = this.phones[0];
				firstPhone.userArgs.speechData = {audioSrc, caller};
				
				// Обновляем аудио визуализатор
				const audioVisualizer = firstPhone.object3d.children.find(child => child.name === "cylinders")?.gameObject?.getComponent("audio_visualizer");
				if (audioVisualizer) {
					audioVisualizer.speechFile = audioSrc;
					audioVisualizer.setupAudio();
				}
			}
			this.currentAudioIndex++;
		} else {
			// Последующие вызовы - запускаем вторую часть анимации
			if (!swipeController) {
				return;
			}
			
			// Запускаем вторую часть анимации (смена телефонов)
			swipeController.proceedToNextPart2();
			
			// Обновляем данные нового активного телефона (после смены)
			const currentPhone = swipeController.currentObject;
			if (currentPhone) {
				currentPhone.userArgs.speechData = {audioSrc, caller};
				
				// Обновляем аудио визуализатор
				const audioVisualizer = currentPhone.object3d.children.find(child => child.name === "cylinders")?.gameObject?.getComponent("audio_visualizer");
				if (audioVisualizer) {
					audioVisualizer.speechFile = audioSrc;
					audioVisualizer.setupAudio();
				}
			}
		}
	}
	
	getNextSpeechData() {
		if (!this.speechFiles || this.currentAudioIndex >= this.speechFiles.length) {
			return null;
		}
		
		const speechData = this.speechFiles[this.currentAudioIndex];
		this.currentAudioIndex++;
		return speechData;
	}
	
	hasMoreSpeechData() {
		return this.speechFiles && this.currentAudioIndex < this.speechFiles.length;
	}
	
	recyclePhone(phone) {
		const newSpeechData = this.getNextSpeechData();
		
		const audioVisualizer = phone.object3d.children.find(child => child.name === "cylinders")?.gameObject?.getComponent("audio_visualizer");
		if (audioVisualizer) {
			audioVisualizer.pauseAudio();
			audioVisualizer.speechFile = newSpeechData.audioSrc;
			audioVisualizer.setupAudio();
		}
		
		phone.userArgs.speechData = newSpeechData;
		phone.object3d.rotation.set(0, 0, 0);
		
		return phone;
	}
	
	updatePhoneDisplay(phone) {
		const callerDisplay = phone.object3d.children.find(child => child.name === "caller_name")?.gameObject?.getComponent("caller_display");
		if (callerDisplay) {
			callerDisplay.updateCallerName();
		}
	}
	
	markPhoneCompleted() {
		this.completedCount++;
	}
	
	isGameCompleted() {
		return this.speechFiles && this.completedCount >= this.speechFiles.length;
	}
},
"./components/phone_input_controller.js": class PhoneInputController {
	start() {
		this.raycaster = new this.EET.T.Raycaster();
		this.mouse = new this.EET.T.Vector2();
		this.camera = this.ORB.search("main_camera").object3d;
		
		this.playButton = null;
		this.pauseButton = null;
		this.audioVisualizer = null;
		this.isPlaying = false;
		this.hasStarted = false;
		
		this.gameObject.object3d.children.forEach(child => {
			if (child.name === "play_button") {
				this.playButton = child;
			}
			if (child.name === "pause_button") {
				this.pauseButton = child;
				child.visible = false;
			}
			if (child.name === "cylinders") {
				this.audioVisualizer = child.gameObject.getComponent("audio_visualizer");
			}
		});
		
		this.domElement = this.ORB.getWorld("world3d").canvas;
		this.boundOnClick = this.onClick.bind(this);
		this.domElement.addEventListener("click", this.boundOnClick);
	}

	onClick(e) {
		if (!this.playButton || !this.pauseButton || !this.audioVisualizer) {
			return;
		}
		
		// Проверяем что телефон активный и лицевой стороной к камере
		if (!this.isActiveAndFacingCamera()) {
			return;
		}
		
		this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
		this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

		this.raycaster.setFromCamera(this.mouse, this.camera);

		const playIntersects = this.raycaster.intersectObject(this.playButton, false);
		const pauseIntersects = this.raycaster.intersectObject(this.pauseButton, false);

		if (playIntersects.length > 0 && !this.isPlaying) {
			// Проверяем наличие аудиофайла
			const speechData = this.gameObject.userArgs?.speechData;
			if (!speechData || !speechData.audioSrc) {
				return; // Не воспроизводим если нет аудиофайла
			}
			
			if (!this.hasStarted) {
				this.audioVisualizer.startAudio();
				this.hasStarted = true;
			} else {
				this.audioVisualizer.resumeAudio();
			}
			this.switchToPause();
		} else if (pauseIntersects.length > 0 && this.isPlaying) {
			this.audioVisualizer.pauseAudio();
			this.switchToPlay();
		}
	}

	
	isActiveAndFacingCamera() {
		// Найти swipe controller для проверки активного телефона
		const swipeController = this.ORB.search("main_camera", "swipe_controller");
		if (!swipeController) return false;
		
		// Проверяем что этот телефон активный
		const isCurrentPhone = swipeController.currentObject === this.gameObject;
		if (!isCurrentPhone) return false;
		
		// Проверяем что телефон не показывает заднюю сторону
		const isShowingBackSide = swipeController.isShowingBackSide;
		if (isShowingBackSide) return false;
		
		// Проверяем что телефон развернут лицевой стороной (rotation.y близко к 0 или 2π)
		const rotationY = this.gameObject.object3d.rotation.y;
		const normalizedRotation = ((rotationY % (Math.PI * 2)) + (Math.PI * 2)) % (Math.PI * 2);
		const isFacingCamera = normalizedRotation < Math.PI / 4 || normalizedRotation > (Math.PI * 2 - Math.PI / 4);
		
		return isFacingCamera;
	}

	switchToPause() {
		this.isPlaying = true;
		
		this.pauseButton.visible = true;
		this.pauseButton.material.opacity = 0;
		this.pauseButton.scale.set(0, 0, 0);
		
		this.animator.add("hide_play", (progress) => {
			const scaleUp = this.EET.U.lerp(1, 1.2, progress);
			this.playButton.scale.set(scaleUp, scaleUp, scaleUp);
			this.playButton.material.opacity = this.EET.U.lerp(1, 0, progress);
			
			if (progress === 1) {
				this.playButton.visible = false;
				this.playButton.scale.set(1, 1, 1);
			}
		}, 15);
		
		this.animator.add("show_pause", (progress) => {
			const scaleDown = this.EET.U.lerp(0, 1, progress);
			this.pauseButton.scale.set(scaleDown, scaleDown, scaleDown);
			this.pauseButton.material.opacity = this.EET.U.lerp(0, 1, progress);
		}, 15);
	}
	
	switchToPlay() {
		this.isPlaying = false;
		
		this.playButton.visible = true;
		this.playButton.material.opacity = 0;
		this.playButton.scale.set(0, 0, 0);
		
		this.animator.add("hide_pause", (progress) => {
			const scaleUp = this.EET.U.lerp(1, 1.2, progress);
			this.pauseButton.scale.set(scaleUp, scaleUp, scaleUp);
			this.pauseButton.material.opacity = this.EET.U.lerp(1, 0, progress);
			
			if (progress === 1) {
				this.pauseButton.visible = false;
				this.pauseButton.scale.set(1, 1, 1);
			}
		}, 15);
		
		this.animator.add("show_play", (progress) => {
			const scaleDown = this.EET.U.lerp(0, 1, progress);
			this.playButton.scale.set(scaleDown, scaleDown, scaleDown);
			this.playButton.material.opacity = this.EET.U.lerp(0, 1, progress);
		}, 15);
	}

	onRemove() {
		if (this.domElement) {
			this.domElement.removeEventListener("click", this.boundOnClick);
		}
	}
},
"./components/audio_visualizer.js": class AudioVisualizer {
	init() {
		this.audio = null;
		this.audioContext = null;
		this.analyser = null;
		this.frequencyData = null;
		this.isPlaying = false;
		this.smoothedData = new Array(128).fill(0);
		this.smoothingFactor = 0.8;
		this.isResetting = false;
		this.centerOffset = 0;
		this.offsetTime = 0;
		this.speechFile = null;
		this.sticks = [];
		this.originalGeometries = [];
		this.cylinderCount = 20;
		this.smoothedAmplitudes = new Array(20).fill(0);
		this.amplitudeSmoothingFactor = 0.7;

	}

	start() {
		this.cylindersGroup = this.gameObject.object3d;
		this.centerIndex = (this.cylinderCount - 1) / 2;
		this.maxFreqIndex = Math.floor(this.cylinderCount / 2);
		
		this.speechFile = this.object3d.parent.gameObject.userArgs.speechData.audioSrc;
		
		this.createSticks();
		this.setupAudio();
		this.resetCylinders();

	}

	createSticks() {
		const stickGeometry = this.ORB.loader.get("./models/stick.fbx").geometry;
		
		for(let i = 0; i < this.cylinderCount; i++) {
			const clonedGeometry = stickGeometry.clone();
			const originalPositions = clonedGeometry.attributes.position.array.slice();
			
			const material = new this.EET.T.MeshStandardMaterial({
				metalness: 0.0,
				roughness: 1,
				alphaTest: 0.01,
				transparent: true,
				side: this.EET.T.DoubleSide,
				map: this.ORB.loader.get("./textures/stick_color.png"),
				normalMap: this.ORB.loader.get("./textures/stick_nm.jpg"),
				aoMap: this.ORB.loader.get("./textures/stick_ao.jpg"),
				emissiveMap: this.ORB.loader.get("./textures/stick_em.jpg")
			});
			
			const stick = new this.EET.T.Mesh(clonedGeometry, material);
			stick.position.set((i - this.centerIndex) * 0.2, 0, 0);
			stick.renderOrder = 1;
			
			this.cylindersGroup.add(stick);
			this.sticks.push(stick);
			this.originalGeometries.push(originalPositions);
		}
	}

	setupAudio() {
		this.audio = new Audio(this.speechFile);
		this.audio.crossOrigin = "anonymous";
		this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
		this.analyser = this.audioContext.createAnalyser();
		
		this.analyser.fftSize = 256;
		this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
		
		const source = this.audioContext.createMediaElementSource(this.audio);
		source.connect(this.analyser);
		this.analyser.connect(this.audioContext.destination);
		
		this.audio.addEventListener('ended', () => {
			this.isPlaying = false;
			this.isResetting = true;
			this.resetCylinders();
		});
		
		this.audio.addEventListener('error', (e) => {
			console.error('Ошибка загрузки аудио:', this.speechFile, e);
		});
		
		this.audio.addEventListener('canplaythrough', () => {
			console.log('Аудио загружено:', this.speechFile);
		});
	}

	playAudio() {
		this.audioContext.resume().then(() => {
			this.audio.play();
			this.isPlaying = true;
			this.cylindersGroup.visible = true;
		});
	}

	update(dt) {
		if (!this.isPlaying && !this.isResetting) {
			//this.resetCylinders();
			return;
		}
		
		this.offsetTime += dt;
		this.centerOffset = Math.sin(this.offsetTime * 0.5) * 3;
		
		if (this.isPlaying && this.analyser) {
			this.analyser.getByteFrequencyData(this.frequencyData);
			
			for(let i = 0; i < this.frequencyData.length; i++) {
				this.smoothedData[i] = this.smoothedData[i] * this.smoothingFactor + 
									   (this.frequencyData[i] / 255) * (1 - this.smoothingFactor);
			}
		} else if (this.isResetting) {
			for(let i = 0; i < this.smoothedData.length; i++) {
				this.smoothedData[i] *= 0.95;
			}
			
			let maxValue = Math.max(...this.smoothedData);
			if (maxValue < 0.01) {
				this.isResetting = false;
				this.smoothedData.fill(0);
			}
		}
		
		let totalAmplitude = 0;
		for(let i = 0; i < this.smoothedData.length; i++) {
			totalAmplitude += this.smoothedData[i];
		}
		const avgLoudness = totalAmplitude / this.smoothedData.length;
		const loudnessMultiplier = 1 + avgLoudness * 2;
		
		for(let i = 0; i < this.cylinderCount; i++) {
			let centerIndex = Math.abs(i - this.centerIndex + this.centerOffset);
			let freqIndex = Math.floor(Math.min(centerIndex, this.maxFreqIndex) * this.smoothedData.length / (this.maxFreqIndex + 1));
			let amplitude = this.smoothedData[freqIndex] * loudnessMultiplier;
			
			this.smoothedAmplitudes[i] = this.smoothedAmplitudes[i] * this.amplitudeSmoothingFactor + 
										amplitude * (1 - this.amplitudeSmoothingFactor);
			
			this.deformStick(i, this.smoothedAmplitudes[i]);
		}
	}

	deformStick(index, amplitude) {
		const stick = this.sticks[index];
		const originalPositions = this.originalGeometries[index];
		const positions = stick.geometry.attributes.position.array;
		
		for(let i = 0; i < positions.length; i += 3) {
			const originalY = originalPositions[i + 1];

			if(amplitude > 0.01 )stick.scale.y = 1;
			else if(amplitude < 0.001 )stick.scale.y = 0;
			else stick.scale.y = amplitude*100;

			if (originalY > 0) {
				positions[i + 1] = originalY + (amplitude);
			} else if (originalY < 0) {
				positions[i + 1] = originalY - (amplitude);
			} else {
				positions[i + 1] = originalY;
			}
		}
		
		stick.geometry.attributes.position.needsUpdate = true;
		stick.geometry.computeVertexNormals();
	}

	resetCylinders() {
		for(let i = 0; i < this.cylinderCount; i++) {
			this.deformStick(i, 0);
		}
		
		this.cylindersGroup.visible = false;
		this.smoothedData.fill(0);
	}

	startAudio() {
		if(!this.isPlaying && !this.isResetting) {
			this.audio.currentTime = 0;
			this.cylindersGroup.visible = true;
			this.playAudio();
		}
	}
	
	pauseAudio() {
		if (this.isPlaying) {
			this.audio.pause();
			this.isPlaying = false;
		}
	}
	
	resumeAudio() {
		if(!this.isPlaying && !this.isResetting) {
			this.cylindersGroup.visible = true;
			this.playAudio();
		}
	}
	
	resetAudio() {
		if (this.audio) {
			this.audio.currentTime = 0;
		}
		this.isPlaying = false;
		this.isResetting = false;
		this.resetCylinders();
	}

	onKeyDown(e) {
		if(e.key === " ") {
			if (!this.isClosestPhone()) return;
			
			if(this.isPlaying) {
				this.audio.pause();
				this.isPlaying = false;
				this.resetCylinders();
			} else {
				this.audio.currentTime = 0;
				this.cylindersGroup.visible = true;
				this.audio.play();
				this.isPlaying = true;
			}
		}
	}

	isClosestPhone() {
		// Find the swipe controller to check which phone is closest
		const swipeController = this.ORB.search("main_camera")?.getComponent("swipe_controller");
		if (!swipeController) return false;
		
		// Get this phone's parent object
		const thisPhone = this.gameObject.object3d.parent.gameObject;
		
		// Find the closest non-swiped phone
		let closestPhone = null;
		let maxZ = -Infinity;
		
		swipeController.phones.forEach((phone, index) => {
			if (!swipeController.swipedPhones.includes(index) && phone.object3d.position.z > maxZ) {
				maxZ = phone.object3d.position.z;
				closestPhone = phone;
			}
		});
		
		// Return true if this phone is the closest one
		return closestPhone === thisPhone;
	}
},
"./components/logo_animator.js": class LogoAnimator {
	init() {
		this.swipeDistance = 10;
		this.animationDuration = 60;
	}

	start() {
		this.simpleApproach();
	}

	simpleApproach() {
		const startY = this.object3d.position.y - 2;
		const targetY = this.object3d.position.y;
		const startZ = 0.830;
		const targetZ = 1.530;
		const startRotationX = 0.5;
		const targetRotationX = 0;
		const startRotationY = 0.5;
		const targetRotationY = this.object3d.rotation.y;
		
		this.object3d.position.y = startY;
		this.object3d.position.z = startZ;
		this.object3d.rotation.x = startRotationX;
		
		this.object3d.traverse((child) => {
			if (child.material && child.name !== "background_logo") {
				child.material.opacity = 0;
				child.material.transparent = true;
			}
		});
		
		this.animator.add("simple_approach", (progress) => {
			const smoothProgress = this.EET.U.smooth(progress,.9,1);
			
			this.object3d.position.y = this.EET.U.lerp(startY, targetY, smoothProgress);
			this.object3d.position.z = this.EET.U.lerp(startZ, targetZ, smoothProgress);
			this.object3d.rotation.x = this.EET.U.lerp(startRotationX, targetRotationX, smoothProgress);
			this.object3d.rotation.y = this.EET.U.lerp(startRotationY, targetRotationY, smoothProgress);
			
			this.object3d.traverse((child) => {
				if (child.material && child.name !== "background_logo") {
					child.material.opacity = smoothProgress;
				}
				else if(child.name === "background_logo" && progress > .5){
					child.visible = true;
				}
			});
		}, "1s");
	}

	swipe(direction = 'right') {
		const startY = this.object3d.position.y;
		const middleY = 0;
		const startX = this.object3d.position.x;
		const targetX = direction === 'right' ? this.swipeDistance : -this.swipeDistance;
		
		const startRotationY = this.object3d.rotation.y;
		const targetRotationY = direction === 'right' ? -Math.PI / 2 : Math.PI / 2;

		const swipeController = this.ORB.search("main_camera").getComponent("swipe_controller");
		const phoneManager = this.ORB.search("phone_manager");

		phoneManager.object3d.visible = false;
		swipeController.showPhones();
		this.xAnimationStarted = false;
		
		const phoneStartZ = phoneManager.object3d.position.z;
		const phoneTargetZ = 0;
		const phoneStartY = phoneManager.object3d.position.y;
		const phoneTargetY = phoneStartY;
		phoneManager.object3d.position.y = phoneStartY + 2;
		
		swipeController.startFirstPhone();
		this.animator.add("logo_swipe_y", (progress) => {
			const smoothProgress = this.EET.U.smooth(progress);
			this.object3d.position.y = this.EET.U.lerp(startY, middleY, smoothProgress);
			if (progress >= 0.5 && !this.xAnimationStarted) {
				this.xAnimationStarted = true;
				phoneManager.object3d.visible = true;
				this.animator.add("logo_swipe_x", (progress) => {
					
					const smoothProgress = this.EET.U.smooth(progress);
					phoneManager.object3d.position.z = this.EET.U.lerp(phoneStartZ, phoneTargetZ, smoothProgress);
					phoneManager.object3d.position.y = this.EET.U.lerp(phoneStartY + 2, phoneTargetY, smoothProgress);
					this.object3d.position.x = this.EET.U.lerp(startX, targetX, smoothProgress);
					this.object3d.rotation.y = this.EET.U.lerp(startRotationY, targetRotationY, smoothProgress);
					
					if (progress === 1) {
						this.object3d.visible = false;
						
					}
				}, this.animationDuration);
			}
		}, this.animationDuration);
	}
},
"./components/phone_back_ui_html.js": class PhoneBackUIHTML {
	init() {
		this.isVisible = false;
		this.isAudioPlaying = false;
	}

	start() {
		// Найти HTML элементы в UI мире
		this.titleElement = this.ORB.search("back_ui_title");
		this.textElement = this.ORB.search("back_ui_text");
		this.buttonsContainer = this.ORB.search("back_ui_buttons");
		this.repeatButton = this.ORB.search("repeat_button");
		this.nextButton = this.ORB.search("next_button");
		
		// Нужно для проекции 3D в 2D координаты
		this.camera = null;
		this.canvas = null;
		this.currentPhone = null;
		
		// Настроить обработчики событий
		this.repeatButton.object2d.element.addEventListener("click", this.onRepeatClick.bind(this));
		this.nextButton.object2d.element.addEventListener("click", this.onNextClick.bind(this));
		
		this.hideUI();
	}
	
	

	showUI(title, text, currentPhone) {
		this.isVisible = true;
		this.currentPhone = currentPhone;
		this.isAudioPlaying = false;
		
		this.object2d.element.style.display = "block";
		
		// Обновляем содержимое
		if (title) {
			this.titleElement.object2d.element.innerHTML = title;
		}
		if (text) {
			this.textElement.object2d.element.innerHTML = text;
		}
		
		// Сбрасываем текст кнопки
		this.repeatButton.object2d.element.innerHTML = "Прослушать еще раз";
		
		// КАДР 1: Отключаем transition и устанавливаем позиции мгновенно
		this.titleElement.object2d.element.style.transition = "none";
		this.textElement.object2d.element.style.transition = "none";
		this.buttonsContainer.object2d.element.style.transition = "none";
		
		this.updateElementPositions();
		
		// НЕ ПОКАЗЫВАЕМ ЭЛЕМЕНТЫ СРАЗУ - ЖДЕМ КОНЦА АНИМАЦИИ ТЕЛЕФОНА
		this.titleElement.object2d.element.style.opacity = "0";
		this.textElement.object2d.element.style.opacity = "0";
		this.buttonsContainer.object2d.element.style.opacity = "0";
		
		// Устанавливаем начальную позицию для анимации (чуть ниже)
		this.titleElement.object2d.element.style.transform += " translateY(20px)";
		this.textElement.object2d.element.style.transform += " translateY(20px)";
		this.buttonsContainer.object2d.element.style.transform += " translateY(20px)";
		
		// КАДР 2: В следующем кадре включаем transition обратно
		requestAnimationFrame(() => {
			
		});
	}

	hideUI() {
		this.isVisible = false;
		
		
		// Анимация скрытия
		this.titleElement.object2d.element.style.opacity = "0";
		this.textElement.object2d.element.style.opacity = "0";
		this.buttonsContainer.object2d.element.style.opacity = "0";
		
		setTimeout(() => {
			this.object2d.element.style.display = "none";
		}, 300);
	}

	onRepeatClick() {
		const swipeController = this.ORB.search("main_camera", "swipe_controller");
		if (!swipeController) return;
		
		if (this.isAudioPlaying) {
			// Остановить аудио
			const audioVisualizer = this.currentPhone.object3d.children.find(child => child.name === "cylinders")?.gameObject?.getComponent("audio_visualizer");
			if (audioVisualizer) {
				audioVisualizer.pauseAudio();
			}
			
			// Обновить состояние кнопки play на телефоне
			const phoneInputController = this.currentPhone.getComponent("phone_input_controller");
			if (phoneInputController) {
				phoneInputController.hasStarted = false;
				phoneInputController.switchToPlay();
			}
			
			this.isAudioPlaying = false;
			this.repeatButton.object2d.element.innerHTML = "Прослушать еще раз";
		} else {
			// Запустить аудио
			swipeController.repeatAudio();
			this.isAudioPlaying = true;
			this.repeatButton.object2d.element.innerHTML = "Остановить запись";
		}
	}

	onNextClick() {
		// Проверяем завершена ли игра перед переходом к следующему
		const phoneLocator = this.ORB.search("phone_manager", "phone_locator");
		const isGameCompleted = phoneLocator && phoneLocator.isGameCompleted();
		
		// Найти swipe controller в 3D мире и перейти к следующему
		const swipeController = this.ORB.search("main_camera", "swipe_controller"); 
		if (swipeController) {
			// Передаем callback в proceedToNext для вызова после завершения анимации
			swipeController.proceedToNext(() => {
				if (this.ORB.userArgs.gotItCallback) {
					this.ORB.userArgs.gotItCallback();
				}
			});
		}
	}
	
	updateElementPositions() {
		if (!this.currentPhone) {
			return;
		}
		
		// Получить камеру и canvas - ТОЧНО ТАК ЖЕ КАК У CALLER DISPLAY
		if (!this.camera) {
			const cameraObj = this.ORB.search("main_camera");
			if (cameraObj) {
				this.camera = cameraObj.object3d;
			}
			
			const world3d = this.ORB.getWorld("world3d");
			if (world3d) {
				this.canvas = world3d.canvas;
			}
		}
		
		if (!this.camera || !this.canvas) {
			return;
		}
		
		// Рассчитать ширину телефона в 2D
		this.calculatePhoneWidth();
		
		// Обновить позицию заголовка
		this.updateElementPosition(this.titleElement, "back_ui_title_anchor");
		
		// Обновить позицию текста
		this.updateElementPosition(this.textElement, "back_ui_text_anchor");
		
		// Обновить позицию кнопок
		this.updateElementPosition(this.buttonsContainer, "back_ui_buttons_anchor");
	}
	
	calculatePhoneWidth() {
		// Получаем баундинг бокс телефона
		const boundingBox = new this.EET.T.Box3().setFromObject(this.currentPhone.object3d);
		
		// Берем левый и правый край из баундинг бокса
		const leftEdge = new this.EET.T.Vector3(boundingBox.min.x, boundingBox.min.y, boundingBox.min.z);
		const rightEdge = new this.EET.T.Vector3(boundingBox.max.x, boundingBox.min.y, boundingBox.min.z);
		
		// Проецируем края в 2D
		leftEdge.project(this.camera);
		rightEdge.project(this.camera);
		
		const rect = this.canvas.getBoundingClientRect();
		const leftX = (leftEdge.x + 1) * rect.width / 2;
		const rightX = (rightEdge.x + 1) * rect.width / 2;
		const centerX = (leftX + rightX) / 2;
		
		this.phoneWidth = Math.abs(rightX - leftX);
		this.phoneCenterX = centerX;
		this.phoneLeftX = leftX;
		this.phoneRightX = rightX;
		
		
		// Устанавливаем динамическую ширину панели
		this.object2d.element.style.width = this.phoneWidth + "px";
		
	}


	updateElementPosition(element, anchorName) {
		if (!element || !this.currentPhone) {
			return;
		}
		
		const anchor = this.currentPhone.object3d.children.find(child => child.name === anchorName);
		if (!anchor) {
			return;
		}
		
		const worldPosition = new this.EET.T.Vector3();
		anchor.getWorldPosition(worldPosition);
		
		const screenPosition = worldPosition.clone();
		screenPosition.project(this.camera);
		
		const rect = this.canvas.getBoundingClientRect();
		const x = (screenPosition.x + 1) * rect.width / 2;
		const y = -(screenPosition.y - 1) * rect.height / 2;
		
		// Сбрасываем transform перед установкой новой позиции
		element.object2d.element.style.transform = "translate(-50%, -50%)";
		element.object2d.element.style.left = x + "px";
		element.object2d.element.style.top = y + "px";
	}
	
	
	animateTextAppearance() {
		
		
		// Плавная анимация появления с доезжанием снизу
		setTimeout(() => {
			this.titleElement.object2d.element.style.transition = "all 0.3s ease-out";
			this.titleElement.object2d.element.style.opacity = "1";
			this.titleElement.object2d.element.style.transform = this.titleElement.object2d.element.style.transform.replace(" translateY(20px)", "");
		}, 50);
		
		setTimeout(() => {
			this.textElement.object2d.element.style.transition = "all 0.3s ease-out";
			this.textElement.object2d.element.style.opacity = "1";
			this.textElement.object2d.element.style.transform = this.textElement.object2d.element.style.transform.replace(" translateY(20px)", "");
		}, 100);
		
		setTimeout(() => {
			this.buttonsContainer.object2d.element.style.transition = "all 0.3s ease-out";
			this.buttonsContainer.object2d.element.style.opacity = "1";
			this.buttonsContainer.object2d.element.style.transform = this.buttonsContainer.object2d.element.style.transform.replace(" translateY(20px)", "");
		}, 150);
	}
},
"./components/caller_display_html.js": class CallerDisplayHTML {
	start() {
		// Элемент для отображения имени звонящего
		this.callerElement = this.ORB.search("caller_name_display");
		
		// Нужно для проекции 3D в 2D координаты
		this.camera = null;
		this.renderer = null;
		this.canvas = null;
		
		// Сначала скрыт
		this.hideCallerName();
	}
	
	showCallerName(callerName, currentPhone) {
		if (this.callerElement) {
			// Обновляем текст
			this.callerElement.object2d.element.innerHTML = callerName || "Unknown Caller";
			
			// Получаем 3D позицию caller_name группы
			this.currentPhone = currentPhone;
			this.update3DPosition();
			
			// Показываем элемент с анимацией появления
			this.callerElement.object2d.element.style.display = "block";
			this.callerElement.object2d.element.style.opacity = "0";
			this.callerElement.object2d.element.style.transform += " translateY(20px)";
			
			// Плавное появление
			setTimeout(() => {
				this.callerElement.object2d.element.style.opacity = "1";
				this.callerElement.object2d.element.style.transform = this.callerElement.object2d.element.style.transform.replace(" translateY(20px)", "");
			}, 50);
			
			// Запускаем постоянное обновление позиции
			this.startPositionUpdates();
		}
	}
	
	hideCallerName() {
		if (this.callerElement) {
			// Останавливаем обновление позиции
			this.stopPositionUpdates();
			
			// Плавное исчезновение
			this.callerElement.object2d.element.style.opacity = "0";
			this.callerElement.object2d.element.style.transform += " translateY(-20px)";
			
			// Скрываем после анимации
			setTimeout(() => {
				this.callerElement.object2d.element.style.display = "none";
				this.callerElement.object2d.element.style.transform = "translateX(-50%)";
			}, 200);
		}
	}
	
	update3DPosition() {
		if (!this.currentPhone || !this.callerElement) {
			return;
		}
		
		// Найти 3D объект caller_name в телефоне
		const callerNameGroup = this.currentPhone.object3d.children.find(child => child.name === "caller_name");
		if (!callerNameGroup) {
			return;
		}
		
		// Получить камеру и canvas из 3D мира
		if (!this.camera) {
			// Получаем камеру через поиск
			const cameraObj = this.ORB.search("main_camera");
			if (cameraObj) {
				this.camera = cameraObj.object3d;
			}
			
			// Получаем canvas из 3D мира
			const world3d = this.ORB.getWorld("world3d");
			if (world3d) {
				this.canvas = world3d.canvas;
			}
		}
		
		if (!this.camera || !this.canvas) {
			return;
		}
		
		// Получить мировую позицию 3D объекта
		const worldPosition = new this.EET.T.Vector3();
		callerNameGroup.getWorldPosition(worldPosition);
		
		// Проецируем в экранные координаты
		const screenPosition = worldPosition.clone();
		screenPosition.project(this.camera);
		
		// Конвертируем в пиксели
		const rect = this.canvas.getBoundingClientRect();
		const x = (screenPosition.x + 1) * rect.width / 2;
		const y = -(screenPosition.y - 1) * rect.height / 2;
		
		// Обновляем позицию HTML элемента
		this.callerElement.object2d.element.style.left = x + "px";
		this.callerElement.object2d.element.style.top = y + "px";
		this.callerElement.object2d.element.style.transform = "translate(-50%, -50%)";
	}
	
	startPositionUpdates() {
		this.stopPositionUpdates();
		// Обновляем только один раз для отладки
		this.update3DPosition();
		// this.positionUpdateInterval = setInterval(() => {
		// 	this.update3DPosition();
		// }, 16); // ~60 FPS
	}
	
	stopPositionUpdates() {
		if (this.positionUpdateInterval) {
			clearInterval(this.positionUpdateInterval);
			this.positionUpdateInterval = null;
		}
	}
},
}