<template>
    <div class="flex-column">
        <div class="d-flex justify-content-between">
            <div>

            </div>
            <h2>Targets</h2>
            <div class="col-2">

            </div>
        </div>

        <b-checkbox v-model="showCategories">Show Categories</b-checkbox>

        <b-table
            fixed
            striped
            :items="rows"
            :fields="fields"
            label-sort-asc=""
            label-sort-desc=""
            label-sort-clear=""
            sort-by="difference"
            sort-desc
        >
            <template #cell(name)="row">
                <span class="fw-bold">{{ row.item.name }}</span>
            </template>
            <template #cell(actualBalance)="row">
                {{ formatNumber(row.item.actualBalance) }}
            </template>
            <template #cell(targetBalance)="row">
                {{ formatNumber(row.item.targetBalance) }}
            </template>
            <template #cell(difference)="row">
                <span :class="getClass(row.item.difference)">{{ formatNumber(row.item.difference) }}</span>
            </template>
        </b-table>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {holdingsModule} from "@/store/HoldingsModule";
    import {Holding} from "@/classes/Holding";

    interface Row {
        name: string;
        actualBalance: number;
        targetBalance: number;
        difference: number;
        isCategory: boolean;
    }

    @Component
    export default class Targets extends Vue {
        fields = [
            { key: 'name', sortable: true },
            { key: 'actualBalance', sortable: true },
            { key: 'targetBalance', sortable: true },
            { key: 'difference', sortable: true }
        ]

        showCategories = false;

        formatNumber(num: number) {
            const isNegative = num < 0;
            if (isNegative) {
                const formatted = new Intl.NumberFormat().format(-num);
                return '(' + formatted + ')';
            } else {
                return new Intl.NumberFormat().format(num);
            }
        }

        getClass(num: number) {
            if (num < 0) {
                return 'text-danger';
            } else {
                return '';
            }
        }

        get rows(): Row[] {
            const result: Row[] = [];

            const processParent = (parent: Holding, parentTargetBalance: number, shouldShowDescendents: boolean) => {
                for (const child of parent.children) {
                    const childBalance = child.getTotalBalance();
                    const targetBalance = parentTargetBalance * (child.targetPercent / 100);

                    const isCategory = child.children.length > 0;

                    if (shouldShowDescendents && (this.showCategories || !isCategory)) {
                        result.push({
                            name: child.name,
                            actualBalance: childBalance,
                            targetBalance: targetBalance,
                            difference: childBalance - targetBalance,
                            isCategory
                        });
                    }

                    if (isCategory) processParent(child, targetBalance, shouldShowDescendents || child === holdingsModule.parentHolding);
                }
            }

            processParent(holdingsModule.rootHolding, holdingsModule.rootHolding.getTotalBalance(), holdingsModule.parentHolding === holdingsModule.rootHolding);

            return result;
        }
    }
</script>

<style scoped>

</style>
