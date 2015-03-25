var interface, Ports, mx, my;

window.onload = function () {
    interface = new Interface();
    window.onresize = function () {
        interface.update();
        interface.draw();
    };
}

/*
    Interface
    Manages the whole Interface (Layout)
*/
function Interface() {
    debug = new debugInterface();
    debug.success("Interface created");
    this.qML = 0.75;
    this.menu = document.getElementById("menu");
    this.main = document.getElementById("main");
    this.log = document.getElementById("log");
    this.canvas = document.getElementById("main");
    this.ctx = this.canvas.getContext("2d");
    this.interfacedrawer = new InterfaceDrawer(this);

    this.update = function (e) {
        this.width = window.innerWidth;
        this.height = window.innerHeight - 48;
        this.main.height = this.height * this.qML;
        this.main.width = this.width;
        this.log.style.top = (this.height * this.qML + 48) + "px";
        this.log.style.height = ((1 - this.qML) * this.height) + "px";
        this.interfacedrawer.update();
    }

    this.draw = function () {
        this.interfacedrawer.draw();
    }

    this.main.onmousemove = function (evt) {
        evt = (evt) ? evt : ((window.event) ? window.event : "");
        interface.interfacedrawer.mousemove(evt.clientX, evt.clientY);
        interface.interfacedrawer.update();
        interface.interfacedrawer.draw();
    }

    this.main.onmousedown = function (evt) {
        interface.interfacedrawer.mousedown();
        interface.interfacedrawer.update();
        interface.interfacedrawer.draw();
    }

    this.main.onmouseup = function (evt) {
        interface.interfacedrawer.mouseup();
        interface.interfacedrawer.update();
        interface.interfacedrawer.draw();
    }

    this.main.onmouseout = function (evt) {
        interface.interfacedrawer.mouseup();
        interface.interfacedrawer.update();
        interface.interfacedrawer.draw();
    }

    this.update();
    this.draw();
}

/*
    InterfaceDrawer
    Helps refreshing the Interface and implements interactivity
*/
function InterfaceDrawer(parentInterface) {
    this.mX = 0;
    this.mY = 0;
    this.mouseDown = false;
    this.objects = [];
    this.cables = [];
    this.ctx = parentInterface.ctx;
    this.objects.push(new SampleBlock());


    this.update = function () {
        for (var i = 0; i < this.cables.length; i++) {
            this.cables[i].update();
        }
        for (var i = 0; i < this.objects.length; i++) {
            this.objects[i].update();
        }
    }
    this.draw = function () {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        for (var i = 0; i < this.cables.length; i++) {
            this.cables[i].draw(this.ctx);
        }
        for (var i = 0; i < this.objects.length; i++) {
            this.objects[i].draw(this.ctx);
        }
    }
    this.mousemove = function (x, y) {
        this.mX = x;
        this.mY = y - 48;
        for (var i = 0; i < this.objects.length; i++) {
            this.objects[i].mousemove(this.mX, this.mY);
        }
    }
    this.mousedown = function () {
        this.mouseDown = true;
        for (var i = 0; i < this.objects.length; i++) {
            this.objects[i].mousedown();
        }
    }
    this.mouseup  = function () {
        this.mouseDown = false;
        for (var i = 0; i < this.objects.length; i++) {
            this.objects[i].mouseup();
        }
    }
}
/*
    Enum
    Helperclass for Enums
*/
function Enum() {
    for (var i = 0; i < arguments.length; ++i) {
        this[arguments[i]] = i;
    }
    return this;
}

/*
    Ports
    Defines available Port-Types
*/
Ports = new Enum("boolean", "number", "string");

/*
    Port
    A Port (Input/Output) connects an object to others
*/
function Port(type, name, description) {
    this.type = type;
    this.name = name;
    this.description = description;
    this.x = 0;
    this.y = 0;
    this.radius = 5;
    this.hovered = false;
    this.lineWidth = 2;

    this.isCompatable = function (cable) {
        if (cable.type == this.type) {
            return true;
        } else {
            return false;
        }
    }

    this.draw = function (ctx, x, y) {
        this.x = x;
        this.y = y;
        switch (this.type) {
        case Ports.number:
            if (this.hovered == true) {
                ctx.fillStyle = "rgba(100,110,250,1)";
            } else {
                ctx.fillStyle = "rgba(50,60,200,1)";
            }
            break;
        case Ports.boolean:
            if (this.hovered == true) {
                ctx.fillStyle = "rgba(250,110,100,1)";
            } else {
                ctx.fillStyle = "rgba(200,60,50,1)";
            }
            break;
        case Ports.string:
            if (this.hovered == true) {
                ctx.fillStyle = "rgba(250,110,100,1)";
            } else {
                ctx.fillStyle = "rgba(200,60,50,1)";
            }
            break;
        }
        ctx.strokeStyle = "rgba(255,255,255,1)";
        ctx.lineWidth = this.lineWidth;
        ctx.beginPath();
        ctx.arc(x, y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }

    this.hittest = function (x, y) {
        if ((Math.pow((this.x - x), 2) + Math.pow((this.y - y), 2)) <= Math.pow(this.radius, 2)) {
            this.hovered = true;
            return true;
        } else {
            this.hovered = false;
            return false;
        }
    }
}

/*
    DrawableObject
    A prototype for drawable objects (vars, operators etc.)
*/
function DrawableObject() {
    this.x = 20;
    this.y = 20;
    this.width = 100;
    this.height = 50;
    this.background = "rgba(255,255,255,0.3)";
    this.border = "rgba(255,255,255,1)";
    this.fontcolor = "rgba(255,255,255,1)";
    this.backgroundHovered = "rgba(255,255,255,0.5)";
    this.lineWidth = 2;
    this.inputs = [];
    this.outputs = [];
    this.inputs.push(new Port(Ports.number, "number 1", "The first number"));
    this.outputs.push(new Port(Ports.boolean, "number 2", "The second number"));
    this.outputs.push(new Port(Ports.boolean, "number 2", "The second number"));
    this.hovered = false;
    this.name = "DrawableObject";
    this.font = "12px Inconsolata";
    this.mouseisdown = false;
    this.gX = null;
    this.gY = null;
    this.mX;
    this.mY;

    this.update = function () {
        return;
    }

    this.predraw = function (ctx) {
        if (this.hovered == true) {
            ctx.fillStyle = this.backgroundHovered;
        } else {
            ctx.fillStyle = this.background;
        }
        ctx.strokeStyle = this.border;
        ctx.lineWidth = this.lineWidth;
    }

    this.draw = function (ctx) {
        this.predraw(ctx);
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        var inputSpacing = this.height / this.inputs.length;
        var inputPosition = this.y + inputSpacing / 2;
        for (var i = 0; i < this.inputs.length; i++) {
            this.inputs[i].draw(ctx, this.x, inputPosition);
            inputPosition = inputPosition + inputSpacing;
        }
        var outputSpacing = this.height / this.outputs.length;
        var outputPosition = this.y + outputSpacing / 2;
        for (var i = 0; i < this.outputs.length; i++) {
            this.outputs[i].draw(ctx, this.x + this.width, outputPosition);
            outputPosition = outputPosition + outputSpacing;
        }
        ctx.fillStyle = this.fontcolor;
        ctx.font = this.font;
        var w = ctx.measureText(this.name).width;
        var h = 12;
        ctx.fillText(this.name, this.x + this.width / 2 - w / 2, this.y + this.height - 1.75 * h);
    }

    this.hittest = function (x, y) {
        if ((x > this.x && x < this.x + this.width) && (y > this.y && y < this.y + this.height)) {
            this.hovered = true;
        } else {
            this.hovered = false;
        }
        for (var i = 0; i < this.inputs.length; i++) {
            if (this.inputs[i].hittest(x, y)) {
                this.hovered = false;
            }
        }
        for (var i = 0; i < this.outputs.length; i++) {
            if (this.outputs[i].hittest(x, y)) {
                this.hovered = false;
            }
        }
    }

    this.mousemove = function (x,y) {
        this.mX = x;
        this.mY = y;
        this.hittest(x,y);
        if(this.mouseisdown == true) {
            this.x = x-this.gX;
            this.y = y-this.gY;
        }
    }

    this.mousedown = function () {
        if (this.hovered) {
            this.mouseisdown = true;
            if(this.gX == null) {
                this.gX = this.mX-this.x;
                this.gY = this.mY-this.y;
            }
        }
    }
    
    this.mouseup = function () {
        this.mouseisdown = false;
        this.gX = null;
        this.gY = null;
    }
}

// Defines a SampleBlock by inheriting Attributes and Methodes from the DrawableObject class
function SampleBlock() {}
SampleBlock.prototype = new DrawableObject();
SampleBlock.prototype.name = "SampleBlock";

function debugInterface() {
    this.log = document.getElementById("log");
    this.text = function (text) {
        var message = document.createElement('div');
        message.className = "log entry";
        message.innerHTML = text;
        this.log.appendChild(message);
    }
    this.success = function (text) {
        var message = document.createElement('div');
        message.className = "log entry success";
        message.innerHTML = text;
        this.log.appendChild(message);
    }
    this.warning = function (text) {
        var message = document.createElement('div');
        message.className = "log entry warning";
        message.innerHTML = text;
        this.log.appendChild(message);
    }
    this.error = function (text) {
        var message = document.createElement('div');
        message.className = "log entry error";
        message.innerHTML = text;
        this.log.appendChild(message);
    }
}