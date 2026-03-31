import { _decorator, Component, Node } from 'cc';
import { CharacterControllerBehavior } from './CharacterController';

const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    public static Instance: GameManager = null!;

    @property(CharacterControllerBehavior)
    public playerController: CharacterControllerBehavior = null!;

    @property(Node)
    public playerNode: Node = null!;

    onLoad() {
        if (GameManager.Instance) {
            this.node.destroy();
            return;
        }
        GameManager.Instance = this;
    }

    public setPlayerEnabled(enabled: boolean) {
        if (this.playerController) {
            this.playerController.enabled = enabled;
        }
    }
}