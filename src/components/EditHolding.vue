<template>
    <div class="col-6 bg-white p-4 border-1 border border-dark" v-if="holdingsModule.showAddEdit">
        <h3>{{ topText }}</h3>
        <b-form>
            <div class="mb-2">
                <label for="name">Name</label>
                <b-form-input id="name" v-model="name"></b-form-input>
            </div>
            <div class="mb-2" v-if="!isCategory">
                <label for="balance">Balance</label>
                <b-form-input id="balance" type="number" v-model="balance"></b-form-input>
            </div>
            <div class="mb-4">
                <label for="target-percent">Target Percentage</label>
                <b-form-input id="target-percent" type="number" v-model="targetPercentage"></b-form-input>
            </div>

            <div>
                <b-button variant="primary" @click="save" style="margin-right: 10px">Save</b-button>
                <b-button @click="close">Close</b-button>
            </div>
        </b-form>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from "vue-property-decorator";
    import {Holding, save as saveHoldings} from "@/classes/Holding";
    import {holdingsModule} from "@/store/HoldingsModule";
    // @ts-ignore
    import {v4} from "uuid";

    @Component
    export default class EditHolding extends Vue {
        name: string = "";
        balance: string = "";
        targetPercentage: string = "";
        isCategory = false;

        @Watch('holdingsModule.showAddEdit')
        onShowChanged() {
            if (holdingsModule.holdingToEdit) {
                this.name = holdingsModule.holdingToEdit.name;
                this.balance = holdingsModule.holdingToEdit.balance.toString();
                this.targetPercentage = holdingsModule.holdingToEdit.targetPercent.toString();

                this.isCategory = holdingsModule.holdingToEdit.children.length > 0;
            } else {
                this.name = "";
                this.balance = "";
                this.targetPercentage = "";

                this.isCategory = false;
            }
        }

        get isEditing() {
            return !!holdingsModule.holdingToEdit;
        }

        get topText () {
            if (holdingsModule.holdingToEdit) return "Edit Holding";
            if (holdingsModule.holdingToMakeParent) return "Add Child";
            else return "Add Holding";
        }

        save() {
            if (holdingsModule.holdingToEdit) {
                holdingsModule.holdingToEdit.name = this.name;
                holdingsModule.holdingToEdit.balance = parseFloat(this.balance);
                holdingsModule.holdingToEdit.targetPercent = parseFloat(this.targetPercentage);
            } else {
                const newHolding = new Holding(
                    v4(),
                    this.name,
                    parseFloat(this.balance),
                    parseFloat(this.targetPercentage),
                    []
                );

                if (holdingsModule.holdingToMakeParent) {
                    holdingsModule.holdingToMakeParent.addChild(newHolding);

                    // Navigate to the new holding
                    holdingsModule.viewChildren(holdingsModule.holdingToMakeParent);
                } else {
                    holdingsModule.parentHolding.addChild(newHolding);
                }
            }

            this.close();

            saveHoldings();
        }

        close() {
            holdingsModule.setHoldingToMakeParent(null);
            holdingsModule.setHoldingToEdit(null);
            holdingsModule.setShowAddEdit(false);
        }

        holdingsModule = holdingsModule;
    }
</script>

<style scoped>

</style>
