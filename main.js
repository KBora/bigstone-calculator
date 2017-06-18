var CALCULATOR = (function () {

  var
    loanAmount = 10000,
    repaymentTermInMonths = 12,
    companyRating = 1,
    personalRating = 1,
    lower_rate_matrix =
      {
        1: {
          1: 8,
          2: 10.1,
          3: 13.3,
          4: 18.3
        },
        2: {
          1: 8.8,
          2: 11.3,
          3: 15.2,
          4: 21.2
        },
        3: {
          1: 9.8,
          2: 12.9,
          3: 17.6,
          4: 22.2
        },
        4: {
          1: 10.9,
          2: 14.5,
          3: 20,
          4: 24
        }
      },

    add_fee = function (loan_amount) {
      return 1.01 * loan_amount;
    },

    calculate_repayment = function (loan_amount, weeks, interest_rate) {
      var weekly_rate = (interest_rate / 100) / 52;
      var accumulation_factor = weekly_rate + 1;
      var whatever = Math.pow(accumulation_factor, weeks)
      return loan_amount * ((whatever * (accumulation_factor - 1)) / (whatever - 1))
    },

    amount_from_interest_rate = function (loan_amount, term, interest_rate) {
      var weeks = 52 * (term / 12);
      return calculate_repayment(loan_amount, weeks, interest_rate) * weeks;
    }

    ;


  return { // these are the 'public' functions

    calculate_estimate: function () {
      var interest_rate = lower_rate_matrix[companyRating][personalRating];
      var total_repayment_amount = amount_from_interest_rate(add_fee(loanAmount), repaymentTermInMonths, interest_rate);
      return {
        "interest_rate": interest_rate,
        "monthly_interest_rate": interest_rate / 12,
        "total_repayment_amount": total_repayment_amount,
        "weekly_repayment_amount": total_repayment_amount / 52,
        "total_cost_of_loan": total_repayment_amount - loanAmount
      }
    },

    setLoanAmount: function (amount) {
      loanAmount = amount;
    },

    getLoanAmount: function () {
      return loanAmount;
    },

    setRepaymentTermInMonths: function (term) {
      repaymentTermInMonths = term;
    },

    getRepaymentTermInMonths: function () {
      return repaymentTermInMonths;
    },

    setCompanyRating: function (rating) {
      companyRating = rating;
    },

    getCompanyRating: function () {
      return companyRating;
    },

    setPersonalRating: function (rating) {
      personalRating = rating;
    },

    getPersonalRating: function () {
      return personalRating;
    }


  }


})();

var UTIL = (function() {
  return {
    filterInt: function(value) {
      if (/([0-9]+)$/.test(value)) {
        return Number(value);
      }
      return NaN;
    }   
  }
})();


var RENDER = (function () {
  return {
    renderRepaymentAmounts: function() {
      accounting.settings.currency.precision = 0;
      var calc = CALCULATOR.calculate_estimate();
      $("#totalRepayment .result-amount").html(accounting.formatMoney(calc.total_repayment_amount));
      $("#totalCost .result-amount").html(accounting.formatMoney(calc.total_cost_of_loan));
      $("#weeklyRepayment .result-amount").html(accounting.formatMoney(calc.weekly_repayment_amount));

    },

  }
})();


$(document).ready(function () { 
  RENDER.renderRepaymentAmounts();
});



