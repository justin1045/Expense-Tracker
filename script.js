// Selecting DOM elements
const totalIncome = document.querySelector("#total_Income");
const totalIncomeIncomeButton = document.querySelector("#income_submit_button");
const balanceInput = document.querySelector("#balance_Input");
const expense = document.querySelector(".expense");
const expenseInputs = document.querySelectorAll(".expense input");
const expenseSelect = document.querySelector(".expense select");
const expenseListDiv = document.querySelector(".expense-list");
const expenseButton = document.querySelector("#expense_button");
const resultContainer = document.querySelector(".result-container");

// Tax form elements
const taxForm = document.querySelector("#tax-form");
const preSpan = document.querySelector("#pre_income");
const incomeInput = document.querySelector("#income-input");
const rate = document.querySelector("#tax_rate");
const tax = document.querySelector("#total-tax");
const taxIncome = document.querySelector("#post-tax-income");

// Chart elements
const barChart = document.querySelector("#bar");
let barChartID;
const pieChart = document.querySelector("#pie");
let pieChartID;

// ai button

const AiButton = document.querySelector("#ai_button");
const aiResponses = document.querySelectorAll(".ai_response"); 

// Array to store expense objects
let resultArray = [];

let totalExpense = 0;
let totalIncomeMoney;


//  Set Total Income

totalIncomeIncomeButton.addEventListener("click", (e) => {
  // Display the entered income value
  totalIncome.innerText = `Your income is : ${balanceInput.value}`;
  totalIncomeMoney = Number(balanceInput.value);

  localStorage.setItem("totalBalance",totalIncomeMoney);
});

window.addEventListener("load", (e)=> {
  if (localStorage.getItem("totalBalance")) {

    let balance = localStorage.getItem("totalBalance");
  totalIncome.innerText = `Your income is : ${balance}`;

  } else {
    totalIncome.innerText = `Your income is : 0`;
  }
  

  if(localStorage.getItem("result")) {
    // console.log("hello");
    
    resultArray = JSON.parse(localStorage.getItem("result"));
    displayData(resultArray);
    createBarGraph(resultArray);
    createPieGraph(resultArray);

  }





});


// Add Expense

expenseButton.addEventListener("click", (e) => {
  // Validation to check if all expense fields are filled
  if (
    expenseInputs[0].value === "" ||
    expenseInputs[1].value === "" ||
    expenseSelect.value === "select"
  ) {
    alert("Please fill all fields before adding an expense!");
    return;
  }

  // Create an expense object
  let expenseInfo = {
    Expense_name: expenseInputs[0].value,
    Amount: expenseInputs[1].value,
    Category: expenseSelect.value,
    Date: new Date().toDateString(),
    id: Date.now(), // Unique identifier for each expense
  };

  totalExpense += Number(expenseInfo.Amount);

  localStorage.setItem("totalExpense", totalExpense);

  if (totalExpense >= totalIncomeMoney*75/100) {
    alert("You have Exhausted 75% of your total income!!!");
  }

  // Add the expense to the result array
  resultArray.push(expenseInfo);

  localStorage.setItem("result", JSON.stringify(resultArray));
  // Display the data and update charts

  displayData(resultArray);
  clearExpenseData();
  createBarGraph(resultArray);
  createPieGraph(resultArray);

});


//  Display Expense Data

function displayData(arr) {
  resultContainer.innerHTML = ""; // Clear previous data
  const fragment = document.createDocumentFragment();

  arr.forEach((obj) => {
    // Create a container for each expense
    const resultDiv = document.createElement("div");
    resultDiv.classList.add("resultDiv");

    // Create paragraph for expense name
    const expenseName = document.createElement("p");
    expenseName.innerText = obj.Expense_name;

    // Create paragraph for amount
    const Amount = document.createElement("p");
    Amount.innerText = obj.Amount;

    // Create paragraph for category
    const Category = document.createElement("p");
    Category.innerText = obj.Category;

    // Create date and delete button container
    const dateDeleteButton = document.createElement("div");
    dateDeleteButton.classList.add("dateAndDelete");

    // Create date span
    const date = document.createElement("span");
    date.innerText = obj.Date;

    // Create delete button
    const deleteButton = document.createElement("span");
    deleteButton.classList.add("fa-solid", "fa-trash");

    // Add delete functionality
    deleteButton.addEventListener("click", (e) => {

      // console.log(typeof(totalExpense));
      totalExpense = Number(localStorage.getItem("totalExpense"));

      totalExpense -= Number(obj.Amount);
      
      // console.log(totalExpense);

      localStorage.setItem("totalExpense", JSON.stringify(totalExpense));



      // Find the index of the clicked item
      let idx = resultArray.findIndex((ele) => {
        return ele.id == obj.id;
      });

      // Remove item from the array
      resultArray.splice(idx, 1);

      localStorage.setItem("result", JSON.stringify(resultArray));

      // Update the display and graphs after deletion
      displayData(resultArray);
      createBarGraph(resultArray);
      createPieGraph(resultArray);
    });

    dateDeleteButton.append(date, deleteButton);
    resultDiv.append(expenseName, Amount, Category, dateDeleteButton);
    fragment.append(resultDiv);
  });

  resultContainer.append(fragment);
}


//  Clear Expense Data

function clearExpenseData() {
  expenseInputs.forEach((input) => {
    input.value = ""; // Reset input values
  });
  expenseSelect.value = "select"; // Reset select dropdown
}


// Create Bar Chart

function createBarGraph(arr) {
  if (barChartID) {
    barChartID.destroy(); // Destroy previous chart instance if it exists
  }

  let categoryArr = [];
  let amountArr = [];

  // Populate data for the chart
  for (let obj of arr) {
    categoryArr.push(obj.Category);
    amountArr.push(obj.Amount);
  }

  // Create a new bar chart
  barChartID = new Chart(barChart, {
    type: "bar",
    data: {
      labels: categoryArr,
      datasets: [
        {
          label: "# Spent",
          data: amountArr,
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      responsive: false,
      maintainAspectRatio: false,
    },
  });
}


// Create Pie Chart

function createPieGraph(arr) {
  if (pieChartID) {
    pieChartID.destroy(); // Destroy previous chart instance if it exists
  }

  let categoryArr = [];
  let amountArr = [];

  // Populate data for the chart
  for (let obj of arr) {
    categoryArr.push(obj.Category);
    amountArr.push(obj.Amount);
  }

  // Create a new pie chart
  pieChartID = new Chart(pieChart, {
    type: "pie",
    data: {
      labels: categoryArr,
      datasets: [
        {
          label: "# Spent",
          data: amountArr,
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: false,
      maintainAspectRatio: false,
    },
  });
}


// Tax Calculation Form

taxForm.addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent form submission

  // Get income value and update pre-tax income
  const incomeValue = Number(incomeInput.value);
  preSpan.innerText = incomeValue;

  let incomeAfterTax;
  let taxToBeDeducted;

  // Tax slab logic based on income range
  if (incomeValue >= 1000000) {
    rate.innerText = "20%";
    taxToBeDeducted = (incomeValue * 20) / 100;
  } else if (incomeValue >= 700000) {
    rate.innerText = "15%";
    taxToBeDeducted = (incomeValue * 15) / 100;
  } else if (incomeValue >= 500000) {
    rate.innerText = "10%";
    taxToBeDeducted = (incomeValue * 10) / 100;
  } else if (incomeValue >= 300000) {
    rate.innerText = "5%";
    taxToBeDeducted = (incomeValue * 5) / 100;
  } else {
    rate.innerText = "0%";
    taxToBeDeducted = 0;
  }

  incomeAfterTax = incomeValue - taxToBeDeducted;

  // Display the calculated tax and post-tax income
  tax.innerText = taxToBeDeducted.toFixed(2);
  taxIncome.innerText = incomeAfterTax.toFixed(2);
});


// Razorpay Payment Integration

var options = {
  key: "rzp_test_dZqJ0BLhCLWNRv", // Razorpay test key
  amount: 100 * 10000, // Amount in paise (10000 = 100 INR)
  currency: "INR",
  description: "c.s.tank",
  image: "example.com/image/rzp.jpg",
  prefill: {
    email: "cstank786@gmail.com",
    contact: +919900000000,
  },
  config: {
    display: {
      blocks: {
        utib: {
          name: "Pay Using Axis Bank",
          instruments: [
            {
              method: "card",
              issuers: ["UTIB"],
            },
            {
              method: "netbanking",
              banks: ["UTIB"],
            },
          ],
        },
        other: {
          name: "Other Payment Methods",
          instruments: [
            {
              method: "card",
              issuers: ["ICIC"],
            },
            {
              method: "netbanking",
            },
          ],
        },
      },
      hide: [
        {
          method: "upi",
        },
      ],
      sequence: ["block.utib", "block.other"],
      preferences: {
        show_default_blocks: false,
      },
    },
  },
  handler: function (response) {
    // Handle successful payment
    alert(response.razorpay_payment_id);
  },
  modal: {
    ondismiss: function () {
      // Handle modal close event
      if (confirm("Are you sure, you want to close the form?")) {
        console.log("Checkout form closed by the user");
      } else {
        console.log("Complete the Payment");
      }
    },
  },
};

// Create Razorpay instance
var rzp1 = new Razorpay(options);

// Open Razorpay modal on button click
document.getElementById("rzp-button1").onclick = function (e) {
  rzp1.open();
  e.preventDefault();
};

// ai 

AiButton.addEventListener("click", (e) => {
  let amount = Number(localStorage.getItem("totalExpense"));

  let totalamount = Number(localStorage.getItem("totalBalance"));

  if (amount >= totalamount * 80 / 100) {
    aiResponses[0].innerText = "💡 You've spent over 80% of your income. It's time to slow down and focus on essential expenses to avoid overspending.";
    aiResponses[1].innerText = "⚠️ Caution! You're nearing the limit of your budget. Consider reviewing your remaining funds and prioritize necessities.";
  
  } else if (amount >= totalamount * 60 / 100) {
    aiResponses[0].innerText = "📊 You've used about 60% of your income. You're managing well so far—stay consistent to keep things balanced.";
    aiResponses[1].innerText = "⏳ You're approaching the critical zone. Monitor upcoming expenses and plan carefully to maintain control.";
  
  } else if (amount >= totalamount * 40 / 100) {
    aiResponses[0].innerText = "✅ Great job! You've spent 40% of your income. You're on track—keep an eye on your remaining budget.";
    aiResponses[1].innerText = "🧠 Smart spending! You're halfway through your income. Stay mindful of future expenses to avoid surprises.";
  
  } else if (amount >= totalamount * 20 / 100) {
    aiResponses[0].innerText = "🌟 You've spent 20% of your income. You're off to a strong start—keep tracking your expenses to stay in control.";
    aiResponses[1].innerText = "🕰️ Good progress! You’ve kept your spending in check so far. Now’s the time to plan for upcoming priorities.";
  
  } else {
    aiResponses[0].innerText = "🚀 You're just getting started! Less than 20% spent—this is the perfect moment to set financial goals.";
    aiResponses[1].innerText = "💡 Smart move! With most of your income still intact, you have plenty of room to plan and make informed decisions.";
  }
  
  
});





