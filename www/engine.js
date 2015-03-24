var interface, Ports, mx, my;

window.onload = function () {
    interface = new Interface();
    window.onresize = function () {
        interface.update();
        interface.draw();
    };
}

function Interface() {
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
        this.log.style.top = (this.height * this.qML + 48)+"px";
        this.log.style.height = ((1 - this.qML) * this.height)+"px";
        this.interfacedrawer.update();
    }

    this.draw = function () {
        this.interfacedrawer.draw();
    }

    this.update();
    this.draw();
}

function InterfaceDrawer(parentInterface) {
    this.objects = [];
    this.cables = [];
    this.ctx = parentInterface.ctx;

    this.objects.push(new DrawableObject());

    this.update = function () {
        for (var i = 0; i < this.cables.length; i++) {
            this.cables[i].update();
        }
        for (var i = 0; i < this.objects.length; i++) {
            this.objects[i].update();
        }
    }
    this.draw = function () {
        for (var i = 0; i < this.cables.length; i++) {
            this.cables[i].draw(this.ctx);
        }
        for (var i = 0; i < this.objects.length; i++) {
            this.objects[i].draw(this.ctx);
        }
    }
}

function Enum() {
    for (var i = 0; i < arguments.length; ++i) {
        this[arguments[i]] = i;
    }
    return this;
}

Ports = new Enum("boolean", "number", "string");

function Port(type, name, description) {
    this.type = type;
    this.name = name;
    this.description = description;

    this.isCompatable = function (cable) {
        if (cable.type == this.type) {
            return true;
        } else {
            return false;
        }
    }

    this.draw = function (ctx, x, y) {
        switch (this.type) {
            case Ports.number:
                ctx.fillStyle = "rgba(50,60,200,1)";
                break;
            case Ports.boolean:
                ctx.fillStyle = "rgba(200,60,50,1)";
                break;
            case Ports.string:
                ctx.fillStyle = "rgba(60,200,50,1)";
                break;
        }
        this.border = "rgba(255,255,255,1)";
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }
}

function DrawableObject() {
    this.x = 20;
    this.y = 20;
    this.width = 100;
    this.height = 50;
    this.background = "rgba(255,255,255,0.3)";
    this.border = "rgba(255,255,255,1)";
    this.lineWidth = 2;
    this.inputs = [];
    this.outputs = [];
    this.inputs.push(new Port(Ports.number, "number 1", "The first number"));
    this.outputs.push(new Port(Ports.boolean, "number 2", "The second number"));
    this.outputs.push(new Port(Ports.boolean, "number 2", "The second number"));

    this.update = function () {

    }

    this.predraw = function (ctx) {
        ctx.fillStyle = this.background;
        ctx.strokeStyle = this.border;
        ctx.lineWidth = this.lineWidth;
    }

    this.draw = function (ctx) {
        this.predraw(ctx);
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        var inputSpacing = this.height/this.inputs.length;
        var inputPosition = this.y+inputSpacing/2;
        for (var i = 0; i < this.inputs.length; i++) {
            this.inputs[i].draw(ctx,this.x,inputPosition);
            inputPosition = inputPosition + inputSpacing;
        }
        var outputSpacing = this.height/this.outputs.length;
        var outputPosition = this.y+outputSpacing/2;
        for (var i = 0; i < this.outputs.length; i++) {
            this.outputs[i].draw(ctx,this.x+this.width,outputPosition);
            outputPosition = outputPosition + outputSpacing;
        }
    }
}