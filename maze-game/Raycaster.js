class Raycaster {
  constructor(numRays, fov) {
    this.numRays = numRays;
    this.fov = fov;
    this.distances = [];
    
    this.wallColor = [74, 124, 89];
    this.wallColorFar = [74, 124, 89];
    this.skyColor = [135, 206, 235];
    this.floorColor = [101, 67, 33];
  }
  
  render(player, maze, exit, renderDistance) {
    if (typeof width === 'undefined' || typeof height === 'undefined' || !player || !maze) {
      return;
    }
    
    noStroke();
    
    for (let y = 0; y < height / 2; y++) {
      let gradientFactor = map(y, 0, height / 2, 0.0, 1.0);
      let r1 = 135, g1 = 206, b1 = 250;
      let r2 = 70, g2 = 130, b2 = 180;
      let r = lerp(r1, r2, gradientFactor);
      let g = lerp(g1, g2, gradientFactor);
      let b = lerp(b1, b2, gradientFactor);
      fill(r, g, b);
      rect(0, y, width, 1);
    }
    
    for (let y = height / 2; y < height; y++) {
      let distFromHorizon = y - height / 2;
      let maxDist = height / 2;
      let gradientFactor = Math.min(distFromHorizon / maxDist, 1.0);
      let r1 = 101, g1 = 67, b1 = 33;
      let r2 = 160, g2 = 120, b2 = 70;
      let r = lerp(r1, r2, gradientFactor);
      let g = lerp(g1, g2, gradientFactor);
      let b = lerp(b1, b2, gradientFactor);
      fill(r, g, b);
      rect(0, y, width, 1);
    }
    
    let rayAngle = player.angle - this.fov / 2;
    let rayStep = this.fov / this.numRays;
    
    let maxRayDistance = 500;
    
    for (let i = 0; i < this.numRays; i++) {
      let result = this.castRay(player.x, player.y, rayAngle, maze, exit, maxRayDistance);
      this.distances[i] = result.distance;
      
      let angleDiff = rayAngle - player.angle;
      let cosAngle = Math.cos(angleDiff);
      let correctionFactor = Math.abs(cosAngle);
      
      if (result.distance > 80 && Math.abs(angleDiff) > 0.3) {
        let smoothFactor = 1.0 - Math.min((result.distance - 80) / 220.0, 0.4);
        correctionFactor = lerp(correctionFactor, 1.0, (1.0 - smoothFactor) * 0.2);
      }
      let correctedDistance = result.distance * correctionFactor;
      
      let projectionPlane = width / (2.0 * Math.tan(this.fov / 2.0));
      let wallHeight = (maze.tileSize * projectionPlane) / Math.max(correctedDistance, 0.1);
      wallHeight = Math.max(1, Math.min(wallHeight, height));
      
      let darknessCoeff = map(renderDistance, 10, 100, 1.0, 0.0);
      darknessCoeff = Math.max(0.0, Math.min(darknessCoeff, 1.0));
      
      let maxDarknessDistance = map(renderDistance, 10, 100, 50.0, 300.0);
      maxDarknessDistance = Math.max(50.0, Math.min(maxDarknessDistance, 300.0));
      
      let brightness;
      
      if (darknessCoeff < 0.01) {
        brightness = 1.0;
      } else {
        let normalizedDist = Math.min(correctedDistance / maxDarknessDistance, 1.0);
        let smoothFactor = normalizedDist * normalizedDist;
        let baseBrightness = 1.0 - (smoothFactor * 0.8);
        baseBrightness = Math.max(0.2, Math.min(baseBrightness, 1.0));
        brightness = lerp(1.0, baseBrightness, darknessCoeff);
        brightness = Math.max(0.1, Math.min(brightness, 1.0));
        
        if (darknessCoeff > 0.1) {
          let farThreshold = maxDarknessDistance * 0.75;
          if (correctedDistance > farThreshold) {
            let farFactor = (correctedDistance - farThreshold) / (maxDarknessDistance - farThreshold);
            farFactor = Math.max(0.0, Math.min(farFactor, 1.0));
            let farDarkness = farFactor * 0.2 * darknessCoeff;
            brightness -= farDarkness;
            brightness = Math.max(brightness, 0.1);
          }
        }
      }
      
      let drawColor;
      if (result.hitExit) {
        drawColor = [255 * brightness, 0, 0];
      } else {
        drawColor = [
          this.wallColor[0] * brightness,
          this.wallColor[1] * brightness,
          this.wallColor[2] * brightness
        ];
      }
      
      noStroke();
      fill(drawColor[0], drawColor[1], drawColor[2]);
      
      let lineWidth = width / this.numRays;
      let x = map(i, 0, this.numRays, 0, width);
      
      let overlap = 1.0;
      let wallTop = height/2 - wallHeight/2;
      let wallBottom = height/2 + wallHeight/2;
      
      if (wallHeight > 1) {
        rect(x - overlap/2, wallTop, lineWidth + overlap, wallBottom - wallTop);
      }
      
      rayAngle += rayStep;
    }
  }
  
  castRay(startX, startY, angle, maze, exit, maxRayDistance) {
    let dx = Math.cos(angle);
    let dy = Math.sin(angle);
    
    if (Math.abs(dx) < 0.0001) dx = 0.0001;
    if (Math.abs(dy) < 0.0001) dy = 0.0001;
    
    let deltaDistX = Math.abs(1.0 / dx);
    let deltaDistY = Math.abs(1.0 / dy);
    
    let mapX = Math.floor(startX / maze.tileSize);
    let mapY = Math.floor(startY / maze.tileSize);
    
    let stepX = dx < 0 ? -1 : 1;
    let stepY = dy < 0 ? -1 : 1;
    
    let sideDistX, sideDistY;
    
    if (dx < 0) {
      sideDistX = (startX / maze.tileSize - mapX) * deltaDistX;
    } else {
      sideDistX = (mapX + 1.0 - startX / maze.tileSize) * deltaDistX;
    }
    
    if (dy < 0) {
      sideDistY = (startY / maze.tileSize - mapY) * deltaDistY;
    } else {
      sideDistY = (mapY + 1.0 - startY / maze.tileSize) * deltaDistY;
    }
    
    let hit = false;
    let hitExit = false;
    let distance = 0;
    let side = 0;
    let exitCheckStep = 1.0;
    
    while (!hit && distance < maxRayDistance) {
      let nextDist;
      
      if (sideDistX < sideDistY) {
        nextDist = sideDistX * maze.tileSize;
      } else {
        nextDist = sideDistY * maze.tileSize;
      }
      
      if (exit != null) {
        let checkDist = Math.max(distance, 0) + exitCheckStep;
        while (checkDist <= nextDist && checkDist < maxRayDistance) {
          let checkX = startX + dx * checkDist;
          let checkY = startY + dy * checkDist;
          let dxExit = checkX - exit.x;
          let dyExit = checkY - exit.y;
          let distToExit = Math.sqrt(dxExit * dxExit + dyExit * dyExit);
          
          if (distToExit < exit.radius) {
            distance = checkDist;
            hit = true;
            hitExit = true;
            break;
          }
          
          checkDist += exitCheckStep;
        }
      }
      
      if (hit) break;
      
      if (sideDistX < sideDistY) {
        sideDistX += deltaDistX;
        mapX += stepX;
        side = 0;
      } else {
        sideDistY += deltaDistY;
        mapY += stepY;
        side = 1;
      }
      
      if (side === 0) {
        distance = (mapX - startX / maze.tileSize + (1 - stepX) / 2) / dx * maze.tileSize;
      } else {
        distance = (mapY - startY / maze.tileSize + (1 - stepY) / 2) / dy * maze.tileSize;
      }
      
      if (mapX < 0 || mapX >= maze.width || mapY < 0 || mapY >= maze.height) {
        hit = true;
        break;
      }
      
      if (exit != null) {
        let checkX = startX + dx * distance;
        let checkY = startY + dy * distance;
        let dxExit = checkX - exit.x;
        let dyExit = checkY - exit.y;
        let distToExit = Math.sqrt(dxExit * dxExit + dyExit * dyExit);
        if (distToExit < exit.radius) {
          hit = true;
          hitExit = true;
          break;
        }
      }
      
      if (maze.isWall(mapX, mapY)) {
        hit = true;
        break;
      }
    }
    
    return { distance: distance, hitExit: hitExit };
  }
}

