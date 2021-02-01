window.onload = () => {
    let initialDate = new Date(localStorage.getItem('initial')).getTime();
    let finalDate = new Date(localStorage.getItem('final')).getTime();
    let currentDate = new Date().getTime();
    let diff = finalDate - initialDate;

    let calcRemaining = {
        days: {
            to: 8.64e+7,
            mod: Infinity
        },
        hours: {
            to: 3.6e+6,
            mod: 24
        },
        minutes: {
            to: 60000,
            mod: 60
        },
        seconds: {
            to: 1000,
            mod: 60
        }
    };
    
    Object.keys(calcRemaining).reduce((currentObject, newObject) => {
        if(parseInt(diff / calcRemaining[newObject].to) > 0) {
            let initialDiff = parseInt(Math.min(diff / calcRemaining[newObject].to, calcRemaining[newObject].mod - 1));
            let currentDiff = parseInt((finalDate - currentDate) / calcRemaining[newObject].to) % calcRemaining[newObject].mod;
            
            let countdownObj = new CountdownTimer(newObject, initialDiff);
            let countdown = countdownObj.init(currentDiff);

            let finish = () => countdownObj.setFinish(true);

            if(newObject == 'seconds') {
                let interval = setInterval(countdown, 1000);
                
                finish = () => clearInterval(interval);
            }
            
            if(currentObject.countdownObj) {
                countdownObj.setEmit(() => {
                    let value = currentObject.countdown();
                    
                    if(!value && currentObject.countdownObj.getFinish()) {
                        countdownObj.setEmit(() => {});
                        finish();
                    }
                    else {
                        countdownObj.reset();
                    }
                })
            }
            else if(!currentDiff) {
                countdownObj.setFinish(true);
            }
            else {
                countdownObj.setEmit(() => countdownObj.setFinish(true));
            }

            return { countdownObj, countdown };
        }

        return {};
    }, {});
}