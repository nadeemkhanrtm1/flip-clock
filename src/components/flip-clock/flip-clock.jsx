import { useEffect, useRef } from 'react';
import './flip-clock.css'; // Make sure to include the CSS file

const FlipClock = ({ countdownDate }) => {
  const clockRef = useRef(null);

  useEffect(() => {
    function CountdownTracker(label, value) {
      const el = document.createElement('span');

      el.className = 'flip-clock__piece';
      el.innerHTML = `
        <b class="flip-clock__card card">
          <b class="card__top"></b>
          <b class="card__bottom"></b>
          <b class="card__back">
            <b class="card__bottom"></b>
          </b>
        </b>
        <span class="flip-clock__slot">${label}</span>
      `;

      this.el = el;

      const top = el.querySelector('.card__top');
      const bottom = el.querySelector('.card__bottom');
      const back = el.querySelector('.card__back');
      const backBottom = el.querySelector('.card__back .card__bottom');

      this.update = (val) => {
        val = ('0' + val).slice(-2);
        if (val !== this.currentValue) {
          if (this.currentValue >= 0) {
            back.setAttribute('data-value', this.currentValue);
            bottom.setAttribute('data-value', this.currentValue);
          }
          this.currentValue = val;
          top.innerText = this.currentValue;
          backBottom.setAttribute('data-value', this.currentValue);

          this.el.classList.remove('flip');
          void this.el.offsetWidth;
          this.el.classList.add('flip');
        }
      };

      this.update(value);
    }

    function getTimeRemaining(endtime) {
      const t = Date.parse(endtime) - Date.parse(new Date());
      return {
        Total: t,
        Days: Math.floor(t / (1000 * 60 * 60 * 24)),
        Hours: Math.floor((t / (1000 * 60 * 60)) % 24),
        Minutes: Math.floor((t / 1000 / 60) % 60),
        Seconds: Math.floor((t / 1000) % 60),
      };
    }

    function getTime() {
      const t = new Date();
      return {
        Total: t,
        Hours: t.getHours() % 12,
        Minutes: t.getMinutes(),
        Seconds: t.getSeconds(),
      };
    }

    function Clock(countdown, callback) {
      countdown = countdown ? new Date(Date.parse(countdown)) : false;
      callback = callback || function () {};

      const updateFn = countdown ? getTimeRemaining : getTime;

      this.el = document.createElement('div');
      this.el.className = 'flip-clock';

      const trackers = {};
      const t = updateFn(countdown);
      let key,
        timeinterval,
        i = 0;

      for (key in t) {
        if (key === 'Total') continue;
        trackers[key] = new CountdownTracker(key, t[key]);
        this.el.appendChild(trackers[key].el);
      }

      function updateClock() {
        timeinterval = requestAnimationFrame(updateClock);

        if (i++ % 10) return;

        const t = updateFn(countdown);
        if (t.Total < 0) {
          cancelAnimationFrame(timeinterval);
          for (key in trackers) {
            trackers[key].update(0);
          }
          callback();
          return;
        }

        for (key in trackers) {
          trackers[key].update(t[key]);
        }
      }

      setTimeout(updateClock, 500);
    }

    const deadline = countdownDate || new Date(Date.parse(new Date()) + 12 * 24 * 60 * 60 * 1000);
    const c = new Clock(deadline, () => alert('Countdown complete'));
    if (clockRef.current) {
      clockRef.current.appendChild(c.el);
    }

    return () => {
      if (clockRef.current) {
        clockRef.current.innerHTML = '';
      }
    };
  }, [countdownDate]);

  return <div ref={clockRef} />;
};

export default FlipClock;
