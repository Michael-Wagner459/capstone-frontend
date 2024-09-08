import Image from 'next/image';

const HeroHeader = () => {
  return (
    <div className="relative w-full h-[10vh] md:h-[20vh] lg:h-[30vh]">
      <Image src="/HeroHeader.png" alt="Hero Header" fill={true} />
    </div>
  );
};

export default HeroHeader;
