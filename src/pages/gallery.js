import React from 'react'
import Layout from "../components/App/Layout"
import Navbar from "../components/App/Navbar"
import Footer from "../components/App/Footer"
import {Link} from 'gatsby'
import gallery1 from '../assets/images/gallery/gallery1.jpg'
import gallery2 from '../assets/images/gallery/gallery2.jpg'
import gallery3 from '../assets/images/gallery/gallery3.jpg'
import gallery4 from '../assets/images/gallery/gallery4.jpg'
import gallery5 from '../assets/images/gallery/gallery5.jpg'
import gallery6 from '../assets/images/gallery/gallery6.jpg'
import gallery7 from '../assets/images/gallery/gallery7.jpg'
import gallery8 from '../assets/images/gallery/gallery8.jpg'
import gallery9 from '../assets/images/gallery/gallery9.jpg'
import Lightbox from 'react-image-lightbox'

const images = [
    (gallery1),
    (gallery2),
    (gallery3),
    (gallery4),
    (gallery5),
    (gallery6),
    (gallery7),
    (gallery8),
    (gallery9),
];

const Gallery = () => {
    const [photoIndex, setPhotoIndex] = React.useState(0);
    const [isOpenImage, setIsOpenImage] = React.useState(false);

    return (
        <Layout>
            <Navbar />

            <div className="gallery-area pt-100 pb-70">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 col-md-6 col-sm-6">
                            <div className="single-gallery-item">
                                <Link 
                                    to="#"
                                    onClick={e => {
                                        e.preventDefault(); 
                                        setIsOpenImage(true); 
                                        setPhotoIndex(0);}
                                    }
                                >
                                    <img src={gallery1} alt="event" />
                                </Link>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-6 col-sm-6">
                            <div className="single-gallery-item">
                                <Link 
                                    to="#"
                                    onClick={e => {
                                        e.preventDefault(); 
                                        setIsOpenImage(true); 
                                        setPhotoIndex(1);}
                                    }
                                >
                                    <img src={gallery2} alt="event" />
                                </Link>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-6 col-sm-6">
                            <div className="single-gallery-item">
                                <Link 
                                    to="#"
                                    onClick={e => {
                                        e.preventDefault(); 
                                        setIsOpenImage(true); 
                                        setPhotoIndex(2);}
                                    }
                                >
                                    <img src={gallery3} alt="event" />
                                </Link>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-6 col-sm-6">
                            <div className="single-gallery-item">
                                <Link 
                                    to="#"
                                    onClick={e => {
                                        e.preventDefault(); 
                                        setIsOpenImage(true); 
                                        setPhotoIndex(3);}
                                    }
                                >
                                    <img src={gallery4} alt="event" />
                                </Link>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-6 col-sm-6">
                            <div className="single-gallery-item">
                                <Link 
                                    to="#"
                                    onClick={e => {
                                        e.preventDefault(); 
                                        setIsOpenImage(true); 
                                        setPhotoIndex(4);}
                                    }
                                >
                                    <img src={gallery5} alt="event" />
                                </Link>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-6 col-sm-6">
                            <div className="single-gallery-item">
                                <Link 
                                    to="#"
                                    onClick={e => {
                                        e.preventDefault(); 
                                        setIsOpenImage(true); 
                                        setPhotoIndex(5);}
                                    }
                                >
                                    <img src={gallery6} alt="event" />
                                </Link>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-6 col-sm-6">
                            <div className="single-gallery-item">
                                <Link 
                                    to="#"
                                    onClick={e => {
                                        e.preventDefault(); 
                                        setIsOpenImage(true); 
                                        setPhotoIndex(6);}
                                    }
                                >
                                    <img src={gallery7} alt="event" />
                                </Link>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-6 col-sm-6">
                            <div className="single-gallery-item">
                                <Link 
                                    to="#"
                                    onClick={e => {
                                        e.preventDefault(); 
                                        setIsOpenImage(true); 
                                        setPhotoIndex(7);}
                                    }
                                >
                                    <img src={gallery8} alt="event" />
                                </Link>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-6 col-sm-6">
                            <div className="single-gallery-item">
                                <Link 
                                    to="#"
                                    onClick={e => {
                                        e.preventDefault(); 
                                        setIsOpenImage(true); 
                                        setPhotoIndex(8);}
                                    }
                                >
                                    <img src={gallery9} alt="event" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lightbox */}
                {isOpenImage && (
                    <Lightbox
                        mainSrc={images[photoIndex]}
                        nextSrc={images[(photoIndex + 1) % images.length]}
                        prevSrc={images[(photoIndex + images.length - 1) % images.length]}
                        onCloseRequest={() => setIsOpenImage(false)}
                        onMovePrevRequest={() =>
                            setPhotoIndex((photoIndex + images.length - 1) % images.length)
                        }
                        onMoveNextRequest={() =>
                            setPhotoIndex((photoIndex + 1) % images.length)
                        }
                    />
                )}
            </div>
            
            <Footer />
        </Layout>
    );
}

export default Gallery