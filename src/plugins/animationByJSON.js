class AnimationsLoader {
    constructor(scene) {
        this.scene = scene;


    }

    create(json){
        // Load defaults from first entry
        let defaults = json[0];
        //
        json.forEach(
            (entry) => {
                let config = {};
                if(entry.atlas){
                    config = createAtlas(entry);
                }
                else if (entry.sheet){
                    config = createSheet(entry);
                }
                else {
                    console.error("Couldn't understand animation entry", entry)
                }



            }
        )

    }
    
    createAtlas(json){


    }

    createSheet(json){



    }




}