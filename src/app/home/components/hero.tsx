import Link from 'next/link'
import HeroImage from './banner.jpg'

import './hero.css';

const TopPolygon = () => {
    return (
        <div className='w-full absolute top-0 bottom-auto left-0 right-0'>
            <svg
                xmlns='http://www.w3.org/2000/svg'
                preserveAspectRatio='none'
                version='1.1'
                viewBox='0 0 2560 450'
                x='0'
                y='0'
            >
                <polygon
                    className='text-blueGray-200 fill-current'
                    points='0,0 2560,0 2560,0 0,1000'
                ></polygon>
            </svg>
        </div>
    )
}

const BottomPolygon = () => {
    return (
        <div
            className='w-full absolute top-auto bottom-0 left-0 right-0 z-10'
        >
            <svg
                xmlns='http://www.w3.org/2000/svg'
                preserveAspectRatio='none'
                version='1.1'
                viewBox='0 0 2560 100'
                x='0'
                y='0'
            >
                <polygon
                    className='text-blueGray-200 fill-current'
                    points='2560 0 2560 100 0 100'
                ></polygon>
            </svg>
        </div>
    )
}

export default function Hero() {
    return (
        <div className='relative bg-slate-100'>
            <div className='w-full px-0 mx-auto z-100'>
                <div className='text-black text-center rounded-xl'>
                    <div
                        className='w-full h-32 bg-center bg-no-repeat bg-cover rounded-t-sm'
                        style={{
                            backgroundImage: `url(${HeroImage.src})`
                        }}
                    >
                    </div>
                    <div className="flex items-center justify-center space-x-4 px-8 py-4 text-center">
                        <h1 className='font-sans font-bold tracking-tighter text-2xl slogan'>
                            HeartStone <span className='text-green-400'>Top </span>
                            <span className='text-sky-400'>Decks </span>
                        </h1>
                        <p className='text-2xl text-black font-medium opacity-100'>
                            炉石最新卡组
                        </p>
                        <Link
                            href="/explore"
                            className="bg-green-400 text-2xl text-white font-mono font-bold px-4 py-2 rounded-sm">
                            Explore
                        </Link>
                    </div>
                </div>
            </div>
        </div >
    )
}
