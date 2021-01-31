window.onload = () => {
    let initialDate = 1612122300000//new Date(localStorage.getItem('initial')).getTime();
    let finalDate = 1612136760000;//new Date(localStorage.getItem('final')).getTime();
    let currentDate = 1612129490000//new Date().getTime();
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
            let countdownObj = new CountdownTimer(newObject, parseInt(Math.min(diff / calcRemaining[newObject].to, calcRemaining[newObject].mod - 1)));
            let countdown = countdownObj.init(parseInt((finalDate - currentDate) / calcRemaining[newObject].to) % calcRemaining[newObject].mod);
            
            if(newObject == 'seconds') {
                interval = setInterval(countdown, 1000);
            }

            if(currentObject.countdownObj) {
                countdownObj.setEmit(() => {
                    let value = currentObject.countdown();

                    if(!value && currentObject.countdownObj.getFinish()) {
                        countdownObj.setEmit(() => {}).setFinish(true);
                    }
                    else {
                        countdownObj.reset();
                    }
                })
            }

            return { countdownObj, countdown };
        }
        else if(currentObject.countdownObj) {
            currentObject.countdownObj.setEmit(() => {}).setFinish(true);
        }

        return {};
    }, {});
}