'use strict';

(() => {
  
  // 時計なのでclockクラス
  class ClockDrawer {
    constructor(canvas) {
      this.ctx = canvas.getContext('2d');
      this.width = canvas.width;
      this.height = canvas.height;
    }

    draw(angle, func) {
      this.ctx.save();

      this.ctx.translate(this.width / 2, this.height / 2);
      this.ctx.rotate(Math.PI / 180 * angle);

      this.ctx.beginPath();
      func(this.ctx);
      this.ctx.stroke();

      this.ctx.restore();
    }

    // 前の描画残らないように全ての描画をリセットする設定
    clear() {
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
  }
// 時計の半径が１００
  class Clock {
    constructor(drawer) {
      this.r = 100;
      this.drawer = drawer;
    }
// for ループを使って 0 度から 360 度まで、60 個の目盛り（秒の目盛）を描きたいので、6 度ずつ回転しながら描画していく
// angle が 0 度から 360 度まで 6 度ずつ増やす
    drawFace() {
      for (let angle = 0; angle < 360; angle += 6) {
        this.drawer.draw(angle, ctx => {

        // 角度でいうと 30 度毎なので、 angle を 30 で割った余りが 0 の時に、太い目盛りにする
          // 短針がさす時間の目盛
          ctx.moveTo(0, -this.r);
          if (angle % 30 === 0) {
            ctx.lineWidth = 2;
            ctx.lineTo(0, -this.r + 10);
            ctx.font = '13px Arial';
            ctx.textAlign = 'center';
            
          } else {
            ctx.lineTo(0, -this.r + 5);
          }
          ctx.moveTo(0, -this.r);
          if (angle % 90 === 0) {
            ctx.lineWidth = 4;
            ctx.lineTo(0, -this.r + 20);}
        });
      }
    }
    
    drawHands() {
      // 短針の描画
      // 60 分かけて 30 度移動するので、 1 分で表現すると30 割る 60 で 0.5 になるので、分に 0.5 をかける
      this.drawer.draw(this.h * 30 + this.m * 0.5, ctx => {
        ctx.lineWidth = 6;
        ctx.moveTo(0, 10);
        ctx.lineTo(0, -this.r + 50);
      });

      // 長針の描画
      // 角度は分に 6 度をかける
      this.drawer.draw(this.m * 6, ctx => {
        ctx.lineWidth = 4;
        ctx.moveTo(0, 10);
        ctx.lineTo(0, -this.r + 30);
      });

      // 秒針の描画
      // 角度は秒に 6 度をかける
      this.drawer.draw(this.s * 6, ctx => {
        ctx.strokeStyle = 'red';
        ctx.moveTo(0, 20);
        ctx.lineTo(0, -this.r + 20);
      });
    }
// 今の時刻の取得
    update() {
      this.h = (new Date()).getHours();
      this.m = (new Date()).getMinutes();
      this.s = (new Date()).getSeconds();
    }

    // リアルタイムで動くように設定
    run() {
      this.update();

      this.drawer.clear();
      this.drawFace();
      this.drawHands();

      setTimeout(() => {
        this.run();
      }, 100);
    }
  }
  
  const canvas = document.querySelector('canvas');
  if (typeof canvas.getContext === 'undefined') {
    return;
  }

  const clock = new Clock(new ClockDrawer(canvas));
  clock.run();
})();