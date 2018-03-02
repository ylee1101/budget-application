// how to write a module - invoking the function
// we are putting () at the end of the var because we want to immediately execute the code 

// BUDGET CONTROLLER
var budgetController = (function(){

    var Expense = function(id, description, value) {
        this.id = id,
        this.description = description,
        this.value = value
    }

    var Income = function(id, description, value) {
        this.id = id,
        this.description = description,
        this.value = value
    };

    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur){
            sum += cur.value;
        });
        data.totals[type] = sum;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1 
    };
    return {
        addItem: function(type, des, val) {
            var newItem, ID;

            if (data.allItems[type].length > 0) {
                // this is for new ID that will come out to the next one/ Create a new ID
                ID = data.allItems[type][data.allItems[type].length - 1].id +1;
                // ID = last ID + 1                
            } else {
                ID = 0;
            }
            
            if (type === "exp") {
                newItem = new Expense(ID, des, val);
            }
            else if (type === "inc"){
                newItem = new Income(ID, des, val);
            }
            // push it into our data structure
            data.allItems[type].push(newItem);
            // return the new element
            return newItem;

        },

        calculateBudget: function() {

            // calculate total income and expense 
            calculateTotal('exp');
            calculateTotal('inc');
            // calculate the budget: income - expense
            data.budget = data.totals.inc - data.totals.exp;
            // calculate the percentage of income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round(data.totals.exp / data.totals.inc * 100);
            } else {
                data.percentage = -1;
            }
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },

        testing: function(){
            console.log(data);
        }
    }
})();

// UI CONTROLLER
var UIController = (function(){

    // some code here 

    var DOMstrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputButton: ".add__btn",
        incomeContainer: ".income__list",
        expenseContainer: ".expenses__list",
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container'
    }
    return {
        getInput: function() {
            return {
            // we will get either inc or exp from add__type value
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },
        // we are exposing the DOMstrings to public
        getDOMstrings: function() {
            return DOMstrings;
        },
        addListItem: function(obj, type) {
            // create HTML string with palceholder text
            var html, newHtml, element; 

            if (type === "inc") {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline" /></button></div></div></div>';
            } else if (type === "exp") {
                element = DOMstrings.expenseContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline" /></button></div></div></div>';
            }

            // replace the placeholder text with actual data
            newHtml = html.replace('%id%', obj.id)
            newHtml = newHtml.replace("%description%", obj.description);
            newHtml = newHtml.replace("%value%", obj.value);

            // insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        clearFields: function() {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach( function(current, index, array){
                current.value = "";
            }); 

            fieldsArr[0].focus();
        },

        displayBudget: function(obj) {
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
            
            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';

            }
        },

        getDOMstrings: function() {
            return DOMstrings;
        }
    };

})();

// 왜 calling 할때 budgetController와 UIController 를 사용하냐하면 (function 안에서 부르지않고), 나중에 이름이 바뀌면 모든걸 다 바꿔야되기 때문이고 
// 또 budgetCtrl, UICtrl을 만듬으로서 따로 관리하기가 편하기 때문이다.

// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl){

    var setupEvenListener = function() {
        var DOM = UICtrl.getDOMstrings();

        // uses same syntax as a css method
        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);

        // for enter key 
        document.addEventListener('keypress', function(event){
            if (event.KeyCode === 13 || event.which === 13) {
                ctrlAddItem()
            } 
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem)
    }

    var updateBudget = function() {
        // 1. calculate the budget
        budgetCtrl.calculateBudget();

        // 2. return the budget
        var budget = budgetCtrl.getBudget();

        // 3. display the budget on the UI
        UICtrl.displayBudget(budget);
    }

    var ctrlAddItem = function() {
        var input, newItem;
        // 1. get the filled input data
        input = UICtrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // 2. add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            // 3. add the item to the UI
            UICtrl.addListItem(newItem, input.type);
            // 4. calculate the budget
            UICtrl.clearFields();

            // 5. calculate and update budget
            updateBudget();
        }

    };


    var ctrlDeleteItem = function(event) {
        
        var itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {
            // inc-1 
            splitID = itemID.split('-');
            type = splitID[0];
            ID = splitID[1];

            // 1. delete item from the data structure
            
            // 2. delete the item from the UI 

            // 3. update and show the new budget

        }
    }

    return {
        init: function() {
            console.log("appplication is running");
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: 0
            });
            setupEvenListener();
        }
    }
})(budgetController, UIController);

controller.init();
