gsap.registerPlugin(MotionPathPlugin, ScrollTrigger);

function MapAlmond() {
  this.svg = document.querySelector(".map-almond");
  this.lines = this.svg.querySelectorAll("path");
  this.points = [];
  this.timelines = [];
}

MapAlmond.prototype.setStyles = function () {
  gsap.set(this.lines, {
    attr: {
      "stroke-dashoffset": (i) => this.lines[i].getTotalLength(),
      "stroke-dasharray": (i) => this.lines[i].getTotalLength(),
    },
  });
};

MapAlmond.prototype.animateLines = function () {
  this.lines.forEach((line, i) => {
    const tl = gsap.timeline({
      pause: true,
      repeat: -1,
      delay: i,
      repeatDelay: i + 3,
    });

    // tl.pause();

    tl
    .to(line, {
      duration: 1.8,
      attr: { "stroke-dashoffset": 0 },
      onStart: () => gsap.to(this.points[i].start, {autoAlpha: 1}),
      onComplete: () => gsap.to(this.points[i].start, {autoAlpha: 0})
    }, 0)
    .to(line,{
        duration: 1.7,
        attr: { "stroke-dashoffset": () => -1 * line.getTotalLength() },
        onStart: () => gsap.to(this.points[i].end, {autoAlpha: 1}),
        onComplete: () => gsap.to(this.points[i].end, {autoAlpha: 0})
    },"<85%")

    this.timelines.push(tl);
  });
};

MapAlmond.prototype.createPoints = function () {
  this.lines.forEach(() => {
    const startPoint = document.createElement("span");
    const endPoint = document.createElement("span");

    startPoint.classList.add("point-map");
    endPoint.classList.add("point-map");

    document.body.appendChild(startPoint);
    document.body.appendChild(endPoint);

    this.points.push({
      start: startPoint,
      end: endPoint
    });
  });
};

MapAlmond.prototype.setPointsPosition = function () {

  this.lines.forEach((line, i) => {
    gsap.to(this.points[i].start, {
      motionPath: {
        path: line,
        align: line,
        alignOrigin: [0.5, 0.5],
        autoRotate: true,
        start: 1,
        end: 0,
      },
      duration: 0,
    });

    gsap.to(this.points[i].end, {
      motionPath: {
        path: line,
        align: line,
        alignOrigin: [0.5, 0.5],
        autoRotate: true,
        start: 0,
        end: 1,
      },
      duration: 0,
    });
  });

};

MapAlmond.prototype.resize = function() {
  let ww = window.innerWidth;

  window.addEventListener("resize", () => {
    if(ww !== window.innerWidth) {
      ww = window.innerWidth;
      this.setPointsPosition();
    }
  });
}

MapAlmond.prototype.init = function () {
  this.setStyles();
  this.createPoints();
  this.setPointsPosition();
  this.animateLines();
  this.resize();
};

const map = new MapAlmond();
map.init();

// ScrollTrigger
// const section = document.querySelector(".section-map");

// ScrollTrigger.create({
//   trigger: section,
//   // markers: true,
//   start: "top bottom",
//   end: "bottom top",
//   onEnter: () => map.timelines.forEach((tl) => tl.play()),
//   onEnterBack: () => map.timelines.forEach((tl) => tl.play()),
//   onLeave: () => map.timelines.forEach((tl) => tl.pause()),
//   onLeaveBack: () => map.timelines.forEach((tl) => tl.pause()),
// });