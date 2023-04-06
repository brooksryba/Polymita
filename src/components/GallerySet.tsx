import { useState } from 'react';
import { Gallery, Image } from "react-grid-gallery";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";


interface CustomImage extends Image {
    original: string;
}

interface GalleryParams {
    source: __WebpackModuleApi.RequireContext;
}

function GallerySet(props: GalleryParams) {
    const [index, setIndex] = useState(-1);
    const handleClick = (index: number) => setIndex(index);

    const photoset: CustomImage[] = props.source.keys()
        .slice(props.source.keys().length / 2)
        .reverse()
        .map(function (x) {
            return {
                src: props.source(x),
                original: props.source(x),
                width: (x.indexOf("_.webp") > 0 ? 4000 : 6000),
                height: (x.indexOf("_.webp") > 0 ? 6000 : 4000)
            }
        });

    const slides = photoset.map(({ original, width, height }) => ({
        src: original,
        width,
        height,
    }));

    return (
        <section className="GallerySet">
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
        </section>
    )
}

export default GallerySet;