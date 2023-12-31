
const TILE_SIZE = 30;
const FPS = 30;
const SLEEP = 1000 / FPS;

enum RawTile {
  AIR,
  FLUX,
  UNBREAKABLE,
  PLAYER,
  STONE, FALLING_STONE,
  BOX, FALLING_BOX,
  KEY1, LOCK1,
  KEY2, LOCK2
}

enum RawInput {
  UP, DOWN, LEFT, RIGHT
}
function assertExhausted(x: never):never { //항상 오류를 출력하거나 리턴 값을 절대로 내보내지 않는 리턴값
  throw new Error("Unedpected object : " + x);
}
function transformTile(tile: RawTile){
  switch (tile){
    case RawTile.BOX: return new Box();
    case RawTile.FALLING_BOX: return new FallingBox();
    case RawTile.AIR: return new Air();
    case RawTile.PLAYER: return new Player();
    case RawTile.UNBREAKABLE: return new Unbreakable();
    case RawTile.STONE: return new Stone();
    case RawTile.FALLING_STONE: return new FallingStone();
    case RawTile.FLUX: return new FallingBox();
    case RawTile.KEY1: return new Key1();
    case RawTile.LOCK1: return new Lock1();
    case RawTile.KEY2: return new Key2();
    case RawTile.LOCK2: return new Lock2();
    default: assertExhausted(tile);
  }
}
function transformMap(){
  map = new Array(rawMap.length);
  for (let y=0; y<rawMap.length; y++){
    map[y] = new Array(rawMap[y].length);
    for (let x=0; x<rawMap[y].length; x++){
      map[y][x] = transformTile(rawMap[y][x]);
    }
  }
}
window.onload = () => {
  transformMap();
  gameLoop();
}

interface Input{
  handle():void;
}
interface Tile{
  isAir(): boolean;
  isFlux(): boolean ;
  isStone(): boolean;
  isFallingStone():boolean;
  isFallingBox():boolean;
  isBox(): boolean;
  isKey1(): boolean;
  isKey2(): boolean;
  isLock1(): boolean;
  isLock2(): boolean;
  draw(g:CanvasRenderingContext2D,x:number,y:number): void;
  moveHorizontal(dx:number):void;
  moveVertical(dy:number):void;
}
class Air implements Tile{
  isAir(): boolean {return true;}
  isBox(): boolean {return false;}
  isFallingBox(): boolean {return false;}
  isFallingStone(): boolean {return false;}
  isFlux(): boolean {return false;}
  isKey2(): boolean {return false;}
  isKey1(): boolean {return false;}
  isLock1(): boolean {return false;}
  isLock2(): boolean {return false;}
  isStone(): boolean{return false;}
  draw(g: CanvasRenderingContext2D, x: number, y: number) {}
  moveHorizontal(dx:number){
    moveToTile(playerx+dx, playery);
  }
  moveVertical(dy: number) {
    moveToTile(playerx, playery + dy);
  }
}
class Player implements Tile{
  isAir(): boolean {return true;}
  isBox(): boolean {return false;}
  isFallingBox(): boolean {return false;}
  isFallingStone(): boolean {return false;}
  isFlux(): boolean {return false;}
  isKey2(): boolean {return false;}
  isKey1(): boolean {return false;}
  isLock1(): boolean {return false;}
  isLock2(): boolean {return false;}
  isStone(): boolean{return false;}
  draw(g: CanvasRenderingContext2D, x: number, y: number) {}
  moveHorizontal(dx: number) {}
  moveVertical(dy:number){}
}
class Flux implements Tile{
  isAir(): boolean {return false;}
  isBox(): boolean {return false;}
  isFallingBox(): boolean {return false;}
  isFallingStone(): boolean {return false;}
  isFlux(): boolean {return true;}
  isKey2(): boolean {return false;}
  isKey1(): boolean {return false;}
  isLock1(): boolean {return false;}
  isLock2(): boolean {return false;}
  isStone(): boolean{return false;}
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#ccffcc";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx:number){
    moveToTile(playerx+dx, playery);
  }
  moveVertical(dy: number) {
    moveToTile(playerx, playery + dy);
  }
}
class Unbreakable implements Tile{
  isAir(): boolean {return false;}
  isBox(): boolean {return false;}
  isFallingBox(): boolean {return false;}
  isFallingStone(): boolean {return false;}
  isFlux(): boolean {return false;}
  isKey2(): boolean {return false;}
  isKey1(): boolean {return false;}
  isLock1(): boolean {return false;}
  isLock2(): boolean {return false;}
  isStone(): boolean{return false;}
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#999999";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number) {}
  moveVertical(dy:number){}
}
class Stone implements Tile{
  isAir(): boolean {return false;}
  isBox(): boolean {return false;}
  isFallingBox(): boolean {return false;}
  isFallingStone(): boolean {return false;}
  isFlux(): boolean {return false;}
  isKey2(): boolean {return false;}
  isKey1(): boolean {return false;}
  isLock1(): boolean {return false;}
  isLock2(): boolean {return false;}
  isStone(): boolean{return true;}
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#0000cc";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number) {
    if (map[playery][playerx + dx + dx].isAir() && !map[playery + 1][playerx + dx].isAir()) {
      map[playery][playerx + dx + dx] = this;
    }
  }
  moveVertical(dy:number){}
}
class FallingStone implements Tile{
  isAir(): boolean {return false;}
  isBox(): boolean {return false;}
  isFallingBox(): boolean {return false;}
  isFallingStone(): boolean {return true;}
  isFlux(): boolean {return false;}
  isKey2(): boolean {return false;}
  isKey1(): boolean {return false;}
  isLock1(): boolean {return false;}
  isLock2(): boolean {return false;}
  isStone(): boolean{return false;}
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#0000cc";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number) {}
  moveVertical(dy:number){}
}
class Box implements Tile{
  isAir(): boolean {return false;}
  isBox(): boolean {return true;}
  isFallingBox(): boolean {return false;}
  isFallingStone(): boolean {return false;}
  isFlux(): boolean {return false;}
  isKey2(): boolean {return false;}
  isKey1(): boolean {return false;}
  isLock1(): boolean {return false;}
  isLock2(): boolean {return false;}
  isStone(): boolean{return false;}
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#8b4513";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number) {
    if (map[playery][playerx + dx + dx].isAir() && !map[playery + 1][playerx + dx].isAir()) {
      map[playery][playerx + dx + dx] = this;
    }
  }
  moveVertical(dy:number){}
}
class FallingBox implements Tile{
  isAir(): boolean {return false;}
  isBox(): boolean {return false;}
  isFallingBox(): boolean {return true;}
  isFallingStone(): boolean {return false;}
  isFlux(): boolean {return false;}
  isKey2(): boolean {return false;}
  isKey1(): boolean {return false;}
  isLock1(): boolean {return false;}
  isLock2(): boolean {return false;}
  isStone(): boolean{return false;}
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#8b4513";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number) {}
  moveVertical(dy:number){}
}
class Key1 implements Tile{
  isAir(): boolean {return false;}
  isBox(): boolean {return false;}
  isFallingBox(): boolean {return false;}
  isFallingStone(): boolean {return false;}
  isFlux(): boolean {return false;}
  isKey2(): boolean {return false;}
  isKey1(): boolean {return true;}
  isLock1(): boolean {return false;}
  isLock2(): boolean {return false;}
  isStone(): boolean{return false;}
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#ffcc00";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number) {
    removeLock1();
    moveToTile(playerx + dx, playery);
  }
  moveVertical(dy: number) {
    removeLock1();
    moveToTile(playerx, playery + dy);
  }
}
class Key2 implements Tile{
  isAir(): boolean {return false;}
  isBox(): boolean {return false;}
  isFallingBox(): boolean {return false;}
  isFallingStone(): boolean {return false;}
  isFlux(): boolean {return false;}
  isKey2(): boolean {return true;}
  isKey1(): boolean {return false;}
  isLock1(): boolean {return false;}
  isLock2(): boolean {return false;}
  isStone(): boolean{return false;}
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#00ccff";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number) {
    removeLock2();
    moveToTile(playerx + dx, playery);
  }
  moveVertical(dy: number) {
    removeLock2();
    moveToTile(playerx, playery + dy);
  }
}
class Lock1 implements Tile{
  isAir(): boolean {return false;}
  isBox(): boolean {return false;}
  isFallingBox(): boolean {return false;}
  isFallingStone(): boolean {return false;}
  isFlux(): boolean {return false;}
  isKey2(): boolean {return false;}
  isKey1(): boolean {return false;}
  isLock1(): boolean {return true;}
  isLock2(): boolean {return false;}
  isStone(): boolean{return false;}
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#ffcc00";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number) {}
  moveVertical(dy:number){}
}
class Lock2 implements Tile{
  isAir(): boolean {return false;}
  isBox(): boolean {return false;}
  isFallingBox(): boolean {return false;}
  isFallingStone(): boolean {return false;}
  isFlux(): boolean {return false;}
  isKey2(): boolean {return false;}
  isKey1(): boolean {return false;}
  isLock1(): boolean {return false;}
  isLock2(): boolean {return true;}
  isStone(): boolean{return false;}
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#00ccff";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number) {}
  moveVertical(dy:number){}
}

class Right implements Input{
  handle(){moveHorizontal(1);}
}
class Left implements Input{
  handle(){moveHorizontal(-1);}
}
class Up implements Input{
  handle(){moveVertical(-1);}
}
class Down implements Input{
  handle(){moveVertical(1);}
}

let playerx = 1;
let playery = 1;
let rawMap: RawTile[][] = [
  [2, 2, 2, 2, 2, 2, 2, 2],
  [2, 3, 0, 1, 1, 2, 0, 2],
  [2, 4, 2, 6, 1, 2, 0, 2],
  [2, 8, 4, 1, 1, 2, 0, 2],
  [2, 4, 1, 1, 1, 9, 0, 2],
  [2, 2, 2, 2, 2, 2, 2, 2],
];
let map: Tile[][];

let inputs: Input[] = [];

function removeLock1() {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x].isLock1()) {
        map[y][x] = new Air();
      }
    }
  }
}
function removeLock2() {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x].isLock2()) {
        map[y][x] = new Air();
      }
    }
  }
}

function moveToTile(newx: number, newy: number) {
  map[playery][playerx] = new Air();
  map[newy][newx] = new Player();
  playerx = newx;
  playery = newy;
}

function moveHorizontal(dx: number) {
  map[playery][playerx+dx].moveHorizontal(dx);
}
//TODO: 얘를 없애기
function moveVertical(dy: number) {
  map[playery+dy][playerx].moveVertical(dy);
}

function update() {
  handleInputs();
  updateMap();
}
function handleInputs(){
  while (inputs.length > 0) {
    let input = inputs.pop();
    input.handle();
  }
}
function updateMap(){
  for (let y = map.length - 1; y >= 0; y--) {
    for (let x = 0; x < map[y].length; x++) {
      updateTile(x,y);
    }
  }
}
function updateTile(x:number, y:number){
  if ((map[y][x].isStone() || map[y][x].isFallingStone())
      && map[y + 1][x].isAir()) {
    map[y + 1][x].isFallingStone();
    map[y][x].isAir();
  } else if ((map[y][x].isBox() || map[y][x].isFallingBox())
      && map[y + 1][x].isAir()) {
    map[y + 1][x].isFallingBox();
    map[y][x].isAir();
  } else if (map[y][x].isFallingStone()) {
    map[y][x].isStone();
  } else if (map[y][x].isFallingBox()) {
    map[y][x].isBox();
  }
}
function createGraphics() {
  let canvas = document.getElementById("GameCanvas") as HTMLCanvasElement;
  let g = canvas.getContext("2d");

  g.clearRect(0, 0, canvas.width, canvas.height); //메서드 호출
  return g;
}
function draw() {
  let g = createGraphics();

  //메서드 전
  drawMap(g);
  drawPlayer(g);

  function drawMap(g:CanvasRenderingContext2D){
    // Draw map
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        drawTile(g,x,y);
      }
    }
  }
  function drawTile(g:CanvasRenderingContext2D,x:number,y:number){
    map[y][x].draw(g,x,y);
    // map[y][x].color(g);
    // if (!map[y][x].isAir() && !map[y][x].isPlayer())
    //   g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  function drawPlayer(g:CanvasRenderingContext2D){
    // Draw player
    g.fillStyle = "#ff0000";
    g.fillRect(playerx * TILE_SIZE, playery * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
}

function gameLoop() {
  let before = Date.now();
  update();
  draw();
  let after = Date.now();
  let frameTime = after - before;
  let sleep = SLEEP - frameTime;
  setTimeout(() => gameLoop(), sleep);
}

window.onload = () => {
  gameLoop();
}

const LEFT_KEY = "ArrowLeft";
const UP_KEY = "ArrowUp";
const RIGHT_KEY = "ArrowRight";
const DOWN_KEY = "ArrowDown";
window.addEventListener("keydown", e => {
  if (e.key === LEFT_KEY || e.key === "a") inputs.push(new Left());
  else if (e.key === UP_KEY || e.key === "w") inputs.push(new Up());
  else if (e.key === RIGHT_KEY || e.key === "d") inputs.push(new Right());
  else if (e.key === DOWN_KEY || e.key === "s") inputs.push(new Down());
});

