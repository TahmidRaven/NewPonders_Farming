import { _decorator, Component, Label, CCInteger } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ResourceManager')
export class ResourceManager extends Component {

    @property(Label) public WheatLabel: Label = null!; 
    @property({ type: CCInteger }) public MaxRawWheat: number = 100; 

    public wheatCount: number = 0; 

    public addWheat(amount: number) {
        this.wheatCount = Math.min(this.wheatCount + amount, this.MaxRawWheat);
        this.updateWheatLabel();
    }

    public isFull(): boolean {
        return this.wheatCount >= this.MaxRawWheat;
    }

    public updateWheatLabel() {
        if (this.WheatLabel) {
            this.WheatLabel.string = `WHEAT: ${this.wheatCount}/${this.MaxRawWheat}`;
        }
    }
}