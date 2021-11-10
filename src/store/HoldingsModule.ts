import {Action, Module, Mutation, VuexModule} from "vuex-class-modules";
import {Holding, save} from "@/classes/Holding";
import {store} from "@/store/index";
// @ts-ignore
import {v4} from "uuid";

@Module
class HoldingsModule extends VuexModule {
    rootHolding = new Holding(v4(), "_root", 0, 100, []);
    parentHolding: Holding = this.rootHolding;
    showAddEdit: boolean = false;
    history: Holding[] = [this.rootHolding];

    holdingToEdit: Holding | null = null;
    holdingToMakeParent: Holding | null = null;

    holdingToMove: Holding | null = null;
    holdingToMoveParent: Holding | null = null;
    moveMode = false;

    get parentIsRoot() {
        return this.rootHolding === this.parentHolding;
    }

    @Mutation
    setMoveMode(value: boolean) {
        this.moveMode = value;
    }

    @Mutation
    setHoldingToMove(holding: Holding | null) {
        this.holdingToMove = holding;
        this.holdingToMoveParent = this.parentHolding;
    }

    @Mutation
    setHoldingToEdit(value: Holding | null) {
        this.holdingToEdit = value;
    }

    @Mutation
    setHoldingToMakeParent(value: Holding | null) {
        this.holdingToMakeParent = value;
    }

    @Mutation
    setParentHolding(holding: Holding) {
        this.parentHolding = holding;
    }

    @Mutation
    setRootHolding(holding: Holding) {
        this.rootHolding = holding;
        this.parentHolding = holding;
        this.history = [holding];
    }

    @Mutation
    setShowAddEdit(newValue: boolean) {
        this.showAddEdit = newValue;
    }

    @Action
    viewChildren(holding: Holding) {
        this.history.push(holding);
        this.setParentHolding(holding);
        this.setShowAddEdit(false);
    }

    @Action
    goBack() {
        this.history.pop();
        this.setShowAddEdit(false);
        const newParent = this.history[this.history.length - 1];
        this.setParentHolding(newParent);
    }

    @Action
    toggleMoveMode() {
        this.setHoldingToMove(null);
        this.setMoveMode(!this.moveMode);
    }

    @Action
    moveTo(holding: Holding) {
        if (!this.holdingToMove) {
            throw "No holding to move selected.";
        }

        // Remove it from the old parent
        this.holdingToMoveParent!.children = this.holdingToMoveParent!.children.filter(child => child.id !== this.holdingToMove!.id);

        // Add it to the new parent
        holding.children.push(this.holdingToMove);

        // this.toggleMoveMode();

        holdingsModule.setHoldingToMove(null);

        save();
    }
}

export const holdingsModule = new HoldingsModule({ store, name: 'HoldingsModule' });
