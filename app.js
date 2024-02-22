'use strict';

function pad(n) {
    if (n>9) return ''+n;
    else return '0'+n;
}

// Didn't use it. I prefer an static ID.
function nameToId(name) {
    return name
        .replace(/&/g, 'x')
        .replace(/ /g, '_')
        .toLowerCase() + '-' +
        Math.floor(Math.random() * 89999 + 10000)
}

function capitalize(string) {
    return string[0].toUpperCase()+string.slice(1);
}

// Didn't use it. I prefer to have freedom on format.
function idToName(id) {
    return id
        .slice(0, id.indexOf('-'))
        .replace(/_/g, ' ')
        .split(' ')
        .map(str => {
            if(str.includes('(')) {
                return str.toUpperCase();
            } else {
                return capitalize(str);
            }
        })
        .join(' ')
}

// This is used for light touch functionality
function calcDistance(end, start) {
    let distance = +Math.abs((end - start)/start).toFixed(2);
    return distance;
}


const _ = undefined;

const elSidebar = document.getElementById('sidebar');
const elContentArea = document.getElementById('content-area');

const elDashboard = document.getElementById('dashboard');
const elDashboardFirst = elDashboard.querySelector('.first');
const elDashboardSecond = elDashboard.querySelector('.second');
const elSelectWatches = document.getElementById('select-watches');
const elRestart = document.getElementById('restart');

class Stopwatch {
    startedAt;
    elContainer = elDashboard.children[0];

    constructor({name, initialMs, imgPath, insikt=true, specific=true, overlapping=false, id, rank=0, isSelected=true}) {
        this.name = name;
        this.initialMs = initialMs;
        this.imgPath = imgPath;
        this.isRunning = false;
        this.insikt = insikt;
        this.specific = specific;
        this.overlapping = overlapping;
        this.id = id;
        this.rank = rank;
        this.isSelected = isSelected;

        this._setupHTML();
    }

    _setupHTML() {
        this.el = document.createElement('div');
        this.el.classList.add('stopwatch');
        this.el.dataset.id = this.id;
        this.el.innerHTML = `
            <div class="words">
                <p class="title">${this.specific ? '' : '<span>◈</span>'}${this.name}</p>
                <p class="time"></p>
            </div>
            <img src="${this.imgPath}" alt="">
        `
        this.elTime = this.el.querySelector('.time');
        this._changeTime(this.initialMs);

        if (this.initialMs > 0) this.el.classList.add('non-virgin');
        if (!this.insikt) this.el.classList.add('non-insikt');
        if (this.overlapping) this.el.classList.add('overlapping');
    }

    start() {
        const savedObj = JSON.parse(localStorage.getItem(`stopwatch_${this.id}`));
        if(!this.isRunning) {
            this.el.classList.add('non-virgin');
            this.el.classList.add('active');
            this.startedAt = Date.now() - this.initialMs; // unit: ms
            this.isRunning = true;
            this.isRunning = setInterval(() => {this._update(savedObj)}, 500); // Why did I have to id like this instead of just 'this.update'? Print 'this' in update.
        }
    }

    stop() {
        if(this.isRunning) {
            this.el.classList.remove('active');
            clearInterval(this.isRunning);
            this.initialMs = Date.now() - this.startedAt;
            this.isRunning = false;
        }
    }

    _update(savedObj) {
        const totalMs = Date.now() - this.startedAt;
        this._changeTime(totalMs);
        this.save(totalMs, savedObj);
    }

    restart() {
        const savedObj = JSON.parse(localStorage.getItem(`stopwatch_${this.id}`));
        if(this.isRunning) this.stop();
        this.el.classList.remove('non-virgin');
        this.initialMs = 0;
        this.save(0, savedObj);
        this._changeTime(this.initialMs);
    }

    _changeTime(msQuantity) {
        if(msQuantity === 0) this.elTime.innerHTML = '0'
        else {
            const hours = Math.floor(msQuantity / 1000 / 60 / 60);
            const minutes = Math.floor(msQuantity / 1000 / 60 % 60);
            const seconds = Math.floor(msQuantity / 1000 % 60);

            const areHours = hours > 0;
            const areMinutes = minutes > 0;

            let html = areHours ? `<span>${hours}</span><span>:</span>` : '';
            html += areHours ? `<span>${pad(minutes)}</span><span>:</span>` : (areMinutes ? `<span>${minutes}</span><span>:</span>` : '');
            html += areMinutes ? `<span>${pad(seconds)}</span>` : `<span>${areHours>0 ? pad(seconds) : seconds}</span>`;

            this.elTime.innerHTML = html;
        }
    }

    save(value, savedObj) {
        const newObject = {...savedObj, initialMs: value}
        localStorage.setItem(
            `stopwatch_${this.id}`, JSON.stringify(newObject)
        );
    }
}



class App {
    stopwatches = [];
    selectors = [];
    startX; startY; endX; endY;
    holdedDown = false;
    holdTimer;
    
    constructor() {
        this.openViewName = localStorage.getItem('openViewName') || 'feature_dashboard';
        this._handleFeature(this.openViewName);

        this._createStopwatches();
        this._createSelectors();

        this._sidebarEvents();
        this._dashboardEvents();
        this._selectWatchesEvents();
        this._elRestartEvents();
    }


    // S i d e b a r

    _sidebarEvents() {
        elSidebar.addEventListener('click', (e) => {
            const elFeature = e.target.closest('.feature'); // Can be null
            const elSidebar = e.target.closest('#sidebar');
            if(elFeature) {
                this._animateFeature(elFeature);
                this._handleFeature(elFeature.id);
            }
            else if(elSidebar) this._toggleSidebar() // must be last
        })
    }

    _handleFeature(id) {
        switch(id) {
            case 'feature_dashboard':
                this.openViewName = 'feature_dashboard';
                localStorage.setItem('openViewName', this.openViewName);
                elDashboard.style.display = 'initial';
                elSelectWatches.style.display = 'none';
                break;
            case 'feature_select-watches':
                this.openViewName = 'feature_select-watches';
                localStorage.setItem('openViewName', this.openViewName);
                console.log('x');
                elDashboard.style.display = 'none';
                elSelectWatches.style.display = 'grid';
                break;
            case 'feature_restart':
                elRestart.style.display = 'grid';

                break;
        }
    }

    _toggleSidebar() {
        elSidebar.classList.toggle('closed');
        elContentArea.classList.toggle('wide');
    }

    _animateFeature(el) {
        const selection = el.children[0];
        selection.classList.add('active');
        let str = getComputedStyle(selection).animationDuration;
        let animationDurationInMs = str.substring(0, str.length - 1) * 1000;
        
        setTimeout(() => {
            selection.classList.remove('active');
        }, animationDurationInMs)
    } 

    

    // C o n t e n t   A r e a

    _dashboardEvents() {        
        elDashboard.addEventListener('touchstart', (e) => {
            console.log('Touch Start');
            
            if (e.touches.length > 1) return;
            [{clientY: this.startY}] = e.touches;

            const elTgStopwatch = e.target.closest('.stopwatch')
            if(elTgStopwatch) {
                const stopwatch = this.stopwatches.find(stopwatch => stopwatch.id === elTgStopwatch.dataset.id);
                this.holdTimer = setTimeout(() => {
                    stopwatch.restart();
                    this.holdedDown = true;
                }, 1500);
            }
        })

        elDashboard.addEventListener('touchend', (e) => {
            console.log('Touch End');

            if(e.changedTouches.length > 1) return;
            [{clientY: this.endY}] = e.changedTouches;
            const tolerance = calcDistance(this.endY, this.startY);
            
            if(tolerance < .1 && !this.holdedDown) {
                const elTgStopwatch = e.target.closest('.stopwatch')
                if(elTgStopwatch) {
                    const stopwatch = this.stopwatches.find(stopwatch => stopwatch.id === elTgStopwatch.dataset.id);
                    if (!stopwatch.isRunning) stopwatch.start();
                    else stopwatch.stop();
                }
            }

            clearTimeout(this.holdTimer);
            this.holdedDown = false;
        })

        /* elDashboard.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }) */
    }

    _createStopwatches() {
        this.stopwatches = mainData.map(data => new Stopwatch(data));
        this.stopwatches.forEach(stopwatch => {
            if (stopwatch.isSelected) {
                elDashboard.children[stopwatch.rank].append(stopwatch.el);
            }
        });
    }

    _createSelectors() {
        this.selectors = mainData.map(data => {
            const selector = document.createElement('div');
            selector.classList.add('item');
            selector.dataset.id = data.id;

            if(data.isSelected) selector.classList.add('isSelected')

            selector.innerHTML = `
                <div class="tick-x-field">
                    <div class="tick">
                        <img draggable="false" src="assets/icons-general/tick.svg" alt="">
                    </div>
                    <div class="field">
                        <img draggable="false" src="${data.imgPath}" alt="">
                        <p>${data.name}</p>
                    </div>
                </div>
                <p class="selector ${data.rank === 0 ? 'main' : ''}">${data.rank+1}</p>
            `

            return selector;
        })

        this.selectors.forEach(selector => {
            elSelectWatches.append(selector);
        })
    }

    _selectWatchesEvents() {
        elSelectWatches.addEventListener('click', (e) => {
            // Activate or deactive stopwatch
            if(e.target.closest('.tick-x-field')) {
                const tgStopwatch = this.stopwatches.find(stp => stp.id === e.target.closest('.item').dataset.id)
                const container = elDashboard.children[tgStopwatch.rank];
                if(!tgStopwatch.isSelected) container.append(tgStopwatch.el);
                else {
                    container.removeChild(tgStopwatch.el);
                    tgStopwatch.stop();
                };
                tgStopwatch.isSelected = !tgStopwatch.isSelected;


                const savedObj = JSON.parse(localStorage.getItem(`stopwatch_${tgStopwatch.id}`));
                localStorage.setItem(`stopwatch_${tgStopwatch.id}`, JSON.stringify({...savedObj, isSelected: tgStopwatch.isSelected}))


                e.target.closest('.item').classList.toggle('isSelected');
            // Change rank and therefore change container
            } else if (e.target.closest('.selector')) {
                const tgStopwatch = this.stopwatches.find(stp => stp.id === e.target.closest('.item').dataset.id);
                tgStopwatch.stop();
                elDashboard.children[tgStopwatch.rank].removeChild(tgStopwatch.el);
                elDashboard.children[+!tgStopwatch.rank].appendChild(tgStopwatch.el);
                tgStopwatch.rank = +!tgStopwatch.rank;


                const savedObj = JSON.parse(localStorage.getItem(`stopwatch_${tgStopwatch.id}`));
                localStorage.setItem(`stopwatch_${tgStopwatch.id}`, JSON.stringify({...savedObj, rank: tgStopwatch.rank}))


                e.target.textContent = tgStopwatch.rank+1;
                e.target.classList.toggle('main');
            }

            // location.reload();
        })
    }

    _elRestartEvents() {
        elRestart.addEventListener('touchend', (e) => {
            if(e.target.closest('button')) {
                if(e.target.closest('button').classList[0] === 'yes') {
                    this.stopwatches.forEach(stp => stp.restart());
                }
                elRestart.style.display = 'none';
            }
        })
    }
}

const app = new App();
 