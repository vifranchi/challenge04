let table1, table2, table3;
let timestamps1 = [], zPos1 = [];
let timestamps2 = [], zPos2 = [];
let timestamps3 = [], zPos3 = [];

function preload() {
  table1 = loadTable('dataset/drone_alfa_data.csv', 'csv', 'header');
  table2 = loadTable('dataset/drone_bravo_data.csv', 'csv', 'header');
  table3 = loadTable('dataset/drone_charlie_data.csv', 'csv', 'header');
}

function setup() {
  createCanvas(1200, 1800);
  background("#efefef");

  // Titolo fuori dal canvas (HTML)
  let infoTitle = createDiv('MOVIMENTO DRONI');
  infoTitle.style('font-size', '180px');
  infoTitle.style('font-weight', 'bold');
  infoTitle.style('font-family', 'Helvetica, sans-serif');
  infoTitle.style('color', '#2a2a2aff');
  infoTitle.style('position', 'absolute');
  infoTitle.style('right', '-650px');
  infoTitle.style('top', '100%');
  infoTitle.style('transform', 'rotate(90deg) translateY(-50%)');
  infoTitle.style('transform-origin', 'center');
  infoTitle.style('text-align', 'center');
  infoTitle.style('white-space', 'nowrap');
  infoTitle.style('width', 'auto')

  // Carica dati drone ALPHA
  for (let r = 0; r < table1.getRowCount(); r++) {
    timestamps1.push(table1.getString(r, 'timestamp'));
    zPos1.push(table1.getNum(r, 'z_pos'));
  }

  // Carica dati drone BRAVO
  for (let r = 0; r < table2.getRowCount(); r++) {
    timestamps2.push(table2.getString(r, 'timestamp'));
    zPos2.push(table2.getNum(r, 'z_pos'));
  }

  // Carica dati drone CHARLIE
  for (let r = 0; r < table3.getRowCount(); r++) {
    timestamps3.push(table3.getString(r, 'timestamp')); // Era timestamps2!
    zPos3.push(table3.getNum(r, 'z_pos'));
  }

  // Disegna i tre grafici
  drawScatterPlot(timestamps1, zPos1, 'DRONE ALPHA', 70);
  drawScatterPlot(timestamps2, zPos2, 'DRONE BRAVO', 600);
  drawScatterPlot(timestamps3, zPos3, 'DRONE CHARLIE', 1200);

  noLoop();

}

function drawScatterPlot(timestamps, zPos, title, offsetY) {
  let marginLeft = 80;
  let marginRight = 40;
  let chartWidth = width - marginLeft - marginRight;
  let chartHeight = 300;
  let marginTop = offsetY;

  // Filtra solo valori tra -0.7 e 1
  let filteredData = [];
  let filteredTimestamps = [];
  for (let i = 0; i < zPos.length; i++) {
    if (zPos[i] >= -0.7 && zPos[i] <= 1) {
      filteredData.push(zPos[i]);
      filteredTimestamps.push(timestamps[i]);
    }
  }

  if (filteredData.length === 0) return;

  let minZ = min(filteredData);
  let maxZ = max(filteredData);

  // Assi
  stroke(0);
  strokeWeight(2);
  line(marginLeft, marginTop, marginLeft, marginTop + chartHeight);
  line(marginLeft, marginTop + chartHeight, marginLeft + chartWidth, marginTop + chartHeight);

  // Griglia
  stroke(230);
  strokeWeight(1);
  let ticks = 8;
  for (let j = 0; j <= ticks; j++) {
    let yVal = minZ + (j * (maxZ - minZ)) / ticks;
    let y = map(yVal, minZ, maxZ, marginTop + chartHeight, marginTop);
    line(marginLeft, y, marginLeft + chartWidth, y);
  }

  // Linea dello zero
  if (minZ < 0 && maxZ > 0) {
    stroke("#872109");
    strokeWeight(2);
    let zeroY = map(0, minZ, maxZ, marginTop + chartHeight, marginTop);
    line(marginLeft, zeroY, marginLeft + chartWidth, zeroY);
    fill("#872109");
    noStroke();
    textStyle(BOLD);
    textSize(10);
    textAlign(LEFT, CENTER);
    text('z = 0', marginLeft + chartWidth + 5, zeroY);
  }

  // Punti
  let pointSpacing = chartWidth / (filteredData.length - 1);
  for (let i = 0; i < filteredData.length; i++) {
    let val = filteredData[i];
    let x = marginLeft + i * pointSpacing;
    let y = map(val, minZ, maxZ, marginTop + chartHeight, marginTop);
    
    // Usa fill e stroke per rendere i punti visibili
    if (val >= 0) {
      fill("#929292ff");
      stroke("#929292ff");
    } else {
      fill("#383838ff");
      stroke("#383838ff");
    }
    strokeWeight(0);
    circle(x, y, 2);
  }

  // Etichette asse X (timestamp) 
  fill(0); 
  noStroke(); 
  textSize(11); 
  textStyle(NORMAL); 
  textAlign(CENTER, TOP); 
  let step = max(1, ceil(filteredData.length / 12)); 
  for (let i = 0; i < filteredTimestamps.length; i += step) { 
    let timestamp = filteredTimestamps[i]; 
    let timeOnly = timestamp.length > 11 ? timestamp.substring(11, 19) : timestamp; 
    let x = marginLeft + i * pointSpacing; 
    push(); 
    translate(x, marginTop + chartHeight + 20); 
    rotate(-PI / 6); 
    text(timeOnly, 0, 0); 
    pop(); 
  } 
  
  // Label asse X 
  textAlign(CENTER, TOP); 
  textSize(13); 
  fill(60); 
  textStyle(BOLD); 
  text('time', marginLeft + chartWidth / 2, marginTop + chartHeight + 50); 

  // Etichette asse Y 
  textAlign(RIGHT, CENTER); 
  textSize(11); 
  textStyle(NORMAL); 
  fill(0); 
  for (let j = 0; j <= ticks; j++) { 
    let yVal = minZ + (j * (maxZ - minZ)) / ticks; 
    let y = map(yVal, minZ, maxZ, marginTop + chartHeight, marginTop); 
    text(nf(yVal, 0, 2) + ' m', marginLeft - 10, y); 
  } 
  
  // Label asse Y 
  push(); 
  translate(20, marginTop + chartHeight / 2); 
  rotate(-PI / 2); 
  textAlign(CENTER, CENTER); 
  textSize(13); 
  fill(60); 
  textStyle(BOLD);
  text('z position', 0, 0); 
  pop();

  // Titolo grafico
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(18);
  textStyle(BOLD);
  fill(20);
  text(title, marginLeft, marginTop - 25);
}

