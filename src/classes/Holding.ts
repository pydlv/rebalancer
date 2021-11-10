// @ts-ignore
import {v4} from "uuid";
import {holdingsModule} from "@/store/HoldingsModule";
import FileSaver from "file-saver";

const ls = require('local-storage');

export class Holding {
    id: string;
    name: string;
    balance: number;
    targetPercent: number;
    children: Holding[];

    constructor(id: string, name: string, balance: number, targetPercent: number, children: Holding[]) {
        this.id = id;
        this.name = name;
        this.balance = balance;
        this.targetPercent = targetPercent;
        this.children = children;
    }

    get isCategory() {
        return this.children.length > 0;
    }

    getTotalBalance() {
        let sum = 0;
        if (this.isCategory) {
            for (const child of this.children) {
                sum += child.getTotalBalance();
            }
        } else {
            sum += this.balance;
        }

        return sum;
    }

    addChild(child: Holding) {
        // Since this holding is now a category, it shouldn't have a balance associated with it.
        this.balance = 0;
        this.children.push(child);
    }

    toObject(): object {
        return {
            id: this.id,
            name: this.name,
            balance: this.balance,
            targetPercent: this.targetPercent,
            children: this.children.map(child => child.toObject())
        }
    }

    static fromJSONDecoded(decoded: any): Holding {
        return new Holding(
            decoded.id,
            decoded.name,
            decoded.balance,
            decoded.targetPercent,
            decoded.children.map((child: any) => Holding.fromJSONDecoded(child))
        )
    }
}

export function save() {
    const json = JSON.stringify(holdingsModule.rootHolding);
    ls('data', json);
}

function loadFromText(text: string) {
    const decoded = JSON.parse(text);
    const newRootHolding = Holding.fromJSONDecoded(decoded);
    holdingsModule.setRootHolding(newRootHolding);
}

export function load() {
    const loaded = ls('data');

    if (loaded !== null) {
        loadFromText(loaded);
    }
}

export function exportData() {
    const json = JSON.stringify(holdingsModule.rootHolding);

    const blob = new Blob([json], {type: 'application/json'});

    FileSaver.saveAs(blob, 'exported.json');
}

export function importData(file: File) {
    const reader = new FileReader();

    reader.readAsText(file);

    reader.onloadend = function(){
        const { result } = reader;
        loadFromText(result as string);
        save();
    }
}
