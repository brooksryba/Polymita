import { useState } from 'react';
import { Gallery, Image } from "react-grid-gallery";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";


export interface CustomImage extends Image {
  original: string;
}

function Painting() {
    const [index, setIndex] = useState(-1);
    const handleClick = (index: number) => setIndex(index);

    const photos = require.context('images/painting', false, /\.(webp)$/);
    const photoset: CustomImage[] = photos.keys().slice(photos.keys().length/2).reverse().map(function(x) {
        return {src: photos(x), original: photos(x), width: (x.indexOf("_.webp")>0 ? 4000 : 6000), height: (x.indexOf("_.webp")>0 ? 6000 : 4000)}
    });

    const slides = photoset.map(({ original, width, height }) => ({
        src: original,
        width,
        height,
    }));

    return (
        <div className="Painting">
            <Gallery
                images={photoset}
                onClick={handleClick}
                enableImageSelection={false}
            />
            <Lightbox
                slides={slides}
                open={index >= 0}
                index={index}
                close={() => setIndex(-1)}
            />
        </div>
    )
}

export default Painting;