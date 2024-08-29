import Image from 'next/image';

const HeroHeader = () => {
  return (
    <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh]">
      <Image
        src="/HeroHeader.webp"
        alt="Hero Header"
        layout="fill"
        objectFit="contain"
        quality={100}
        objectPosition="center"
        className="object-cover w-full h-full"
      />
    </div>
  );
};

export default HeroHeader;
