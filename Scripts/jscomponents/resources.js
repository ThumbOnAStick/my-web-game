export class Resources {
    constructor() {
        this.images = {};
        this.sounds = {};
    }

    loadAllImages(names, paths, onLoad) {
        let loadedCount = 0;
        const total = names.length;

        names.forEach((name, index) => {
            console.log(`Loading images: ${name} from ${paths[index]}`);
            this.loadImage(name, paths[index], () => {
                loadedCount++;
                if (loadedCount === total && onLoad) {
                    onLoad();
                }
            });
        });

    }

    loadAnimation(name, src, onLoad) 
    {
        fetch('data.csv')
            .then(response => response.text())
            .then(text => {
                const rows = text.split('\n');
                const data = rows.map(row => row.split(','));
                console.log(data);
            });
    }

    loadImage(name, src, onLoad) {
        const img = new Image();
        if (onLoad) img.onload = onLoad;
        img.src = src;
        this.images[name] = img;
    }

    drawImage(ctx, name, x, y, width, height) {
        const img = this.images[name];
        if (img) {
            ctx.drawImage(img, x, y, width, height);
        } else {
            console.warn(`Image ${name} not found`);
        }
    }

    getImage(name) {
        return this.images[name];
    }

    loadSound(name, src) {
        const audio = new Audio(src);
        this.sounds[name] = audio;
    }

    playSound(name) {
        if (this.sounds[name]) {
            this.sounds[name].play();
        }
    }
}

