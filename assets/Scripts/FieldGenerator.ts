import { _decorator, Component, Node, Prefab, instantiate, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FieldGenerator')
export class FieldGenerator extends Component {
    
    @property({ type: Prefab })
    public wheatPrefab: Prefab = null!;

    @property
    public spacing: number = 0.6;

    @property
    public fieldWidth: number = 20;

    @property
    public fieldDepth: number = 20;
    
    private readonly GRID_CELL_SIZE: number = 5; 
    private wheatGrid: Map<number, Map<number, Node[]>> = new Map(); 

    start() {
        if (!this.wheatPrefab) return;
        this.generateField();
    }

    public generateField() {
        this.wheatGrid.clear();
        const halfWidth = this.fieldWidth / 2;
        const halfDepth = this.fieldDepth / 2;
        
        for (let x = -halfWidth; x < halfWidth; x += this.spacing) {
            for (let z = -halfDepth; z < halfDepth; z += this.spacing) {
                const wheatStalk = instantiate(this.wheatPrefab);
                wheatStalk.setParent(this.node);
                wheatStalk.setWorldPosition(new Vec3(x, 0, z));
                this.addToGrid(wheatStalk);
            }
        }
    }

    private addToGrid(node: Node) {
        const pos = node.worldPosition;
        const chunkX = Math.floor(pos.x / this.GRID_CELL_SIZE);
        const chunkZ = Math.floor(pos.z / this.GRID_CELL_SIZE);

        if (!this.wheatGrid.has(chunkX)) {
            this.wheatGrid.set(chunkX, new Map());
        }
        const zMap = this.wheatGrid.get(chunkX)!;
        
        if (!zMap.has(chunkZ)) {
            zMap.set(chunkZ, []);
        }
        zMap.get(chunkZ)!.push(node);
    }

    public getNodesInVicinity(worldPos: Vec3): Node[] {
        const nodes: Node[] = [];
        const playerChunkX = Math.floor(worldPos.x / this.GRID_CELL_SIZE);
        const playerChunkZ = Math.floor(worldPos.z / this.GRID_CELL_SIZE);

        for (let dx = -1; dx <= 1; dx++) {
            for (let dz = -1; dz <= 1; dz++) {
                const zMap = this.wheatGrid.get(playerChunkX + dx);
                if (zMap) {
                    const chunkNodes = zMap.get(playerChunkZ + dz);
                    if (chunkNodes) {
                        nodes.push(...chunkNodes);
                    }
                }
            }
        }
        return nodes;
    }

    public removeNodeFromGrid(node: Node) {
        const pos = node.worldPosition;
        const chunkX = Math.floor(pos.x / this.GRID_CELL_SIZE);
        const chunkZ = Math.floor(pos.z / this.GRID_CELL_SIZE);
        
        const zMap = this.wheatGrid.get(chunkX);
        if (zMap) {
            const nodeArray = zMap.get(chunkZ);
            if (nodeArray) {
                const index = nodeArray.indexOf(node);
                if (index !== -1) {
                    nodeArray.splice(index, 1);
                }
            }
        }
    }
}