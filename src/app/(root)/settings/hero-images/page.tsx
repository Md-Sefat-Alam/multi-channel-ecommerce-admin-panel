import AddHeroImage from "../lib/components/HeroImage/AddHeroImage";
import HeroImagesTableDraggable from "../lib/components/HeroImage/HeroImagesTableDraggable";

type Props = {};

export default function GeneralSetting({}: Props) {
  return (
    <div>
      <div className='container mx-auto min-h-screen px-2 xl:px-0'>
        <div className='flex flex-col gap-6'>
          <AddHeroImage />
          <HeroImagesTableDraggable />
        </div>
      </div>
    </div>
  );
}
