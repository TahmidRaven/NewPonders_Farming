import { _decorator, Component, Node, Vec3 } from 'cc';
import { FieldGenerator } from './FieldGenerator'; 
import { ResourceManager } from './ResourceManager'; 

const { ccclass, property } = _decorator;

@ccclass('Harvester')
export class Harvester extends Component {
    
    @property(FieldGenerator) 
    public fieldGenerator: FieldGenerator = null!; 

    @property(ResourceManager) 
    public resourceManager: ResourceManager = null!; 

    @property
    public baseHarvestRadius: number = 1.5; 

    @property
    public harvestCheckInterval: number = 0.1; 

    private timeSinceLastCheck: number = 0;

    update(deltaTime: number) {
        
        if (!this.fieldGenerator || !this.resourceManager) return;

        this.timeSinceLastCheck += deltaTime;
        if (this.timeSinceLastCheck >= this.harvestCheckInterval) {
            this.timeSinceLastCheck = 0;
            this.checkForHarvest();
        }
    }

    checkForHarvest() {
        if (this.resourceManager.isFull()) return;

        const harvestOrigin = this.node.worldPosition;
    
        const potentialNodes = this.fieldGenerator.getNodesInVicinity(harvestOrigin); 
        
        for (let i = potentialNodes.length - 1; i >= 0; i--) {
            const wheatNode = potentialNodes[i];
            if (!wheatNode || !wheatNode.isValid) continue; 

            const dist = Vec3.distance(harvestOrigin, wheatNode.worldPosition);

            if (dist <= this.baseHarvestRadius) {
                this.harvestNode(wheatNode);
            }
        }
    }

    private harvestNode(node: Node) {
        this.resourceManager.addWheat(1);
        this.fieldGenerator.removeNodeFromGrid(node);
        node.destroy();
    }
}