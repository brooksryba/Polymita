import { useState } from 'react';
import { Gallery, Image } from "react-grid-gallery";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import Header from 'components/Header'
import Footer from 'components/Footer'
import 'App.scss';


export interface CustomImage extends Image {
  original: string;
}

function GalleryPage() {
    const [index, setIndex] = useState(-1);
    const handleClick = (index: number) => setIndex(index);

    const data = require.context('images/', false, /\.(jpg|png|jpeg)$/);
    const images: CustomImage[] = data.keys().slice(data.keys().length/2).reverse().map(function(x) {
        return {src: data(x), original: data(x), width: 600, height: 400}
    });

    const slides = images.map(({ original, width, height }) => ({
        src: original,
        width,
        height,
    }));

    return (
        <div className="Gallery">
            <Header/>
            <Gallery
                images={images}
                onClick={handleClick}
                enableImageSelection={false}
            />
            <Lightbox
                slides={slides}
                open={index >= 0}
                index={index}
                close={() => setIndex(-1)}
            />
            <Footer/>
        </div>
    )
}

export default GalleryPage;