// how to write a module - invoking the function
// we are putting () at the end of the var because we want to immediately execute the code 
var budgetController = (function(){

    var x = 23;
    var add = function(a) {
        return x + a;

    }

    return {
        publicTest: function(b) {
            return add(b);
        }
    }
})();


var UIController = (function(){

    // some code here 

})();

// 왜 calling 할때 budgetController와 UIController 를 사용하냐하면 (function 안에서 부르지않고), 나중에 이름이 바뀌면 모든걸 다 바꿔야되기 때문이고 
// 또 budgetCtrl, UICtrl을 만듬으로서 따로 관리하기가 편하기 때문이다.
var controller = (function(budgetCtrl, UICtrl){

    var z = budgetCtrl.publicTest(1);

    return {
        anotherPublic: function() {
            console.log(z)
        }
    }

})(budgetController, UIController);