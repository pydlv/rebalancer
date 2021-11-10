<template>
    <div class="container shadow bg-light min-vh-100 p-lg-5">
        <div class="d-flex flex-column justify-content-center ms-5 me-5">
            <div>
                <div class="mb-4 d-flex justify-content-between">
                    <b-button @click="() => {/*holdingsModule.moveMode && !holdingsModule.holdingToMove && holdingsModule.toggleMoveMode();*/ holdingsModule.goBack()}" v-if="!holdingsModule.parentIsRoot">Back</b-button>
                    <div v-else>

                    </div>
                    <h2>{{ titleText }}</h2>
                    <b-button @click="addHolding" variant="primary">Add Holding</b-button>
                </div>
                <p v-if="showWarning" class="text-danger fs-4">Warning: Your holding target percentages do not add up to 100%.</p>
                <PortfolioTable />
                <div>
                    <b-button @click="holdingsModule.toggleMoveMode()" class="me-2">{{ !holdingsModule.moveMode ? 'Move Mode' : 'Done' }}</b-button>
                    <b-button @click="holdingsModule.moveTo(holdingsModule.parentHolding)" v-if="holdingsModule.moveMode && holdingsModule.holdingToMove">Move Here</b-button>
                </div>

                <div class="d-flex justify-content-center">
                    <EditHolding :holding-to-edit="null" />
                </div>
            </div>
            <b-modal id="import-modal" title="Import Data" ok-only>
                <b-form-file v-model="importFile" />
                <b-button variant="primary" @click="doImport" class="mt-4">Import!</b-button>
            </b-modal>
            <div class="d-flex justify-content-end mt-4 mb-4">
                <a href="javascript:void(0)" v-b-modal.import-modal>Import</a>&nbsp;
                <a href="javascript:void(0)" @click="doExport">Export</a>
            </div>

            <Targets />
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import PortfolioTable from "@/components/PortfolioTable.vue";
    import EditHolding from "@/components/EditHolding.vue";
    import {holdingsModule} from "@/store/HoldingsModule";
    import {exportData, importData} from "@/classes/Holding";
    import Targets from "@/components/Targets.vue";

    @Component(
        {components: {PortfolioTable, EditHolding, Targets}}
    )
    export default class App extends Vue {
        importFile: File | null = null;

        get titleText() {
            if (holdingsModule.parentIsRoot) {
                return "Portfolio Overview";
            } else {
                return holdingsModule.parentHolding.name;
            }
        }

        addHolding() {
            holdingsModule.setHoldingToEdit(null);
            holdingsModule.setShowAddEdit(!holdingsModule.showAddEdit);
        }

        get showWarning() {
            return Math.abs(100 - holdingsModule.parentHolding.children.reduce((a, b) => a + b.targetPercent, 0)) > 0.15;
        }

        doExport() {
            exportData();
        }

        doImport() {
            if (this.importFile) {
                importData(this.importFile);
            }
        }

        holdingsModule = holdingsModule
    }
</script>

<style>
    td {
        font-size: 1.3rem;
    }

    * {
        font-family: Neuton, serif;
    }
</style>
