<template>
    <b-table
        fixed
        striped
        hover
        class="mb-4"
        :fields="fields"
        :items="holdings"
        label-sort-asc=""
        label-sort-desc=""
        label-sort-clear=""
        sort-by="targetPercent"
        sort-desc
        foot-clone
        no-footer-sorting
    >
        <template #cell(name)="row">
            <span class="fw-bold">{{ row.item.name }}</span>
        </template>
        <template #cell(actions)="row">
            <div v-if="!holdingsModule.moveMode">
                <b-button @click="editHolding(row.item)">
                    Edit
                </b-button>
                <b-button @click="makeParent(row.item)" v-if="row.item.numChildren">
                    Children
                </b-button>
                <b-button v-else @click="addChild(row.item)">
                    Add Child
                </b-button>
                <b-button @click="deleteHolding(row.item)" variant="danger">
                    Delete
                </b-button>
            </div>
            <div v-else>
                <b-button v-if="holdingsModule.holdingToMove === null || holdingsModule.holdingToMove.id === row.item.id" @click="setHoldingToMove(row.item)">
                    {{ holdingsModule.holdingToMove !== null ? 'Deselect' : 'Select' }}
                </b-button>
                <b-button v-else @click="moveTo(row.item)">
                    Move Here
                </b-button>
                <b-button @click="makeParent(row.item)" v-if="row.item.numChildren">
                    Children
                </b-button>
            </div>
        </template>
        <template #foot(name)="data">
            Totals
        </template>
        <template #foot(balance)="data">
            {{ new Intl.NumberFormat().format(holdingsModule.parentHolding.getTotalBalance()) }}
        </template>
        <template #foot(targetPercent)="data">
            {{ new Intl.NumberFormat().format(holdingsModule.parentHolding.children.reduce((a, b) => a + b.targetPercent, 0)) }}
        </template>
    </b-table>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {holdingsModule} from "@/store/HoldingsModule";
    import {Holding, save} from "@/classes/Holding";

    interface HoldingItem {
        id: string,
        name: string;
        balance: number;
        targetPercent: number;
        numChildren: number;
    }

    @Component
    export default class PortfolioTable extends Vue {
        fields = [
            { key: 'name', sortable: true },
            { key: 'balance', sortable: true },
            { key: 'targetPercent', sortable: true },
            { key: 'actions', label: '' }
        ]

        get holdings(): HoldingItem[] {
            return holdingsModule.parentHolding.children.map(holding => {
                return {
                    id: holding.id,
                    name: holding.name,
                    balance: holding.getTotalBalance(),
                    targetPercent: holding.targetPercent,
                    numChildren: holding.children.length
                }
            })
        }

        setHoldingToMove(holdingItem: HoldingItem) {
            const thisHolding = this.reverseHoldingItem(holdingItem);
            if (holdingsModule.holdingToMove === thisHolding) {
                holdingsModule.setHoldingToMove(null);
            } else {
                holdingsModule.setHoldingToMove(thisHolding);
            }
        }

        moveTo(holdingItem: HoldingItem) {
            const holdingToMoveTo = this.reverseHoldingItem(holdingItem);

            holdingsModule.moveTo(holdingToMoveTo);
        }

        reverseHoldingItem(holdingItem: HoldingItem): Holding {
            return holdingsModule.parentHolding.children.filter(holding => holding.id === holdingItem.id)[0];
        }

        editHolding(holdingItem: HoldingItem) {
            const thisHolding = this.reverseHoldingItem(holdingItem);
            if (holdingsModule.holdingToEdit === thisHolding) {
                holdingsModule.setHoldingToEdit(null);
                holdingsModule.setShowAddEdit(false);
            } else {
                holdingsModule.setHoldingToEdit(thisHolding);
                holdingsModule.setShowAddEdit(true);
            }
        }

        makeParent(holdingItem: HoldingItem) {
            holdingsModule.viewChildren(this.reverseHoldingItem(holdingItem));
        }

        addChild(holdingItem: HoldingItem) {
            const holdingToMakeParent = this.reverseHoldingItem(holdingItem);

            holdingsModule.setHoldingToMakeParent(holdingToMakeParent);
            holdingsModule.setHoldingToEdit(null);
            holdingsModule.setShowAddEdit(true);
        }

        deleteHolding(holding: HoldingItem) {
            holdingsModule.parentHolding.children = holdingsModule.parentHolding.children.filter(
                otherHolding => otherHolding.id !== holding.id
            );

            save();
        }

        holdingsModule = holdingsModule;
    }
</script>

<style scoped>
    button:not(:last-child) {
        margin-right: 20px !important;
    }
    /*button:last-child {*/
    /*    margin-right: ;*/
    /*}*/
</style>
