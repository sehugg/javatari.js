// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

jt.Clock = function(clockDriven, pCyclesPerSecond) {
    var self = this;

    function init() {
        internalSetFrequency(pCyclesPerSecond || NATURAL_FPS);
    }

    this.go = function() {
        if (!running) {
            running = true;
            if (!pulsing) pulse();
        }
    };

    this.pauseOnNextPulse = function() {
        running = false;
    };

    this.setFrequency = function(freq) {
        if (pulsing) {
            pause();
            internalSetFrequency(freq);
            schedule();
        } else {
            internalSetFrequency(freq);
        }
    };

    var internalSetFrequency = function(freq) {
        cyclesPerSecond = freq;
        cycleTimeMs = 1000 / freq;
        useRequestAnimationFrame = window.requestAnimationFrame && (freq === NATURAL_FPS);
    };

    var pulse = function() {
        if (!running) {
            pause();
            pulsing = false;
            return;
        }
        pulsing = true;
        clockDriven.clockPulse();
        schedule();
    };
    
    var schedule = function() {
        if (useRequestAnimationFrame)
            animationFrame = window.requestAnimationFrame(pulse);
        else
            if (!interval) interval = window.setInterval(pulse, cycleTimeMs);
    }

    var pause = function () {
        if (animationFrame) {
            window.cancelAnimationFrame(animationFrame);
            animationFrame = null;
        }
        if (interval) {
            window.clearTimeout(interval);
            interval = null;
        }
    };

    this.isRunning = function() {
        return running;
    }

    var running = false;
    var pulsing = false;

    var cyclesPerSecond = null;
    var cycleTimeMs = null;
    var useRequestAnimationFrame = null;

    var animationFrame = null;
    var interval = null;

    var NATURAL_FPS = Javatari.SCREEN_NATURAL_FPS;

    init();

};
