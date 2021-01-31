class CountdownTimer {
    #name;
    #value;
    #finish;

    constructor(name, value) {
        this.#name = name;
        this.#value = value;
        this.#finish = false;

        this.reset = () => {};
        this.emit = () => {};
    }

    _prepareCountdown(value) {
        const handler = {
            set: (currentObj, property, newValue) => {
                if(property == 'value' && newValue < 0) {
                    currentObj.OnZero();
                    
                    return true;
                }

                currentObj[property] = newValue;

                return true;
            }
        }

        const countdown = new Proxy({
            value,
            OnZero: () => {}
        }, handler);

        return countdown;
    }

    _createDiv(countdown) {
        let div = document.createElement('div');
        div.className = 'timer';

        let deg = 360 / this.#value;
        
        div.innerHTML = `
            <span>${countdown.value}</span>
            ${
                Array.from(Array(this.#value)).map((_, index) => 
                    `<div class="dotParent ${index < countdown.value ? 'active' : ''}" style="transform: rotate(${(deg * index) - 90}deg)">
                        <div class="dot"></div>
                    </div>`).join('')
            }
            <label>${this.#name}</label>
        `;

        return div;
    }

    update = ({ element, countdown }) => () => {
        let all = element.querySelectorAll('.dotParent');
        let active = element.querySelectorAll(`.dotParent:nth-child(-n+${countdown.value})`);

        all.forEach(dot => { dot.classList.remove('active') });
        active.forEach(dot => { dot.classList.add('active') });
        
        countdown.value--;

        element.querySelector('span').innerText = countdown.value;

        return countdown.value;
    }

    setReset(fn) {
        this.reset = fn;

        return this;
    }

    setEmit(fn) {
        this.emit = fn;

        return this;
    }

    setFinish(finish) {
        this.#finish = finish;

        return this;
    }

    getFinish() {
        return this.#finish;
    }

    init(value = this.#value) {
        const countdown = this._prepareCountdown(value);
        const element = this._createDiv(countdown);

        const timeRemaining = document.getElementById('countdown');

        timeRemaining.append(element);
        
        element.style.height = `${element.clientWidth}px`;

        this.reset = () => {
            element.querySelectorAll('.dotParent').forEach(dot => { dot.classList.add('active') });
            countdown.value = this.#value;
        };

        // countdown.reset = () => this.reset();
        countdown.OnZero = () => this.emit();

        return this.update({ element, countdown });
    }
}