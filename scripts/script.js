window.onload = function(){
    bank.init();
};

class Money{
    constructor(transaction, balance, id){
        this.transaction = transaction;
        this.balance = balance;
        this.date = new Date().toLocaleString();
        this.id = id++;
    }
}

class Bank{
    constructor(){
        this.moneyBank = [];
        
    }
    saldo = 0;

    init(){
        document.getElementById("add").addEventListener('click', this.addToBank);
        document.getElementById("clear").addEventListener('click', this.itemsClear);
        this.loadDataFromStorage();
    }

    addToBank(){
        const input = document.getElementById("cash");
        bank.bankAcc(input);
        bank.clear(input);
    }
    clear(value){
        value.value = "";
    }

    updateBalance(moneyAdd){
        let balance;
        if(this.moneyBank.length != 0)
        balance = bank.moneyBank[bank.moneyBank.length-1].balance;
        else
        balance = 0;
        balance += moneyAdd;
        this.writeAcc(balance);
        return balance;
    }

    bankAcc(add){
        let addToBank = parseFloat(add.value, 10);
        let saldo;
        if (!isNaN(addToBank) || addToBank == ""){
            saldo = this.updateBalance(addToBank);
            const moneyTransaction = new Money(addToBank, saldo, this.moneyBank.length+1);
            this.addTransaction(moneyTransaction);
        }
    }
    writeAcc(balance){
        const bankBalance = document.getElementById("bank-cash");
        bankBalance.innerHTML = balance.toFixed(2) + " PLN";
    }
    addTransaction(cash){
        this.moneyBank.push(cash);
        this.addElement(cash);
        this.saveData();
    }
    addElement(newRow){
        const tbody = document.querySelector("table tbody");
        const tr = document.createElement("tr");
        tr.className = "tr-data";
        tr.innerHTML = `
            <td>${newRow.id}</td>
            <td>${newRow.date}</td>
            <td>${newRow.transaction.toFixed(2)} PLN</td>
            <td>${newRow.balance.toFixed(2)} PLN</td>
            `;
        tbody.appendChild(tr);
    }
    saveData(){
        storage.saveItems(this.moneyBank);
    }
    loadDataFromStorage(){
        const data = storage.getItems();
        if(data == null || data == undefined) return;
        this.moneyBank = data;
        
        data.forEach((value, index) => {
            this.addElement(value);
        });
        let balanceLoad = 0;
        this.updateBalance(balanceLoad);
    }
    itemsClear(){
        this.balanceNow = 0;
        this.saldo = this.balanceNow;
        bank.writeAcc(this.balanceNow);
        bank.moneyBank.splice(0);
        const tableRows = document.querySelectorAll(".tr-data");
        tableRows.forEach((el)=>{
            el.remove();
        });
        localStorage.clear();
    }
}

const bank = new Bank();

class Storage{
    getItems(){
        let moneyBank = null;
        if(localStorage.getItem("moneyBank")!== null){
            moneyBank = JSON.parse(localStorage.getItem("moneyBank"));
        }
        else{
            moneyBank = [];
        }
        return moneyBank;
    }
    saveItems(moneyBank){
        localStorage.setItem("moneyBank", JSON.stringify(moneyBank));
    }

}
const storage = new Storage();