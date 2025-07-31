export class Resources {
    constructor() 
    {
        this.images = {};
        this.sounds = {};
    }

    loadAllImages(names, paths, callback) {
        let loadedCount = 0;
        const total = names.length;

        names.forEach((name, index) => 
        {
            console.log(`Loading images: ${name} from ${paths[index]}`);
            this.loadImage(name, paths[index], () => 
                {
                loadedCount++;
                if (loadedCount === total) 
                {
                    callback();
                }
            });
        });

    }

    loadAllSounds(names, paths, callback) 
    {
        let loadedCount = 0;
        const total = names.length;

        names.forEach((name, index) => {
            console.log(`Loading sounds: ${name} from ${paths[index]}`);
            this.loadSound(name, paths[index], () => {
                loadedCount++;
                console.log(`sound ${name} loadded!`);       
                if (loadedCount === total) 
                {
                    callback()
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

    getImage(name) 
    {
        return this.images[name];
    }    
    getSound(name) 
    {
        return this.sounds[name];
    }

   loadSound(name, src, onload) 
{
    const audio = new Audio();
    
    // Use canplaythrough for audio loading
    if(onload) 
    {
        audio.addEventListener('canplaythrough', onload, { once: true });
    }
    
    // Add error handling
    audio.addEventListener
    ('error', (e) => {
        console.error(`Failed to load audio: ${name}`, e);
    });
    
    audio.src = src;
    audio.preload = 'auto';  // Ensure audio preloads
    this.sounds[name] = audio;
}

    playSound(name) {
        if (this.sounds[name]) {
            this.sounds[name].play();
        }
    }
}

