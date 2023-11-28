/** 
 * @typedef {Object} Payment
 * @property {number} balance
 * @property {number} interest
 * @property {number} principal_payment
 * @property {Date} payment_date
 */

/** 
 * @typedef {Object} PaymentProfile
 * @property {Object.<number, Payment>} number 
 */

/**
 * @enum {number}
 */
const PaymentFrequency = {
    Weekly: 0,
    Monthly: 1,
    Quarterly: 3,
    Annually: 12
}

class LoanInformation {
    /**
     * 
     * @param {number} balance 
     * @param {number} aop 
     * @param {PaymentFrequency} payment_frequency 
     * @param {number} payment_amount 
     * @param {Date} next_payment_date 
     */
    constructor(balance, aop, payment_frequency, payment_amount, next_payment_date) {
        this.balance = balance;
        this.aop = aop;
        this.payment_frequency = payment_frequency;
        this.payment_amount = payment_amount;
        this.next_payment_date = next_payment_date;
        this.payment_profile = this._get_payment_profile();
    }

    /**
     * @returns {PaymentProfile}
     */
    _get_payment_profile() {
        let amount = this.payment_amount;
        let balance = this.balance;
        let period_ir = this._period_efficient_rate();
        let principal_payment = 0;
        let payment_profile = [];

        let i = 0;
        while (balance > 0) {
            let interest = balance * period_ir;
            console.log(interest)
            principal_payment = amount - interest;
            if (principal_payment < 0) {
                throw Error("Loan will never be repaid");
            };
            let payment_date = get_payment_days(this.next_payment_date, i, this.payment_frequency);
            payment_profile.push({
                    "balance": balance,
                    "interest": interest,
                    "principal_payment": principal_payment,
                    "payment_date": payment_date
            });
            balance = balance - principal_payment;
            i++;
        }

        return payment_profile;
    }

    /**
     * @returns {number}
     */
    _period_efficient_rate() {
        let rate = (
            ((1 + this.aop) / 1)
            ** (1 / (12 / this.payment_frequency))
        ) - 1;

        return rate;
    };

}


/**
 * @param {Date} next_payment_date
 * @param {int} iteration
 * @param {PaymentFrequency} payment_frequency
 * @returns {Date}
 */
const get_payment_days = (next_payment_date, iteration, payment_frequency) => {
    next_payment_date = next_payment_date;
    if (this.payment_frequency == PaymentFrequency.Weekly) {
        return next_payment_date.addDays(iteration * 7);
    }
    else {
        return next_payment_date.addMonths(iteration * payment_frequency);
    }
}



Date.isLeapYear = function (year) { 
    return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)); 
};

Date.getDaysInMonth = function (year, month) {
    return [31, (Date.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
};

Date.prototype.isLeapYear = function () { 
    return Date.isLeapYear(this.getFullYear()); 
};

Date.prototype.getDaysInMonth = function () { 
    return Date.getDaysInMonth(this.getFullYear(), this.getMonth());
};

Date.prototype.addMonths = function (value) {
    var n = this.getDate();
    this.setDate(1);
    this.setMonth(this.getMonth() + value);
    this.setDate(Math.min(n, this.getDaysInMonth()));
    return this;
};

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
};


const generate_loan_information = () => {
    let balance = document.getElementById("balance").value;
    let aop = document.getElementById("aop").value / 100;
    let payment_frequency = document.getElementById("payment_frequency").value;
    let payment_amount = document.getElementById("payment_amount").value;
    let next_payment_date = new Date(document.getElementById("payment_date").value);
    let li = new LoanInformation(balance, aop, payment_frequency, payment_amount, next_payment_date);

    document.getElementById("payment_profile").textContent = JSON.stringify(li.payment_profile);
}