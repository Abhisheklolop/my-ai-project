let input = document.getElementById('inputBox');
let buttons = document.querySelectorAll('button');
let dateDisplay = document.getElementById('dateDisplay');
let timeDisplay = document.getElementById('timeDisplay');

function updateDateTime() {
    let now = new Date();
    dateDisplay.textContent = now.toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
    timeDisplay.textContent = now.toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit'
    });
}

updateDateTime();
setInterval(updateDateTime, 1000);

let string = "";
let arr = Array.from(buttons);
arr.forEach(button => {
    button.addEventListener('click', (e) =>{
        if(e.target.innerHTML == '='){
            string = eval(string);
            input.value = string;
        }

        else if(e.target.innerHTML == 'AC'){
            string = "";
            input.value = string;
        }
        else if(e.target.innerHTML == 'DEL'){
            string = string.substring(0, string.length-1);
            input.value = string;
        }
        else{
            string += e.target.innerHTML;
            input.value = string;
        }
        
    })
})
