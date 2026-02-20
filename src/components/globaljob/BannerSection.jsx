import React from 'react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import Image from 'next/image';
import { Typography } from 'antd';
import { PrimaryButton } from '../core/buttons';

const BannerSection = ({ title, subtitle, buttonText, buttonLink }) => {
  const { t } = useTranslation('common');
  return (
    <div className="w-full px-10 md:px-20 xl:px-40">
      <div className="relative w-full aspect-[12/16] sm:aspect-video md:h-72 bg-primary rounded-3xl overflow-hidden">
        <Image
          src="/images/confettis.svg"
          alt={t('labels.general.bannerImageAlt')}
          fill
          className="object-contain object-top"
        />
        <div className="absolute top-0 left-0 flex items-center justify-between w-full h-full px-10 max-md:flex-col lg:pr-20 max-md:py-10">
          <div className="flex flex-col max-md:gap-2.5 text-secondary">
            <Typography.Text className="text-inherit text-[35px] font-bold">
              {title}
            </Typography.Text>
            <Typography.Text className="text-inherit text-[19px]">
              {subtitle}
            </Typography.Text>
          </div>
          <Link href={buttonLink} className="w-fit h-fit">
            <PrimaryButton
              text={buttonText}
              negative
              className="w-49 h-14 rounded-2xl"
              textClassName="text-[23px] font-bold"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BannerSection;
