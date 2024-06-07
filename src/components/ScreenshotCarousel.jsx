import { useState } from "react"
import {BsArrowLeftCircleFill, BsArrowRightCircleFill} from "react-icons/bs"

function ScreenshotCarousel({ screenshots }) {
    const [currentScreenshot, setCurrentScreenshot] = useState(0)

    // Common styles for indicators
    const commonStyles = "w-4 h-4 md:w-2 md:h-2 rounded-full border-none cursor-pointer";

    const nextScreenshot = () => {
        if (currentScreenshot === screenshots.length - 1) {
            // Show first screenshot
            setCurrentScreenshot(0);
        } else {
            setCurrentScreenshot(currentScreenshot + 1);
        }
    }

    const prevScreenshot = () => {
        if (currentScreenshot === 0) {
            // Show last screenshot
            setCurrentScreenshot(screenshots.length - 1);
        } else {
            setCurrentScreenshot(currentScreenshot - 1);
        }
    }

    return (
        <div className="flex flex-col items-center gap-4 mb-4">
            <div className="relative flex gap-4 justify-center items-center max-h-96">
                {/* Left Arrow */}
                <BsArrowLeftCircleFill className="w-16 h-16 md:w-12 md:h-12 left-4 hover:cursor-pointer filter" onClick={prevScreenshot} />

                {/* Screenshot*/}
                {screenshots.map((item, index) => {
                    return <img key = {item.image_id} src={`https://images.igdb.com/igdb/image/upload/t_original/${item.image_id}.webp`} className={currentScreenshot=== index ? "w-4/5 max-h-96 rounded-lg shadow" : "hidden"}></img>
                })}
                {/* Right Arrow */}
                <BsArrowRightCircleFill className="w-16 h-16 md:w-12 md:h-12 right-4 hover:cursor-pointer filter" onClick={nextScreenshot} />
            </div>
            {/* Indicators */}
            <span className="flex gap-1">
                {screenshots.map((_, index) => {
                    return <button className={`${commonStyles} ${currentScreenshot === index ? "bg-grey" : "bg-black"}`} key={index} onClick={() => setCurrentScreenshot(index)}></button>
                })}
            </span>
        </div>
    )
}

export default ScreenshotCarousel;