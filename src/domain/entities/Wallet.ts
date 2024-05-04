import { objectId } from "../../models/users.model";


export class Wallet {
    [x: string]: any;
    constructor(
        public owner: string |objectId, 
        public balance: number,
        public transactions: Transaction[]
    ) {}
}

export interface Transaction {
    type: 'credit' | 'debit';
    amount: number;
    description: string;
    date: Date;
}
