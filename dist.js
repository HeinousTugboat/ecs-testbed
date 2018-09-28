var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("ecs", ["require", "exports", "rxjs", "rxjs/operators"], function (require, exports, rxjs_1, operators_1) {
    "use strict";
    exports.__esModule = true;
    var Entity = /** @class */ (function () {
        function Entity(name) {
            this.name = name;
            this.id = Entity.nextId++;
            this.components = new Map();
            Entity.added$.next(this);
            Entity.map.set(this.id, this);
        }
        Entity.prototype.get = function (component) {
            return this.components.get(component.name);
        };
        Entity.prototype.add = function (component) {
            var inst = new component(this.id);
            this.components.set(component.name, inst);
            Component.added$.next(inst);
            return inst;
        };
        Entity.prototype.remove = function (component) {
            var inst = this.components.get(component.name);
            if (inst !== undefined) {
                this.components["delete"](component.name);
                Component.removed$.next(inst);
            }
            return inst;
        };
        Entity.nextId = 1;
        Entity.added$ = new rxjs_1.Subject();
        Entity.map = new Map();
        return Entity;
    }());
    exports.Entity = Entity;
    var Component = /** @class */ (function () {
        function Component(entity) {
            this.entity = entity;
        }
        Component.added$ = new rxjs_1.Subject();
        Component.removed$ = new rxjs_1.Subject();
        return Component;
    }());
    exports.Component = Component;
    var System = /** @class */ (function () {
        function System(label, components) {
            var _this = this;
            this.label = label;
            this.components = components;
            this.entities = new Set();
            System.list.add(this);
            Component.added$.pipe(operators_1.filter(function (x) { return components.some(function (y) { return x instanceof y; }); }), operators_1.filter(function (x) {
                var e = Entity.map.get(x.entity);
                if (e === undefined) {
                    return false;
                }
                var cs = e.components.keys().slice();
                return components.map(function (c) { return c.name; }).every(function (c) { return cs.includes(c); });
            })).subscribe(function (x) { return _this.entities.add(x.entity); });
            Component.removed$.pipe(operators_1.filter(function (x) { return components.some(function (y) { return x instanceof y; }); })).subscribe(function (x) { return _this.entities["delete"](x.entity); });
        }
        System.tick = function (dT) {
            System.list.forEach(function (system) { return system.tick(dT); });
            System.frame++;
        };
        System.prototype.tick = function (dT) {
            var _this = this;
            this.entities.forEach(function (id) {
                var e = Entity.map.get(id);
                if (e === undefined) {
                    return;
                }
                _this.update(e, dT);
            });
        };
        System.prototype.update = function (e, dT) {
            console.log("[" + System.frame.toString(10).padStart(2) + "] " + this.label + ": " + e.name + " ", dT);
        };
        System.list = new Set();
        System.frame = 1;
        return System;
    }());
    exports.System = System;
});
// const fn = function(this: System, e: Entity, str: string = '') {
//    console.log(`[${System.frame.toString(10).padStart(2)}] ${this.label}: ${e.name} `, str);
// };
// const pSystem = new System([PositionComponent], 'position', function(this: System, e: Entity, dT: number) {
//   // fn.bind(this)(e);
// });
// const pvSystem = new System([PositionComponent, VelocityComponent], 'movement', function(this: System, e: Entity, dT: number) {
//   const pos = e.get(PositionComponent)!;
//   const v = e.get(VelocityComponent)!;
//   pos.x += v.x * dT / 1000;
//   pos.y += v.y * dT / 1000;
//   // fn.bind(this)(e, `${pos.x}, ${pos.y}`);
// });
// // const sSystem = new System([VelocityComponent], 'speed', fn);
// // const cSystem = new System([ColorComponent], 'color', fn);
// // Component.added$.subscribe(x => console.log('Component!', x));
// const ent = new Entity('Joe');
// System.tick(1);
// ent.add(VelocityComponent);
// System.tick(2);
// ent.add(PositionComponent);
// System.tick(3);
// ent.add(ColorComponent);
// System.tick(4);
// // console.log('    ~~ Added ~~');
// System.tick(5);
// ent.remove(PositionComponent);
// System.tick(6);
// ent.remove(ColorComponent);
// System.tick(7);
// ent.add(PositionComponent);
// System.tick(8);
// for (let i = 1; i < 50_000; ++i) {
//   const e = new Entity(`Drone-${i.toString(10).padStart(3, '0')}`);
//   e.add(PositionComponent);
//   const vel = e.add(VelocityComponent);
//   vel.x = 100;
// }
// let now = performance.now();
// let then = now - 15;
// console.log(now);
// const times: number[] = [];
// for (let i = 0; i < 1000; ++i) {
//   then = now;
//   now = performance.now();
//   console.log(now - then);
//   System.tick(now - then);
//   times.push(now - then);
// }
// const total = times.reduce((t, n) => t + n, 0);
// console.log(total);
// console.log(total / times.length);
define("utils", ["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    function invalid(o) {
        return o === undefined || o === null;
    }
    exports.invalid = invalid;
    function ready(cb) {
        if (document.readyState !== 'loading') {
            cb();
        }
        else {
            document.addEventListener('DOMContentLoaded', cb);
        }
    }
    exports.ready = ready;
    var Vector = /** @class */ (function () {
        function Vector(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.x = x;
            this.y = y;
        }
        return Vector;
    }());
    exports.Vector = Vector;
});
define("components/render", ["require", "exports", "ecs", "utils"], function (require, exports, ecs_1, utils_1) {
    "use strict";
    exports.__esModule = true;
    var RenderComponent = /** @class */ (function (_super) {
        __extends(RenderComponent, _super);
        function RenderComponent() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.visible = true;
            _this.width = 10;
            _this.height = 10;
            return _this;
        }
        return RenderComponent;
    }(ecs_1.Component));
    exports.RenderComponent = RenderComponent;
    var RenderSystem = /** @class */ (function (_super) {
        __extends(RenderSystem, _super);
        function RenderSystem(ctx) {
            var _this = _super.call(this, 'render', [RenderComponent]) || this;
            _this.ctx = ctx;
            return _this;
        }
        RenderSystem.prototype.update = function (entity) {
            var render = entity.get(RenderComponent);
            if (utils_1.invalid(render) || !render.visible) {
                return;
            }
            var p = render.position, w = render.width, h = render.height;
            this.ctx.fillRect(p.x - w / 2, p.y - w / 2, w, h);
        };
        return RenderSystem;
    }(ecs_1.System));
    exports.RenderSystem = RenderSystem;
});
define("index", ["require", "exports", "components/render", "utils"], function (require, exports, render_1, utils_2) {
    "use strict";
    exports.__esModule = true;
    utils_2.ready(function () {
        console.log('Test');
        console.log(render_1.RenderSystem);
    });
});
