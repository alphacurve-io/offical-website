# Kid1 在滚动时被固定在屏幕位置的问题分析

## 问题描述
当 kid1 在有 destination 的 section 时，滚动页面时 kid1 会像浮在屏幕固定的位置，不会跑向已经变动位置的 destination。

## 代码分析

### 1. 动画循环中的 destination 位置更新 (540-547行)
```javascript
if (destinationElementRef.current && isMovingToDestinationRef.current && !destinationReachedRef.current && cameraRef.current) {
  const rect = destinationElementRef.current.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const worldPos = mouseToWorldPosition(centerX, centerY, cameraRef.current, 5);
  targetPositionRef.current.copy(worldPos);
}
```

**分析**：
- ✅ `getBoundingClientRect()` 会返回相对于**视口（viewport）**的位置，滚动时会自动更新
- ✅ 每帧都会更新 `targetPositionRef.current`
- ⚠️ **问题**：`mouseToWorldPosition` 函数可能将屏幕坐标转换为 3D 世界坐标时，使用的是相对于视口的坐标，但没有考虑页面滚动的影响

### 2. kid1 位置更新 (579行)
```javascript
currentPos.lerp(targetPos, moveSpeed);
```

**分析**：
- ✅ 使用 `lerp` 平滑移动到 `targetPositionRef.current`
- ✅ 如果 `targetPositionRef.current` 正确更新，kid1 应该会移动

### 3. 滚动事件中的更新 (790-791行)
```javascript
if (destinationElementRef.current && isMovingToDestinationRef.current && !destinationReachedRef.current) {
  updateDestinationPosition();
}
```

**分析**：
- ✅ 滚动时会调用 `updateDestinationPosition()`
- ✅ `updateDestinationPosition()` 也会使用 `getBoundingClientRect()` 获取最新位置

## 可能的原因

### 🔴 **最可能的原因：mouseToWorldPosition 函数的问题**

`mouseToWorldPosition` 函数可能将屏幕坐标转换为 3D 世界坐标时，使用的是相对于**视口**的坐标系统，而不是相对于**页面**的坐标系统。

当页面滚动时：
- `getBoundingClientRect()` 返回的位置会改变（相对于视口）
- 但是 `mouseToWorldPosition` 可能将其转换为 3D 坐标时，使用的是固定的坐标系统
- 导致 kid1 在 3D 空间中的位置是固定的，不会跟随页面滚动

### 🟡 **次要原因：相机位置固定**

Three.js 的相机位置是固定的（`camera.position.set(0, 2, 5)`），这意味着：
- 3D 世界坐标是相对于相机的
- 当页面滚动时，destination 在页面上的位置改变了
- 但是相机没有移动，所以 3D 世界坐标可能不会正确反映页面滚动

### 🟡 **另一个可能：lerp 速度太慢**

如果 `moveSpeed` 太小，kid1 移动太慢，可能看起来像是被固定住了。

## 解决方案

### 方案 1：确保 mouseToWorldPosition 正确处理滚动
需要检查 `mouseToWorldPosition` 函数是否正确处理了页面滚动。如果它使用的是相对于视口的坐标，应该没问题，因为 `getBoundingClientRect()` 返回的就是相对于视口的坐标。

### 方案 2：在滚动时强制更新位置
在滚动事件中，不仅调用 `updateDestinationPosition()`，还要确保动画循环立即响应。

### 方案 3：增加移动速度
如果 kid1 移动太慢，可以增加 `moveSpeed`。

### 方案 4：检查相机设置
确保相机的坐标系统与页面坐标系统一致。

## 根本原因分析

### 🔴 **核心问题：lerp 速度太慢，跟不上滚动速度**

当页面滚动时：
1. `getBoundingClientRect()` 返回新的相对于视口的位置 ✅
2. `mouseToWorldPosition` 将其转换为 3D 坐标 ✅
3. `targetPositionRef.current` 更新 ✅
4. **但是** `lerp` 的速度太慢（默认 0.05），导致 kid1 移动太慢 ❌

**具体表现**：
- 当页面快速滚动时，destination 的位置变化很快
- 但 kid1 的移动速度是固定的（每帧移动 5% 的距离）
- 如果滚动速度 > kid1 移动速度，kid1 就会看起来像是被固定住了
- 实际上 kid1 在移动，但移动速度跟不上 destination 位置变化的速度

### 🟡 **次要问题：初始速度更慢**

如果 kid1 刚开始显示，会使用 `initialMoveSpeed`（默认 0.02），这比正常速度（0.05）更慢，导致问题更严重。

## 解决方案

### 方案 1：增加移动速度（推荐）
增加 `moveSpeed` 和 `initialMoveSpeed`，让 kid1 移动更快，能跟上滚动速度。

### 方案 2：滚动时使用更快的速度
检测到滚动时，临时增加移动速度。

### 方案 3：滚动时直接设置位置
检测到快速滚动时，直接设置 kid1 的位置，而不是使用 lerp。

## 需要检查的关键点

1. ✅ **mouseToWorldPosition 函数的实现**：正确，使用相对于视口的坐标
2. ✅ **getBoundingClientRect() 的行为**：正确，滚动时会自动更新
3. ✅ **targetPositionRef.current 的值**：正确，每帧都会更新
4. ✅ **lerp 的执行**：正确，每帧都在执行
5. ❌ **moveSpeed 的值**：**太小（0.05），导致移动太慢，跟不上滚动速度**

